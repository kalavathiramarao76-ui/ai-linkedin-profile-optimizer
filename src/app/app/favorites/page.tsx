'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FavoriteButton } from '@/components/FavoriteButton';
import { getFavorites, FavoriteItem, FavoriteType } from '@/lib/favorites';
import { Star, BarChart3, Heading, FileText, Filter } from 'lucide-react';

const filterOptions: { value: FavoriteType | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'All', icon: Star },
  { value: 'analysis', label: 'Analyses', icon: BarChart3 },
  { value: 'headline', label: 'Headlines', icon: Heading },
  { value: 'summary', label: 'Summaries', icon: FileText },
];

const typeBadgeVariant: Record<FavoriteType, 'default' | 'warning' | 'success'> = {
  analysis: 'default',
  headline: 'warning',
  summary: 'success',
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [filter, setFilter] = useState<FavoriteType | 'all'>('all');

  const loadFavorites = () => {
    setFavorites(getFavorites());
  };

  useEffect(() => {
    loadFavorites();
    const handler = () => loadFavorites();
    window.addEventListener('favorites-changed', handler);
    return () => window.removeEventListener('favorites-changed', handler);
  }, []);

  const filtered = filter === 'all' ? favorites : favorites.filter((f) => f.type === filter);

  const counts: Record<string, number> = {
    all: favorites.length,
    analysis: favorites.filter((f) => f.type === 'analysis').length,
    headline: favorites.filter((f) => f.type === 'headline').length,
    summary: favorites.filter((f) => f.type === 'summary').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
          Favorites
        </h1>
        <p className="text-zinc-400">
          Your saved analyses, headlines, and summaries — all in one place.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="h-4 w-4 text-zinc-500" />
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === opt.value
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
            }`}
          >
            <opt.icon className="h-3.5 w-3.5" />
            {opt.label}
            {counts[opt.value] > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-zinc-800 text-zinc-400">
                {counts[opt.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Star className="h-8 w-8 text-amber-400/50" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">No favorites yet</h2>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            {filter === 'all'
              ? 'Star your best headlines, summaries, and analyses to find them here.'
              : `No saved ${filter === 'analysis' ? 'analyses' : filter + 's'} yet. Use the star button to save them.`}
          </p>
        </div>
      )}

      {/* Favorites list */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id} className="group hover:border-zinc-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={typeBadgeVariant[item.type]}>{item.type}</Badge>
                    <span className="text-xs text-zinc-500">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-white mb-1 truncate">{item.title}</p>
                  <p className="text-xs text-zinc-400 line-clamp-2">{item.preview}</p>
                </div>
                <FavoriteButton
                  id={item.id}
                  type={item.type}
                  title={item.title}
                  preview={item.preview}
                  data={item.data}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
