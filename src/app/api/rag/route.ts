import { NextResponse } from 'next/server';
import { ChatOllama } from '@langchain/ollama';
import { getRelevantChunks } from '@/lib/chroma';

export async function POST(req: Request) {
  const { question, projectId } = await req.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const model = new ChatOllama({
          model: 'llama3:8b',
          streaming: true, // important
        });

        const chunks = await getRelevantChunks(question, projectId, 4);
        const context = chunks.join('\n\n');

        const prompt = `Answer the question based on the context below.\n\nContext:\n${context}\n\nQuestion: ${question}`;

        const resStream = await model.stream(prompt);

        for await (const chunk of resStream) {
          controller.enqueue(encoder.encode(chunk.content));
        }

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}



// // /api/rag/route.ts
// import { NextRequest } from 'next/server';
// import { getRelevantChunks } from '@/lib/chroma';
// import Anthropic from '@anthropic-ai/sdk';

// const anthropic = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// });

// export async function POST(req: NextRequest) {
//   const { question, projectId } = await req.json();

//   const chunks = await getRelevantChunks(question, projectId, 4);
//   const context = chunks.join('\n\n');

//   const systemPrompt = `Use the following context to answer the question as clearly as possible. If unsure, say so.\n\nContext:\n${context}`;

//   const stream = await anthropic.messages.stream({
//     model: 'claude-3-haiku-20240307', // or opus / sonnet
//     max_tokens: 1024,
//     messages: [
//       { role: 'user', content: question },
//     ],
//     system: systemPrompt,
//   });

//   const encoder = new TextEncoder();

//   const readableStream = new ReadableStream({
//     async start(controller) {
//       for await (const chunk of stream) {
//         const token = chunk?.delta?.text || '';
//         controller.enqueue(encoder.encode(token));
//       }
//       controller.close();
//     },
//   });

//   return new Response(readableStream, {
//     headers: {
//       'Content-Type': 'text/plain; charset=utf-8',
//       'Transfer-Encoding': 'chunked',
//     },
//   });
// }
