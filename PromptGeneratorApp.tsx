

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PromptParts, PromptPartLang, HistoryEntry } from './types';
import { generatePrompt } from './services/geminiService';
import PromptInput from './components/PromptInput';
import PromptSelect from './components/PromptSelect';
import { Icon } from './components/Icon';
import HistoryModal from './components/HistoryModal';
import GuideModal from './components/GuideModal';

// PROPS
interface PromptGeneratorAppProps {
  onLogout: () => void;
}

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
        aspectRatioLabel: "Rasio Aspek",
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
        negativePromptHistoryLabel: "Negatif:",
        logoutButton: "Logout",
        enhanceToRealisticLabel: "Tingkatkan ke Realistis",
        enhanceToRealisticTooltip: "Menambahkan detail sinematik ke prompt akhir untuk hasil yang lebih realistis, tanpa mengubah input Anda.",
        limitReachedMessage: "Anda telah mencapai batas generate ({limit} kali) untuk 24 jam. Coba lagi besok atau hubungi admin untuk akses tak terbatas.",
        limitErrorTitle: "Akses Dibatasi",
        contactAdmin: "Hubungi Admin Sekarang",
        contactAdminBody: "Halo, saya ingin meminta akses generate tak terbatas. Username saya: ",
        guideButtonLabel: "Panduan",
        guideButtonTooltip: "Buka panduan cara pakai",
        guideTitle: "Cara Pakai Aplikasi",
        guideIntro: "Panduan ini akan membantu Anda memahami fitur-fitur utama dan cara memaksimalkan penggunaan aplikasi generator prompt ini.",
        guideModeTitle: "Mode Generate",
        guideModeStructuredTitle: "Terstruktur",
        guideModeStructuredContent: "Dalam mode ini, AI hanya akan mengisi kolom-kolom yang Anda kosongkan. AI tidak akan mengubah isian yang sudah Anda buat. Mode ini cocok jika Anda sudah memiliki ide yang jelas dan hanya butuh bantuan untuk melengkapi detail.",
        guideModeCreativeTitle: "Kreatif",
        guideModeCreativeContent: "Mode ini memberikan kebebasan penuh pada AI untuk mengembangkan ide Anda. AI akan mengambil input Anda sebagai inspirasi dan membangun sebuah adegan yang lebih kaya, lengkap, dan terkadang tak terduga. Gunakan mode ini untuk mencari inspirasi baru.",
        guideFeaturesTitle: "Fitur Utama",
        guideFeatureKeepSubjectTitle: "Jaga Subjek",
        guideFeatureKeepSubjectContent: "Saat dicentang, AI tidak akan mengubah isi kolom 'Subjek' dan 'Detail Subjek'. Berguna jika Anda ingin melihat subjek yang sama dalam berbagai aksi atau suasana berbeda saat menggunakan mode 'Kreatif'.",
        guideFeatureEnhanceTitle: "Tingkatkan ke Realistis",
        guideFeatureEnhanceContent: "Fitur ini bekerja di latar belakang untuk menambahkan detail sinematik dan teknis (seperti jenis kamera, lensa, atau efek) ke prompt akhir Anda. Fitur ini tidak akan mengubah input Anda di formulir, hanya memperkaya hasil akhirnya untuk kualitas yang lebih tinggi.",
        guideFeatureIntonationTitle: "Intonasi Jelas",
        guideFeatureIntonationContent: "Jika Anda mengisi kolom 'Kalimat yang Diucapkan', mencentang opsi ini akan menambahkan instruksi khusus pada prompt agar subjek mengucapkan dialog dengan penekanan dan intonasi yang jelas, mengurangi hasil yang monoton.",
        guideFeatureImportExportTitle: "Impor & Ekspor Riwayat",
        guideFeatureImportExportContent: "Fitur ini memungkinkan Anda mencadangkan (ekspor) seluruh riwayat prompt Anda ke dalam sebuah file JSON. File ini dapat disimpan atau dipindahkan ke perangkat lain. Gunakan 'Impor' untuk memuat kembali riwayat dari file cadangan. Ini berguna untuk memindahkan data antar browser, perangkat, atau untuk berbagi riwayat dengan orang lain.",
        guideTargetModelTitle: "Target Model (VEO2 vs VEO3)",
        guideTargetModelContent: "Pilihan ini menyesuaikan format prompt akhir. VEO3 tidak memiliki kolom Negative Prompt terpisah, jadi jika VEO3 dipilih, prompt negatif akan otomatis digabungkan ke prompt utama. Jika VEO2 dipilih, prompt negatif akan ditampilkan di kotak terpisah untuk disalin manual.",
        guideAccountManagementTitle: "Manajemen Akun & Limitasi",
        guideAccountManagementContent: "Setiap pengguna memiliki batas generate harian. Pengguna standar akan direset setiap 24 jam. Jika Anda mencapai batas, Anda dapat menunggu atau menghubungi admin melalui tautan yang muncul untuk meminta akses premium (tanpa batas).",
        guideCloseButton: "Tutup Panduan",
        importHistoryButton: "Impor",
        exportHistoryButton: "Ekspor",
        importHistoryTooltip: "Impor riwayat dari file JSON",
        exportHistoryTooltip: "Ekspor riwayat saat ini ke file JSON",
        importConfirm: "Ini akan menggabungkan riwayat yang diimpor dengan riwayat Anda saat ini. Entri duplikat akan diabaikan. Lanjutkan?",
        importSuccess: "Riwayat berhasil diimpor dan digabungkan!",
        importError: "File tidak valid atau rusak. Harap pilih file cadangan riwayat JSON yang benar.",
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
        aspectRatioLabel: "Aspect Ratio",
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
        negativePromptHistoryLabel: "Negative:",
        logoutButton: "Logout",
        enhanceToRealisticLabel: "Enhance to Realistic",
        enhanceToRealisticTooltip: "Adds cinematic details to the final prompt for a more realistic result, without changing your inputs.",
        limitReachedMessage: "You have reached your generation limit ({limit} times) for 24 hours. Try again tomorrow or contact an admin for unlimited access.",
        limitErrorTitle: "Access Restricted",
        contactAdmin: "Contact Admin Now",
        contactAdminBody: "Hello, I would like to request unlimited generation access. My username is: ",
        guideButtonLabel: "Guide",
        guideButtonTooltip: "Open usage guide",
        guideTitle: "How to Use the App",
        guideIntro: "This guide will help you understand the main features and how to maximize the use of this prompt generator application.",
        guideModeTitle: "Generation Modes",
        guideModeStructuredTitle: "Structured",
        guideModeStructuredContent: "In this mode, the AI will only fill in the fields you leave empty. It will not change any content you've already entered. This mode is suitable if you have a clear idea and just need help completing the details.",
        guideModeCreativeTitle: "Creative",
        guideModeCreativeContent: "This mode gives the AI full freedom to develop your ideas. The AI will take your input as inspiration and build a richer, more complete, and sometimes unexpected scene. Use this mode to find new inspiration.",
        guideFeaturesTitle: "Main Features",
        guideFeatureKeepSubjectTitle: "Keep Subject",
        guideFeatureKeepSubjectContent: "When checked, the AI will not change the content of the 'Subject' and 'Subject Details' fields. Useful if you want to see the same subject in different actions or moods when using 'Creative' mode.",
        guideFeatureEnhanceTitle: "Enhance to Realistic",
        guideFeatureEnhanceContent: "This feature works in the background to add cinematic and technical details (like camera type, lens, or effects) to your final prompt. It will not change your input in the form, only enrich the final output for higher quality.",
        guideFeatureIntonationTitle: "Clear Intonation",
        guideFeatureIntonationContent: "If you fill in the 'Dialogue' field, checking this option will add a special instruction to the prompt for the subject to speak the dialogue with clear emphasis and intonation, reducing monotonous results.",
        guideFeatureImportExportTitle: "Import & Export History",
        guideFeatureImportExportContent: "This feature allows you to back up (export) your entire prompt history into a JSON file. This file can be saved or moved to another device. Use 'Import' to load the history back from the backup file. This is useful for transferring your data between browsers, devices, or for sharing your history with others.",
        guideTargetModelTitle: "Target Model (VEO2 vs VEO3)",
        guideTargetModelContent: "This option adjusts the final prompt format. VEO3 does not have a separate Negative Prompt field, so if VEO3 is selected, the negative prompt will be automatically merged into the main prompt. If VEO2 is selected, the negative prompt will be displayed in a separate box to be copied manually.",
        guideAccountManagementTitle: "Account Management & Limits",
        guideAccountManagementContent: "Each user has a daily generation limit. Standard users are reset every 24 hours. If you reach your limit, you can wait or contact the admin via the link that appears to request premium (unlimited) access.",
        guideCloseButton: "Close Guide",
        importHistoryButton: "Import",
        exportHistoryButton: "Export",
        importHistoryTooltip: "Import history from a JSON file",
        exportHistoryTooltip: "Export current history to a JSON file",
        importConfirm: "This will merge the imported history with your current one. Duplicate entries will be ignored. Continue?",
        importSuccess: "History successfully imported and merged!",
        importError: "Invalid or corrupted file. Please select a valid history backup JSON file.",
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
        aspectRatioLabel: "نسبة العرض إلى الارتفاع",
        lightingLabel: "الإضاءة",
        videoStyleLabel: "أسلوب الفيديو",
        videoMoodLabel: "جو الفيديو",
        soundLabel: "الصوت أو الموسيقى",
        dialogueLabel: "الحوار / الكلمات المنطوقة",
        additionalDetailsLabel: "تفاصيل إضافية",
        clearIntonationLabel: "نبرة واضحة",
        clearIntonationTooltip: "أضف تعليمات لنبرة واضحة في الأمر النهائي",
        resultsTitle: "النتائج والمعاينة",
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
        negativePromptHistoryLabel: "سلبي:",
        logoutButton: "خروج",
        enhanceToRealisticLabel: "تحسين إلى الواقعية",
        enhanceToRealisticTooltip: "يضيف تفاصيل سينمائية إلى الأمر النهائي للحصول على نتيجة أكثر واقعية، دون تغيير مدخلاتك.",
        limitReachedMessage: "لقد وصلت إلى حد الإنشاء ({limit} مرة) لمدة 24 ساعة. حاول مرة أخرى غدًا أو اتصل بالمسؤول للوصول غير المحدود.",
        limitErrorTitle: "الوصول مقيد",
        contactAdmin: "اتصل بالمسؤول الآن",
        contactAdminBody: "مرحباً، أود طلب وصول غير محدود للإنشاء. اسم المستخدم الخاص بي هو: ",
        guideButtonLabel: "دليل",
        guideButtonTooltip: "فتح دليل الاستخدام",
        guideTitle: "كيفية استخدام التطبيق",
        guideIntro: "سيساعدك هذا الدليل على فهم الميزات الرئيسية وكيفية تحقيق أقصى استفادة من تطبيق مولد الأوامر هذا.",
        guideModeTitle: "أوضاع الإنشاء",
        guideModeStructuredTitle: "منظم",
        guideModeStructuredContent: "في هذا الوضع، سيقوم الذكاء الاصطناعي فقط بملء الحقول التي تتركها فارغة. لن يغير أي محتوى قمت بإدخاله بالفعل. هذا الوضع مناسب إذا كانت لديك فكرة واضحة وتحتاج فقط إلى مساعدة في إكمال التفاصيل.",
        guideModeCreativeTitle: "إبداعي",
        guideModeCreativeContent: "يمنح هذا الوضع الذكاء الاصطناعي حرية كاملة لتطوير أفكارك. سيأخذ الذكاء الاصطناعي مدخلاتك كمصدر إلهام ويبني مشهدًا أكثر ثراءً واكتمالاً وغير متوقع في بعض الأحيان. استخدم هذا الوضع للعثور على إلهام جديد.",
        guideFeaturesTitle: "الميزات الرئيسية",
        guideFeatureKeepSubjectTitle: "حافظ على الموضوع",
        guideFeatureKeepSubjectContent: " عند تحديد هذا الخيار، لن يغير الذكاء الاصطناعي محتوى حقلي 'الموضوع' و 'تفاصيل الموضوع'. مفيد إذا كنت تريد رؤية نفس الموضوع في إجراءات أو أمزجة مختلفة عند استخدام الوضع 'الإبداعي'.",
        guideFeatureEnhanceTitle: "تحسين إلى الواقعية",
        guideFeatureEnhanceContent: " تعمل هذه الميزة في الخلفية لإضافة تفاصيل سينمائية وتقنية (مثل نوع الكاميرا أو العدسة أو التأثيرات) إلى الأمر النهائي. لن تغير مدخلاتك في النموذج، بل ستثري فقط الإخراج النهائي للحصول على جودة أعلى.",
        guideFeatureIntonationTitle: "نبرة واضحة",
        guideFeatureIntonationContent: "إذا قمت بملء حقل 'الحوار'، فإن تحديد هذا الخيار سيضيف تعليمات خاصة إلى الأمر لكي ينطق الموضوع الحوار بتركيز ونبرة واضحة، مما يقلل من النتائج الرتيبة.",
        guideFeatureImportExportTitle: "استيراد وتصدير السجل",
        guideFeatureImportExportContent: "تتيح لك هذه الميزة نسخ (تصدير) سجل الأوامر بالكامل إلى ملف JSON. يمكن حفظ هذا الملف أو نقله إلى جهاز آخر. استخدم 'استيراد' لتحميل السجل مرة أخرى من ملف النسخ الاحتياطي. هذا مفيد لنقل بياناتك بين المتصفحات أو الأجهزة المختلفة، أو لمشاركة سجلك مع الآخرين.",
        guideTargetModelTitle: "النموذج المستهدف (VEO2 vs VEO3)",
        guideTargetModelContent: "يضبط هذا الخيار تنسيق الأمر النهائي. لا يحتوي VEO3 على حقل أمر سلبي منفصل، لذلك إذا تم تحديد VEO3، فسيتم دمج الأمر السلبي تلقائيًا في الأمر الرئيسي. إذا تم تحديد VEO2، فسيتم عرض الأمر السلبي في مربع منفصل ليتم نسخه يدويًا.",
        guideAccountManagementTitle: "إدارة الحساب والحدود",
        guideAccountManagementContent: "كل مستخدم لديه حد إنشاء يومي. يتم إعادة تعيين المستخدمين القياسيين كل 24 ساعة. إذا وصلت إلى الحد الأقصى، يمكنك الانتظار أو الاتصال بالمسؤول عبر الرابط الذي يظهر لطلب وصول متميز (غير محدود).",
        guideCloseButton: "أغلق الدليل",
        importHistoryButton: "استيراد",
        exportHistoryButton: "تصدير",
        importHistoryTooltip: "استيراد السجل من ملف JSON",
        exportHistoryTooltip: "تصدير السجل الحالي إلى ملف JSON",
        importConfirm: "سيؤدي هذا إلى دمج السجل المستورد مع سجلك الحالي. سيتم تجاهل الإدخالات المكررة. متابعة؟",
        importSuccess: "تم استيراد السجل ودمجه بنجاح!",
        importError: "ملف غير صالح أو تالف. يرجى تحديد ملف نسخ احتياطي صالح للسجل بتنسيق JSON.",
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
        aspectRatioLabel: "宽高比",
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
        negativePromptHistoryLabel: "负面:",
        logoutButton: "登出",
        enhanceToRealisticLabel: "增强为写实",
        enhanceToRealisticTooltip: "在不更改您输入的情况下，向最终提示添加电影细节以获得更逼真的效果。",
        limitReachedMessage: "您已达到 24 小时内的生成限制 ({limit} 次)。请明天再试或联系管理员以获取无限制访问权限。",
        limitErrorTitle: "访问受限",
        contactAdmin: "立即联系管理员",
        contactAdminBody: "您好，我想申请无限制生成权限。我的用户名是: ",
        guideButtonLabel: "指南",
        guideButtonTooltip: "打开使用指南",
        guideTitle: "如何使用本应用",
        guideIntro: "本指南将帮助您了解此提示生成器应用的主要功能以及如何最大限度地使用它。",
        guideModeTitle: "生成模式",
        guideModeStructuredTitle: "结构化",
        guideModeStructuredContent: "在此模式下，AI只会填充您留空的字段。它不会更改您已经输入的任何内容。如果您已经有清晰的想法，只需要帮助完成细节，则此模式非常适合。",
        guideModeCreativeTitle: "创意",
        guideModeCreativeContent: "此模式赋予AI充分的自由来发展您的想法。AI将以您的输入为灵感，构建一个更丰富、更完整，有时甚至出乎意料的场景。使用此模式寻找新的灵感。",
        guideFeaturesTitle: "主要功能",
        guideFeatureKeepSubjectTitle: "保持主题",
        guideFeatureKeepSubjectContent: "选中后，AI不会更改“主题”和“主题细节”字段的内容。在使用“创意”模式时，如果您希望在不同的动作或情绪中看到相同的主题，此功能非常有用。",
        guideFeatureEnhanceTitle: "增强为写实",
        guideFeatureEnhanceContent: "此功能在后台运行，将电影和技术细节（如相机类型、镜头或效果）添加到您的最终提示中。它不会更改您在表单中的输入，只会丰富最终输出以获得更高质量。",
        guideFeatureIntonationTitle: "清晰的语调",
        guideFeatureIntonationContent: "如果您填写了“对话”字段，选中此选项将向提示添加特殊说明，使主题以清晰的重音和语调说出对话，减少单调的结果。",
        guideFeatureImportExportTitle: "导入和导出历史记录",
        guideFeatureImportExportContent: "此功能允许您将整个提示历史记录备份（导出）到一个JSON文件中。该文件可以保存或移动到其他设备。使用“导入”从备份文件加载历史记录。这对于在不同浏览器、设备之间传输数据或与他人共享您的历史记录非常有用。",
        guideTargetModelTitle: "目标模型 (VEO2 vs VEO3)",
        guideTargetModelContent: "此选项调整最终提示的格式。VEO3没有单独的负面提示字段，因此如果选择VEO3，负面提示将自动合并到主提示中。如果选择VEO2，负面提示将显示在单独的框中以便手动复制。",
        guideAccountManagementTitle: "账户管理与限制",
        guideAccountManagementContent: "每个用户都有每日生成限制。标准用户每24小时重置一次。如果达到限制，您可以等待或通过出现的链接联系管理员，请求高级（无限制）访问权限。",
        guideCloseButton: "关闭指南",
        importHistoryButton: "导入",
        exportHistoryButton: "导出",
        importHistoryTooltip: "从JSON文件导入历史记录",
        exportHistoryTooltip: "将当前历史记录导出到JSON文件",
        importConfirm: "这将把导入的历史记录与当前历史记录合并。重复的条目将被忽略。继续吗？",
        importSuccess: "历史记录成功导入并合并！",
        importError: "文件无效或已损坏。请选择一个有效的历史记录备份JSON文件。",
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
        aspectRatioLabel: "Соотношение сторон",
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
        negativePromptHistoryLabel: "Негатив:",
        logoutButton: "Выйти",
        enhanceToRealisticLabel: "Улучшить до реалистичного",
        enhanceToRealisticTooltip: "Добавляет кинематографические детали в финальный промпт для более реалистичного результата, не изменяя ваши вводы.",
        limitReachedMessage: "Вы достигли лимита генерации ({limit} раз) на 24 часа. Попробуйте снова завтра или свяжитесь с администратором для неограниченного доступа.",
        limitErrorTitle: "Доступ ограничен",
        contactAdmin: "Связаться с администратором сейчас",
        contactAdminBody: "Здравствуйте, я хотел бы запросить неограниченный доступ к генерации. Мое имя пользователя: ",
        guideButtonLabel: "Руководство",
        guideButtonTooltip: "Открыть руководство по использованию",
        guideTitle: "Как использовать приложение",
        guideIntro: "Это руководство поможет вам понять основные функции и как максимально эффективно использовать это приложение-генератор промптов.",
        guideModeTitle: "Режимы генерации",
        guideModeStructuredTitle: "Структурированный",
        guideModeStructuredContent: "В этом режиме ИИ будет заполнять только те поля, которые вы оставили пустыми. Он не будет изменять уже введенные вами данные. Этот режим подходит, если у вас есть четкая идея и вам нужна помощь только в дополнении деталей.",
        guideModeCreativeTitle: "Творческий",
        guideModeCreativeContent: "Этот режим дает ИИ полную свободу для развития ваших идей. ИИ будет использовать ваш ввод как вдохновение и создавать более богатую, полную и иногда неожиданную сцену. Используйте этот режим для поиска нового вдохновения.",
        guideFeaturesTitle: "Основные функции",
        guideFeatureKeepSubjectTitle: "Сохранять тему",
        guideFeatureKeepSubjectContent: "Если этот флажок установлен, ИИ не будет изменять содержимое полей 'Тема' и 'Детали темы'. Полезно, если вы хотите видеть один и тот же объект в разных действиях или настроениях при использовании 'Творческого' режима.",
        guideFeatureEnhanceTitle: "Улучшить до реалистичного",
        guideFeatureEnhanceContent: "Эта функция работает в фоновом режиме, добавляя кинематографические и технические детали (например, тип камеры, объектив или эффекты) в ваш финальный промпт. Она не изменит ваш ввод в форме, а только обогатит конечный результат для более высокого качества.",
        guideFeatureIntonationTitle: "Четкая интонация",
        guideFeatureIntonationContent: "Если вы заполните поле 'Диалог', установка этого флажка добавит специальную инструкцию в промпт, чтобы объект произносил диалог с четким ударением и интонацией, уменьшая монотонность результатов.",
        guideFeatureImportExportTitle: "Импорт и экспорт истории",
        guideFeatureImportExportContent: "Эта функция позволяет вам создавать резервные копии (экспортировать) всей вашей истории промптов в файл JSON. Этот файл можно сохранить или перенести на другое устройство. Используйте 'Импорт', чтобы загрузить историю обратно из файла резервной копии. Это полезно для переноса ваших данных между разными браузерами, устройствами или для обмена вашей историей с другими.",
        guideTargetModelTitle: "Целевая модель (VEO2 vs VEO3)",
        guideTargetModelContent: "Этот параметр настраивает формат финального промпта. В VEO3 нет отдельного поля для негативного промпта, поэтому, если выбрана VEO3, негативный промпт будет автоматически объединен с основным. Если выбрана VEO2, негативный промпт будет отображаться в отдельном окне для ручного копирования.",
        guideAccountManagementTitle: "Управление аккаунтом и лимиты",
        guideAccountManagementContent: "У каждого пользователя есть дневной лимит генерации. Для стандартных пользователей лимит сбрасывается каждые 24 часа. Если вы достигли своего лимита, вы можете подождать или связаться с администратором по появившейся ссылке, чтобы запросить премиум-доступ (без ограничений).",
        guideCloseButton: "Закрыть руководство",
        importHistoryButton: "Импорт",
        exportHistoryButton: "Экспорт",
        importHistoryTooltip: "Импортировать историю из файла JSON",
        exportHistoryTooltip: "Экспортировать текущую историю в файл JSON",
        importConfirm: "Это объединит импортированную историю с вашей текущей. Дублирующиеся записи будут проигнорированы. Продолжить?",
        importSuccess: "История успешно импортирована и объединена!",
        importError: "Неверный или поврежденный файл. Пожалуйста, выберите действительный файл резервной копии истории JSON.",
    }
};

