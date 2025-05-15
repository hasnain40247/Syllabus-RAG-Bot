export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { writeFile } from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import { storePdfText } from '@/lib/chroma';

export async function POST(req: NextRequest) {
  console.log(`🚀 Starting PDF upload process`);

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const projectId = formData.get('projectId')?.toString();

  if (!file || !projectId) {
    console.warn('⚠️ Missing file or projectId');
    return NextResponse.json({ error: 'Missing file or projectId' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const tempFilePath = path.join(tmpdir(), `${Date.now()}-${file.name}`);
  await writeFile(tempFilePath, buffer);

  console.log(`📁 Saved uploaded file to: ${tempFilePath}`);
  console.log(`📌 Project ID: ${projectId}`);

  const loader = new PDFLoader(tempFilePath, { splitPages: true });
  const docs = await loader.load();

  console.log(`📄 Parsed ${docs.length} pages from PDF`);

  const combinedText = docs.map(doc => doc.pageContent).join('\n\n');
  console.log(`🧾 Combined text length: ${combinedText.length} characters`);

  await storePdfText(combinedText, projectId);

  console.log(`✅ Finished storing chunks to Chroma`);

  return NextResponse.json({ success: true, message: 'Stored in Chroma successfully.' });
}
