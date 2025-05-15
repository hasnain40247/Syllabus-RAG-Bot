'use client';

import ChatInput from '@/app/components/ChatInput';
import ChatMessageCard from '@/app/components/ChatMessageCard';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function ChatThreadPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { projectId, chatId } = params as { projectId: string; chatId: string };

  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([]);

  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const saveChatToLocalStorage = (
    chatId: string,
    projectId: string,
    messages: { role: string; content: string }[]
  ) => {
    const storedProjects = localStorage.getItem('projects');
    if (!storedProjects) return;
  
    const projects = JSON.parse(storedProjects);
    const projectIndex = projects.findIndex((p: any) => p.id === projectId);
  
    if (projectIndex === -1) return;
  
    const project = projects[projectIndex];
  
    // Ensure chats key exists
    if (!project.chats) {
      project.chats = [];
    }
  
 
    const chatIndex = project.chats.findIndex((c: any) => c.chatId === chatId);
  
    if (chatIndex !== -1) {
      project.chats[chatIndex].messages = messages;
      project.chats[chatIndex].timestamp = Date.now();
    } else {
      project.chats.push({
        chatId,
        timestamp: Date.now(),
        messages,
      });
    }
  
    projects[projectIndex] = project;
    localStorage.setItem('projects', JSON.stringify(projects));
  };
  
  const sendMessage = async (message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setMessages(prev => [...prev, { role: 'assistant', content: 'Thinking...' }]);
  
    const res = await fetch('/api/rag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: message, projectId }),
    });
  
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let result = '';
    let hasStarted = false;
  
    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;
  
      result += decoder.decode(value, { stream: true });
  
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
  
        if (!hasStarted) {
          updated[lastIdx] = { ...updated[lastIdx], content: result };
          hasStarted = true;
        } else {
          updated[lastIdx].content = result;
        }
  
        return updated;
      });
    }
  
    // ✅ Save final messages to localStorage
    setMessages(prev => {
      const finalMessages = [...prev];
      saveChatToLocalStorage(chatId, projectId, finalMessages); // 💾
      return finalMessages;
    });
  };
  
  // Load saved messages from localStorage
useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (!storedProjects) return;
  
    const projects = JSON.parse(storedProjects);
    const project = projects.find((p: any) => p.id === projectId);
    if (!project || !project.chats) return;
  
    const chat = project.chats.find((c: any) => c.chatId === chatId);
    if (chat && Array.isArray(chat.messages)) {
      setMessages(chat.messages);
    }
  }, [projectId, chatId]);
  
 
  useEffect(() => {
    const storedMessage = localStorage.getItem('initialMessage');
    if (storedMessage) {
      sendMessage(storedMessage);
      localStorage.removeItem('initialMessage');
    }
  }, []);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="relative min-h-screen flex flex-col bg-zinc-900 text-white">
      <div className="pt-6 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-400 flex items-center space-x-1 mb-2">
          <a href="/" className="hover:underline">All projects</a>
          <span>/</span>
          <a href={`/${projectId}`} className="hover:underline">{projectId}</a>
          <span>/</span>
          <span className="text-white">{chatId}</span>
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className="w-full">
                <ChatMessageCard role={msg.role} content={msg.content} />
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 bg-zinc-900  px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={sendMessage} placeholder='Reply...' />
          </div>
        </div>
      </div>
    </main>
  );
}