type LocalizedOption = { value: string; id: string; en: string; ar: string; cn: string; ru: string };

const subjectOptions: LocalizedOption[] = [ { value: 'Orang Asia', id: 'Orang Asia', en: 'Asian person', ar: 'شخص آسيوي', cn: '亚洲人', ru: 'Азиат' }, { value: 'Orang Afrika', id: 'Orang Afrika', en: 'African person', ar: 'شخص أفريقي', cn: '非洲人', ru: 'Африканец' }, { value: 'Orang Eropa', id: 'Orang Eropa', en: 'European person', ar: 'شخص أوروبي', cn: '欧洲人', ru: 'Европеец' }, { value: 'Orang Hispanik', id: 'Orang Hispanik', en: 'Hispanic person', ar: 'شخص من أصل إسباني', cn: '西班牙裔', ru: 'Испанец' }, { value: 'Orang Timur Tengah', id: 'Orang Timur Tengah', en: 'Middle Eastern person', ar: 'شخص من الشرق الأوسط', cn: '中东人', ru: 'Житель Ближнего Востока' }, { value: 'Anak-anak', id: 'Anak-anak', en: 'Children', ar: 'أطفال', cn: '儿童', ru: 'Дети' }, { value: 'Orang tua', id: 'Orang tua', en: 'Elderly person', ar: 'شخص مسن', cn: '老人', ru: 'Пожилой человек' }, { value: 'Robot futuristik', id: 'Robot futuristik', en: 'Futuristic robot', ar: 'روبوت مستقبلي', cn: '未来派机器人', ru: 'Футуристический робот' }, { value: 'Makhluk fantasi', id: 'Makhluk fantasi', en: 'Fantasy creature', ar: 'مخلوق خيالي', cn: '幻想生物', ru: 'Фантастическое существо' }, { value: 'Hewan (spesifik)', id: 'Hewan (spesifik)', en: 'Animal (specific)', ar: 'حيوان (محدد)', cn: '动物（具体）', ru: 'Животное (конкретное)' }, ];
const timeOptions: LocalizedOption[] = [ { value: 'Pagi hari', id: 'Pagi hari', en: 'Morning', ar: 'صباح', cn: '早上', ru: 'Утро' }, { value: 'Siang hari', id: 'Siang hari', en: 'Daytime', ar: 'وقت النهار', cn: '白天', ru: 'День' }, { value: 'Sore hari', id: 'Sore hari', en: 'Afternoon', ar: 'بعد الظهر', cn: '下午', ru: 'После полудня' }, { value: 'Golden hour', id: 'Golden hour', en: 'Golden hour', ar: 'الساعة الذهبية', cn: '黄金时刻', ru: 'Золотой час' }, { value: 'Malam hari', id: 'Malam hari', en: 'Night', ar: 'ليل', cn: '夜晚', ru: 'Ночь' }, { value: 'Fajar', id: 'Fajar', en: 'Dawn', ar: 'فجر', cn: '黎明', ru: 'Рассвет' }, { value: 'Senja', id: 'Senja', en: 'Dusk', ar: 'غسق', cn: '黄昏', ru: 'Сумерки' }, ];
const cameraMovementOptions: LocalizedOption[] = [ { value: 'Wide shot', id: 'Wide shot', en: 'Wide shot', ar: 'لقطة واسعة', cn: '广角镜头', ru: 'Широкий план' }, { value: 'Medium shot', id: 'Medium shot', en: 'Medium shot', ar: 'لقطة متوسطة', cn: '中景镜头', ru: 'Средний план' }, { value: 'Close-up shot', id: 'Close-up shot', en: 'Close-up shot', ar: 'لقطة مقربة', cn: '特写镜头', ru: 'Крупный план' }, { value: 'Low-angle shot', id: 'Low-angle shot', en: 'Low-angle shot', ar: 'لقطة من زاوية منخفضة', cn: '低角度拍摄', ru: 'Съемка с нижнего ракурса' }, { value: 'High-angle shot', id: 'High-angle shot', en: 'High-angle shot', ar: 'لقطة من زاوية مرتفعة', cn: '高角度拍摄', ru: 'Съемка с верхнего ракурса' }, { value: 'Dolly zoom', id: 'Dolly zoom', en: 'Dolly zoom', ar: 'تقريب دوللي', cn: '推拉变焦', ru: 'Транстрав (Долли-зум)' }, { value: 'Tracking shot', id: 'Tracking shot', en: 'Tracking shot', ar: 'لقطة تتبع', cn: '跟随镜头', ru: 'Проездка (трекинг-шот)' }, { value: 'Handheld', id: 'Handheld', en: 'Handheld', ar: 'محمولة باليد', cn: '手持拍摄', ru: 'Ручная съемка' }, { value: 'Drone shot', id: 'Drone shot', en: 'Drone shot', ar: 'لقطة بطائرة بدون طيار', cn: '无人机拍摄', ru: 'Съемка с дрона' }, ];
const aspectRatioOptions: LocalizedOption[] = [ { value: '16:9 (Lanskap)', id: '16:9 (Lanskap)', en: '16:9', ar: '16:9 (أفقي)', cn: '16:9 (横向)', ru: '16:9 (Ландшафт)' }, { value: '9:16 (Potret)', id: '9:16 (Potret)', en: '9:16', ar: '9:16 (عمودي)', cn: '9:16 (纵向)', ru: '9:16 (Портрет)' }, { value: '1:1 (Persegi)', id: '1:1 (Persegi)', en: '1:1', ar: '1:1 (مربع)', cn: '1:1 (方形)', ru: '1:1 (Квадрат)' }, { value: '4:3 (Klasik)', id: '4:3 (Klasik)', en: '4:3', ar: '4:3 (كلاسيكي)', cn: '4:3 (经典)', ru: '4:3 (Классика)' }, { value: '3:4 (Potret Klasik)', id: '3:4 (Potret Klasik)', en: '3:4', ar: '3:4 (عمودي كلاسيكي)', cn: '3:4 (经典纵向)', ru: '3:4 (Классический портрет)' }, ];
const lightingOptions: LocalizedOption[] = [ { value: 'Pencahayaan sinematik', id: 'Pencahayaan sinematik', en: 'Cinematic lighting', ar: 'إضاءة سينمائية', cn: '电影灯光', ru: 'Кинематографическое освещение' }, { value: 'Cahaya alami', id: 'Cahaya alami', en: 'Natural light', ar: 'ضوء طبيعي', cn: '自然光', ru: 'Естественный свет' }, { value: 'Rembrandt lighting', id: 'Rembrandt lighting', en: 'Rembrandt lighting', ar: 'إضاءة رامبرانت', cn: '伦勃朗光', ru: 'Рембрандтовский свет' }, { value: 'Cahaya neon', id: 'Cahaya neon', en: 'Neon light', ar: 'ضوء نيون', cn: '霓虹灯', ru: 'Неоновый свет' }, { value: 'High-key lighting', id: 'High-key lighting', en: 'High-key lighting', ar: 'إضاءة عالية المفتاح', cn: '高调光', ru: 'Высокий ключ' }, { value: 'Low-key lighting', id: 'Low-key lighting', en: 'Low-key lighting', ar: 'إضاءة منخفضة المفتاح', cn: '低调光', ru: 'Низкий ключ' }, { value: 'Backlight', id: 'Backlight', en: 'Backlight', ar: 'إضاءة خلفية', cn: '逆光', ru: 'Контровой свет' }, ];
const videoStyleOptions: LocalizedOption[] = [ { value: 'Sinematik', id: 'Sinematik', en: 'Cinematic', ar: 'سينمائي', cn: '电影感', ru: 'Кинематографический' }, { value: 'Hyperrealistic', id: 'Hyperrealistic', en: 'Hyperrealistic', ar: 'واقعية مفرطة', cn: '超写实', ru: 'Гиперреалистичный' }, { value: 'Gaya anime', id: 'Gaya anime', en: 'Anime style', ar: 'أسلوب الأنمي', cn: '动漫风格', ru: 'В стиле аниме' }, { value: 'Film vintage', id: 'Film vintage', en: 'Vintage film', ar: 'فيلم كلاسيكي', cn: '复古电影', ru: 'Винтажный фильм' }, { value: 'Fantasi', id: 'Fantasi', en: 'Fantasy', ar: 'خيالي', cn: '幻想', ru: 'Фэнтези' }, { value: 'Cyberpunk', id: 'Cyberpunk', en: 'Cyberpunk', ar: 'سايبربانك', cn: '赛博朋克', ru: 'Киберпанк' }, { value: 'Dokumenter', id: 'Dokumenter', en: 'Documentary', ar: 'وثائقي', cn: '纪录片', ru: 'Документальный' }, { value: 'Stop-motion', id: 'Stop-motion', en: 'Stop-motion', ar: 'إيقاف الحركة', cn: '定格动画', ru: 'Покадровая анимация' }, { value: 'Lukisan cat air', id: 'Lukisan cat air', en: 'Watercolor painting', ar: 'لوحة مائية', cn: '水彩画', ru: 'Акварельная живопись' }, ];
const videoMoodOptions: LocalizedOption[] = [ { value: 'Ceria', id: 'Ceria', en: 'Cheerful', ar: 'مبهج', cn: '愉快的', ru: 'Веселое' }, { value: 'Misterius', id: 'Misterius', en: 'Mysterious', ar: 'غامض', cn: '神秘的', ru: 'Таинственное' }, { value: 'Dramatis', id: 'Dramatis', en: 'Dramatic', ar: 'درامي', cn: '戏剧性的', ru: 'Драматичное' }, { value: 'Tenang', id: 'Tenang', en: 'Calm', ar: 'هادئ', cn: '平静的', ru: 'Спокойное' }, { value: 'Epik', id: 'Epik', en: 'Epic', ar: 'ملحمي', cn: '史诗般的', ru: 'Эпичное' }, { value: 'Nostalgia', id: 'Nostalgia', en: 'Nostalgic', ar: 'حنين', cn: '怀旧的', ru: 'Ностальгическое' }, { value: 'Menegangkan', id: 'Menegangkan', en: 'Tense', ar: 'متوتر', cn: '紧张的', ru: 'Напряженное' }, { value: 'Romantis', id: 'Romantis', en: 'Romantic', ar: 'رومانسي', cn: '浪漫的', ru: 'Романтичное' }, { value: 'Kecewa', id: 'Kecewa', en: 'Disappointed', ar: 'خائب الأمل', cn: '失望的', ru: 'Разочарованное' }, { value: 'Sedih', id: 'Sedih', en: 'Sad', ar: 'حزين', cn: '悲伤的', ru: 'Грустное' }, ];

