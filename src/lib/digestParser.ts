// Digest parser - automatically formats raw input into structured items

export interface ParsedItem {
  title: string;
  url?: string;
  source: string;
  snippet: string;
  tags: string[];
  image_url?: string;
  content_md?: string;
  rank: number;
  read_time_minutes: number;
}

interface JsonDigest {
  date?: string;
  title?: string;
  summary?: string;
  items: Array<{
    title: string;
    url?: string;
    source?: string;
    snippet?: string;
    tags?: string[];
    image_url?: string;
    content_md?: string;
  }>;
}

// Extract domain from URL
function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return "Unknown";
  }
}

// Estimate read time based on content length
function estimateReadTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// Detect URLs in text
function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

// Generate title from text (first sentence, max 80 chars)
function generateTitle(text: string): string {
  // Try to find title before em-dash or colon
  const titleMatch = text.match(/^([^—:]+)[—:]/);
  if (titleMatch && titleMatch[1].trim().length <= 80) {
    return titleMatch[1].trim();
  }

  // Otherwise take first sentence
  const firstSentence = text.split(/[.!?]/)[0].trim();
  if (firstSentence.length <= 80) {
    return firstSentence;
  }
  return firstSentence.substring(0, 77) + "...";
}

// Generate snippet (2-3 sentences, 160-220 chars)
function generateSnippet(text: string, title: string): string {
  // Remove title from text if it starts with it
  let content = text.replace(title, "").trim();
  // Remove URLs for snippet
  content = content.replace(/(https?:\/\/[^\s]+)/g, "").trim();
  
  if (content.length <= 220) {
    return content;
  }
  
  // Try to cut at sentence boundary
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
  let snippet = "";
  for (const sentence of sentences) {
    if ((snippet + sentence).length <= 220) {
      snippet += sentence;
    } else {
      break;
    }
  }
  
  return snippet.trim() || content.substring(0, 217) + "...";
}

// Parse JSON format
function parseJson(input: string): ParsedItem[] | null {
  try {
    const data = JSON.parse(input) as JsonDigest;
    if (!data.items || !Array.isArray(data.items)) {
      return null;
    }

    return data.items.map((item, index) => ({
      title: item.title,
      url: item.url,
      source: item.source || (item.url ? extractDomain(item.url) : "Unknown"),
      snippet: item.snippet || "",
      tags: item.tags || [],
      image_url: item.image_url,
      content_md: item.content_md,
      rank: index + 1,
      read_time_minutes: estimateReadTime(item.snippet || item.title),
    }));
  } catch {
    return null;
  }
}

// Parse Markdown format
function parseMarkdown(input: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  const lines = input.split("\n");
  
  let currentSection = "General";
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect section headers
    if (trimmed.startsWith("## ")) {
      currentSection = trimmed.replace("## ", "").trim();
      continue;
    }
    
    // Detect list items
    if (trimmed.match(/^[-•*]\s+/) || trimmed.match(/^\d+\.\s+/)) {
      const content = trimmed.replace(/^[-•*\d.]+\s+/, "");
      const urls = extractUrls(content);
      const url = urls[0];
      const textWithoutUrl = content.replace(/(https?:\/\/[^\s]+)/g, "").trim();
      
      if (textWithoutUrl) {
        items.push({
          title: generateTitle(textWithoutUrl),
          url,
          source: url ? extractDomain(url) : "Unknown",
          snippet: generateSnippet(textWithoutUrl, generateTitle(textWithoutUrl)),
          tags: [currentSection],
          rank: items.length + 1,
          read_time_minutes: estimateReadTime(textWithoutUrl),
        });
      }
    }
  }
  
  return items;
}

// Parse plain text format
function parsePlainText(input: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  
  // Split by various delimiters
  const blocks = input.split(/\n\n+|(?=^[-•])|(?=^\d+\.)|(?=^[🔹🔸📌🚀💡])/m);
  
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed || trimmed.length < 10) continue;
    
    const urls = extractUrls(trimmed);
    const url = urls[0];
    const textWithoutUrl = trimmed.replace(/(https?:\/\/[^\s]+)/g, "").trim();
    
    // Clean up bullet points and numbers
    const cleanText = textWithoutUrl
      .replace(/^[-•*🔹🔸📌🚀💡]\s*/, "")
      .replace(/^\d+\.\s*/, "")
      .trim();
    
    if (cleanText.length < 10) continue;
    
    // Check for duplicate URLs
    if (url && items.some((item) => item.url === url)) {
      continue;
    }
    
    const title = generateTitle(cleanText);
    
    items.push({
      title,
      url,
      source: url ? extractDomain(url) : "Unknown",
      snippet: generateSnippet(cleanText, title),
      tags: [],
      rank: items.length + 1,
      read_time_minutes: estimateReadTime(cleanText),
    });
  }
  
  return items;
}

// Main parser function
export function parseRawInput(input: string): ParsedItem[] {
  const trimmed = input.trim();
  
  // Try JSON first
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    const jsonItems = parseJson(trimmed);
    if (jsonItems && jsonItems.length > 0) {
      return jsonItems;
    }
  }
  
  // Try Markdown (has headers or structured lists)
  if (trimmed.includes("## ") || /^[-•*]\s+.+\n/m.test(trimmed)) {
    const mdItems = parseMarkdown(trimmed);
    if (mdItems.length > 0) {
      return mdItems;
    }
  }
  
  // Fall back to plain text
  return parsePlainText(trimmed);
}
