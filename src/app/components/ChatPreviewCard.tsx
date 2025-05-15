'use client';

interface ChatListCardProps {
  title: string;
  createdAt: string;
  onClick: () => void;
  onDelete: () => void;
}

export default function ChatPreviewCard({ title, createdAt, onClick, onDelete }: ChatListCardProps) {
  return (
    <div onClick={onClick} className=" p-3 w-full rounded-xl flex items-center justify-between flex-row bg-zinc-800 ">
        <div className="flex items-left flex-col ">
        <div className="text-white font-medium truncate">{title}</div>
        <div className="text-xs text-gray-400 mt-1">
          {new Date(createdAt).toLocaleString()}
        </div>
        </div>
        <div className="flex ">
  

      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent navigation
          onDelete();
        }}
        className="text-white bg-zinc-700 hover:bg-red-600 hover:text-white rounded-full w-7 h-7 flex items-center justify-center transition"
        aria-label="Delete chat"
        title="Delete chat"
      >
        <span className="text-lg font-bold">×</span>
      </button></div>
    </div>
  );
}