const createEmptyPromptPartLang = (): PromptPartLang => ({ id: '', en: '' });
const initialPromptPartsState: PromptParts = { subject: createEmptyPromptPartLang(), subjectDetails: createEmptyPromptPartLang(), action: createEmptyPromptPartLang(), expression: createEmptyPromptPartLang(), place: createEmptyPromptPartLang(), time: createEmptyPromptPartLang(), cameraMovement: createEmptyPromptPartLang(), aspectRatio: createEmptyPromptPartLang(), lighting: createEmptyPromptPartLang(), videoStyle: createEmptyPromptPartLang(), videoMood: createEmptyPromptPartLang(), sound: createEmptyPromptPartLang(), dialogue: createEmptyPromptPartLang(), details: createEmptyPromptPartLang(), negativePrompt: createEmptyPromptPartLang() };

const placeholders = {
    id: { subjectDetails: "Rambutnya terbuat dari api, matanya seperti permata", action: "Mengaum sambil menyemburkan api ke langit", expression: "Marah, mata menyala dengan garang", place: "Di puncak gunung berapi yang aktif, lava mengalir", sound: "Musik orkestra epik, suara gemuruh gunung", dialogue: "(Tidak ada dialog)", details: "Asap tebal membumbung, kilat menyambar di latar belakang", },
    en: { subjectDetails: "Hair made of fire, eyes like gems", action: "Roaring while spewing fire into the sky", expression: "Angry, eyes burning fiercely", place: "On the peak of an active volcano, lava flowing", sound: "Epic orchestral music, sound of a rumbling mountain", dialogue: "(No dialogue)", details: "Thick smoke billows, lightning flashes in the background", },
    ar: { subjectDetails: "شعرها مصنوع من نار، وعيناها مثل الجواهر", action: "تزأر وتنفث النار في السماء", expression: "غاضبة، عيناها تشتعلان بشراسة", place: "على قمة بركان نشط، والحمم تتدفق", sound: "موسيقى أوركسترالية ملحمية، صوت هدير الجبل", dialogue: "(لا يوجد حوار)", details: "دخان كثيف يتصاعد، وبرق يلمع في الخلفية", },
    cn: { subjectDetails: "头发由火焰构成，眼睛像宝石", action: "咆哮着向天空喷火", expression: "愤怒，双眼燃烧着熊熊烈火", place: "在活火山顶上，岩浆流淌", sound: "史诗般的管弦乐，山峦的轰鸣声", dialogue: "（无对话）", details: "浓烟滚滚，背景中电闪雷鸣", },
    ru: { subjectDetails: "Волосы из огня, глаза как драгоценные камни", action: "Рычит, извергая огонь в небо", expression: "Злой, глаза яростно горят", place: "На вершине действующего вулкана, течет лава", sound: "Эпическая оркестровая музыка, гул горы", dialogue: "(Нет диалога)", details: "Густой дым клубится, на заднем плане сверкают молнии", }
};

