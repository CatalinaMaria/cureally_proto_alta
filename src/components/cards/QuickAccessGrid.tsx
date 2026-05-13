import { type KeyboardEvent } from 'react';
import { Card } from './Card';

export interface QuickAccessItem {
  id: string;
  titulo: string;
  descripcion: string;
  onSelect: () => void;
}

interface QuickAccessGridProps {
  items: QuickAccessItem[];
}

export function QuickAccessGrid({ items }: QuickAccessGridProps) {
  const handleKey = (event: KeyboardEvent<HTMLDivElement>, onSelect: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div className="quick-grid">
      {items.map((item) => (
        <Card key={item.id}>
          <div
            role="button"
            tabIndex={0}
            onClick={item.onSelect}
            onKeyDown={(event) => handleKey(event, item.onSelect)}
            className="quick-card"
            aria-label={`Ir a ${item.titulo}`}
          >
            <p className="quick-card__title">{item.titulo}</p>
            <p className="quick-card__description">{item.descripcion}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
