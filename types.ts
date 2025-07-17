export interface PromptPartLang {
  id: string;
  en: string;
}

export interface PromptParts {
  subject: PromptPartLang;
  subjectDetails: PromptPartLang;
  action: PromptPartLang;
  expression: PromptPartLang;
  place: PromptPartLang;
  time: PromptPartLang;
  cameraMovement: PromptPartLang;
  lighting: PromptPartLang;
  videoStyle: PromptPartLang;
  videoMood: PromptPartLang;
  sound: PromptPartLang;
  dialogue: PromptPartLang;
  details: PromptPartLang;
  negativePrompt: PromptPartLang;
}

export interface HistoryEntry {
  id: number;
  timestamp: string;
  parts: PromptParts;
  finalPromptId: string;
  finalPromptEn: string;
}