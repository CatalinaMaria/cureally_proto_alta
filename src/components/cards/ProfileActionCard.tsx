import { Card } from './Card';

export function ProfileActionCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="profile-action-card">
      <p className="profile-action-card__title">{title}</p>
      <p className="muted-text">{description}</p>
    </Card>
  );
}
