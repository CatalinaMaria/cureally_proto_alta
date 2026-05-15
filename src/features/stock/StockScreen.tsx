import { useState } from 'react';
import { Card } from '../../components/cards/Card';
import { Badge } from '../../components/feedback/Badge';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { Button } from '../../components/forms/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';

type StockCategory = 'medicacion' | 'insumo';
type StockStatus = 'bajo' | 'suficiente' | 'critico';

interface StockItem {
  id: string;
  categoria: StockCategory;
  nombre: string;
  detalle: string;
  estado: StockStatus;
}

const STOCK_ITEMS: StockItem[] = [
  {
    id: 'stock-memantina',
    categoria: 'medicacion',
    nombre: 'Memantina 20 mg',
    detalle: 'Quedan 5 dosis',
    estado: 'bajo',
  },
  {
    id: 'stock-aspirina',
    categoria: 'medicacion',
    nombre: 'Aspirina 100 mg',
    detalle: 'Quedan 12 dosis',
    estado: 'suficiente',
  },
  {
    id: 'stock-panales',
    categoria: 'insumo',
    nombre: 'Pañales',
    detalle: 'Quedan 2 unidades',
    estado: 'critico',
  },
  {
    id: 'stock-gasas',
    categoria: 'insumo',
    nombre: 'Gasas',
    detalle: 'Stock suficiente',
    estado: 'suficiente',
  },
];

export function StockScreen() {
  const [requestedReplenishment, setRequestedReplenishment] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState('');

  const handleRequestReplenishment = (itemId: string) => {
    setRequestedReplenishment((prev) => ({ ...prev, [itemId]: true }));
    setFeedback('Solicitud enviada a la red de cuidado.');
    window.setTimeout(() => setFeedback(''), 2600);
  };

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Stock de cuidado" subtitle="Medicaciones e insumos necesarios para Juan." showBack backTo="/home" />

      <section>
        <SectionTitle title="Medicación" />
        <div className="stack-sm">
          {STOCK_ITEMS.filter((item) => item.categoria === 'medicacion').map((item) => (
            <StockCard
              key={item.id}
              item={item}
              requested={requestedReplenishment[item.id]}
              onRequestReplenishment={handleRequestReplenishment}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Insumos" />
        <div className="stack-sm">
          {STOCK_ITEMS.filter((item) => item.categoria === 'insumo').map((item) => (
            <StockCard
              key={item.id}
              item={item}
              requested={requestedReplenishment[item.id]}
              onRequestReplenishment={handleRequestReplenishment}
            />
          ))}
        </div>
      </section>

      {feedback ? (
        <p className="stock-feedback" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}
    </section>
  );
}

function StockCard({
  item,
  requested,
  onRequestReplenishment,
}: {
  item: StockItem;
  requested?: boolean;
  onRequestReplenishment: (itemId: string) => void;
}) {
  const showReplenishmentAction = item.estado === 'bajo' || item.estado === 'critico';

  return (
    <Card className={`list-card stock-card ${stockCardClass(item.estado)}`}>
      <div className="list-card__row">
        <p className="list-card__title">{item.nombre}</p>
        <Badge variant={stockBadgeVariant(item.estado)}>{stockStatusLabel(item.estado)}</Badge>
      </div>
      <p className="list-card__meta">{item.detalle}</p>

      {showReplenishmentAction ? (
        <div className="stock-card__actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onRequestReplenishment(item.id)}
            disabled={requested}
          >
            {requested
              ? item.estado === 'critico'
                ? 'Reposición urgente solicitada'
                : 'Reposición solicitada'
              : item.estado === 'critico'
                ? 'Solicitar reposición urgente'
                : 'Solicitar reposición'}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

function stockStatusLabel(status: StockStatus) {
  if (status === 'critico') return 'Crítico';
  if (status === 'bajo') return 'Bajo stock';
  return 'Suficiente';
}

function stockBadgeVariant(status: StockStatus) {
  if (status === 'critico') return 'danger';
  if (status === 'bajo') return 'warning';
  return 'success';
}

function stockCardClass(status: StockStatus) {
  if (status === 'critico') return 'stock-card--critical';
  if (status === 'bajo') return 'stock-card--low';
  return 'stock-card--ok';
}
