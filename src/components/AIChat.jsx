import { useState, useRef, useEffect } from 'react';
import * as api from '../utils/api';

export default function AIChat({ recipeContext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'שלום! אני שף AI. אני יכול לעזור עם מתכונים, תחליפים, טיפים ועוד. מה תרצה לדעת?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await api.sendChatMessage(text, recipeContext);
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'מצטער, אירעה שגיאה. נסה שוב.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-brand-500 hover:bg-brand-600 text-white rounded-full shadow-xl flex items-center justify-center text-2xl transition-all hover:scale-110 z-50"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 w-80 sm:w-96 card shadow-2xl z-50 animate-fade-in flex flex-col" style={{ maxHeight: '70vh' }}>
      {/* Header */}
      <div className="bg-gradient-to-l from-brand-500 to-brand-600 text-white p-4 rounded-t-2xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <span className="font-bold">שף AI צ'אט</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '200px' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-brand-500 text-white rounded-bl-sm'
                  : 'bg-gray-100 text-gray-700 rounded-br-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-400 px-4 py-2 rounded-xl text-sm rounded-br-sm">
              <span className="animate-pulse">מקליד...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="שאל את שף AI..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
            dir="rtl"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white px-3 py-2 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
