export interface BriefHistoryItem {
  id: string;
  name: string;
  date: string;
}

const STORAGE_KEY = "brief_history";

export function saveBriefToHistory(item: BriefHistoryItem) {
  if (typeof window === "undefined") return;
  
  const history = getBriefHistory();
  const existingIndex = history.findIndex((b) => b.id === item.id);
  if (existingIndex !== -1) {
    history[existingIndex].name = item.name;
  } else {
    history.unshift(item);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getBriefHistory(): BriefHistoryItem[] {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error leyendo el historial de briefs", error);
    return [];
  }
}

export function removeBriefFromHistory(id: string) {
  if (typeof window === "undefined") return;
  
  const history = getBriefHistory().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}