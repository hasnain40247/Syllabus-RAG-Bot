'use client';

import { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
  };

  return (
    <div className="border border-zinc-700 rounded-2xl p-4 text-white bg-zinc-900">
      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          e.target.style.height = 'auto';
          e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
        }}
        placeholder="How can I help you today?"
        rows={1}
        className="w-full bg-transparent resize-none outline-none placeholder:text-zinc-400 text-base overflow-y-auto max-h-40"
        style={{ lineHeight: '1.5' }}
      />

      <div className="flex justify-end items-center space-x-3 mt-4">
        <button
          onClick={handleSend}
          className="bg-orange-800 hover:bg-orange-700 text-white rounded-full h-10 w-10 flex items-center justify-center"
        >
          <span className="text-xl leading-none">↑</span>
        </button>
      </div>
    </div>
  );
}
