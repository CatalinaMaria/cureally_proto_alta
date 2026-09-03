import { useState, type FormEvent } from 'react';
import { useAuth } from '../../app/auth';
import { useCareStore } from '../../app/care-store';
import { Card } from '../../components/cards/Card';
import { Badge } from '../../components/feedback/Badge';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { Button } from '../../components/forms/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { getCareMemberName } from '../../data/mockData';
import type { StockItem } from '../../types/domain';

export function StockScreen() {
  const { currentUser } = useAuth();
  const { stockItems, stockMovements, registerStockReplenishment } = useCareStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [stockItemId, setStockItemId] = useState(stockItems[0]?.id ?? '');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(quantity);
    if (!currentUser || !registerStockReplenishment(currentUser.careMemberId, stockItemId, amount, note)) return;
    setQuantity('');
    setNote('');
    setIsFormOpen(false);
    setFeedback('Reposición registrada y compartida con la red de cuidado.');
    window.setTimeout(() => setFeedback(''), 2800);
  };

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Stock de cuidado" subtitle="Medicaciones e insumos necesarios para Juan." showBack backTo="/home" />

      <Button type="button" fullWidth onClick={() => setIsFormOpen((open) => !open)}>
        {isFormOpen ? 'Cerrar registro' : '+ Registrar compra o reposición'}
      </Button>

      {isFormOpen ? (
        <Card>
          <form className="stock-movement-form" onSubmit={handleSubmit}>
            <label className="field"><span className="field__label">Producto</span><select className="field__input" value={stockItemId} onChange={(event) => setStockItemId(event.target.value)}>{stockItems.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select></label>
            <label className="field"><span className="field__label">Cantidad incorporada</span><input className="field__input" type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="Ej: 30" required /></label>
            <label className="field"><span className="field__label">Observación opcional</span><textarea className="field__textarea" rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ej: Compra mensual" /></label>
            <Button type="submit" fullWidth>Guardar movimiento</Button>
          </form>
        </Card>
      ) : null}

      {feedback ? <p className="stock-feedback" role="status">{feedback}</p> : null}

      {(['medicacion', 'insumo'] as const).map((category) => (
        <section key={category}>
          <SectionTitle title={category === 'medicacion' ? 'Medicación' : 'Insumos'} />
          <div className="stack-sm">{stockItems.filter((item) => item.categoria === category).map((item) => <StockCard key={item.id} item={item} />)}</div>
        </section>
      ))}

      <section>
        <SectionTitle title="Últimos movimientos" />
        <Card className="stock-movements-card">
          <div className="stock-movement-list">
            {stockMovements.map((movement) => {
              const item = stockItems.find((candidate) => candidate.id === movement.stockItemId);
              return <div key={movement.id} className="stock-movement"><span className={movement.cantidad > 0 ? 'stock-movement__amount--positive' : 'stock-movement__amount--negative'}>{movement.cantidad > 0 ? '+' : ''}{movement.cantidad}</span><div><p><strong>{item?.nombre}</strong> — {movement.tipo === 'reposicion' ? 'Reposición' : 'Administrada'} por {getCareMemberName(movement.actorId)}</p>{movement.observacion ? <small>{movement.observacion}</small> : null}</div><time>{movement.registradaEn}</time></div>;
            })}
          </div>
        </Card>
      </section>
    </section>
  );
}

function StockCard({ item }: { item: StockItem }) {
  const status = item.cantidad <= 2 ? 'critico' : item.cantidad <= 5 ? 'bajo' : 'suficiente';
  return <Card className={`list-card stock-card stock-card--${status === 'critico' ? 'critical' : status === 'bajo' ? 'low' : 'ok'}`}><div className="list-card__row"><p className="list-card__title">{item.nombre}</p><Badge variant={status === 'critico' ? 'danger' : status === 'bajo' ? 'warning' : 'success'}>{status === 'critico' ? 'Crítico' : status === 'bajo' ? 'Bajo stock' : 'Suficiente'}</Badge></div><p className="list-card__meta">Quedan {item.cantidad} {item.unidad}</p></Card>;
}
