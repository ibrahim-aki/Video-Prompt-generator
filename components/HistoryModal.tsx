import React from 'react';
import { HistoryEntry } from '../types';
import { Icon } from './Icon';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onLoadPrompt: (entry: HistoryEntry) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: number) => void;
  onImportClick: () => void;
  onExportHistory: () => void;
  translations: {
    historyTitle: string;
    clearHistoryButton: string;
    loadPromptButton: string;
    noHistoryMessage: string;
    closeButtonLabel: string;
    deleteItemButtonTooltip: string;
    negativePromptHistoryLabel: string;
    importHistoryButton: string;
    exportHistoryButton: string;
    importHistoryTooltip: string;
    exportHistoryTooltip: string;
  };
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onLoadPrompt, onClearHistory, onDeleteItem, onImportClick, onExportHistory, translations }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col transform transition-transform duration-300 scale-95"
        style={isOpen ? { transform: 'scale(1)' } : {}}
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <h2 id="history-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">{translations.historyTitle}</h2>
          <div className="flex items-center gap-2">
            <button
                onClick={onImportClick}
                title={translations.importHistoryTooltip}
                className="flex items-center gap-2 text-sm bg-slate-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-slate-700 transition-colors"
              >
                <Icon type="download" className="w-4 h-4"/>
                <span>{translations.importHistoryButton}</span>
            </button>
            {history.length > 0 && (
              <>
                 <button
                    onClick={onExportHistory}
                    title={translations.exportHistoryTooltip}
                    className="flex items-center gap-2 text-sm bg-slate-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-slate-700 transition-colors"
                  >
                    <Icon type="upload" className="w-4 h-4"/>
                    <span>{translations.exportHistoryButton}</span>
                </button>
                <button
                  onClick={onClearHistory}
                  title={translations.clearHistoryButton}
                  className="flex items-center gap-2 text-sm bg-red-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-red-700 transition-colors"
                >
                  <Icon type="reset" className="w-4 h-4"/>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label={translations.closeButtonLabel}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400 py-10 flex flex-col items-center gap-4">
               <Icon type="history" className="w-16 h-16 text-slate-400 dark:text-slate-500"/>
              <p className="text-lg">{translations.noHistoryMessage}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {history.map(entry => (
                <li key={entry.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 transition-all hover:shadow-md hover:border-cyan-500/50 dark:hover:border-cyan-500/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{entry.timestamp}</p>
                  <p className="font-mono text-sm text-slate-800 dark:text-slate-200 line-clamp-2">
                    {entry.finalPromptEn}
                  </p>
                  {entry.parts.negativePrompt?.en && (
                     <div className='mt-2'>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{translations.negativePromptHistoryLabel}</p>
                        <p className="font-mono text-xs text-red-600 dark:text-red-500 line-clamp-1">
                            {entry.parts.negativePrompt.en}
                        </p>
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-end gap-2 rtl:justify-start">
                    <button
                        onClick={() => onDeleteItem(entry.id)}
                        title={translations.deleteItemButtonTooltip}
                        className="p-2 text-slate-500 dark:text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-500 rounded-md transition-colors"
                    >
                        <Icon type="trash" className="w-4 h-4"/>
                    </button>
                    <button
                      onClick={() => onLoadPrompt(entry)}
                      className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700 transition-all duration-300 text-sm transform hover:scale-105"
                    >
                      <Icon type="rocket" className="w-4 h-4"/>
                      <span>{translations.loadPromptButton}</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default HistoryModal;