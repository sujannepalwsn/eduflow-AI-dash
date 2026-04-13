import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const aiService = {
  async generateGradingFeedback(question: string, studentAnswer: string, correctAnswer: string) {
    const prompt = `
      You are an expert educational assistant. 
      Question: ${question}
      Student Answer: ${studentAnswer}
      Correct Answer: ${correctAnswer}
      
      Provide a constructive feedback for the student. 
      Identify what they did well and what they can improve.
      Keep it encouraging and educational.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("Error generating grading feedback:", error);
      return "Unable to generate feedback at this time.";
    }
  },

  async suggestLessonPlan(topic: string, content: string) {
    const prompt = `
      You are an expert teacher. 
      Topic: ${topic}
      Content Summary: ${content}
      
      Suggest a lesson plan including:
      1. Learning Outcomes
      2. Teaching Activities
      3. Evaluation Methods
      
      Return the response in a structured format.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("Error suggesting lesson plan:", error);
      return "Unable to suggest lesson plan at this time.";
    }
  },

  async identifySkillGaps(performanceData: any) {
    const prompt = `
      Analyze the following student performance data and identify skill gaps:
      ${JSON.stringify(performanceData)}
      
      Suggest specific areas for improvement and recommended resources.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("Error identifying skill gaps:", error);
      return "Unable to analyze performance data.";
    }
  }
};
