const StudyPlan = require('../models/StudyPlan');
const Document = require('../models/Document');
const DocumentChunk = require('../models/DocumentChunk');
const ActivityLog = require('../models/ActivityLog');
const geminiService = require('../services/geminiService');
const cacheService = require('../services/cacheService');

/**
 * @desc    Generate a custom day-by-day study plan leading up to an exam
 * @route   POST /api/study-plans
 * @access  Private
 */
const generateStudyPlan = async (req, res, next) => {
  try {
    const { documentId, examDate } = req.body;

    if (!documentId || !examDate) {
      res.status(400);
      throw new Error('Please provide documentId and examDate');
    }

    const examDateTime = new Date(examDate);
    const now = new Date();
    
    // Reset hours to count days correctly
    examDateTime.setHours(0,0,0,0);
    now.setHours(0,0,0,0);

    const timeDiff = examDateTime.getTime() - now.getTime();
    let daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysRemaining < 0) {
      res.status(400);
      throw new Error('Exam date cannot be in the past!');
    }

    if (daysRemaining === 0) {
      daysRemaining = 1; // Exam is today/tomorrow, rapid revision plan
    }

    // Limit planner length to avoid context truncation (e.g. max 14 days)
    const planDays = Math.min(daysRemaining, 14);

    // Check document
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user.id,
    });

    if (!document) {
      res.status(404);
      throw new Error('Document not found');
    }

    // Check cache
    const cacheKey = `studyplan:${documentId}:${planDays}`;
    const cachedPlan = await cacheService.get(cacheKey);
    if (cachedPlan) {
      console.log('Serving study plan from cache.');
      return res.status(200).json(cachedPlan);
    }

    // Step 1: Fetch representative document context
    const chunks = await DocumentChunk.find({ documentId }).limit(10).select('text');
    if (chunks.length === 0) {
      res.status(400);
      throw new Error('Document context is not indexed. Please re-upload.');
    }

    const corpus = chunks.map((c) => c.text).join('\n\n');

    // Step 2: System instruction and prompt
    const systemInstruction = `You are a academic consultant and student coach.
Create a structured day-by-day study schedule for exactly ${planDays} days leading up to the exam, based on the provided document text.
For each day, specify the core topic to focus on, a checklist of 2-3 specific study/practice tasks, and a brief revision strategy.
Output must be a raw JSON array. Do not wrap in markdown or add explanations.
JSON format:
[
  {
    "day": 1,
    "topic": "Topic name...",
    "tasks": ["Task 1...", "Task 2..."],
    "revisionSchedule": "Revision suggestion for the evening..."
  }
]`;

    const prompt = `Based on this document content, create a ${planDays}-day study schedule:
----------------------------------
${corpus.substring(0, 15000)}
----------------------------------
Generate the plan in JSON format.`;

    // Step 3: Call Gemini
    const rawResponse = await geminiService.generateContent(prompt, systemInstruction, true);
    
    let parsedPlan;
    try {
      parsedPlan = JSON.parse(rawResponse);
    } catch (e) {
      const cleanJsonStr = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedPlan = JSON.parse(cleanJsonStr);
    }

    if (!Array.isArray(parsedPlan)) {
      throw new Error('Gemini response did not return a valid study plan array');
    }

    // Step 4: Save to DB
    const studyPlan = await StudyPlan.create({
      userId: req.user.id,
      documentId,
      examDate: examDateTime,
      dailyPlan: parsedPlan,
    });

    // Cache study plan for 4 hours
    await cacheService.set(cacheKey, studyPlan, 14400);

    // Step 5: Log Activity
    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'study_plan',
      details: `Generated a ${planDays}-day study plan for "${document.originalname}"`,
    });

    res.status(201).json(studyPlan);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get study plans for a specific document
 * @route   GET /api/study-plans/document/:documentId
 * @access  Private
 */
const getStudyPlansByDocument = async (req, res, next) => {
  try {
    const plans = await StudyPlan.find({
      userId: req.user.id,
      documentId: req.params.documentId,
    }).sort({ createdAt: -1 });

    res.json(plans);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateStudyPlan,
  getStudyPlansByDocument,
};
