import { ChromaClient } from 'chromadb';

const client = new ChromaClient();

export async function storePdfText(text: string, projectId: string) {
  console.log(projectId);
  
  const collection = await client.getOrCreateCollection({
    name: `project-${projectId}`,
    metadata: {
      "description": `collection for project-${projectId}`
    }
  });

  const chunks = splitIntoChunks(text, 500, 50);
  const ids = chunks.map((_, i) => `${projectId}-${Date.now()}-${i}`);

  await collection.add({
    documents: chunks,
    ids:ids,
  });

  console.log(`✅ Stored chunks to collection project-${projectId}`);
}

export async function getRelevantChunks(query: string, projectId: string, k = 4) {
  const collection = await client.getOrCreateCollection({
    name: `project-${projectId}`,
  });

  const result = await collection.query({
    queryTexts: [query],
    nResults: k,
  });

  return result.documents?.[0] || [];
}

// Helper function
function splitIntoChunks(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));

    // Make sure we don't go backwards or infinite loop
    if (end === text.length) break;

    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}

