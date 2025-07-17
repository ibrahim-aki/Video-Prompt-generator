import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PromptParts, PromptPartLang, HistoryEntry } from './types';
import { generatePrompt } from './services/geminiService';
import PromptInput from './components/PromptInput';
import PromptSelect from './components/PromptSelect';
import { Icon } from './components/Icon';
import HistoryModal from './components/HistoryModal';

type Theme = 'light' | 'dark' | 'system';
type UILang = 'id' | 'en' | 'ar' | 'cn' | 'ru';
type ModelTarget = 'veo3' | 'veo2';
type GenerationMode = 'structured' | 'creative';

const translations = {
    id: {
        title: "Prompt Generator App",
        keepSubjectLabel: "Jaga Subjek",
        subjectLabel: "Subjek",
        subjectDetailsLabel: "Detail Subjek",
        actionLabel: "Aksi",
        expressionLabel: "Ekspresi",
        placeLabel: "Tempat",
        timeLabel: "Waktu",
        cameraMovementLabel: "Gerakan Kamera",
        lightingLabel: "Pencahayaan",
        videoStyleLabel: "Gaya Video",
        videoMoodLabel: "Suasana Video",
        soundLabel: "Suara atau Musik",
        dialogueLabel: "Kalimat yang Diucapkan",
        additionalDetailsLabel: "Detail Tambahan",
        clearIntonationLabel: "Intonasi Jelas",
        clearIntonationTooltip: "Tambahkan instruksi untuk intonasi yang jelas pada prompt final",
        resultsTitle: "Hasil & Pratinjau Prompt",
        resetFormButton: "Reset Form",
        resetFormTooltip: "Reset semua isian form",
        generatePromptButton: "Generate",
        processing: "Memproses...",
        promptIdViewTitle: "Tampilan Prompt (ID)",
        promptEnViewTitle: "Hasil Final untuk VEO (EN)",
        negativePromptTitle: "Negative Prompt (Untuk Dihindari)",
        promptIdPlaceholder: "Prompt Bahasa Indonesia akan muncul di sini...",
        promptEnPlaceholder: "Prompt Bahasa Inggris akan muncul di sini...",
        negativePromptPlaceholder: "Prompt negatif akan muncul di sini...",
        copyIdButton: "Salin (ID)",
        copyEnButton: "Salin (EN)",
        copyNegButton: "Salin (Negatif)",
        copied: "Disalin!",
        selectPlaceholder: "Pilih...",
        themeTooltip: "Pilih tema",
        themeLight: "Terang",
        themeDark: "Gelap",
        themeSystem: "Sistem",
        langTooltip: "Pilih bahasa UI",
        targetModelLabel: "Target Model:",
        historyButtonLabel: "Riwayat",
        historyButtonTooltip: "Lihat riwayat prompt",
        historyTitle: "Riwayat Prompt",
        clearHistoryButton: "Bersihkan Riwayat",
        loadPromptButton: "Gunakan Prompt Ini",
        noHistoryMessage: "Belum ada riwayat.",
        closeButtonLabel: "Tutup",
        clearHistoryConfirm: "Anda yakin ingin menghapus semua riwayat prompt? Tindakan ini tidak dapat diurungkan.",
        deleteItemConfirm: "Anda yakin ingin menghapus entri ini?",
        deleteItemButtonTooltip: "Hapus entri ini",
        generationModeLabel: "Pilih Mode Generate",
        structuredMode: "Terstruktur",
        creativeMode: "Kreatif",
        structuredModeTooltip: "AI akan mengisi kolom yang kosong berdasarkan struktur yang ada.",
        creativeModeTooltip: "AI akan mengembangkan ide Anda menjadi sebuah adegan yang lebih lengkap dan imajinatif.",
        credit: "Aplikasi dibuat oleh Ibrahim",
        socialMedia: "Media Sosial",
        negativePromptHistoryLabel: "Negatif:"
    },
    en: {
        title: "Prompt Generator App",
        keepSubjectLabel: "Keep Subject",
        subjectLabel: "Subject",
        subjectDetailsLabel: "Subject Details",
        actionLabel: "Action",
        expressionLabel: "Expression",
        placeLabel: "Place",
        timeLabel: "Time",
        cameraMovementLabel: "Camera Movement",
        lightingLabel: "Lighting",
        videoStyleLabel: "Video Style",
        videoMoodLabel: "Video Mood",
        soundLabel: "Sound or Music",
        dialogueLabel: "Dialogue / Spoken Words",
        additionalDetailsLabel: "Additional Details",
        clearIntonationLabel: "Clear Intonation",
        clearIntonationTooltip: "Add instruction for clear intonation to the final prompt",
        resultsTitle: "Results & Prompt Preview",
        resetFormButton: "Reset Form",
        resetFormTooltip: "Reset all form inputs",
        generatePromptButton: "Generate",
        processing: "Processing...",
        promptIdViewTitle: "Prompt View (ID)",
        promptEnViewTitle: "Final Result for VEO (EN)",
        negativePromptTitle: "Negative Prompt (To Avoid)",
        promptIdPlaceholder: "Indonesian prompt will appear here...",
        promptEnPlaceholder: "English prompt will appear here...",
        negativePromptPlaceholder: "Negative prompt will appear here...",
        copyIdButton: "Copy (ID)",
        copyEnButton: "Copy (EN)",
        copyNegButton: "Copy (Negative)",
        copied: "Copied!",
        selectPlaceholder: "Select...",
        themeTooltip: "Select theme",
        themeLight: "Light",
        themeDark: "Dark",
        themeSystem: "System",
        langTooltip: "Select UI language",
        targetModelLabel: "Target Model:",
        historyButtonLabel: "History",
        historyButtonTooltip: "View prompt history",
        historyTitle: "Prompt History",
        clearHistoryButton: "Clear History",
        loadPromptButton: "Use This Prompt",
        noHistoryMessage: "No history yet.",
        closeButtonLabel: "Close",
        clearHistoryConfirm: "Are you sure you want to clear all prompt history? This cannot be undone.",
        deleteItemConfirm: "Are you sure you want to delete this entry?",
        deleteItemButtonTooltip: "Delete this entry",
        generationModeLabel: "Select Generate Mode",
        structuredMode: "Structured",
        creativeMode: "Creative",
        structuredModeTooltip: "AI will fill in the empty fields based on the existing structure.",
        creativeModeTooltip: "AI will develop your ideas into a more complete and imaginative scene.",
        credit: "App created by Ibrahim",
        socialMedia: "Social Media",
        negativePromptHistoryLabel: "Negative:"
    },
    ar: {
        title: "تطبيق مولد الأوامر",
        keepSubjectLabel: "حافظ على الموضوع",
        subjectLabel: "الموضوع",
        subjectDetailsLabel: "تفاصيل الموضوع",
        actionLabel: "الحركة",
        expressionLabel: "التعبير",
        placeLabel: "المكان",
        timeLabel: "الوقت",
        cameraMovementLabel: "حركة الكاميرا",
        lightingLabel: "الإضاءة",
        videoStyleLabel: "أسلوب الفيديو",
        videoMoodLabel: "جو الفيديو",
        soundLabel: "الصوت أو الموسيقى",
        dialogueLabel: "الحوار / الكلمات المنطوقة",
        additionalDetailsLabel: "تفاصيل إضافية",
        clearIntonationLabel: "نبرة واضحة",
        clearIntonationTooltip: "أضف تعليمات لنبرة واضحة في الأمر النهائي",
        resultsTitle: "النتائج ومعاينة الأمر",
        resetFormButton: "إعادة تعيين النموذج",
        resetFormTooltip: "إعادة تعيين جميع مدخلات النموذج",
        generatePromptButton: "إنشاء",
        processing: "جاري المعالجة...",
        promptIdViewTitle: "عرض الأمر (ID)",
        promptEnViewTitle: "النتيجة النهائية لـ VEO (EN)",
        negativePromptTitle: "الأمر السلبي (لتجنب)",
        promptIdPlaceholder: "سيظهر الأمر باللغة الإندونيسية هنا...",
        promptEnPlaceholder: "سيظهر الأمر باللغة الإنجليزية هنا...",
        negativePromptPlaceholder: "سيظهر الأمر السلبي هنا...",
        copyIdButton: "نسخ (ID)",
        copyEnButton: "نسخ (EN)",
        copyNegButton: "نسخ (سلبي)",
        copied: "تم النسخ!",
        selectPlaceholder: "اختر...",
        themeTooltip: "اختر المظهر",
        themeLight: "فاتح",
        themeDark: "داكن",
        themeSystem: "النظام",
        langTooltip: "اختر لغة الواجهة",
        targetModelLabel: "النموذج المستهدف:",
        historyButtonLabel: "السجل",
        historyButtonTooltip: "عرض سجل الأوامر",
        historyTitle: "سجل الأوامر",
        clearHistoryButton: "مسح السجل",
        loadPromptButton: "استخدام هذا الأمر",
        noHistoryMessage: "لا يوجد سجل حتى الآن.",
        closeButtonLabel: "إغلاق",
        clearHistoryConfirm: "هل أنت متأكد أنك تريد مسح كل سجل الأوامر؟ لا يمكن التراجع عن هذا الإجراء.",
        deleteItemConfirm: "هل أنت متأكد أنك تريد حذف هذا الإدخال؟",
        deleteItemButtonTooltip: "حذف هذا الإدخال",
        generationModeLabel: "اختر وضع الإنشاء",
        structuredMode: "منظم",
        creativeMode: "إبداعي",
        structuredModeTooltip: "سيقوم الذكاء الاصطناعي بملء الحقول الفارغة بناءً على الهيكل الحالي.",
        creativeModeTooltip: "سيقوم الذكاء الاصطناعي بتطوير أفكارك إلى مشهد أكثر اكتمالاً وإبداعًا.",
        credit: "التطبيق من صنع إبراهيم",
        socialMedia: "وسائل التواصل الاجتماعي",
        negativePromptHistoryLabel: "سلبي:"
    },
    cn: {
        title: "提示生成器应用",
        keepSubjectLabel: "保持主题",
        subjectLabel: "主题",
        subjectDetailsLabel: "主题细节",
        actionLabel: "动作",
        expressionLabel: "表情",
        placeLabel: "地点",
        timeLabel: "时间",
        cameraMovementLabel: "镜头移动",
        lightingLabel: "灯光",
        videoStyleLabel: "视频风格",
        videoMoodLabel: "视频氛围",
        soundLabel: "声音或音乐",
        dialogueLabel: "对话/台词",
        additionalDetailsLabel: "附加细节",
        clearIntonationLabel: "清晰的语调",
        clearIntonationTooltip: "为最终提示添加清晰语调的说明",
        resultsTitle: "结果与提示预览",
        resetFormButton: "重置表单",
        resetFormTooltip: "重置所有表单输入",
        generatePromptButton: "生成",
        processing: "处理中...",
        promptIdViewTitle: "提示视图 (ID)",
        promptEnViewTitle: "VEO 最终结果 (EN)",
        negativePromptTitle: "负面提示 (以避免)",
        promptIdPlaceholder: "印尼语提示将出现在这里...",
        promptEnPlaceholder: "英语提示将出现在这里...",
        negativePromptPlaceholder: "负面提示将出现在这里...",
        copyIdButton: "复制 (ID)",
        copyEnButton: "复制 (EN)",
        copyNegButton: "复制 (负面)",
        copied: "已复制！",
        selectPlaceholder: "选择...",
        themeTooltip: "选择主题",
        themeLight: "浅色",
        themeDark: "深色",
        themeSystem: "系统",
        langTooltip: "选择界面语言",
        targetModelLabel: "目标模型:",
        historyButtonLabel: "历史记录",
        historyButtonTooltip: "查看提示历史记录",
        historyTitle: "提示历史记录",
        clearHistoryButton: "清除历史记录",
        loadPromptButton: "使用此提示",
        noHistoryMessage: "暂无历史记录。",
        closeButtonLabel: "关闭",
        clearHistoryConfirm: "您确定要清除所有提示历史记录吗？此操作无法撤销。",
        deleteItemConfirm: "您确定要删除此条目吗？",
        deleteItemButtonTooltip: "删除此条目",
        generationModeLabel: "选择生成模式",
        structuredMode: "结构化",
        creativeMode: "创意",
        structuredModeTooltip: "AI 将根据现有结构填充空字段。",
        creativeModeTooltip: "AI 将把您的想法发展成一个更完整、更富想象力的场景。",
        credit: "应用由 Ibrahim 创建",
        socialMedia: "社交媒体",
        negativePromptHistoryLabel: "负面:"
    },
    ru: {
        title: "Приложение-генератор промптов",
        keepSubjectLabel: "Сохранять тему",
        subjectLabel: "Тема",
        subjectDetailsLabel: "Детали темы",
        actionLabel: "Действие",
        expressionLabel: "Выражение",
        placeLabel: "Место",
        timeLabel: "Время",
        cameraMovementLabel: "Движение камеры",
        lightingLabel: "Освещение",
        videoStyleLabel: "Стиль видео",
        videoMoodLabel: "Настроение видео",
        soundLabel: "Звук или музыка",
        dialogueLabel: "Диалог / Речь",
        additionalDetailsLabel: "Дополнительные детали",
        clearIntonationLabel: "Четкая интонация",
        clearIntonationTooltip: "Добавить инструкцию для четкой интонации в финальный промпт",
        resultsTitle: "Результаты и предпросмотр промпта",
        resetFormButton: "Сбросить форму",
        resetFormTooltip: "Сбросить все поля формы",
        generatePromptButton: "Сгенерировать",
        processing: "Обработка...",
        promptIdViewTitle: "Просмотр промпта (ID)",
        promptEnViewTitle: "Конечный результат для VEO (EN)",
        negativePromptTitle: "Негативный промпт (чего избегать)",
        promptIdPlaceholder: "Промпт на индонезийском появится здесь...",
        promptEnPlaceholder: "Промпт на английском появится здесь...",
        negativePromptPlaceholder: "Негативный промпт появится здесь...",
        copyIdButton: "Копировать (ID)",
        copyEnButton: "Копировать (EN)",
        copyNegButton: "Копировать (негатив)",
        copied: "Скопировано!",
        selectPlaceholder: "Выберите...",
        themeTooltip: "Выберите тему",
        themeLight: "Светлая",
        themeDark: "Темная",
        themeSystem: "Системная",
        langTooltip: "Выберите язык интерфейса",
        targetModelLabel: "Целевая модель:",
        historyButtonLabel: "История",
        historyButtonTooltip: "Просмотр истории промптов",
        historyTitle: "История промптов",
        clearHistoryButton: "Очистить историю",
        loadPromptButton: "Использовать этот промпт",
        noHistoryMessage: "История пока пуста.",
        closeButtonLabel: "Закрыть",
        clearHistoryConfirm: "Вы уверены, что хотите очистить всю историю промптов? Это действие нельзя отменить.",
        deleteItemConfirm: "Вы уверены, что хотите удалить эту запись?",
        deleteItemButtonTooltip: "Удалить эту запись",
        generationModeLabel: "Выберите режим генерации",
        structuredMode: "Структурированный",
        creativeMode: "Творческий",
        structuredModeTooltip: "ИИ заполнит пустые поля на основе существующей структуры.",
        creativeModeTooltip: "ИИ разовьет ваши идеи в более полную и образную сцену.",
        credit: "Приложение создано Ибрагимом",
        socialMedia: "Социальные сети",
        negativePromptHistoryLabel: "Негатив:"
    }
};

