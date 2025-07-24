

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
  "aspectRatio": { "id": "...", "en": "..." },
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
  "aspectRatio": { "id": "...", "en": "..." },
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
    aspectRatio: `["16:9", "9:16", "1:1", "4:3", "3:4"]`,
    lighting: `["Cinematic lighting", "Natural light", "Rembrandt lighting", "Neon light", "High-key lighting", "Low-key lighting", "Backlight"]`,
    videoStyle: `["Cinematic", "Hyperrealistic", "Anime style", "Vintage film", "Fantasy", "Cyberpunk", "Documentary", "Stop-motion", "Watercolor painting"]`,
    videoMood: `["Cheerful", "Mysterious", "Dramatic", "Calm", "Epic", "Nostalgic", "Tense", "Romantic", "Disappointed", "Sad"]`
};

const optionsInstruction = `
For the following fields, you MUST choose a value from the provided list for the 'en' property. Do not invent new values for these specific fields.
- subject: ${validOptions.subject}
- time: ${validOptions.time}
- cameraMovement: ${validOptions.cameraMovement}
- aspectRatio: ${validOptions.aspectRatio}
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

const translationAndDialogueInstruction = `
**Absolute, Non-Negotiable Rules for the 'dialogue' field (Spoken Words):**
1.  **PRESERVE OR IGNORE, NEVER CREATE**:
    *   If the user provides text in \`dialogue.id\`, you **MUST** preserve that exact Indonesian text. Do not change it, do not add to it, do not translate it.
    *   If the user leaves the \`dialogue.id\` field empty, you **MUST** also leave it empty. **DO NOT UNDER ANY CIRCUMSTANCES GENERATE, INVENT, OR CREATE ANY DIALOGUE TEXT.** The field must remain \`{"id": "", "en": ""}\`. This is the most critical rule for this field.
2.  **NEVER TRANSLATE DIALOGUE**: The 'en' property of the 'dialogue' field **MUST ALWAYS be an empty string ("")**. This applies whether the user provided dialogue or not.

**Rules for all other fields:**
- For all other fields (subject, action, etc.), you MUST provide both an Indonesian ('id') and an English ('en') translation. The English version should be concise and optimized for an AI model.
`;


