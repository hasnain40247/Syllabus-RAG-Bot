'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid'; // ← Import UUID
type Project = {
  id: string;
  title: string;
  description: string;
  visibility: string;
  createdBy: string;
  updated: string;
  locked: boolean;
};
export default function CreateProjectPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

  
    const newProject = {
      id: uuidv4(), // ← Use UUID here
      title: name.trim(),
      description: description.trim(),
      visibility,
      createdBy: 'You',
      updated: new Date().toISOString(),
      locked: true,
    };
  
    const existing = localStorage.getItem('projects');
    const projects = existing ? JSON.parse(existing) : [];
  
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
  
    router.push('/');
  };
  

  useEffect(() => {
    const stored = localStorage.getItem('projects');
    if (stored) {
      setProjects(JSON.parse(stored));
    }
  }, []);

  return (
<main className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-zinc-900 text-white px-6 py-10 rounded-lg w-full max-w-xl">
    <h1 className="text-2xl font-semibold mb-8">Create a project</h1>

    <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm">What are you working on?</label>
          <input
            type="text"
            placeholder="Name your project"
            className="w-full px-4 py-2 bg-zinc-800 rounded text-white placeholder-gray-400 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">What are you trying to achieve?</label>
          <textarea
            placeholder="Describe your project, goals, subject, etc..."
            className="w-full px-4 py-2 bg-zinc-800 rounded text-white placeholder-gray-400 focus:outline-none h-24 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Visibility</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-400">
              <input type="radio" disabled className="accent-gray-600" />
              <span className="line-through">Northeastern University</span>
              <span className="text-sm ml-2">Public projects are disabled by your organization</span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                value="private"
                checked={visibility === 'private'}
                onChange={() => setVisibility('private')}
                className="accent-white"
              />
              <span className="text-sm">Private — Only invited members can view and use this project</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-white text-black hover:bg-gray-200"
          >
            Create project
          </button>
        </div>
      </form>
      </div>
    </main>
  );
}