type LocalizedOption = { value: string; id: string; en: string; ar: string; cn: string; ru: string };

const subjectOptions: LocalizedOption[] = [ { value: 'Orang Asia', id: 'Orang Asia', en: 'Asian person', ar: 'شخص آسيوي', cn: '亚洲人', ru: 'Азиат' }, { value: 'Orang Afrika', id: 'Orang Afrika', en: 'African person', ar: 'شخص أفريقي', cn: '非洲人', ru: 'Африканец' }, { value: 'Orang Eropa', id: 'Orang Eropa', en: 'European person', ar: 'شخص أوروبي', cn: '欧洲人', ru: 'Европеец' }, { value: 'Orang Hispanik', id: 'Orang Hispanik', en: 'Hispanic person', ar: 'شخص من أصل إسباني', cn: '西班牙裔', ru: 'Испанец' }, { value: 'Orang Timur Tengah', id: 'Orang Timur Tengah', en: 'Middle Eastern person', ar: 'شخص من الشرق الأوسط', cn: '中东人', ru: 'Житель Ближнего Востока' }, { value: 'Anak-anak', id: 'Anak-anak', en: 'Children', ar: 'أطفال', cn: '儿童', ru: 'Дети' }, { value: 'Orang tua', id: 'Orang tua', en: 'Elderly person', ar: 'شخص مسن', cn: '老人', ru: 'Пожилой человек' }, { value: 'Robot futuristik', id: 'Robot futuristik', en: 'Futuristic robot', ar: 'روبوت مستقبلي', cn: '未来派机器人', ru: 'Футуристический робот' }, { value: 'Makhluk fantasi', id: 'Makhluk fantasi', en: 'Fantasy creature', ar: 'مخلوق خيالي', cn: '幻想生物', ru: 'Фантастическое существо' }, { value: 'Hewan (spesifik)', id: 'Hewan (spesifik)', en: 'Animal (specific)', ar: 'حيوان (محدد)', cn: '动物（具体）', ru: 'Животное (конкретное)' }, ];
const timeOptions: LocalizedOption[] = [ { value: 'Pagi hari', id: 'Pagi hari', en: 'Morning', ar: 'صباح', cn: '早上', ru: 'Утро' }, { value: 'Siang hari', id: 'Siang hari', en: 'Daytime', ar: 'وقت النهار', cn: '白天', ru: 'День' }, { value: 'Sore hari', id: 'Sore hari', en: 'Afternoon', ar: 'بعد الظهر', cn: '下午', ru: 'После полудня' }, { value: 'Golden hour', id: 'Golden hour', en: 'Golden hour', ar: 'الساعة الذهبية', cn: '黄金时刻', ru: 'Золотой час' }, { value: 'Malam hari', id: 'Malam hari', en: 'Night', ar: 'ليل', cn: '夜晚', ru: 'Ночь' }, { value: 'Fajar', id: 'Fajar', en: 'Dawn', ar: 'فجر', cn: '黎明', ru: 'Рассвет' }, { value: 'Senja', id: 'Senja', en: 'Dusk', ar: 'غسق', cn: '黄昏', ru: 'Сумерки' }, ];
const cameraMovementOptions: LocalizedOption[] = [ { value: 'Wide shot', id: 'Wide shot', en: 'Wide shot', ar: 'لقطة واسعة', cn: '广角镜头', ru: 'Широкий план' }, { value: 'Medium shot', id: 'Medium shot', en: 'Medium shot', ar: 'لقطة متوسطة', cn: '中景镜头', ru: 'Средний план' }, { value: 'Close-up shot', id: 'Close-up shot', en: 'Close-up shot', ar: 'لقطة مقربة', cn: '特写镜头', ru: 'Крупный план' }, { value: 'Low-angle shot', id: 'Low-angle shot', en: 'Low-angle shot', ar: 'لقطة من زاوية منخفضة', cn: '低角度拍摄', ru: 'Съемка с нижнего ракурса' }, { value: 'High-angle shot', id: 'High-angle shot', en: 'High-angle shot', ar: 'لقطة من زاوية مرتفعة', cn: '高角度拍摄', ru: 'Съемка с верхнего ракурса' }, { value: 'Dolly zoom', id: 'Dolly zoom', en: 'Dolly zoom', ar: 'تقريب دوللي', cn: '推拉变焦', ru: 'Транстрав (Долли-зум)' }, { value: 'Tracking shot', id: 'Tracking shot', en: 'Tracking shot', ar: 'لقطة تتبع', cn: '跟随镜头', ru: 'Проездка (трекинг-шот)' }, { value: 'Handheld', id: 'Handheld', en: 'Handheld', ar: 'محمولة باليد', cn: '手持拍摄', ru: 'Ручная съемка' }, { value: 'Drone shot', id: 'Drone shot', en: 'Drone shot', ar: 'لقطة بطائرة بدون طيار', cn: '无人机拍摄', ru: 'Съемка с дрона' }, ];
const lightingOptions: LocalizedOption[] = [ { value: 'Pencahayaan sinematik', id: 'Pencahayaan sinematik', en: 'Cinematic lighting', ar: 'إضاءة سينمائية', cn: '电影灯光', ru: 'Кинематографическое освещение' }, { value: 'Cahaya alami', id: 'Cahaya alami', en: 'Natural light', ar: 'ضوء طبيعي', cn: '自然光', ru: 'Естественный свет' }, { value: 'Rembrandt lighting', id: 'Rembrandt lighting', en: 'Rembrandt lighting', ar: 'إضاءة رامبرانت', cn: '伦勃朗光', ru: 'Рембрандтовский свет' }, { value: 'Cahaya neon', id: 'Cahaya neon', en: 'Neon light', ar: 'ضوء نيون', cn: '霓虹灯', ru: 'Неоновый свет' }, { value: 'High-key lighting', id: 'High-key lighting', en: 'High-key lighting', ar: 'إضاءة عالية المفتاح', cn: '高调光', ru: 'Высокий ключ' }, { value: 'Low-key lighting', id: 'Low-key lighting', en: 'Low-key lighting', ar: 'إضاءة منخفضة المفتاح', cn: '低调光', ru: 'Низкий ключ' }, { value: 'Backlight', id: 'Backlight', en: 'Backlight', ar: 'إضاءة خلفية', cn: '逆光', ru: 'Контровой свет' }, ];
const videoStyleOptions: LocalizedOption[] = [ { value: 'Sinematik', id: 'Sinematik', en: 'Cinematic', ar: 'سينمائي', cn: '电影感', ru: 'Кинематографический' }, { value: 'Hyperrealistic', id: 'Hyperrealistic', en: 'Hyperrealistic', ar: 'واقعية مفرطة', cn: '超写实', ru: 'Гиперреалистичный' }, { value: 'Gaya anime', id: 'Gaya anime', en: 'Anime style', ar: 'أسلوب الأنمي', cn: '动漫风格', ru: 'В стиле аниме' }, { value: 'Film vintage', id: 'Film vintage', en: 'Vintage film', ar: 'فيلم كلاسيكي', cn: '复古电影', ru: 'Винтажный фильм' }, { value: 'Fantasi', id: 'Fantasi', en: 'Fantasy', ar: 'خيالي', cn: '幻想', ru: 'Фэнтези' }, { value: 'Cyberpunk', id: 'Cyberpunk', en: 'Cyberpunk', ar: 'سايبربانك', cn: '赛博朋克', ru: 'Киберпанк' }, { value: 'Dokumenter', id: 'Dokumenter', en: 'Documentary', ar: 'وثائقي', cn: '纪录片', ru: 'Документальный' }, { value: 'Stop-motion', id: 'Stop-motion', en: 'Stop-motion', ar: 'إيقاف الحركة', cn: '定格动画', ru: 'Покадровая анимация' }, { value: 'Lukisan cat air', id: 'Lukisan cat air', en: 'Watercolor painting', ar: 'لوحة مائية', cn: '水彩画', ru: 'Акварельная живопись' }, ];
const videoMoodOptions: LocalizedOption[] = [ { value: 'Ceria', id: 'Ceria', en: 'Cheerful', ar: 'مبهج', cn: '愉快的', ru: 'Веселое' }, { value: 'Misterius', id: 'Misterius', en: 'Mysterious', ar: 'غامض', cn: '神秘的', ru: 'Таинственное' }, { value: 'Dramatis', id: 'Dramatis', en: 'Dramatic', ar: 'درامي', cn: '戏剧性的', ru: 'Драматичное' }, { value: 'Tenang', id: 'Tenang', en: 'Calm', ar: 'هادئ', cn: '平静的', ru: 'Спокойное' }, { value: 'Epik', id: 'Epik', en: 'Epic', ar: 'ملحمي', cn: '史诗般的', ru: 'Эпичное' }, { value: 'Nostalgia', id: 'Nostalgia', en: 'Nostalgic', ar: 'حنين', cn: '怀旧的', ru: 'Ностальгическое' }, { value: 'Menegangkan', id: 'Menegangkan', en: 'Tense', ar: 'متوتر', cn: '紧张的', ru: 'Напряженное' }, { value: 'Romantis', id: 'Romantis', en: 'Romantic', ar: 'رومانسي', cn: '浪漫的', ru: 'Романтичное' }, { value: 'Kecewa', id: 'Kecewa', en: 'Disappointed', ar: 'خائب الأمل', cn: '失望的', ru: 'Разочарованное' }, { value: 'Sedih', id: 'Sedih', en: 'Sad', ar: 'حزين', cn: '悲伤的', ru: 'Грустное' }, ];