const PROMPT_GENERATION_LIMIT = 5; // Default limit
const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

interface User {
    username: string;
    unlimited: boolean;
    limit?: number;
}

interface UsageData {
    count: number;
    timestamp: number;
}


// Moved outside component to prevent state reset on re-renders
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

// Moved outside component to prevent state reset on re-renders
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

const PromptGeneratorApp: React.FC<PromptGeneratorAppProps> = ({ onLogout }) => {
    const [promptParts, setPromptParts] = useState<PromptParts>(initialPromptPartsState);
    const [finalPromptId, setFinalPromptId] = useState('');
    const [finalPromptEn, setFinalPromptEn] = useState('');
    const [finalNegativePromptId, setFinalNegativePromptId] = useState('');
    const [finalNegativePromptEn, setFinalNegativePromptEn] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [keepSubject, setKeepSubject] = useState(false);
    const [clearIntonation, setClearIntonation] = useState(false);
    const [enhanceToRealistic, setEnhanceToRealistic] = useState(false);
    const [modelTarget, setModelTarget] = useState<ModelTarget>('veo3');
    const [generationMode, setGenerationMode] = useState<GenerationMode>('structured');
    const [uiLang, setUiLang] = useState<UILang>('id');
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme | null) || 'system');
    const [showResults, setShowResults] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [copyStatus, setCopyStatus] = useState({ id: false, en: false, neg: false });
    const copyTimeoutRef = useRef<number | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [usage, setUsage] = useState({ count: 0, limit: PROMPT_GENERATION_LIMIT, isUnlimited: false });
    const [limitError, setLimitError] = useState('');
    const [enhancedDetails, setEnhancedDetails] = useState<PromptPartLang | null>(null);
    const importFileRef = useRef<HTMLInputElement>(null);

    const t = translations[uiLang];

    const getLocalizedOptions = useCallback((options: LocalizedOption[]) => {
        return options.map(opt => ({ value: opt[uiLang] || opt.en, label: opt[uiLang] || opt.en }));
    }, [uiLang]);

    const buildFinalPrompt = useCallback((parts: PromptParts, lang: 'id' | 'en') => {
        const finalParts = enhanceToRealistic && enhancedDetails ? { ...parts, details: enhancedDetails } : parts;

        if (lang === 'en') {
            const promptComponents: string[] = [];
            if (finalParts.aspectRatio?.en) {
                promptComponents.push(`An aspect ratio of ${finalParts.aspectRatio.en}`);
            }
            const subjectPart = [finalParts.subject?.en, finalParts.subjectDetails?.en].filter(Boolean).join(' ');
            if (subjectPart) {
                promptComponents.push(subjectPart);
            }
            let combinedActionPart = finalParts.action?.en || '';
            const hasDialogue = modelTarget === 'veo3' && finalParts.dialogue?.id && finalParts.dialogue.id.trim() !== '';
    
            if (hasDialogue) {
                const dialogueInstruction = `saying in Indonesian: "${finalParts.dialogue.id.trim()}"`;
                combinedActionPart = combinedActionPart ? `${combinedActionPart}, ${dialogueInstruction}` : dialogueInstruction;
                if (clearIntonation) {
                    combinedActionPart += ', with clear intonation';
                }
            }
    
            if (combinedActionPart) {
                promptComponents.push(combinedActionPart);
            }
    
            const remainingOrder: (keyof PromptParts)[] = [ 'expression', 'place', 'time', 'cameraMovement', 'lighting', 'videoStyle', 'videoMood', 'sound', 'details' ];
            remainingOrder.forEach(key => {
                if (finalParts[key]?.en) {
                    promptComponents.push(finalParts[key].en);
                }
            });

            if (modelTarget === 'veo3' && finalParts.negativePrompt?.en) {
                promptComponents.push(`negative prompt: ${finalParts.negativePrompt.en}`);
            }

            return promptComponents.filter(p => p.trim() !== '').join(', ');
    
        } else {
            const aspectRatioText = finalParts.aspectRatio?.id ? ` dalam rasio aspek ${finalParts.aspectRatio.id},` : '';
            const basePrompt = `Sebuah video ${finalParts.videoStyle?.id || ''}${aspectRatioText} dengan suasana ${finalParts.videoMood?.id || ''}, menampilkan ${finalParts.subject?.id || 'subjek'}${finalParts.subjectDetails?.id ? ` (${finalParts.subjectDetails.id})` : ''}. Subjek sedang ${finalParts.action?.id || 'melakukan sesuatu'} dengan ekspresi ${finalParts.expression?.id || ''}. Lokasinya di ${finalParts.place?.id || 'sebuah tempat'} pada ${finalParts.time?.id || 'suatu waktu'}. Video diambil dengan gerakan kamera ${finalParts.cameraMovement?.id || ''} dan pencahayaan ${finalParts.lighting?.id || ''}.${finalParts.sound?.id ? ` Terdengar ${finalParts.sound.id}.` : ''}${finalParts.dialogue?.id ? ` Terdengar dialog: "${finalParts.dialogue.id}".` : ''}${finalParts.details?.id ? ` Detail tambahan: ${finalParts.details.id}.` : ''}`;

            const negativeTextId = (modelTarget === 'veo3' && finalParts.negativePrompt?.id) ? ` Prompt negatif: ${finalParts.negativePrompt.id}.` : '';

            return `${basePrompt}${negativeTextId}`;
        }
    }, [clearIntonation, modelTarget, enhanceToRealistic, enhancedDetails]);
    
    useEffect(() => {
        const storedLang = localStorage.getItem('lang') as UILang | null;
        if (storedLang) setUiLang(storedLang);
        const storedHistory = localStorage.getItem('promptHistory');
        if (storedHistory) setHistory(JSON.parse(storedHistory));
    }, []);

    useEffect(() => {
        const userDataString = localStorage.getItem('currentUser');
        if (!userDataString) {
            onLogout();
            return;
        }

        const user: User = JSON.parse(userDataString);
        setCurrentUser(user);

        if (user.unlimited) {
            setUsage({ count: 0, limit: PROMPT_GENERATION_LIMIT, isUnlimited: true });
            return;
        }

        const userLimit = user.limit ?? PROMPT_GENERATION_LIMIT;
        const usageKey = `generationUsage_${user.username}`;
        const usageDataString = localStorage.getItem(usageKey);
        let currentCount = 0;

        if (usageDataString) {
            const storedUsage: UsageData = JSON.parse(usageDataString);
            if (Date.now() - storedUsage.timestamp < TWENTY_FOUR_HOURS_IN_MS) {
                currentCount = storedUsage.count;
            } else {
                localStorage.removeItem(usageKey); // Reset if expired
            }
        }
        setUsage({ count: currentCount, limit: userLimit, isUnlimited: false });
    }, [onLogout]);
    
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
            if (theme === 'system') applyTheme('system');
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
        const allOptions = [subjectOptions, timeOptions, cameraMovementOptions, aspectRatioOptions, lightingOptions, videoStyleOptions, videoMoodOptions].flat();
        const selectedOption = allOptions.find(opt => opt[uiLang] === selectedValue);
        
        if (selectedOption) {
            handlePartChange(part, { id: selectedOption.id, en: selectedOption.en });
        } else {
            const fallbackOption = allOptions.find(opt => Object.values(opt).includes(selectedValue));
            if(fallbackOption){
                handlePartChange(part, { id: fallbackOption.id, en: fallbackOption.en });
            } else {
                handlePartChange(part, { id: selectedValue, en: selectedValue });
            }
        }
    };
    
    const handleReset = () => {
        setPromptParts(initialPromptPartsState);
        setShowResults(false);
        setFinalPromptId('');
        setFinalPromptEn('');
        setFinalNegativePromptId('');
        setFinalNegativePromptEn('');
        setKeepSubject(false);
        setClearIntonation(false);
        setEnhanceToRealistic(false);
        setLimitError('');
        setEnhancedDetails(null);
    };
    
    const handleGenerateWithAI = async () => {
        setLimitError(''); // Reset error on each attempt
        
        if (!usage.isUnlimited && usage.count >= usage.limit) {
            setLimitError(t.limitReachedMessage.replace(/{limit}/g, String(usage.limit)));
            return;
        }

        setIsLoading(true);
        setProgress(0);
        setEnhancedDetails(null); // Reset enhanced details on new generation

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) return 95;
                if (prev < 60) return prev + Math.random() * 2.5;
                if (prev < 90) return prev + Math.random() * 1.2;
                return prev + 0.5;
            });
        }, 100);

        try {
            const lockedParts = keepSubject ? { subject: promptParts.subject, subjectDetails: promptParts.subjectDetails } : null;
            const newParts = await generatePrompt(lockedParts, modelTarget, generationMode, promptParts, enhanceToRealistic);
            
            if (currentUser && !currentUser.unlimited) {
                const usageKey = `generationUsage_${currentUser.username}`;
                const usageDataString = localStorage.getItem(usageKey);
                let newUsageData: UsageData;

                if (usageDataString) {
                    const storedUsage = JSON.parse(usageDataString);
                    if (Date.now() - storedUsage.timestamp < TWENTY_FOUR_HOURS_IN_MS) {
                        newUsageData = { ...storedUsage, count: storedUsage.count + 1 };
                    } else {
                        newUsageData = { count: 1, timestamp: Date.now() }; // Reset expired
                    }
                } else {
                    newUsageData = { count: 1, timestamp: Date.now() }; // Start new
                }
                localStorage.setItem(usageKey, JSON.stringify(newUsageData));
                setUsage(prev => ({ ...prev, count: newUsageData.count }));
            }

            clearInterval(progressInterval);
            setProgress(100);

            // If enhancing, store the AI-enhanced details separately
            // but keep the user's original detail input in the form.
            if (enhanceToRealistic) {
                setEnhancedDetails(newParts.details);
            }
            
            // Update the form fields with the new data, except for details if enhanced.
            const partsForUiUpdate = enhanceToRealistic 
                ? { ...newParts, details: promptParts.details } 
                : newParts;
            setPromptParts(partsForUiUpdate);
            
            setTimeout(() => {
                // Always use the full AI response (`newParts`) for building prompts and history.
                const generatedId = buildFinalPrompt(newParts, 'id');
                const generatedEn = buildFinalPrompt(newParts, 'en');
                setFinalPromptId(generatedId);
                setFinalPromptEn(generatedEn);
                setFinalNegativePromptId(newParts.negativePrompt.id);
                setFinalNegativePromptEn(newParts.negativePrompt.en);
                setShowResults(true);
                
                const newHistoryEntry: HistoryEntry = {
                    id: Date.now(),
                    timestamp: new Date().toLocaleString(),
                    parts: newParts, // Save the fully enhanced parts to history
                    finalPromptId: generatedId,
                    finalPromptEn: generatedEn,
                    finalNegativePromptId: newParts.negativePrompt.id,
                    finalNegativePromptEn: newParts.negativePrompt.en,
                };
                const updatedHistory = [newHistoryEntry, ...history];
                setHistory(updatedHistory);
                localStorage.setItem('promptHistory', JSON.stringify(updatedHistory));

                setIsLoading(false);
            }, 500);

        } catch (error) {
            clearInterval(progressInterval);
            setIsLoading(false);
            setProgress(0);
            console.error(error);
            setLimitError((error as Error).message);
        }
    };

    const handleCopy = (text: string, type: 'id' | 'en' | 'neg') => {
        navigator.clipboard.writeText(text);
        setCopyStatus({ id: false, en: false, neg: false, [type]: true });
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = window.setTimeout(() => setCopyStatus({ id: false, en: false, neg: false }), 2000);
    };

    const handleLoadFromHistory = (entry: HistoryEntry) => {
        const completeParts = { ...initialPromptPartsState, ...entry.parts };
        setPromptParts(completeParts);
        
        setFinalPromptId(entry.finalPromptId);
        setFinalPromptEn(entry.finalPromptEn);
        setFinalNegativePromptId(entry.finalNegativePromptId);
        setFinalNegativePromptEn(entry.finalNegativePromptEn);
        setShowResults(true);
        setIsHistoryOpen(false);
        setLimitError('');
        setEnhancedDetails(null);
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

    const handleExportHistory = () => {
        if (history.length === 0) {
            alert("No history to export.");
            return;
        }
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(history, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "prompt_history_backup.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportClick = () => {
        importFileRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File content is not readable.");
                
                const importedHistory: HistoryEntry[] = JSON.parse(text);

                if (!Array.isArray(importedHistory) || (importedHistory.length > 0 && typeof importedHistory[0].id === 'undefined')) {
                   alert(t.importError);
                   return;
                }

                if (window.confirm(t.importConfirm)) {
                    const existingIds = new Set(history.map(h => h.id));
                    const newEntries = importedHistory.filter(entry => !existingIds.has(entry.id));

                    if(newEntries.length === 0) {
                        alert("No new entries to import.");
                        return;
                    }

                    const mergedHistory = [...history, ...newEntries];
                    mergedHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                    setHistory(mergedHistory);
                    localStorage.setItem('promptHistory', JSON.stringify(mergedHistory));
                    alert(t.importSuccess);
                }
            } catch (error) {
                console.error("Failed to import history:", error);
                alert(t.importError);
            } finally {
                if(event.target) event.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    const renderPromptInput = (part: keyof PromptParts, label: string, placeholder: string, required: boolean = false, rows: number = 2, children?: React.ReactNode) => {
        const dataLangKey: 'id' | 'en' = uiLang === 'id' ? 'id' : 'en';
        const value = promptParts[part] ? promptParts[part][dataLangKey] : '';
        return (
            <PromptInput
                id={part} label={label} value={value}
                onChange={(e) => {
                    const current = promptParts[part] || createEmptyPromptPartLang();
                    const keyToUpdate = uiLang === 'id' ? 'id' : 'en';
                    handlePartChange(part, { ...current, [keyToUpdate]: e.target.value });
                }}
                placeholder={placeholder} rows={rows} required={required}
            > {children} </PromptInput>
        );
    };

    const renderPromptSelect = (part: keyof PromptParts, label: string, options: LocalizedOption[], required: boolean = false, children?: React.ReactNode) => {
        const currentPartValue = promptParts[part] || createEmptyPromptPartLang();
        const selectedOption = options.find(opt => opt.id === currentPartValue.id && opt.en === currentPartValue.en);
        const displayValue = selectedOption ? (selectedOption[uiLang] || selectedOption.en) : (uiLang === 'id' ? currentPartValue.id : currentPartValue.en);
        return (
            <PromptSelect id={part} label={label} value={displayValue || ''} onChange={(e) => handleSelectChange(part, e)} options={getLocalizedOptions(options)} placeholder={t.selectPlaceholder} required={required} >
                {children}
            </PromptSelect>
        );
    };
    
    return (
        <div className="flex flex-col min-h-screen">
             <input
                type="file"
                ref={importFileRef}
                onChange={handleFileImport}
                accept=".json"
                className="hidden"
            />
            <header className="w-full py-4 border-b border-slate-200 dark:border-slate-700/50 sticky top-0 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm z-30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Icon type="sparkles" className="w-8 h-8 text-cyan-500" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                         <button
                            onClick={() => setIsGuideOpen(true)}
                            title={t.guideButtonTooltip}
                            className="h-10 px-4 flex items-center justify-center text-sm font-semibold rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {t.guideButtonLabel}
                        </button>
                        <LangSwitcher uiLang={uiLang} setUiLang={setUiLang} />
                        <ThemeSwitcher theme={theme} setTheme={setTheme} uiLang={uiLang}/>
                        <button onClick={onLogout} title={t.logoutButton} className="flex items-center justify-center w-10 h-10 rounded-full text-slate-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                           <Icon type="logout" className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow w-full container mx-auto p-4 sm:p-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Form Section */}
                    <div className="w-full space-y-6 bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-start p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                            <div className="flex items-center gap-2">
                               <label className="font-semibold text-slate-700 dark:text-slate-300">{t.targetModelLabel}</label>
                               <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-1 rounded-full">
                                   <button onClick={() => setModelTarget('veo3')} className={`px-3 py-1 text-sm font-bold rounded-full transition-colors ${modelTarget === 'veo3' ? 'bg-cyan-500 text-white' : 'text-slate-600 dark:text-slate-300'}`}>VEO3</button>
                                   <button onClick={() => setModelTarget('veo2')} className={`px-3 py-1 text-sm font-bold rounded-full transition-colors ${modelTarget === 'veo2' ? 'bg-cyan-500 text-white' : 'text-slate-600 dark:text-slate-300'}`}>VEO2</button>
                               </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
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
                            {renderPromptSelect('aspectRatio', t.aspectRatioLabel, aspectRatioOptions)}
                            {renderPromptSelect('lighting', t.lightingLabel, lightingOptions)}
                            {renderPromptSelect('videoStyle', t.videoStyleLabel, videoStyleOptions, false,
                                <div className="flex items-center gap-2 whitespace-nowrap" title={t.enhanceToRealisticTooltip}>
                                    <input 
                                        type="checkbox" 
                                        id="enhance-to-realistic" 
                                        checked={enhanceToRealistic} 
                                        onChange={(e) => setEnhanceToRealistic(e.target.checked)} 
                                        className="w-4 h-4 text-cyan-600 bg-slate-100 border-slate-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                                    />
                                    <label htmlFor="enhance-to-realistic" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                        {t.enhanceToRealisticLabel}
                                    </label>
                                </div>
                            )}
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
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.generationModeLabel}</label>
                                <div className="flex w-full sm:w-auto items-center bg-slate-200 dark:bg-slate-700 p-1 rounded-full">
                                    <button 
                                        onClick={() => setGenerationMode('structured')} 
                                        className={`w-1/2 sm:w-auto px-4 py-1.5 text-sm font-bold rounded-full transition-colors text-center ${generationMode === 'structured' ? 'bg-cyan-500 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-600/50'}`}
                                        title={t.structuredModeTooltip}
                                    >
                                        {t.structuredMode}
                                    </button>
                                    <button 
                                        onClick={() => setGenerationMode('creative')} 
                                        className={`w-1/2 sm:w-auto px-4 py-1.5 text-sm font-bold rounded-full transition-colors text-center ${generationMode === 'creative' ? 'bg-cyan-500 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-600/50'}`}
                                        title={t.creativeModeTooltip}
                                    >
                                        {t.creativeMode}
                                    </button>
                                </div>
                            </div>
                            
                            {limitError && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-300 rounded-r-lg" role="alert">
                                    <div className="flex">
                                        <div className="py-1">
                                            <svg className="fill-current h-6 w-6 text-red-500 ltr:mr-4 rtl:ml-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-5.5a1 1 0 0 0 2 0v-3a1 1 0 1 0-2 0v3zM10 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>
                                        </div>
                                        <div>
                                            <p className="font-bold">{t.limitErrorTitle}</p>
                                            <p className="text-sm">{limitError}</p>
                                            <a 
                                                href={`https://wa.me/6285773080443?text=${encodeURIComponent(`${t.contactAdminBody}${currentUser?.username || ''}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 inline-block text-sm font-semibold text-cyan-700 dark:text-cyan-500 hover:underline"
                                            >
                                                {t.contactAdmin}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                {isLoading ? (
                                    <div className="w-full h-12 bg-slate-200 dark:bg-slate-700 rounded-md overflow-hidden relative flex items-center justify-center">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-100 ease-linear"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                        <span className="relative z-10 font-bold text-white drop-shadow-md">
                                            {t.processing} {Math.round(progress)}%
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <button onClick={handleGenerateWithAI} className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105">
                                            <Icon type="rocket" className="w-5 h-5"/>
                                            <span>{t.generatePromptButton}</span>
                                        </button>
                                        <button onClick={handleReset} title={t.resetFormTooltip} className="inline-flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition-colors">
                                            <Icon type="reset" className="w-5 h-5"/>
                                            <span>{t.resetFormButton}</span>
                                        </button>
                                        <button onClick={() => setIsHistoryOpen(true)} title={t.historyButtonTooltip} className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 transition-colors">
                                            <Icon type="history" className="w-5 h-5"/>
                                            <span>{t.historyButtonLabel}</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    {showResults && (
                        <div className="w-full space-y-6">
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
                            {modelTarget === 'veo2' && (
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
                            )}
                        </div>
                    )}
                </div>
            </main>

            <footer className="w-full mt-12 py-6 border-t border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center gap-6 mb-4">
                        <a href="https://www.tiktok.com/@tongsolop" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors" aria-label="TikTok">
                            <Icon type="tiktok" className="w-6 h-6"/>
                        </a>
                        <a href="https://www.youtube.com/@tongsolop" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" aria-label="YouTube">
                            <Icon type="youtube" className="w-7 h-7"/>
                        </a>
                    </div>
                    <p className="text-center text-sm text-slate-600 dark:text-slate-400">{t.credit}</p>
                </div>
            </footer>

            <HistoryModal 
                isOpen={isHistoryOpen} 
                onClose={() => setIsHistoryOpen(false)}
                history={history}
                onLoadPrompt={handleLoadFromHistory}
                onClearHistory={handleClearHistory}
                onDeleteItem={handleDeleteItem}
                onImportClick={handleImportClick}
                onExportHistory={handleExportHistory}
                translations={{
                    historyTitle: t.historyTitle,
                    clearHistoryButton: t.clearHistoryButton,
                    loadPromptButton: t.loadPromptButton,
                    noHistoryMessage: t.noHistoryMessage,
                    closeButtonLabel: t.closeButtonLabel,
                    deleteItemButtonTooltip: t.deleteItemButtonTooltip,
                    negativePromptHistoryLabel: t.negativePromptHistoryLabel,
                    importHistoryButton: t.importHistoryButton,
                    exportHistoryButton: t.exportHistoryButton,
                    importHistoryTooltip: t.importHistoryTooltip,
                    exportHistoryTooltip: t.exportHistoryTooltip,
                }}
            />

            <GuideModal
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
                translations={{
                    guideTitle: t.guideTitle,
                    guideIntro: t.guideIntro,
                    guideModeTitle: t.guideModeTitle,
                    guideModeStructuredTitle: t.guideModeStructuredTitle,
                    guideModeStructuredContent: t.guideModeStructuredContent,
                    guideModeCreativeTitle: t.guideModeCreativeTitle,
                    guideModeCreativeContent: t.guideModeCreativeContent,
                    guideFeaturesTitle: t.guideFeaturesTitle,
                    guideFeatureKeepSubjectTitle: t.guideFeatureKeepSubjectTitle,
                    guideFeatureKeepSubjectContent: t.guideFeatureKeepSubjectContent,
                    guideFeatureEnhanceTitle: t.guideFeatureEnhanceTitle,
                    guideFeatureEnhanceContent: t.guideFeatureEnhanceContent,
                    guideFeatureIntonationTitle: t.guideFeatureIntonationTitle,
                    guideFeatureIntonationContent: t.guideFeatureIntonationContent,
                    guideFeatureImportExportTitle: t.guideFeatureImportExportTitle,
                    guideFeatureImportExportContent: t.guideFeatureImportExportContent,
                    guideTargetModelTitle: t.guideTargetModelTitle,
                    guideTargetModelContent: t.guideTargetModelContent,
                    guideAccountManagementTitle: t.guideAccountManagementTitle,
                    guideAccountManagementContent: t.guideAccountManagementContent,
                    guideCloseButton: t.guideCloseButton,
                }}
            />
        </div>
    );
};

export default PromptGeneratorApp;