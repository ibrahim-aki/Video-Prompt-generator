import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { PromptParts, PromptPartLang } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const createEmptyPromptPartLang = (): PromptPartLang => ({ id: '', en: '' });

const jsonVeo3Structure = `
{
  "subject": { "id": "...", "en": "..." },
  "subjectDetails": { "id": "...", "en": "..." },
  "action": { "id": "...", "en": "..." },
  "expression": { "id": "...", "en": "..." },
  "place": { "id": "...", "en": "..." },
  "time": { "id": "...", "en": "..." },
  "cameraMovement": { "id": "...", "en": "..." },
  "lighting": { "id": "...", "en": "..." },
  "videoStyle": { "id": "...", "en": "..." },
  "videoMood": { "id": "...", "en": "..." },
  "sound": { "id": "...", "en": "..." },
  "dialogue": { "id": "...", "en": "..." },
  "details": { "id": "...", "en": "..." },
  "negativePrompt": { "id": "...", "en": "..." }
}`;

const jsonVeo2Structure = `
{
  "subject": { "id": "...", "en": "..." },
  "subjectDetails": { "id": "...", "en": "..." },
  "action": { "id": "...", "en": "..." },
  "expression": { "id": "...", "en": "..." },
  "place": { "id": "...", "en": "..." },
  "time": { "id": "...", "en": "..." },
  "cameraMovement": { "id": "...", "en": "..." },
  "lighting": { "id": "...", "en": "..." },
  "videoStyle": { "id": "...", "en": "..." },
  "videoMood": { "id": "...", "en": "..." },
  "details": { "id": "...", "en": "..." },
  "negativePrompt": { "id": "...", "en": "..." }
}`;

// Define valid EN options for dropdowns to guide the AI
const validOptions = {
    subject: `["Asian person", "African person", "European person", "Hispanic person", "Middle Eastern person", "Children", "Elderly person", "Futuristic robot", "Fantasy creature", "Animal (specific)"]`,
    time: `["Morning", "Daytime", "Afternoon", "Golden hour", "Night", "Dawn", "Dusk"]`,
    cameraMovement: `["Wide shot", "Medium shot", "Close-up shot", "Low-angle shot", "High-angle shot", "Dolly zoom", "Tracking shot", "Handheld", "Drone shot"]`,
    lighting: `["Cinematic lighting", "Natural light", "Rembrandt lighting", "Neon light", "High-key lighting", "Low-key lighting", "Backlight"]`,
    videoStyle: `["Cinematic", "Hyperrealistic", "Anime style", "Vintage film", "Fantasy", "Cyberpunk", "Documentary", "Stop-motion", "Watercolor painting"]`,
    videoMood: `["Cheerful", "Mysterious", "Dramatic", "Calm", "Epic", "Nostalgic", "Tense", "Romantic", "Disappointed", "Sad"]`
};

const optionsInstruction = `
For the following fields, you MUST choose a value from the provided list for the 'en' property. Do not invent new values for these specific fields.
- subject: ${validOptions.subject}
- time: ${validOptions.time}
- cameraMovement: ${validOptions.cameraMovement}
- lighting: ${validOptions.lighting}
- videoStyle: ${validOptions.videoStyle}
- videoMood: ${validOptions.videoMood}
`;

const negativePromptInstruction = `
**Negative Prompt Generation**: You MUST generate a 'negativePrompt' field. This field should contain a comma-separated list of words and phrases in both 'id' and 'en' that the video generation AI should AVOID. The contents must be intelligently derived from the positive prompt to prevent common generation errors and maintain the desired aesthetic.
-   Example 1: If 'videoStyle' is 'hyperrealistic', the 'negativePrompt' should include 'cartoon, anime, 3d render, painting, illustration, watermark, text, signature'.
-   Example 2: If 'videoMood' is 'cheerful', the 'negativePrompt' should include 'sad, horror, dark, gloomy, depressing'.
-   Example 3: For any human subject, it should include 'deformed, ugly, disfigured, bad anatomy, extra limbs'.
-   **Always include** generic quality-control terms like 'blurry, low quality, low resolution, worst quality'.
-   The 'id' translation should be a direct translation of the 'en' comma-separated list.
`;


