interface ChatMessageCardProps {
    role: 'user' | 'assistant';
    content: string;
  }
  
  export default function ChatMessageCard({ role, content }: ChatMessageCardProps) {
    const imageSrc = role === 'user' ? '/user.png' : '/system.png';
    const name = role === 'user' ? 'You' : 'Ollama';
  
    return (
      <div className="flex items-start w-full space-x-4">
        <img
          src={imageSrc}
          alt={name}
          className="w-8 h-8 rounded-full mt-1 shrink-0"
        />
  
        <div
          className={`px-4 py-3 w-full rounded-tl-md rounded-tr-2xl rounded-bl-2xl rounded-br-2xl ${
            role === 'user'
              ? 'bg-zinc-800 text-white'
              : 'bg-zinc-700 text-orange-300'
          }`}
        >
          <div className="text-xs text-gray-400 mb-1">{name}</div>
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
      </div>
    );
  }
  