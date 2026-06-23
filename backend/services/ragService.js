const DocumentChunk = require('../models/DocumentChunk');
const geminiService = require('./geminiService');
const { chunkText, cosineSimilarity } = require('../utils/textUtils');

class RagService {
  /**
   * Chunks a document, generates embeddings for each chunk, and stores them in the DB.
   * @param {string} documentId - The ID of the parent document.
   * @param {string} userId - The user ID who owns the document.
   * @param {string} text - The full extracted text.
   */
  async indexDocument(documentId, userId, text) {
    try {
      // Step 1: Chunk the text
      const chunks = chunkText(text, 1000, 200);
      console.log(`Document ${documentId} split into ${chunks.length} chunks.`);

      // Step 2: Generate embeddings and save chunks
      const chunkPromises = chunks.map(async (chunkContent, index) => {
        // Generate embedding
        const embedding = await geminiService.getEmbedding(chunkContent);
        
        // Save to DB
        return await DocumentChunk.create({
          documentId,
          userId,
          text: chunkContent,
          chunkIndex: index,
          embedding,
        });
      });

      // Execute in parallel batches to avoid hitting API rate limits
      // Let's do batch processing of chunks
      const batchSize = 5;
      for (let i = 0; i < chunkPromises.length; i += batchSize) {
        const batch = chunkPromises.slice(i, i + batchSize);
        await Promise.all(batch);
      }

      console.log(`Document ${documentId} successfully indexed with vector embeddings.`);
      return true;
    } catch (error) {
      console.error(`Error indexing document ${documentId}:`, error.message);
      throw error;
    }
  }

  /**
   * Retrieves the most semantically relevant chunks for a user query.
   * @param {string} documentId - The document to search within.
   * @param {string} query - The search query/question.
   * @param {number} limit - Number of top chunks to return.
   * @returns {Promise<Object[]>} Array of relevant chunk objects with similarity scores.
   */
  async retrieveRelevantChunks(documentId, query, limit = 5) {
    try {
      // 1. Generate query embedding
      const queryEmbedding = await geminiService.getEmbedding(query);

      // 2. Fetch all chunks for this document
      const chunks = await DocumentChunk.find({ documentId }).select('-__v');
      
      if (chunks.length === 0) {
        return [];
      }

      // 3. Compute cosine similarity for each chunk
      const chunksWithScore = chunks.map((chunk) => {
        const score = cosineSimilarity(queryEmbedding, chunk.embedding);
        return {
          text: chunk.text,
          chunkIndex: chunk.chunkIndex,
          score,
        };
      });

      // 4. Sort by score descending and return top matches
      chunksWithScore.sort((a, b) => b.score - a.score);
      return chunksWithScore.slice(0, limit);
    } catch (error) {
      console.error(`Error retrieving chunks for document ${documentId}:`, error.message);
      throw error;
    }
  }
}

module.exports = new RagService();
