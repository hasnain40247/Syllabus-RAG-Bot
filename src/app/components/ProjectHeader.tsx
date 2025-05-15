'use client';

interface ProjectHeaderProps {
  name: string;
  description: string;
  visibility: string;
  createdBy: string;
}

export default function ProjectHeader({ name, description, visibility, createdBy }: ProjectHeaderProps) {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-1">
        {name}
        <span className="text-sm bg-zinc-700 px-2 py-0.5 rounded ml-2">{visibility}</span>
      </h1>
      <p className="text-gray-400 mb-4">{description}</p>
      <p className="text-sm text-gray-500 mb-6">Created by {createdBy}</p>
    </>
  );
}
