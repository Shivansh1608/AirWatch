import React, { useState } from 'react';
import api from '../api/client';
import { Bot, Send, User, Sparkles, AlertTriangle, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [city, setCity] = useState('Delhi');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your AirWatch Health Assistant. I analyze real-time CPCB Air Quality telemetry, dominant pollutants, and weather to provide evidence-based guidance for your daily activities. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const suggestedPrompts = [
    'Can I go for an outdoor run today?',
    'Should I keep home windows open right now?',
    'What precautions should elderly and asthmatic people take today?',
    'Is it safe for kids to play in the park this evening?'
  ];

  const handleSendMessage = async (textToSend) => {
    const queryText = textToSend || inputMessage;
    if (!queryText.trim() || loading) return;

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.post('/ai/assistant', {
        city,
        message: queryText,
        sensitiveGroup: user?.preferences?.sensitiveGroup || false
      });

      const replyData = res.data?.data;
      const botMsg = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        text: replyData?.reply || 'I was unable to generate advice. Please try again.',
        source: replyData?.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: 'err_' + Date.now(),
        sender: 'assistant',
        text: `Error: ${err.message || 'Rate limit reached or server unavailable. Please try again in a minute.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bot className="w-8 h-8 text-emerald-500" />
            AI Air Quality Health Assistant
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Grounded personalized health counsel calibrated to Indian CPCB AQI standards.
          </p>
        </div>

        {/* City Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Context City:</span>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Any city worldwide..."
            list="popular-assistant-cities"
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-emerald-500 outline-none w-44"
          />
          <datalist id="popular-assistant-cities">
            <option value="Delhi" />
            <option value="Mumbai" />
            <option value="Bengaluru" />
            <option value="London" />
            <option value="New York" />
            <option value="Tokyo" />
            <option value="Dubai" />
            <option value="Paris" />
            <option value="Singapore" />
            <option value="Lucknow" />
            <option value="Mathura" />
          </datalist>
        </div>
      </div>

      {/* Grounding & Medical Disclaimer Ribbon */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Responses are strictly grounded in live CPCB AQI, dominant pollutant, and local dispersion data.</span>
        </div>
        <span className="hidden sm:inline font-mono text-[10px] bg-emerald-200/60 dark:bg-emerald-900 px-2 py-0.5 rounded">
          Not Medical Advice
        </span>
      </div>

      {/* Suggested Prompts */}
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-700 text-slate-700 dark:text-slate-300 shadow-xs transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[520px]">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
          {messages.map((m) => {
            const isBot = m.sender === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isBot
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                    isBot
                      ? 'bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200'
                      : 'bg-emerald-600 text-white font-medium rounded-tr-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <div
                    className={`text-[10px] flex items-center justify-between pt-1 border-t ${
                      isBot
                        ? 'border-slate-200/50 dark:border-slate-700/50 text-slate-400'
                        : 'border-emerald-500 text-emerald-100'
                    }`}
                  >
                    <span>{m.source || (isBot ? 'CPCB AI Health Model' : 'You')}</span>
                    <span>{m.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                <span>Analyzing {city} air quality & synthesizing medical guidance...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask a question about ${city}'s air quality (e.g. Can I take children outside?)...`}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
