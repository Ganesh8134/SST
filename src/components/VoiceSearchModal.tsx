import React, { useState, useEffect } from 'react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectQuery
}) => {
  const [listening, setListening] = useState(true);
  const [transcript, setTranscript] = useState('');

  const suggestions = [
    'Amul Taaza Milk',
    'India Gate Basmati Rice',
    'Toor Dal',
    'Freedom Sunflower Oil',
    'Parle-G Biscuits',
    'Lays Magic Masala'
  ];

  useEffect(() => {
    if (isOpen) {
      setListening(true);
      setTranscript('');
      // Simulate listening state
      const timer = setTimeout(() => {
        const randomQuery = suggestions[Math.floor(Math.random() * suggestions.length)];
        setTranscript(randomQuery);
        setListening(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f1f3ff] text-[#141b2b] flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Pulsing Mic */}
        <div className="relative my-4 flex items-center justify-center">
          {listening && (
            <div className="absolute w-24 h-24 rounded-full bg-[#caead6] animate-ping opacity-60" />
          )}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#006c49] to-[#10b981] text-white flex items-center justify-center shadow-lg shadow-[#006c49]/30 z-10">
            <span className="material-symbols-outlined text-[36px]">
              {listening ? 'mic' : 'mic_none'}
            </span>
          </div>
        </div>

        <h3 className="text-[18px] font-extrabold text-[#141b2b] mt-2">
          {listening ? 'Listening to your voice...' : 'Did you say?'}
        </h3>
        <p className="text-[12px] text-[#5b6b62] mt-1">
          {listening ? 'Say "Milk", "Rice", "Atta", "Oil", "Dal"...' : `"${transcript}"`}
        </p>

        {transcript && !listening && (
          <button
            type="button"
            onClick={() => {
              onSelectQuery(transcript);
              onClose();
            }}
            className="mt-4 px-6 py-2.5 rounded-full bg-[#006c49] text-white font-extrabold text-[13px] shadow-md hover:bg-[#005236]"
          >
            Search for "{transcript}"
          </button>
        )}

        {/* Quick Clickable Suggestions */}
        <div className="w-full mt-5 pt-4 border-t border-[#e6ecf5]">
          <span className="text-[10px] font-extrabold text-[#5b6b62] uppercase tracking-wider block mb-2">
            Or tap to search directly
          </span>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {suggestions.slice(0, 4).map((sug) => (
              <button
                key={sug}
                onClick={() => {
                  onSelectQuery(sug);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-xl bg-[#f1f3ff] hover:bg-[#caead6] text-[11px] font-bold text-[#141b2b]"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