export const generatePrompt = async (
    lockedParts: { subject: PromptPartLang, subjectDetails: PromptPartLang } | null,
    modelTarget: 'veo3' | 'veo2',
    generationMode: 'structured' | 'creative',
    currentParts: PromptParts,
    enhanceToRealistic: boolean
): Promise<PromptParts> => {
    const model = "gemini-2.5-flash";
    
    let systemInstruction: string;
    const userPrompt = `Here is the current JSON data. Please process it according to the system instructions.\n${JSON.stringify(currentParts)}`;

    const isVeo2 = modelTarget === 'veo2';
    const modelDescription = isVeo2 
        ? "This model (VEO2) does not support audio, so the 'sound' and 'dialogue' components must have empty values."
        : "";
    const jsonStructure = isVeo2 ? jsonVeo2Structure : jsonVeo3Structure;

    const keepSubjectInstruction = lockedParts 
        ? "Crucially, DO NOT change the existing values for 'subject' and 'subjectDetails'. Preserve them exactly as they are in the input JSON. You must obey this rule."
        : "";

    const realismEnhancementInstruction = enhanceToRealistic ? `
**Realism Enhancement Activated**: The user wants to enhance the final output for realism and quality. You MUST act as an expert cinematographer and photographer. Your task is to intelligently inject hyper-realistic and cinematic details into the 'details' and 'negativePrompt' fields based on the user's specific choices. Do NOT change the user's selected values in the dropdowns (like 'videoStyle', 'cameraMovement', etc.).

**Contextual Enhancement Rules:**

1.  **Analyze all User Inputs**: Carefully examine the user's choices for \`videoStyle\`, \`cameraMovement\`, \`lighting\`, \`subject\`, etc.
2.  **Inject Specific Technical Details**: Based on the context, add highly specific and relevant technical details into the 'details' field. These details should complement and elevate the user's existing prompt.
    *   **Example (Camera Movement):**
        *   If \`cameraMovement\` is 'Drone shot', add details like: "filmed with a DJI Mavic 3 Pro drone, smooth sweeping motion, wide-angle lens for a vast landscape view".
        *   If \`cameraMovement\` is 'Close-up shot', add details like: "using a 100mm macro lens, tack-sharp focus on the subject's eyes, extremely shallow depth of field to isolate the subject".
        *   If \`cameraMovement\` is 'Handheld', add: "subtle, realistic camera shake to imply immediacy, as if filmed on a Sony a7S III".
    *   **Example (Video Style):**
        *   If \`videoStyle\` is 'Hyperrealistic' or 'Cinematic', add professional terms: "shot on ARRI Alexa camera, anamorphic lens, meticulous detail, 8K, UHD, professional color grading".
        *   If \`videoStyle\` is 'Vintage film', add: "emulating the look of 16mm film stock, visible film grain, slight color desaturation, subtle light leaks and gate weave".
        *   If \`videoStyle\` is 'Anime style', enhance *that* style: "in the style of Makoto Shinkai, high-fidelity background art, detailed cell shading, dynamic lighting effects, beautiful lens flares".
    *   **Example (Lighting):**
        *   If \`lighting\` is 'Neon light', add: "vibrant neon glow casting colorful reflections on wet surfaces, high contrast, bloom effect".
3.  **Strengthen Negative Prompt Contextually**: The 'negativePrompt' MUST be significantly strengthened based on the desired style.
    *   For any realistic style, add a comprehensive list: '3D, CGI, render, animation, cartoon, illustration, painting, video game, smooth skin, airbrushed, uncanny valley, disfigured, bad anatomy, blurry, low resolution, worst quality, watermark, text, signature'.
    *   For 'Anime style', you should *not* add 'animation, cartoon, illustration'. Instead, you might add 'photorealistic, 3D render' to keep it in the 2D anime aesthetic.
    *   For 'Vintage film', you might add 'digital noise, clean image, 4K, sharp focus' to ensure an authentic old-film look.

**Your goal is to be a smart collaborator, not a dumb keyword injector. The final output should feel like a professional cinematographer refined the user's idea.**
` : '';

    if (generationMode === 'creative') {
        systemInstruction = `You are a world-class creative director and cinematic storyteller. Your task is to take a user's ideas and develop them into a complete, compelling, and visually rich scene.

**RULE 1: RESPECT USER INPUT. THIS IS THE MOST IMPORTANT RULE.**
- If a field in the input JSON is NOT empty (i.e., not \`{"id": "", "en": ""}\`), you **MUST NOT** change its core idea.
- You are allowed to **ENHANCE** or **ADD DETAIL** to the user's text, but you **MUST NOT REPLACE** it.
- **Good Example (Enhancing)**: User provides \`{"id": "seorang ksatria", "en": "a knight"}\`. You can change it to \`{"id": "seorang ksatria yang lelah dengan baju zirah penyok", "en": "a weary knight with dented armor"}\`. This is GOOD.
- **Bad Example (Replacing)**: User provides \`{"id": "seorang ksatria", "en": "a knight"}\`. You **MUST NOT** change it to \`{"id": "seorang penyihir", "en": "a wizard"}\`. This is BAD and you must avoid it.

**RULE 2: FILL EMPTY GAPS CREATIVELY.**
- For any fields that are empty, you must invent compelling and creative details that fit the overall scene described by the user's filled-in fields.

**RULE 3: MAINTAIN COHERENCE.**
- The new details you invent must create a coherent and logical scene when combined with the user's original input.

**OTHER RULES:**
1.  **Dropdown Constraints**: For certain fields, you must adhere to the provided list of options. If the user has already selected a valid option, do not change it. If the field is empty, pick one from the list.
2.  ${translationAndDialogueInstruction}
3.  **Negative Prompt**: ${negativePromptInstruction}
4.  **Format Output**: Your final response MUST be ONLY the completed JSON object. Do not include any commentary or markdown formatting. Just the raw JSON.

${keepSubjectInstruction}
${realismEnhancementInstruction}
${optionsInstruction}
${modelDescription}
The JSON structure to fill is:
${jsonStructure}`;

    } else { // structured mode
        systemInstruction = `You are a helpful and precise assistant. Your task is to complete a JSON object for a video prompt.
1.  **Analyze**: Look at the provided JSON from the user. Some fields might be filled, others might be empty (e.g., {"id": "", "en": ""}).
2.  **Complete, Don't Change**: Your primary goal is to **fill in ONLY the empty fields**. If a field already has content, YOU MUST NOT CHANGE IT.
3.  **Dropdown Constraints**: When filling a field that has a list of valid options, you MUST choose from that list.
4.  ${translationAndDialogueInstruction}
5.  **Negative Prompt**: ${negativePromptInstruction}
6.  **Format Output**: Your final response MUST be ONLY the completed JSON object. Do not include any commentary or markdown formatting. Just the raw JSON.
${keepSubjectInstruction}
${realismEnhancementInstruction}
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
          aspectRatio: createEmptyPromptPartLang(),
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

        // As a safeguard, ensure user's original dialogue is preserved if it was provided
        if (currentParts.dialogue?.id) {
            result.dialogue = { ...result.dialogue, id: currentParts.dialogue.id };
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