'use client';

import { ShareIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ProjectHeaderProps {
  name: string;
  description: string;
  visibility: string;
  createdBy: string;
}

export default function ProjectHeader({ name, description, visibility, createdBy }: ProjectHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-semibold">
          {name}
          <span className="text-sm bg-zinc-700 px-2 py-0.5 rounded ml-2">{visibility}</span>
        </h1>
        <button
          onClick={handleShare}
          className="flex items-center text-gray-200 hover:text-white"
          title="Share Project"
        >
          <ShareIcon className="h-5 w-5 mr-1" />
          <span className="sr-only">Share</span>
        </button>
      </div>
      <p className="text-gray-400 mb-4">{description}</p>
      <p className="text-sm text-gray-500 mb-6">Created by {createdBy}</p>
    </>
  );
}
