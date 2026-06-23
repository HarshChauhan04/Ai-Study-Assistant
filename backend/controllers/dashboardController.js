const Document = require('../models/Document');
const Chat = require('../models/Chat');
const Quiz = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');
const StudyPlan = require('../models/StudyPlan');
const ActivityLog = require('../models/ActivityLog');

/**
 * @desc    Get dashboard metrics, charts data, and activity feed
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Gather basic stats
    const totalDocs = await Document.countDocuments({ userId });
    const totalChats = await Chat.countDocuments({ userId });
    const totalQuizzes = await Quiz.countDocuments({ userId });
    const totalFlashcards = await Flashcard.countDocuments({ userId });
    const totalPlans = await StudyPlan.countDocuments({ userId });

    // 2. Fetch recent activity (last 10 items)
    const recentActivity = await ActivityLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10);

    // 3. Compute simulated "Study Hours" based on interactive actions
    // - 20 mins (0.33h) per Document upload/indexing
    // - 5 mins (0.08h) per Chat question
    // - 15 mins (0.25h) per Quiz generated/completed
    // - 10 mins (0.17h) per Flashcard generated
    // - 30 mins (0.50h) per Study Plan generated
    const docWeight = totalDocs * 0.33;
    const chatWeight = totalChats * 0.08;
    const quizWeight = totalQuizzes * 0.25;
    const flashWeight = totalFlashcards * 0.17;
    const planWeight = totalPlans * 0.50;
    const computedStudyHours = parseFloat((docWeight + chatWeight + quizWeight + flashWeight + planWeight).toFixed(1));

    // 4. Gather data for analytical charts
    // - Quiz scores progress
    const quizLogs = await Quiz.find({ userId, score: { $ne: null } })
      .populate('documentId', 'originalname')
      .sort({ createdAt: 1 })
      .limit(7);

    const quizPerformance = quizLogs.map((q, idx) => ({
      quizNumber: `Quiz ${idx + 1}`,
      documentName: q.documentId ? q.documentId.originalname : 'Deleted Doc',
      score: q.score,
      maxScore: q.maxScore,
      percentage: Math.round((q.score / q.maxScore) * 100),
    }));

    // - Weekly activity overview (aggregate last 7 days of logs)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyLogs = await ActivityLog.find({
      userId,
      timestamp: { $gte: sevenDaysAgo },
    });

    // Map logs to day of week
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const activityByDay = {};
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = daysOfWeek[d.getDay()];
      activityByDay[dayName] = 0;
    }

    weeklyLogs.forEach((log) => {
      const dayName = daysOfWeek[new Date(log.timestamp).getDay()];
      if (activityByDay[dayName] !== undefined) {
        activityByDay[dayName] += 1;
      }
    });

    const weeklyActivity = Object.keys(activityByDay).map((day) => ({
      day,
      actions: activityByDay[day],
    }));

    res.json({
      stats: {
        totalDocuments: totalDocs,
        totalQuestionsAsked: totalChats,
        totalQuizzesGenerated: totalQuizzes,
        totalStudyHours: computedStudyHours || 0.5, // minimum default
      },
      recentActivity,
      analytics: {
        quizPerformance,
        weeklyActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
};