const createEmptyPromptPartLang = (): PromptPartLang => ({ id: '', en: '' });
const initialPromptPartsState: PromptParts = { subject: createEmptyPromptPartLang(), subjectDetails: createEmptyPromptPartLang(), action: createEmptyPromptPartLang(), expression: createEmptyPromptPartLang(), place: createEmptyPromptPartLang(), time: createEmptyPromptPartLang(), cameraMovement: createEmptyPromptPartLang(), lighting: createEmptyPromptPartLang(), videoStyle: createEmptyPromptPartLang(), videoMood: createEmptyPromptPartLang(), sound: createEmptyPromptPartLang(), dialogue: createEmptyPromptPartLang(), details: createEmptyPromptPartLang(), negativePrompt: createEmptyPromptPartLang() };

const placeholders = {
    id: { subjectDetails: "Rambutnya terbuat dari api, matanya seperti permata", action: "Mengaum sambil menyemburkan api ke langit", expression: "Marah, mata menyala dengan garang", place: "Di puncak gunung berapi yang aktif, lava mengalir", sound: "Musik orkestra epik, suara gemuruh gunung", dialogue: "(Tidak ada dialog)", details: "Asap tebal membumbung, kilat menyambar di latar belakang", },
    en: { subjectDetails: "Hair made of fire, eyes like gems", action: "Roaring while spewing fire into the sky", expression: "Angry, eyes burning fiercely", place: "On the peak of an active volcano, lava flowing", sound: "Epic orchestral music, sound of a rumbling mountain", dialogue: "(No dialogue)", details: "Thick smoke billows, lightning flashes in the background", },
    ar: { subjectDetails: "شعرها مصنوع من نار، وعيناها مثل الجواهر", action: "تزأر وتنفث النار في السماء", expression: "غاضبة، عيناها تشتعلان بشراسة", place: "على قمة بركان نشط، والحمم تتدفق", sound: "موسيقى أوركسترالية ملحمية، صوت هدير الجبل", dialogue: "(لا يوجد حوار)", details: "دخان كثيف يتصاعد، وبرق يلمع في الخلفية", },
    cn: { subjectDetails: "头发由火焰构成，眼睛像宝石", action: "咆哮着向天空喷火", expression: "愤怒，双眼燃烧着熊熊烈火", place: "在活火山顶上，岩浆流淌", sound: "史诗般的管弦乐，山峦的轰鸣声", dialogue: "（无对话）", details: "浓烟滚滚，背景中电闪雷鸣", },
    ru: { subjectDetails: "Волосы из огня, глаза как драгоценные камни", action: "Рычит, извергая огонь в небо", expression: "Злой, глаза яростно горят", place: "На вершине действующего вулкана, течет лава", sound: "Эпическая оркестровая музыка, гул горы", dialogue: "(Нет диалога)", details: "Густой дым клубится, на заднем плане сверкают молнии", }
};

