'use client';

import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ProjectKnowledge() {
  const params = useParams();
  const projectId = params?.projectId as string;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [instructions, setInstructions] = useState('');

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setMessage('');

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);

      await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
    }

    setUploading(false);
    setMessage('✅ PDF(s) uploaded and indexed successfully.');
    setFiles([]);
  };

  return (
    <aside className="border border-zinc-700 p-6 rounded-xl max-w-4xl">
    <div className="flex justify-between items-center mb-4">
  <h2 className="text-lg font-semibold">Project knowledge</h2>
  <div className="flex space-x-2">
    <button
      onClick={() => fileInputRef.current?.click()}
      className="border border-zinc-600 px-2 py-1 rounded text-white text-sm hover:bg-zinc-800"
    >
      +
    </button>
    {files.length > 0 && (
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="border border-green-500 text-green-300 px-2 py-1 rounded text-sm hover:bg-green-900"
      >
        {uploading ? 'Uploading...' : 'Done'}
      </button>
    )}
  </div>
</div>


      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
            setFiles(prev => [...prev, ...selectedFiles]);
          }
        }}
        ref={fileInputRef}
        className="hidden"
      />

      <div className="border border-dashed border-zinc-600 rounded-md px-4 py-3 text-sm text-gray-400 mb-6 flex justify-between items-center">
        <button
          onClick={() => setShowModal(true)}
          className="text-left text-white hover:underline"
        >
          Set project instructions
        </button>
        <span className="text-xs text-gray-500">Optional</span>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="bg-zinc-800 rounded-lg px-6 py-8 text-center text-gray-400"
      >
        <div className="text-3xl mb-4">📖</div>
        <p className="mb-2 text-sm">No knowledge added yet.</p>
        <p className="text-xs text-gray-500 mb-4">
          Add PDFs, documents, or other text to the project knowledge base that Claude will reference in every project conversation.
        </p>

        {files.length > 0 && (
          <>
            <ul className="mt-6 space-y-2 text-left text-sm text-white">
              {files.map((file, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center border border-zinc-700 rounded px-3 py-1"
                >
                  <span className="truncate max-w-[80%]">{file.name}</span>
                  <button
                    onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                    className="text-red-400 hover:text-red-600 text-xs"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>



          </>
        )}

        {message && <p className="mt-4 text-green-400 text-sm">{message}</p>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-2">Set project instructions</h3>
            <p className="text-sm text-gray-400 mb-4">
              Provide Claude with relevant instructions and information for chats within this project. This will work alongside user preferences and the selected style in a chat.
            </p>

            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Break down large tasks and ask clarifying questions when needed."
              className="w-full h-32 bg-zinc-800 text-white p-3 rounded resize-none border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-white border border-zinc-600 rounded hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Optional: persist `instructions` to backend
                  setShowModal(false);
                }}
                className="px-4 py-2 text-sm bg-gray-300 text-black rounded hover:bg-white"
              >
                Save instructions
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
