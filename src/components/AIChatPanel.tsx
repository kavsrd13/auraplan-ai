/**
 * Interactive "Ask AI Co-Planner" refinement chat component.
 * Allows users to converse with Gemini to adjust budgets, ask for vendor advice,
 * or refine timelines with instant suggestions.
 *
 * @module AIChatPanel
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  Lightbulb,
} from 'lucide-react';
import type { ChatMessage, EventPlan } from '@/types/event';
import { chatWithAI } from '@/services/aiService';

interface AIChatPanelProps {
  currentPlan: EventPlan;
  apiKey: string;
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
  currentPlan,
  apiKey,
  messages,
  onAddMessage,
}) => {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    onAddMessage(userMessage);
    setInput('');
    setIsSending(true);

    try {
      const response = await chatWithAI(query, currentPlan, apiKey);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      onAddMessage(assistantMessage);
    } catch {
      const errorMessage: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: 'Unable to communicate with Gemini at this time. Please check your API key or network connection.',
        timestamp: new Date().toISOString(),
      };
      onAddMessage(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const samplePrompts = [
    'How can I cut $2,500 from catering without sacrificing quality?',
    'What weather backup plan should we have for an outdoor ceremony?',
    'Draft a speech schedule and toast order for the reception.',
    'Suggest signature his & hers mocktail recipes for non-drinkers.',
  ];

  return (
    <aside
      aria-labelledby="ai-copilot-title"
      className="bg-white rounded-2xl border border-surface-200 shadow-xs flex flex-col h-[600px] overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-surface-200 bg-surface-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-aura-700">
          <Bot className="w-5 h-5 text-aura-600" aria-hidden="true" />
          <h3 id="ai-copilot-title" className="text-sm font-extrabold text-surface-900">
            Ask AI Co-Planner
          </h3>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-aura-100 text-aura-800 border border-aura-200">
          {apiKey ? 'Live Gemini Engine' : 'Demo Mode'}
        </span>
      </div>

      {/* Messages list */}
      <div
        tabIndex={0}
        aria-label="Conversation with AI Co-Planner"
        className="flex-1 overflow-y-auto p-4 space-y-4 focus:outline-none focus:ring-1 focus:ring-aura-400"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-surface-500">
            <Sparkles className="w-8 h-8 text-aura-400 mb-2 animate-bounce" />
            <h4 className="text-sm font-bold text-surface-800">
              Your Personal Celebration Strategist
            </h4>
            <p className="text-xs text-surface-500 max-w-xs mt-1 mb-4 leading-relaxed">
              Ask for budget cuts, timeline tweaks, vendor negotiation scripts, or dietary alternatives.
            </p>

            {/* Starter chips */}
            <div className="w-full space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400 block mb-1">
                Suggested Prompts
              </span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(p)}
                  className="w-full text-left text-xs p-2 rounded-lg bg-surface-50 hover:bg-aura-50 border border-surface-200 text-surface-700 hover:text-aura-700 transition-colors flex items-center gap-2"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span className="truncate">{p}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                    isUser ? 'bg-aura-600' : 'bg-surface-700'
                  }`}
                  aria-hidden="true"
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-aura-600 text-white rounded-tr-none'
                      : 'bg-surface-100 text-surface-900 rounded-tl-none border border-surface-200'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                  <span
                    className={`text-[9px] mt-1 block ${
                      isUser ? 'text-aura-200' : 'text-surface-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-aura-700 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI Co-Planner is analyzing and typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-surface-200 bg-surface-50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="ai-chat-input" className="sr-only">
            Ask AI Co-Planner a question
          </label>
          <input
            id="ai-chat-input"
            type="text"
            value={input}
            disabled={isSending}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to adjust budgets, tweak timeline..."
            className="flex-1 px-3 py-2 text-xs border border-surface-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-aura-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            aria-label="Send message to AI"
            className={`p-2 rounded-xl text-white font-bold transition-all focus:outline-none focus:ring-2 focus:ring-aura-500 ${
              !input.trim() || isSending
                ? 'bg-surface-300 cursor-not-allowed'
                : 'bg-aura-600 hover:bg-aura-700 shadow-sm'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
};
