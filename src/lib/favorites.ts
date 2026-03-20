// Favorites CRUD with localStorage + custom event dispatching

export type FavoriteType = 'analysis' | 'headline' | 'summary';

export interface FavoriteItem {
  id: string;
  type: FavoriteType;
  title: string;
  preview: string;
  data: any;
  createdAt: string;
}

const STORAGE_KEY = 'profileai-favorites';

function emit() {
  window.dispatchEvent(new CustomEvent('favorites-changed'));
}

export function getFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getFavoritesByType(type: FavoriteType): FavoriteItem[] {
  return getFavorites().filter((f) => f.type === type);
}

export function isFavorited(id: string): boolean {
  return getFavorites().some((f) => f.id === id);
}

export function addFavorite(item: Omit<FavoriteItem, 'createdAt'>): void {
  const favorites = getFavorites();
  if (favorites.some((f) => f.id === item.id)) return;
  favorites.unshift({ ...item, createdAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  emit();
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites().filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  emit();
}

export function toggleFavorite(item: Omit<FavoriteItem, 'createdAt'>): boolean {
  if (isFavorited(item.id)) {
    removeFavorite(item.id);
    return false;
  }
  addFavorite(item);
  return true;
}

export function getFavoritesCount(): number {
  return getFavorites().length;
}
