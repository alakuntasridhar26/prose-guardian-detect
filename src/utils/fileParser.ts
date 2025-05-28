
import mammoth from 'mammoth';

export interface ParsedFile {
  content: string;
  filename: string;
  error?: string;
}

export const parseFile = async (file: File): Promise<ParsedFile> => {
  const filename = file.name;
  
  try {
    if (file.type === 'application/pdf') {
      // For PDF parsing, we'll use the File API to read as text
      // Note: This is a simplified approach. For production, you'd want a more robust PDF parser
      const text = await file.text();
      return { content: text, filename };
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Parse DOCX files using mammoth
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return { content: result.value, filename };
    } else if (file.type === 'text/plain') {
      // Parse plain text files
      const content = await file.text();
      return { content, filename };
    } else {
      return { 
        content: '', 
        filename, 
        error: 'Unsupported file format. Please upload PDF, DOCX, or TXT files.' 
      };
    }
  } catch (error) {
    return { 
      content: '', 
      filename, 
      error: `Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};
