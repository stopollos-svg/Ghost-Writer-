
import { GoogleGenAI, Type } from "@google/genai";
import { Brief, ReactionResponse } from "../types";

export const getAIReaction = async (
  brief: Brief, 
  fullMessage: string, 
  isReplyAll: boolean = false
): Promise<ReactionResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    System Instruction: You are the 'Ghostwriter Game Engine'. The player is a social media fixer.
    
    [Scenario]: ${brief.scenario}
    [Context]: ${brief.context}
    [Recipient]: ${brief.recipient}
    [Player's Draft]: "${fullMessage}"
    [Modality]: ${isReplyAll ? "CRITICAL ERROR: PLAYER CLICKED 'REPLY ALL'. The message was sent to EVERYONE involved in the scenario, including potential brand managers, followers, and exes." : "Standard direct message."}
    
    CRITICAL FORMATTING:
    - Act as the recipient(s) responding to this message.
    - If multiple people respond (especially in 'Reply All'), use the format "Name: Message" for each response on a new line.
    - Examples: "Follower69: No way!", "Brand Manager: This is a legal disaster.", "Boyfriend: Who's hand is that?".
    
    Output a JSON response containing:
    - Recipient_Reaction: (The text of the conversation. Use "Name: Text" format).
    - Drama_Score: (A number 1-100 representing the heat generated).
    - Outcome_Category: (Must be one of: "Success", "Funny Fail", or "Total Disaster").
    - Viral_Headline: (A funny clickbait title for the result).
    - stressImpact: (1-100 scale of how stressed the client is).
    - reputationImpact: (-20 to +20 change in score).
    - ratingTitle: (A witty title for the player).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            Recipient_Reaction: { type: Type.STRING },
            Drama_Score: { type: Type.NUMBER },
            Outcome_Category: { type: Type.STRING },
            Viral_Headline: { type: Type.STRING },
            stressImpact: { type: Type.NUMBER },
            reputationImpact: { type: Type.NUMBER },
            ratingTitle: { type: Type.STRING }
          },
          required: ["Recipient_Reaction", "Drama_Score", "Outcome_Category", "Viral_Headline", "stressImpact", "reputationImpact", "ratingTitle"]
        }
      }
    });

    const data = JSON.parse(response.text.trim());
    return {
      reactionText: data.Recipient_Reaction,
      stressImpact: data.stressImpact,
      reputationImpact: data.reputationImpact,
      dramaImpact: data.Drama_Score,
      isViral: data.Drama_Score > 65 || isReplyAll,
      leakedCommentary: data.Viral_Headline,
      ratingTitle: data.ratingTitle,
      outcomeCategory: data.Outcome_Category as 'Success' | 'Funny Fail' | 'Total Disaster'
    };
  } catch (error) {
    console.error("Ghostwriter Engine Error:", error);
    return {
      reactionText: "Nexus: Connection severed. Response lost to the void.",
      stressImpact: 100,
      reputationImpact: -10,
      dramaImpact: 0,
      isViral: false,
      leakedCommentary: "Protocol Failure.",
      ratingTitle: "Offline Ghost",
      outcomeCategory: 'Total Disaster'
    };
  }
};
