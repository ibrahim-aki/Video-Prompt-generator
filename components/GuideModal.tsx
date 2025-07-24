
import React from 'react';
import { Icon } from './Icon';

interface GuideTranslations {
  guideTitle: string;
  guideIntro: string;
  guideModeTitle: string;
  guideModeStructuredTitle: string;
  guideModeStructuredContent: string;
  guideModeCreativeTitle: string;
  guideModeCreativeContent: string;
  guideFeaturesTitle: string;
  guideFeatureKeepSubjectTitle: string;
  guideFeatureKeepSubjectContent: string;
  guideFeatureEnhanceTitle: string;
  guideFeatureEnhanceContent: string;
  guideFeatureIntonationTitle: string;
  guideFeatureIntonationContent: string;
  guideFeatureImportExportTitle: string;
  guideFeatureImportExportContent: string;
  guideTargetModelTitle: string;
  guideTargetModelContent: string;
  guideAccountManagementTitle: string;
  guideAccountManagementContent: string;
  guideCloseButton: string;
}

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: GuideTranslations;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, translations: t }) => {
  if (!isOpen) return null;

  const GuideSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-2">
      <h4 className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{title}</h4>
      <div className="space-y-3 text-slate-600 dark:text-slate-300">{children}</div>
    </div>
  );

  const SubSection: React.FC<{ title: string; content: string }> = ({ title, content }) => (
    <div>
      <h5 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h5>
      <p>{content}</p>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-transform duration-300 scale-95"
        style={isOpen ? { transform: 'scale(1)' } : {}}
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Icon type="help" className="w-6 h-6 text-cyan-500"/>
            <h2 id="guide-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">{t.guideTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label={t.guideCloseButton}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-base text-slate-700 dark:text-slate-300">{t.guideIntro}</p>

          <GuideSection title={t.guideModeTitle}>
            <SubSection title={t.guideModeStructuredTitle} content={t.guideModeStructuredContent} />
            <SubSection title={t.guideModeCreativeTitle} content={t.guideModeCreativeContent} />
          </GuideSection>
          
          <GuideSection title={t.guideFeaturesTitle}>
            <SubSection title={t.guideFeatureKeepSubjectTitle} content={t.guideFeatureKeepSubjectContent} />
            <SubSection title={t.guideFeatureEnhanceTitle} content={t.guideFeatureEnhanceContent} />
            <SubSection title={t.guideFeatureIntonationTitle} content={t.guideFeatureIntonationContent} />
            <SubSection title={t.guideFeatureImportExportTitle} content={t.guideFeatureImportExportContent} />
          </GuideSection>

          <GuideSection title={t.guideTargetModelTitle}>
            <p>{t.guideTargetModelContent}</p>
          </GuideSection>
          
          <GuideSection title={t.guideAccountManagementTitle}>
            <p>{t.guideAccountManagementContent}</p>
          </GuideSection>

        </main>
        
        <footer className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex-shrink-0 flex justify-end">
             <button
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700 transition-all duration-300 text-sm"
              >
                <span>{t.guideCloseButton}</span>
              </button>
        </footer>
      </div>
    </div>
  );
};

export default GuideModal;