const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      this.client = new Groq({ apiKey });
      this.model = 'llama-3.3-70b-versatile';
    } else {
      console.warn('GROQ_API_KEY is not defined in environment variables. AI features will fail.');
    }
  }

  /**
   * Generates a simple TF-IDF-style embedding for a given text.
   * Groq does not provide an embeddings API, so we use a deterministic
   * bag-of-words vector as a lightweight local fallback for RAG similarity search.
   * @param {string} text - The input text to embed.
   * @returns {number[]} A fixed-length vector array.
   */
  async getEmbedding(text) {
    // Deterministic bag-of-words hashed embedding (dim=512)
    const DIM = 512;
    const vec = new Array(DIM).fill(0);
    const words = text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/);
    for (const word of words) {
      if (!word) continue;
      // Simple polynomial hash into the vector dimension
      let h = 5381;
      for (let i = 0; i < word.length; i++) {
        h = ((h << 5) + h + word.charCodeAt(i)) >>> 0;
      }
      vec[h % DIM] += 1;
    }
    // L2-normalise
    const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
    return vec.map(v => v / mag);
  }

  /**
   * Generates text response using Groq (llama-3.3-70b-versatile).
   * @param {string} prompt - Prompt context.
   * @param {string} systemInstruction - Optional system instructions.
   * @param {boolean} jsonMode - If true, requests JSON output.
   * @returns {Promise<string>} Model response text.
   */
  async generateContent(prompt, systemInstruction = '', jsonMode = false) {
    if (!this.client) {
      throw new Error('Groq API client not initialized. GROQ_API_KEY is missing.');
    }

    try {
      const messages = [];

      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }

      messages.push({ role: 'user', content: prompt });

      const options = {
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
      };

      if (jsonMode) {
        options.response_format = { type: 'json_object' };
      }

      const completion = await this.client.chat.completions.create(options);
      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating content from Groq:', error.message);
      throw error;
    }
  }
}

module.exports = new GroqService();
