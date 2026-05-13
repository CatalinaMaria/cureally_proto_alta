import type { CareMember } from '../../types/domain';
import { Card } from './Card';

export function CareNetworkCard({ members }: { members: CareMember[] }) {
  return (
    <Card>
      <h3 className="card-title">Red de cuidado</h3>
      <ul className="simple-list">
        {members.map((member) => (
          <li key={member.id}>
            <span>{member.nombre}</span>
            <span className="muted-text">{member.rol}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
