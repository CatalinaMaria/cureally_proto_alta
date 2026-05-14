interface CalendarMonthGridProps {
  year: number;
  month: number;
  selectedDate: string;
  onSelectDate: (dateIso: string) => void;
  hasActivities: (dateIso: string) => boolean;
}

const weekdays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export function CalendarMonthGrid({ year, month, selectedDate, onSelectDate, hasActivities }: CalendarMonthGridProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;

  const cells = Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - offset + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return null;
    }

    const dateIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    const isSelected = dateIso === selectedDate;

    return (
      <button
        key={dateIso}
        type="button"
        className={`calendar-cell ${isSelected ? 'is-selected' : ''}`}
        onClick={() => onSelectDate(dateIso)}
      >
        <span>{dayNumber}</span>
        {hasActivities(dateIso) ? <span className="calendar-dot" aria-hidden="true" /> : null}
      </button>
    );
  });

  return (
    <div className="calendar-grid-wrap">
      <div className="calendar-weekdays">
        {weekdays.map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="calendar-grid">{cells}</div>
    </div>
  );
}
