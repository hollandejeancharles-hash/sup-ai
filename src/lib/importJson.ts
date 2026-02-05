// src/lib/importJson.ts
export type ImportItem = {
  title?: string;
  url?: string;
  source?: string;
  snippet?: string;
  paragraph?: string;
  tags?: string[];
  image_url?: string;
  video_url?: string;
  read_time_minutes?: number;
};

export function sanitizeJsonInput(raw: string) {
  return raw
    .trim()
    // Remove BOM if present
    .replace(/^\uFEFF/, "")
    // Curly double quotes -> straight
    .replace(/[“”]/g, '"')
    // Curly single quotes -> straight apostrophe (safe for text)
    .replace(/[‘’]/g, "'")
    // French quotes
    .replace(/[«»]/g, '"')
    // Non-breaking spaces -> normal spaces
    .replace(/\u00A0/g, " ")
    // Remove trailing commas before } or ]
    .replace(/,\s*([}\]])/g, "$1");
}

function formatJsonParseError(raw: string, message: string) {
  const match = message.match(/position\s(\d+)/i);
  if (!match) return message;

  const pos = Number(match[1]);
  const before = raw.slice(0, pos);
  const line = before.split("\n").length;
  const col = before.length - before.lastIndexOf("\n");
  return `${message} (ligne ${line}, colonne ${col})`;
}

export function parseImportPayload(rawText: string): ImportItem[] {
  const cleaned = sanitizeJsonInput(rawText);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "JSON invalide";
    throw new Error(formatJsonParseError(cleaned, msg));
  }

  // Accept: [ {...}, {...} ]
  if (Array.isArray(parsed)) return parsed as ImportItem[];

  // Accept: { items: [ ... ] }
  if (parsed && typeof parsed === "object" && "items" in (parsed as any) && Array.isArray((parsed as any).items)) {
    return (parsed as any).items as ImportItem[];
  }

  // Accept: single object { ... } -> wrap
  if (parsed && typeof parsed === "object") return [parsed as ImportItem];

  throw new Error("Format non supporté. Colle un tableau d’objets ou un objet avec 'items'.");
}

export function normalizeItems(items: ImportItem[]): ImportItem[] {
  if (!items.length) throw new Error("Aucun article trouvé dans le JSON.");

  return items.map((it, idx) => {
    const title = (it.title ?? "").trim();
    const url = (it.url ?? "").trim();
    const paragraph = (it.paragraph ?? "").trim();
    const snippet = (it.snippet ?? "").trim();

    const safeTitle =
      title ||
      (snippet ? snippet.slice(0, 80).trim() : "") ||
      (paragraph ? paragraph.slice(0, 80).trim() : `Article ${idx + 1}`);

    const tags = Array.isArray(it.tags)
      ? it.tags.map(t => String(t).trim()).filter(Boolean)
      : [];

    return {
      ...it,
      title: safeTitle,
      url,
      snippet: snippet || (paragraph ? paragraph.slice(0, 220).trim() : ""),
      paragraph,
      tags,
      image_url: (it.image_url ?? "").trim(),
      video_url: (it.video_url ?? "").trim(),
      read_time_minutes: Number.isFinite(it.read_time_minutes as number) ? Number(it.read_time_minutes) : undefined,
    };
  });
}
