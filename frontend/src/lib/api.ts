// API base URL — defaults to deployed backend URL, can be overridden by VITE_API_BASE_URL.
const DEFAULT_API_BASE_URL = "https://bajaj-backend-moem.onrender.com";

function normalizeBaseUrl(value?: string) {
  return (value || DEFAULT_API_BASE_URL).trim().replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL as string | undefined
);

export interface Hierarchy {
  root: string;
  tree: Record<string, unknown>;
  depth?: number;
  has_cycle?: boolean;
}

export interface BfhlResponse {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: Hierarchy[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: {
    total_trees: number;
    total_cycles: number;
    largest_tree_root: string;
  };
}

export async function postBfhl(data: string[]): Promise<BfhlResponse> {
  const res = await fetch(`${API_BASE_URL}/bfhl`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Request failed (${res.status}): ${text || res.statusText}`
    );
  }
  return (await res.json()) as BfhlResponse;
}

export function parseInput(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
