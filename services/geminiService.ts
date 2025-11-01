import { GoogleGenAI } from "@google/genai";
import { type AnalysisResult } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        // Fallback for ArrayBuffer
        const arrayBuffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        bytes.forEach(byte => binary += String.fromCharCode(byte));
        resolve(window.btoa(binary));
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeVideoAndGenerateReport = async (videoFile: File): Promise<AnalysisResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const videoPart = await fileToGenerativePart(videoFile);

    const prompt = `
        You are an expert legal assistant and digital forensics analyst specializing in Indian law. Your task is to analyze the provided video and generate a structured report for a First Information Report (FIR).

        Based on the video, provide the following in a single, valid JSON object only:

        1.  "eventSummary": A detailed, objective, and chronological summary of the events depicted. Describe actions, people involved (e.g., "Person A"), and the sequence of events.
        2.  "detectedActivities": An array of strings describing potential criminal or suspicious activities observed (e.g., "Theft", "Assault", "Vandalism").
        3.  "suggestedIPCSections": An array of objects, each representing a relevant section of the Indian Penal Code (IPC). For each, provide:
            *   "section": The section number (e.g., "379").
            *   "title": The official title of the section (e.g., "Punishment for theft").
            *   "description": A brief explanation of the section.
            *   "reasoning": A short sentence explaining why this section might be applicable.
        4.  "authenticityAnalysis": An object providing a detailed analysis of the video's authenticity. Provide:
            *   "isAuthentic": A boolean value (true if it appears authentic, false if it has signs of being AI-generated or manipulated).
            *   "confidenceScore": A number between 0.0 and 1.0 representing your confidence in the authenticity assessment.
            *   "summary": A brief one-sentence summary of your assessment.
            *   "findings": An array of objects serving as "proofs". For each finding, detail:
                *   "observation": A specific observation (e.g., "Unnatural shadow movement near Person A at 0:15", "Pixel distortion around the edges of the car").
                *   "type": The category of the observation (e.g., "Shadow Inconsistency", "Pixel Artifact", "Audio-Video Sync Issue", "Logical Inconsistency", "Compression Artifacts", "Consistent Lighting"). This is your classification of the proof.

        Analyze the video meticulously. The output MUST be only a single JSON object and nothing else. Do not wrap it in markdown backticks.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [videoPart, {text: prompt}] },
        });

        const textResponse = response.text;
        
        // Clean the response to ensure it's valid JSON
        const cleanedJsonString = textResponse.replace(/^```json\s*|```\s*$/g, '').trim();

        const result: AnalysisResult = JSON.parse(cleanedJsonString);
        return result;

    } catch (error) {
        console.error("Error analyzing video with Gemini API:", error);
        throw new Error("Failed to process the video. The AI model could not generate a valid report.");
    }
};