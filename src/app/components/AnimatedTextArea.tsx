import { useState, useEffect } from 'react';

const messages = [
  "Break down large tasks and ask clarifying questions when needed.",
  "Think step by step and show reasoning for complex problems.",
  "When giving feedback, explain thought process and highlight issues.",
];

type AnimatedTextareaProps = {
    message: string;
    setMessage: (value: string) => void;
  };
  
export default function AnimatedTextarea({ message, setMessage }:AnimatedTextareaProps) {
  const [placeholder, setPlaceholder] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(prev => {
        const currentIndex = messages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <textarea
      value={message}
      onChange={(e) => {
        setMessage(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
      }}
      placeholder={placeholder}
      rows={1}
      className={`w-full h-32 bg-zinc-800 text-white p-3 rounded-2xl resize-none border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-500 ${
        message ? '' : 'animate-placeholder-flash'
      }`}
      style={{ lineHeight: '1.5' }}
    />
  );
}


//   <textarea
//               value={instructions}
//               onChange={(e) => setInstructions(e.target.value)}
//               placeholder="Break down large tasks and ask clarifying questions when needed."
//               className="w-full h-32 bg-zinc-800 text-white p-3 rounded resize-none border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-500"
//             />
