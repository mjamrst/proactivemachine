'use client';

import { useState, useCallback } from 'react';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let chars = '';
    if (includeLowercase) chars += LOWERCASE;
    if (includeUppercase) chars += UPPERCASE;
    if (includeNumbers) chars += NUMBERS;
    if (includeSpecial) chars += SPECIAL;

    if (chars.length === 0) {
      setPassword('');
      return;
    }

    // Use crypto for secure random generation
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    setPassword(result);
    setCopied(false);
  }, [length, includeLowercase, includeUppercase, includeNumbers, includeSpecial]);

  const copyToClipboard = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const atLeastOneSelected = includeLowercase || includeUppercase || includeNumbers || includeSpecial;

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Password Generator</h2>
        <p className="text-muted mt-1">Generate secure passwords for new users</p>
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl p-6 space-y-6">
        {/* Length Selector */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Password Length: <span className="text-accent font-bold">{length}</span>
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="flex-1 h-2 bg-card-border rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <input
              type="number"
              min="8"
              max="64"
              value={length}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 8 && val <= 64) setLength(val);
              }}
              className="w-20 px-3 py-2 bg-background border border-card-border rounded-lg text-foreground text-center focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Character Options */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Include Characters
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3 bg-background border border-card-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-4 h-4 text-accent bg-background border-card-border rounded focus:ring-accent"
              />
              <div>
                <span className="text-foreground text-sm font-medium">Lowercase</span>
                <p className="text-xs text-muted">a-z</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-background border border-card-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-4 h-4 text-accent bg-background border-card-border rounded focus:ring-accent"
              />
              <div>
                <span className="text-foreground text-sm font-medium">Uppercase</span>
                <p className="text-xs text-muted">A-Z</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-background border border-card-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4 h-4 text-accent bg-background border-card-border rounded focus:ring-accent"
              />
              <div>
                <span className="text-foreground text-sm font-medium">Numbers</span>
                <p className="text-xs text-muted">0-9</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-background border border-card-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors">
              <input
                type="checkbox"
                checked={includeSpecial}
                onChange={(e) => setIncludeSpecial(e.target.checked)}
                className="w-4 h-4 text-accent bg-background border-card-border rounded focus:ring-accent"
              />
              <div>
                <span className="text-foreground text-sm font-medium">Special</span>
                <p className="text-xs text-muted">!@#$%^&*...</p>
              </div>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          disabled={!atLeastOneSelected}
          className="w-full py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Password
        </button>

        {/* Generated Password Display */}
        {password && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Generated Password
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-4 bg-background border border-card-border rounded-lg font-mono text-foreground break-all select-all">
                {password}
              </div>
              <button
                onClick={copyToClipboard}
                className={`p-4 rounded-lg border transition-colors ${
                  copied
                    ? 'bg-green-500/10 border-green-500/30 text-green-500'
                    : 'bg-card-border border-card-border text-muted hover:text-foreground'
                }`}
                title={copied ? 'Copied!' : 'Copy to clipboard'}
              >
                {copied ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-500">Password copied to clipboard!</p>
            )}
          </div>
        )}

        {!atLeastOneSelected && (
          <p className="text-sm text-error">Please select at least one character type</p>
        )}
      </div>
    </div>
  );
}
