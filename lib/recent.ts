const KEY = "thrift-lens:recent-v1";
const MAX = 5;

export type RecentSearch = { label: string; lookId: string };

export function loadRecent(): RecentSearch[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((r): r is RecentSearch => typeof r?.label === "string" && typeof r?.lookId === "string")
      .slice(0, MAX);
  } catch {
    return [];
  }
}

function write(list: RecentSearch[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // private mode or quota: recents just won't persist
  }
}

export function addRecent(entry: RecentSearch): RecentSearch[] {
  const next = [entry, ...loadRecent().filter((r) => !(r.label === entry.label && r.lookId === entry.lookId))].slice(0, MAX);
  write(next);
  return next;
}

export function clearRecent() {
  write([]);
}