export const generatePrompt = async (
    lockedParts: { subject: PromptPartLang, subjectDetails: PromptPartLang } | null,
    modelTarget: 'veo3' | 'veo2',
    generationMode: 'structured' | 'creative',
    currentParts: PromptParts
): Promise<PromptParts> => {
    const model = "gemini-2.5-flash";
    
    let systemInstruction: string;
    const userPrompt = `Here is the current JSON data. Please process it according to the system instructions.\n${JSON.stringify(currentParts)}`;

    const isVeo2 = modelTarget === 'veo2';
    const modelDescription = isVeo2 
        ? "This model (VEO2) does not support audio, so the 'sound' and 'dialogue' components must have empty values."
        : "";
    const jsonStructure = isVeo2 ? jsonVeo2Structure : jsonVeo3Structure;

    if (generationMode === 'creative') {
        systemInstruction = `You are a world-class creative director and cinematic storyteller. Your task is to take a user's potentially incomplete ideas (provided in a JSON object) and develop them into a complete, compelling, and visually rich scene.
1.  **Analyze and Enhance**: Look at the user's input. Use their provided values as a core foundation. **Enhance and build upon their ideas**, making the scene richer and more coherent. Do not simply replace their choices, but perfect them.
2.  **Fill Gaps Creatively**: If a field is empty, invent a fitting detail that aligns with the new, enhanced vision.
3.  **Dropdown Constraints**: For certain fields, you must adhere to the provided list of options.
4.  **Translate**: For every single component, you MUST provide both an Indonesian ('id') and an English ('en') translation. The English version should be concise and optimized for an AI model.
5.  **Negative Prompt**: ${negativePromptInstruction}
6.  **Format Output**: Your final response MUST be ONLY the completed JSON object. Do not include any commentary or markdown formatting. Just the raw JSON.
${optionsInstruction}
${modelDescription}
The JSON structure to fill is:
${jsonStructure}`;

    } else { // structured mode
        const keepSubjectInstruction = lockedParts 
            ? "Crucially, DO NOT change the existing values for 'subject' and 'subjectDetails'. Preserve them exactly as they are in the input JSON."
            : "";

        systemInstruction = `You are a helpful and precise assistant. Your task is to complete a JSON object for a video prompt.
1.  **Analyze**: Look at the provided JSON from the user. Some fields might be filled, others might be empty (e.g., {"id": "", "en": ""}).
2.  **Complete, Don't Change**: Your primary goal is to **fill in ONLY the empty fields**. If a field already has content, YOU MUST NOT CHANGE IT.
3.  **Dropdown Constraints**: When filling a field that has a list of valid options, you MUST choose from that list.
4.  **Translate**: For any fields you fill, you MUST provide both an Indonesian ('id') and an English ('en') translation.
5.  **Negative Prompt**: ${negativePromptInstruction}
6.  **Format Output**: Your final response MUST be ONLY the completed JSON object. Do not include any commentary or markdown formatting. Just the raw JSON.
${keepSubjectInstruction}
${optionsInstruction}
${modelDescription}
The JSON structure to complete is:
${jsonStructure}`;
    }


    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.9,
            }
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedData = JSON.parse(jsonStr);
        
        const defaultParts: PromptParts = {
          subject: createEmptyPromptPartLang(),
          subjectDetails: createEmptyPromptPartLang(),
          action: createEmptyPromptPartLang(),
          expression: createEmptyPromptPartLang(),
          place: createEmptyPromptPartLang(),
          time: createEmptyPromptPartLang(),
          cameraMovement: createEmptyPromptPartLang(),
          lighting: createEmptyPromptPartLang(),
          videoStyle: createEmptyPromptPartLang(),
          videoMood: createEmptyPromptPartLang(),
          sound: createEmptyPromptPartLang(),
          dialogue: createEmptyPromptPartLang(),
          details: createEmptyPromptPartLang(),
          negativePrompt: createEmptyPromptPartLang(),
        };

        const result: Partial<PromptParts> = {};
        for (const key in defaultParts) {
            const typedKey = key as keyof PromptParts;
            if (parsedData[typedKey] && typeof parsedData[typedKey].id === 'string' && typeof parsedData[typedKey].en === 'string') {
                result[typedKey] = { id: parsedData[typedKey].id, en: parsedData[typedKey].en };
            } else {
                result[typedKey] = createEmptyPromptPartLang();
            }
        }
        
        // As a safeguard, ensure locked parts are respected, even if the AI hallucinates.
        if (lockedParts) {
            result.subject = lockedParts.subject;
            result.subjectDetails = lockedParts.subjectDetails;
        }
        
        if (isVeo2) {
            result.sound = createEmptyPromptPartLang();
            result.dialogue = createEmptyPromptPartLang();
        }

        return result as PromptParts;

    } catch (e) {
        console.error("Failed to generate or parse AI response:", e);
        if (e instanceof Error) {
            throw new Error(`Gagal memproses permintaan AI: ${e.message}`);
        }
        throw new Error("Terjadi kesalahan yang tidak diketahui saat berkomunikasi dengan AI.");
    }
};