import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params (Next.js 15+ requires params to be awaited)
    const { path: pathSegments } = await params;
    // Join path segments and decode URL encoding (handles spaces, etc.)
    const filename = decodeURIComponent(pathSegments.join('/'));
    // Serve directly from config directory (no need to copy to public)
    const filePath = path.join(process.cwd(), 'config', 'profile-pic', filename);
    
    // Security: prevent directory traversal
    const resolvedPath = path.resolve(filePath);
    const configDir = path.resolve(path.join(process.cwd(), 'config', 'profile-pic'));
    
    if (!resolvedPath.startsWith(configDir)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return new NextResponse('Not Found', { status: 404 });
    }
    
    // Read file
    const fileBuffer = await fs.readFile(filePath);
    
    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    const contentType = contentTypeMap[ext] || 'application/octet-stream';
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving profile picture:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

