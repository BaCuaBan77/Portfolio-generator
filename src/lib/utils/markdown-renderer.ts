/**
 * Simple markdown renderer for basic formatting
 * Converts markdown syntax to HTML
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';

  let html = markdown;

  // Escape HTML to prevent XSS (do this first)
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Process lists first (before other formatting to avoid conflicts)
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match list items: - item or * item (with optional leading whitespace)
    const listMatch = line.match(/^(\s*)[-*]\s+(.+)$/);

    if (listMatch) {
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      processedLines.push(`<li>${listMatch[2]}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    }
  }

  if (inList) {
    processedLines.push('</ul>');
  }

  html = processedLines.join('\n');

  // Convert markdown to HTML
  // Bold: **text** (handle multiple bold sections)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_ (but not if it's part of **text**)
  // Use negative lookbehind/lookahead to avoid matching bold markers
  html = html.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
  html = html.replace(/(?<!_)_([^_\n]+?)_(?!_)/g, '<em>$1</em>');

  // Convert line breaks to <br> tags
  // The browser will handle list rendering correctly even with <br> tags
  html = html.replace(/\n/g, '<br>');

  return html;
}

