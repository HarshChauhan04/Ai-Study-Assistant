/**
 * Utility functions for text processing and vector operations.
 */

/**
 * Splits text into overlapping chunks of a given character size.
 * @param {string} text - The input text to chunk.
 * @param {number} size - Target size of each chunk (characters).
 * @param {number} overlap - Overlap between adjacent chunks (characters).
 * @returns {string[]} An array of text chunks.
 */
const chunkText = (text, size = 1000, overlap = 200) => {
  if (!text) return [];
  
  // Normalize whitespace
  const cleanedText = text.replace(/\s+/g, ' ').trim();
  
  const chunks = [];
  let index = 0;
  
  while (index < cleanedText.length) {
    // Take a substring of size
    let chunk = cleanedText.substring(index, index + size);
    chunks.push(chunk);
    
    // Increment index by (size - overlap)
    index += size - overlap;
    
    // Prevent infinite loop if size <= overlap
    if (size <= overlap) {
      index += size;
    }
  }
  
  return chunks;
};

/**
 * Calculates the cosine similarity between two numerical vectors.
 * @param {number[]} vecA - First vector.
 * @param {number[]} vecB - Second vector.
 * @returns {number} Cosine similarity coefficient (between -1 and 1).
 */
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

module.exports = {
  chunkText,
  cosineSimilarity,
};
