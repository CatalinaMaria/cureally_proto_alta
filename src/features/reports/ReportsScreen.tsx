import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareStore } from '../../app/care-store';
import { Badge } from '../../components/feedback/Badge';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Card } from '../../components/cards/Card';
import { formatReportDate, getCareReports, getReportStatusLabel, getReportStatusVariant } from './reportsData';

export function ReportsScreen() {
  const navigate = useNavigate();
  const { dailyReport, caregiverReports } = useCareStore();

  const reports = useMemo(() => getCareReports(dailyReport, caregiverReports), [caregiverReports, dailyReport]);

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Informes" subtitle="Historial de reportes diarios de la red de cuidado." showBack backTo="/home" />

      <section>
        <SectionTitle title="Reportes recientes" />
        <div className="stack-sm">
          {reports.map((report) => (
            <Card key={report.id} className="report-card">
              <div className="list-card__row">
                <p className="list-card__title">{`Informe de ${report.cuidador}`}</p>
                <Badge variant={getReportStatusVariant(report.estado)}>{getReportStatusLabel(report.estado)}</Badge>
              </div>
              <p className="list-card__meta">{`Fecha: ${formatReportDate(report.fecha)}`}</p>
              <p className="report-card__preview">{report.preview}</p>
              <div className="report-card__actions">
                <button
                  type="button"
                  className="text-button report-card__detail-link"
                  onClick={() => navigate(`/reports/${report.id}`)}
                >
                  Ver informe
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </section>
  );
}
