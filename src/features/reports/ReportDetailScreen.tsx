import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useCareStore } from '../../app/care-store';
import { Button } from '../../components/forms/Button';
import { Card } from '../../components/cards/Card';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { formatReportDate, getCareReports } from './reportsData';

export function ReportDetailScreen() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { dailyReport, caregiverReports } = useCareStore();

  const reports = useMemo(() => getCareReports(dailyReport, caregiverReports), [caregiverReports, dailyReport]);
  const report = reports.find((item) => item.id === reportId) ?? null;

  if (!report || !reportId) {
    return <Navigate to="/reports" replace />;
  }

  return (
    <section className="screen stack-lg">
      <ScreenHeader title={`Informe de ${report.cuidador}`} subtitle={formatReportDate(report.fecha)} showBack backTo="/reports" />

      <Card>
        <p className="report-sheet__label">Fecha</p>
        <p className="task-modal-sheet__text">{formatReportDate(report.fecha)}</p>

        <p className="report-sheet__label">Observación general</p>
        <p className="task-modal-sheet__text task-modal-sheet__report-text">{report.observacion}</p>

        <p className="report-sheet__label">Tareas registradas</p>
        <div className="check-list" aria-label={`Tareas registradas del informe de ${report.cuidador}`}>
          {report.checks.map((check) => (
            <p key={check} className="check-list__item">
              ✓ {check}
            </p>
          ))}
        </div>

        {report.notas ? (
          <>
            <p className="report-sheet__label">Notas</p>
            <p className="task-modal-sheet__text">{report.notas}</p>
          </>
        ) : null}
      </Card>

      <Button type="button" variant="secondary" fullWidth onClick={() => navigate('/reports')}>
        Cerrar
      </Button>
    </section>
  );
}
