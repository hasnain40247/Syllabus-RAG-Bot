'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Project = {
  id: string;
  title: string;
  description: string;
  visibility: string;
  createdBy: string;
  updated: string;
  locked: boolean;
};

const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Revamp the landing page and update branding.',
    visibility: 'public',
    createdBy: 'user1',
    updated: new Date().toISOString(),
    locked: false,
  },
  {
    id: '2',
    title: 'AI Research',
    description: 'Develop a prototype for an AI assistant.',
    visibility: 'private',
    createdBy: 'user2',
    updated: new Date().toISOString(),
    locked: true,
  },
  {
    id: '3',
    title: 'Marketing Plan',
    description: 'Create a 6-month roadmap for marketing.',
    visibility: 'public',
    createdBy: 'user3',
    updated: new Date().toISOString(),
    locked: false,
  },
  {
    id: '4',
    title: 'Mobile App',
    description: 'Build MVP for iOS and Android.',
    visibility: 'private',
    createdBy: 'user4',
    updated: new Date().toISOString(),
    locked: true,
  }
];
import { TrashIcon } from '@heroicons/react/24/solid';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('projects', JSON.stringify(updated));
  };
  useEffect(() => {
    const stored = localStorage.getItem('projects');

    if (stored) {
      setProjects(JSON.parse(stored));
    } else {
      localStorage.setItem('projects', JSON.stringify(sampleProjects));
      setProjects(sampleProjects);
    }
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-30">
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-4xl font-semibold">Projects</h1>
        <Link href="/new">
          <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition">
            + New project
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 rounded-full">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-full bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <div key={project.id} className="relative">
            <Link href={`/${project.id}`}>
              <div className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">
                      {project.title} {project.locked && '🔒'}
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">{project.description}</p>
                    <span className="text-xs text-gray-500 mt-2 block">
                      {new Date(project.updated).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDelete(project.id);
                    }}
                    className="text-white bg-zinc-700 hover:bg-red-600 rounded-full w-7 h-7 flex items-center justify-center transition"
                    title="Delete project"
                    aria-label="Delete project"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
