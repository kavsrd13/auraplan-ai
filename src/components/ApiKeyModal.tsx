/**
 * Secure API Key management modal.
 * Allows entering or modifying Gemini API key for live AI plan generation.
 *
 * @module ApiKeyModal
 */

import React, { useState } from 'react';
import { Key, ShieldCheck, X, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
}) => {
  const [inputValue, setInputValue] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError('Please enter a valid API key or token.');
      return;
    }
    setError(null);
    onSaveKey(trimmed);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-surface-200">
        <div className="flex items-center justify-between pb-4 border-b border-surface-100">
          <div className="flex items-center gap-2 text-aura-700">
            <Key className="w-5 h-5 text-aura-600" aria-hidden="true" />
            <h2 id="api-key-modal-title" className="text-lg font-bold text-surface-900">
              Gemini API Key Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-surface-500 hover:text-surface-800 hover:bg-surface-100 focus:outline-none focus:ring-2 focus:ring-aura-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            AuraPlan AI uses Google Gemini (<code>@google/genai</code>) to generate customized event budgets, run-of-show schedules, vendor negotiation tips, and themes.
          </p>

          <div className="p-3.5 bg-aura-50 rounded-xl border border-aura-100 text-xs text-aura-800 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4 text-aura-600" aria-hidden="true" />
              <span>Zero-Persistence Security Guarantee</span>
            </div>
            <p>
              Your key stays within this browser session and is sent directly to Google's official Gemini endpoint. It is never logged or forwarded to external servers.
            </p>
          </div>

          <div>
            <label
              htmlFor="gemini-key-input"
              className="block text-sm font-semibold text-surface-800 mb-1"
            >
              API Key
            </label>
            <div className="relative">
              <input
                id="gemini-key-input"
                type={showKey ? 'text' : 'password'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="AIzaSy..."
                aria-describedby={error ? 'api-key-error' : 'api-key-hint'}
                aria-invalid={!!error}
                className={`w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-aura-500 ${
                  error ? 'border-danger-400 bg-danger-50/20' : 'border-surface-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
                className="absolute right-2.5 top-2.5 text-surface-400 hover:text-surface-700 focus:outline-none focus:ring-2 focus:ring-aura-500 rounded p-1"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p id="api-key-error" className="mt-1 text-xs text-danger-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
            <p id="api-key-hint" className="mt-1 text-xs text-surface-500">
              Don't have a key?{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aura-600 hover:underline font-medium"
              >
                Get one free at Google AI Studio
              </a>
              . (Or click "Load Demo Event" to explore without a key).
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-surface-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-surface-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-aura-600 hover:bg-aura-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-aura-500 focus:ring-offset-1"
            >
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
