export type SupportedFileType = 'pdf' | 'docx' | 'doc' | 'txt';

export function getSupportedFileType(filename: string): SupportedFileType | null {
  const ext = filename.toLowerCase().split('.').pop();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx' || ext === 'doc') return 'docx';
  if (ext === 'txt') return 'txt';
  return null;
}

export function isSupportedFile(filename: string): boolean {
  return getSupportedFileType(filename) !== null;
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  fileType: SupportedFileType
): Promise<string> {
  switch (fileType) {
    case 'pdf':
      return extractTextFromPdf(buffer);
    case 'docx':
    case 'doc':
      return extractTextFromDocx(buffer);
    case 'txt':
      return buffer.toString('utf-8');
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    // Use require for pdf-parse due to ESM/Turbopack compatibility issues
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    return data.text.trim();
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF document');
  }
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse Word document');
  }
}

export async function extractTextFromUrl(
  url: string,
  fileType: SupportedFileType
): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch document: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return extractTextFromBuffer(buffer, fileType);
}

// Truncate text if it's too long for Claude context
export function truncateText(text: string, maxChars: number = 50000): string {
  if (text.length <= maxChars) return text;
  return text.substring(0, maxChars) + '\n\n[Document truncated due to length...]';
}

// Format multiple documents into a single context string
export function formatDocumentsForPrompt(
  documents: Array<{ name: string; content: string }>
): string {
  if (documents.length === 0) return '';

  const formattedDocs = documents.map((doc, index) => {
    return `--- Document ${index + 1}: ${doc.name} ---\n${doc.content}\n`;
  });

  return `\n\n=== REFERENCE DOCUMENTS ===\nThe following documents contain brand guidelines, briefs, and campaign information that should inform the ideas:\n\n${formattedDocs.join('\n')}\n=== END DOCUMENTS ===\n`;
}