// Moved outside App component to prevent state reset on re-renders
const ThemeSwitcher: React.FC<{ theme: Theme; setTheme: (theme: Theme) => void; uiLang: UILang }> = ({ theme, setTheme, uiLang }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const t = translations[uiLang];

    const themes: { name: Theme; icon: 'sun' | 'moon' | 'desktop'; label: string }[] = [
        { name: 'light', icon: 'sun', label: t.themeLight },
        { name: 'dark', icon: 'moon', label: t.themeDark },
        { name: 'system', icon: 'desktop', label: t.themeSystem },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentIcon = themes.find(t => t.name === theme)?.icon || 'desktop';

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                title={t.themeTooltip}
                className="flex items-center justify-center w-10 h-10 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
                <Icon type={currentIcon} className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute right-0 ltr:right-0 rtl:left-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1">
                        {themes.map(({ name, icon, label }) => (
                            <button
                                key={name}
                                onClick={() => {
                                    setTheme(name);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center gap-3 w-full px-4 py-2 text-sm ltr:text-left rtl:text-right ${
                                    theme === name
                                        ? 'bg-cyan-500 text-white'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                            >
                                <Icon type={icon} className="w-5 h-5" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Moved outside App component to prevent state reset on re-renders
const LangSwitcher: React.FC<{ uiLang: UILang; setUiLang: (lang: UILang) => void }> = ({ uiLang, setUiLang }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const t = translations[uiLang];

    const languages: { code: UILang; icon: 'flagId' | 'flagEn' | 'flagSa' | 'flagCn' | 'flagRu'; name: string }[] = [
        { code: 'id', icon: 'flagId', name: 'Indonesia' },
        { code: 'en', icon: 'flagEn', name: 'English' },
        { code: 'ar', icon: 'flagSa', name: 'العربية' },
        { code: 'cn', icon: 'flagCn', name: '中文' },
        { code: 'ru', icon: 'flagRu', name: 'Русский' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const currentLang = languages.find(lang => lang.code === uiLang);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                title={t.langTooltip}
                className="flex items-center justify-center w-10 h-10 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
                {currentLang && <Icon type={currentLang.icon} />}
            </button>
            {isOpen && (
                <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1">
                        {languages.map(({ code, icon, name }) => (
                            <button
                                key={code}
                                onClick={() => {
                                    setUiLang(code);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center gap-3 w-full px-4 py-2 text-sm ltr:text-left rtl:text-right ${
                                    uiLang === code
                                        ? 'bg-cyan-500 text-white'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                            >
                                <Icon type={icon} />
                                <span>{name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const App: React.FC = () => {
    const [promptParts, setPromptParts] = useState<PromptParts>(initialPromptPartsState);
    const [finalPromptId, setFinalPromptId] = useState('');
    const [finalPromptEn, setFinalPromptEn] = useState('');
    const [finalNegativePromptEn, setFinalNegativePromptEn] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [keepSubject, setKeepSubject] = useState(false);
    const [clearIntonation, setClearIntonation] = useState(false);
    const [modelTarget, setModelTarget] = useState<ModelTarget>('veo3');
    const [generationMode, setGenerationMode] = useState<GenerationMode>('structured');
    const [uiLang, setUiLang] = useState<UILang>('id');
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme | null) || 'system');
    const [showResults, setShowResults] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [copyStatus, setCopyStatus] = useState({ id: false, en: false, neg: false });
    const copyTimeoutRef = useRef<number | null>(null);

    const t = translations[uiLang];

    const getLocalizedOptions = useCallback((options: LocalizedOption[]) => {
        return options.map(opt => ({ value: opt[uiLang] || opt.en, label: opt[uiLang] || opt.en }));
    }, [uiLang]);

    const buildFinalPrompt = useCallback((parts: PromptParts, lang: 'id' | 'en') => {
        if (lang === 'en') {
            const order: (keyof PromptParts)[] = [
                'action', 'expression', 'place', 'time', 'cameraMovement', 
                'lighting', 'videoStyle', 'videoMood', 'sound', 'dialogue', 'details'
            ];
            
            // Combine subject and details first
            const subjectPart = [parts.subject?.en, parts.subjectDetails?.en].filter(Boolean).join(' ');

            const otherParts = order
                .map(key => parts[key]?.en)
                .filter(Boolean);

            let allParts = [subjectPart, ...otherParts].filter(Boolean);
            
            let prompt = allParts.join(', ');

            if (clearIntonation && modelTarget === 'veo3' && parts.dialogue?.en) {
                prompt += ', spoken with clear intonation';
            }
            return prompt;
        } else {
            return `Sebuah video ${parts.videoStyle?.id || ''} dengan suasana ${parts.videoMood?.id || ''}, menampilkan ${parts.subject?.id || 'subjek'}${parts.subjectDetails?.id ? ` (${parts.subjectDetails.id})` : ''}. Subjek sedang ${parts.action?.id || 'melakukan sesuatu'} dengan ekspresi ${parts.expression?.id || ''}. Lokasinya di ${parts.place?.id || 'sebuah tempat'} pada ${parts.time?.id || 'suatu waktu'}. Video diambil dengan gerakan kamera ${parts.cameraMovement?.id || ''} dan pencahayaan ${parts.lighting?.id || ''}.${parts.sound?.id ? ` Terdengar ${parts.sound.id}.` : ''}${parts.dialogue?.id ? ` Terdengar dialog: "${parts.dialogue.id}".` : ''}${parts.details?.id ? ` Detail tambahan: ${parts.details.id}.` : ''}`;
        }
    }, [clearIntonation, modelTarget]);
    
    useEffect(() => {
        const storedLang = localStorage.getItem('lang') as UILang | null;
        if (storedLang) setUiLang(storedLang);

        const storedHistory = localStorage.getItem('promptHistory');
        if (storedHistory) setHistory(JSON.parse(storedHistory));
    }, []);
    
    // Theme effect
    useEffect(() => {
        const applyTheme = (t: Theme) => {
            if (t === 'system') {
                localStorage.removeItem('theme');
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                document.documentElement.classList.toggle('dark', mediaQuery.matches);
            } else {
                localStorage.setItem('theme', t);
                document.documentElement.classList.toggle('dark', t === 'dark');
            }
        };

        applyTheme(theme);
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('lang', uiLang);
        document.documentElement.lang = uiLang;
        document.documentElement.dir = uiLang === 'ar' ? 'rtl' : 'ltr';
    }, [uiLang]);
    
    const handlePartChange = (part: keyof PromptParts, value: PromptPartLang) => {
        setPromptParts(prev => ({ ...prev, [part]: value }));
    };

    const handleSelectChange = (part: keyof PromptParts, e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        const allOptions = [subjectOptions, timeOptions, cameraMovementOptions, lightingOptions, videoStyleOptions, videoMoodOptions].flat();
        const selectedOption = allOptions.find(opt => opt.id === selectedValue || opt.en === selectedValue || opt.ar === selectedValue || opt.cn === selectedValue || opt.ru === selectedValue || opt[uiLang] === selectedValue);
        if (selectedOption) {
            handlePartChange(part, { id: selectedOption.id, en: selectedOption.en });
        } else {
            // Handle cases where the value might not be in the pre-defined list (e.g., loaded from history)
            handlePartChange(part, { id: selectedValue, en: selectedValue });
        }
    };
    
    const handleReset = () => {
        setPromptParts(initialPromptPartsState);
        setShowResults(false);
        setFinalPromptId('');
        setFinalPromptEn('');
        setFinalNegativePromptEn('');
        setKeepSubject(false);
        setClearIntonation(false);
    };
    
    const handleGenerateWithAI = async () => {
        setIsLoading(true);
        setShowResults(false);
        try {
            const lockedParts = keepSubject ? { subject: promptParts.subject, subjectDetails: promptParts.subjectDetails } : null;
            const newParts = await generatePrompt(lockedParts, modelTarget, generationMode, promptParts);
            setPromptParts(newParts);

            const generatedId = buildFinalPrompt(newParts, 'id');
            const generatedEn = buildFinalPrompt(newParts, 'en');
            setFinalPromptId(generatedId);
            setFinalPromptEn(generatedEn);
            setFinalNegativePromptEn(newParts.negativePrompt.en);
            setShowResults(true);

            // Save to history
            const newHistoryEntry: HistoryEntry = {
                id: Date.now(),
                timestamp: new Date().toLocaleString(),
                parts: newParts,
                finalPromptId: generatedId,
                finalPromptEn: generatedEn,
            };
            const updatedHistory = [newHistoryEntry, ...history];
            setHistory(updatedHistory);
            localStorage.setItem('promptHistory', JSON.stringify(updatedHistory));

        } catch (error) {
            console.error(error);
            alert((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text: string, type: 'id' | 'en' | 'neg') => {
        navigator.clipboard.writeText(text);
        setCopyStatus({ id: false, en: false, neg: false, [type]: true });
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = window.setTimeout(() => {
            setCopyStatus({ id: false, en: false, neg: false });
        }, 2000);
    };

    const handleLoadFromHistory = (entry: HistoryEntry) => {
        setPromptParts(entry.parts);
        setFinalPromptId(entry.finalPromptId);
        setFinalPromptEn(entry.finalPromptEn);
        setFinalNegativePromptEn(entry.parts.negativePrompt.en);
        setShowResults(true);
        setIsHistoryOpen(false);
    };

    const handleClearHistory = () => {
        if (window.confirm(t.clearHistoryConfirm)) {
            setHistory([]);
            localStorage.removeItem('promptHistory');
        }
    };

    const handleDeleteItem = (id: number) => {
        if (window.confirm(t.deleteItemConfirm)) {
            const updatedHistory = history.filter(item => item.id !== id);
            setHistory(updatedHistory);
            localStorage.setItem('promptHistory', JSON.stringify(updatedHistory));
        }
    };
    
    const renderPromptInput = (part: keyof PromptParts, label: string, placeholder: string, required: boolean = false, rows: number = 2, children?: React.ReactNode) => (
        <PromptInput
            id={part}
            label={label}
            value={promptParts[part][uiLang] || promptParts[part].id}
            onChange={(e) => {
                const current = promptParts[part];
                handlePartChange(part, { ...current, [uiLang]: e.target.value, id: e.target.value });
            }}
            placeholder={placeholder}
            rows={rows}
            required={required}
        >
          {children}
        </PromptInput>
    );

    const renderPromptSelect = (part: keyof PromptParts, label: string, options: LocalizedOption[], required: boolean = false, children?: React.ReactNode) => (
        <PromptSelect
            id={part}
            label={label}
            value={promptParts[part][uiLang] || promptParts[part].id}
            onChange={(e) => handleSelectChange(part, e)}
            options={getLocalizedOptions(options)}
            placeholder={t.selectPlaceholder}
            required={required}
        >
            {children}
        </PromptSelect>
    );
    
    return (
        <div className="min-h-screen container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Icon type="sparkles" className="w-8 h-8 text-cyan-500" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <LangSwitcher uiLang={uiLang} setUiLang={setUiLang} />
                    <ThemeSwitcher theme={theme} setTheme={setTheme} uiLang={uiLang}/>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                {/* Form Section */}
                <div className="space-y-6 bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-start p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                        <div className="flex items-center gap-2">
                           <label className="font-semibold text-slate-700 dark:text-slate-300">{t.targetModelLabel}</label>
                           <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-1 rounded-full">
                               <button onClick={() => setModelTarget('veo3')} className={`px-3 py-1 text-sm font-bold rounded-full transition-colors ${modelTarget === 'veo3' ? 'bg-cyan-500 text-white' : 'text-slate-600 dark:text-slate-300'}`}>VEO3</button>
                               <button onClick={() => setModelTarget('veo2')} className={`px-3 py-1 text-sm font-bold rounded-full transition-colors ${modelTarget === 'veo2' ? 'bg-cyan-500 text-white' : 'text-slate-600 dark:text-slate-300'}`}>VEO2</button>
                           </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderPromptSelect('subject', t.subjectLabel, subjectOptions, true,
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <input type="checkbox" id="keep-subject" checked={keepSubject} onChange={(e) => setKeepSubject(e.target.checked)} className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label htmlFor="keep-subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.keepSubjectLabel}</label>
                            </div>
                        )}
                        {renderPromptInput('subjectDetails', t.subjectDetailsLabel, placeholders[uiLang].subjectDetails)}
                        {renderPromptInput('action', t.actionLabel, placeholders[uiLang].action, true)}
                        {renderPromptInput('expression', t.expressionLabel, placeholders[uiLang].expression)}
                        {renderPromptInput('place', t.placeLabel, placeholders[uiLang].place, true)}
                        {renderPromptSelect('time', t.timeLabel, timeOptions)}
                        {renderPromptSelect('cameraMovement', t.cameraMovementLabel, cameraMovementOptions)}
                        {renderPromptSelect('lighting', t.lightingLabel, lightingOptions)}
                        {renderPromptSelect('videoStyle', t.videoStyleLabel, videoStyleOptions)}
                        {renderPromptSelect('videoMood', t.videoMoodLabel, videoMoodOptions)}
                        {modelTarget === 'veo3' && renderPromptInput('sound', t.soundLabel, placeholders[uiLang].sound)}
                        {modelTarget === 'veo3' && renderPromptInput('dialogue', t.dialogueLabel, placeholders[uiLang].dialogue, false, 2,
                            <div className="flex items-center gap-2 whitespace-nowrap" title={t.clearIntonationTooltip}>
                                <input type="checkbox" id="clear-intonation" checked={clearIntonation} onChange={(e) => setClearIntonation(e.target.checked)} className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <label htmlFor="clear-intonation" className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.clearIntonationLabel}</label>
                            </div>
                        )}
                        {renderPromptInput('details', t.additionalDetailsLabel, placeholders[uiLang].details)}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">{t.generationModeLabel}</label>
                            <div className="flex-grow w-full sm:w-auto flex items-center bg-slate-200 dark:bg-slate-700 p-1 rounded-full">
                                <button 
                                    onClick={() => setGenerationMode('structured')} 
                                    className={`w-1/2 px-3 py-1.5 text-sm font-bold rounded-full transition-colors text-center ${generationMode === 'structured' ? 'bg-cyan-500 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-600/50'}`}
                                    title={t.structuredModeTooltip}
                                >
                                    {t.structuredMode}
                                </button>
                                <button 
                                    onClick={() => setGenerationMode('creative')} 
                                    className={`w-1/2 px-3 py-1.5 text-sm font-bold rounded-full transition-colors text-center ${generationMode === 'creative' ? 'bg-cyan-500 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-600/50'}`}
                                    title={t.creativeModeTooltip}
                                >
                                    {t.creativeMode}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button onClick={handleGenerateWithAI} disabled={isLoading} className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-all duration-300 transform hover:scale-105">
                                {isLoading ? <Icon type="loader" className="w-5 h-5"/> : <Icon type="rocket" className="w-5 h-5"/>}
                                <span>{isLoading ? t.processing : t.generatePromptButton}</span>
                            </button>
                            <button onClick={handleReset} title={t.resetFormTooltip} className="inline-flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition-colors">
                                <Icon type="reset" className="w-5 h-5"/>
                                <span>{t.resetFormButton}</span>
                            </button>
                            <button onClick={() => setIsHistoryOpen(true)} title={t.historyButtonTooltip} className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 transition-colors">
                                <Icon type="history" className="w-5 h-5"/>
                                <span>{t.historyButtonLabel}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {showResults && (
                    <div className="mt-8 lg:mt-0 space-y-6">
                        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50">
                            <h3 className="text-lg font-semibold mb-3">{t.promptIdViewTitle}</h3>
                            <div className="relative">
                                <textarea readOnly value={finalPromptId} placeholder={t.promptIdPlaceholder} rows={5} className="w-full bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-md p-3 pr-12 text-sm resize-y" />
                                <button onClick={() => handleCopy(finalPromptId, 'id')} title={t.copyIdButton} className="absolute top-2 ltr:right-2 rtl:left-2 p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors">
                                    <Icon type="copy" className="w-5 h-5" />
                                </button>
                                {copyStatus.id && <div className="absolute top-10 ltr:right-2 rtl:left-2 bg-slate-900 text-white text-xs rounded py-1 px-2">{t.copied}</div>}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50">
                            <h3 className="text-lg font-semibold mb-3">{t.promptEnViewTitle}</h3>
                            <div className="relative">
                                <textarea readOnly value={finalPromptEn} placeholder={t.promptEnPlaceholder} rows={5} className="w-full bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-md p-3 pr-12 text-sm resize-y" />
                                <button onClick={() => handleCopy(finalPromptEn, 'en')} title={t.copyEnButton} className="absolute top-2 ltr:right-2 rtl:left-2 p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors">
                                    <Icon type="copy" className="w-5 h-5" />
                                </button>
                                {copyStatus.en && <div className="absolute top-10 ltr:right-2 rtl:left-2 bg-slate-900 text-white text-xs rounded py-1 px-2">{t.copied}</div>}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-red-500/50 dark:border-red-500/50">
                            <h3 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">{t.negativePromptTitle}</h3>
                            <div className="relative">
                                <textarea readOnly value={finalNegativePromptEn} placeholder={t.negativePromptPlaceholder} rows={3} className="w-full bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-md p-3 pr-12 text-sm resize-y" />
                                <button onClick={() => handleCopy(finalNegativePromptEn, 'neg')} title={t.copyNegButton} className="absolute top-2 ltr:right-2 rtl:left-2 p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors">
                                    <Icon type="copy" className="w-5 h-5" />
                                </button>
                                {copyStatus.neg && <div className="absolute top-10 ltr:right-2 rtl:left-2 bg-slate-900 text-white text-xs rounded py-1 px-2">{t.copied}</div>}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="text-center mt-12 py-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-center items-center gap-6 mb-4">
                    <a href="https://www.tiktok.com/@tongsolop" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors" aria-label="TikTok">
                        <Icon type="tiktok" className="w-6 h-6"/>
                    </a>
                    <a href="https://www.youtube.com/@tongsolop" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" aria-label="YouTube">
                        <Icon type="youtube" className="w-7 h-7"/>
                    </a>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t.credit}</p>
            </footer>

            <HistoryModal 
                isOpen={isHistoryOpen} 
                onClose={() => setIsHistoryOpen(false)}
                history={history}
                onLoadPrompt={handleLoadFromHistory}
                onClearHistory={handleClearHistory}
                onDeleteItem={handleDeleteItem}
                translations={{
                    historyTitle: t.historyTitle,
                    clearHistoryButton: t.clearHistoryButton,
                    loadPromptButton: t.loadPromptButton,
                    noHistoryMessage: t.noHistoryMessage,
                    closeButtonLabel: t.closeButtonLabel,
                    deleteItemButtonTooltip: t.deleteItemButtonTooltip,
                    negativePromptHistoryLabel: t.negativePromptHistoryLabel,
                }}
            />
        </div>
    );
};

export default App;