'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProjectHeader from '../components/ProjectHeader';
import ChatInput from '../components/ChatInput';
import ProjectKnowledge from '../components/ProjectKnowledge';
import ChatPreviewCard from '../components/ChatPreviewCard';

type Chat = {
  chatId: string;
  timestamp: number;
  messages: { role: string; content: string }[];
};

type Project = {
  id: string;
  title: string;
  description: string;
  visibility: string;
  createdBy: string;
  updated: string;
  locked: boolean;
  chats?: Chat[];
};

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;

  const [project, setProject] = useState<Project | null>(null);

  // Fetch project and its chats from localStorage
  useEffect(() => {
    if (!projectId) return;

    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const parsedProjects: Project[] = JSON.parse(storedProjects);
      const foundProject = parsedProjects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [projectId, router]);

  const handleSend = (message: string) => {
    const chatId = Date.now().toString();
    localStorage.setItem('initialMessage', message);
    router.push(`/${projectId}/${chatId}`);
  };

  const handleDelete = (chatIdToDelete: string) => {
    if (!project) return;
  
    // Filter out the deleted chat from current project
    const updatedChats = (project.chats || []).filter(chat => chat.chatId !== chatIdToDelete);
    const updatedProject = { ...project, chats: updatedChats };
  
    // Update state
    setProject(updatedProject);
  
    // Update localStorage
    const storedProjects = localStorage.getItem('projects');
    if (!storedProjects) return;
  
    const parsedProjects: Project[] = JSON.parse(storedProjects);
  
    const updatedProjects = parsedProjects.map(p => {
      if (p.id === projectId) {
        return { ...p, chats: updatedChats };
      }
      return p;
    });
  
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };
  

  if (!project) {
    return (
      <main className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading project...</p>
      </main>
    );
  }

  const chats = project.chats || [];

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-8">
      <div className="mb-6">
        <a href="/" className="text-sm text-gray-400 hover:underline">&larr; All projects</a>
      </div>

      <ProjectHeader
        name={project.title}
        description={project.description}
        visibility={project.visibility}
        createdBy={project.createdBy}
      />

      <div className="flex flex-col lg:flex-row gap-8 mt-6 items-start">
        <div className="flex flex-col flex-1 space-y-6">
          <ChatInput onSend={handleSend} />
          <div className="flex space-x-4">
            <button className="px-4 py-2 rounded-2xl bg-white text-black">Your chats</button>
          </div>

          {chats.length === 0 && (
            <div className="border border-zinc-700 p-6 rounded-lg text-gray-400">
              Start a chat to keep conversations organized and re-use project knowledge.
            </div>
          )}

          <div className="max-h-[50vh] overflow-y-auto pr-1 scroll-container">
            <ul className="space-y-2">
              {chats.map(chat => (
                <ChatPreviewCard
                  key={chat.chatId}
                  onClick={() => {
                    router.push(`/${projectId}/${chat.chatId}`);
                  }}
                  onDelete={() => handleDelete(chat.chatId)}
                  title="My Chat"
                  createdAt={new Date(chat.timestamp).toLocaleString()}
                />
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full lg:w-[400px] shrink-0">
          <ProjectKnowledge />
        </div>
      </div>
    </main>
  );
}
