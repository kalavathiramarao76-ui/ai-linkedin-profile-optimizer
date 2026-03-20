'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isFavorited, toggleFavorite, FavoriteType } from '@/lib/favorites';

interface FavoriteButtonProps {
  id: string;
  type: FavoriteType;
  title: string;
  preview: string;
  data?: any;
  className?: string;
}

export function FavoriteButton({ id, type, title, preview, data, className }: FavoriteButtonProps) {
  const [active, setActive] = useState(false);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    setActive(isFavorited(id));
    const handler = () => setActive(isFavorited(id));
    window.addEventListener('favorites-changed', handler);
    return () => window.removeEventListener('favorites-changed', handler);
  }, [id]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowFavorited = toggleFavorite({ id, type, title, preview, data });
    setActive(nowFavorited);
    if (nowFavorited) {
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'relative p-1.5 rounded-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400/50',
        active ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300',
        className
      )}
      title={active ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star
        className={cn(
          'h-5 w-5 transition-all duration-200',
          active && 'fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]',
          bounce && 'animate-favorite-bounce'
        )}
      />
    </button>
  );
}
