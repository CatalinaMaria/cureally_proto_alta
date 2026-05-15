import { useEffect, useMemo, useState } from 'react';
import { useCareStore } from '../../app/care-store';
import { Badge } from '../../components/feedback/Badge';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { Button } from '../../components/forms/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Card } from '../../components/cards/Card';

type ReportStatus = 'revisado' | 'nuevo' | 'atencion' | 'urgente';

interface CareReport {
  id: string;
  cuidador: string;
  fecha: string;
  preview: string;
  estado: ReportStatus;
  observacion: string;
  checks: string[];
  notas?: string;
}

export function ReportsScreen() {
  const { dailyReport } = useCareStore();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const reports = useMemo<CareReport[]>(
    () => [
      {
        id: 'report-carolina',
        cuidador: 'Carolina',
        fecha: dailyReport.fecha,
        preview: dailyReport.observaciones,
        estado: 'nuevo',
        observacion: dailyReport.observaciones,
        checks: dailyReport.checks,
        notas: 'Se recomienda mantener la rutina de descanso.',
      },
      {
        id: 'report-pedro',
        cuidador: 'Pedro',
        fecha: '2026-05-12',
        preview: 'Turno de la tarde sin novedades importantes.',
        estado: 'revisado',
        observacion: 'Turno de la tarde sin novedades importantes.',
        checks: ['Hidratación de la tarde registrada', 'Movilidad asistida completada', 'Colación de media tarde entregada'],
        notas: 'Sin cambios en la rutina para el turno siguiente.',
      },
      {
        id: 'report-carolina-concern',
        cuidador: 'Carolina',
        fecha: '2026-05-11',
        preview: 'Paciente con poco apetito durante el almuerzo.',
        estado: 'nuevo',
        observacion: 'Paciente con poco apetito durante el almuerzo.',
        checks: ['Medicación del mediodía registrada', 'Hidratación parcial verificada', 'Almuerzo ofrecido'],
        notas: 'Comió menos de lo habitual. Se sugiere observar la cena y consultar si la situación continúa.',
      },
      {
        id: 'report-pedro-attention',
        cuidador: 'Pedro',
        fecha: '2026-05-10',
        preview: 'Se observó desorientación y rechazo de la medicación.',
        estado: 'atencion',
        observacion: 'Durante la tarde el paciente presentó mayor desorientación y rechazó la medicación indicada.',
        checks: ['Intento de administración realizado', 'Signos observados registrados', 'Familiar notificado'],
        notas: 'Se recomienda seguimiento cercano y confirmar con el profesional tratante.',
      },
      {
        id: 'report-carolina-urgent',
        cuidador: 'Carolina',
        fecha: '2026-05-09',
        preview: 'Paciente con malestar general y somnolencia inusual.',
        estado: 'urgente',
        observacion: 'Paciente con malestar general, somnolencia inusual y menor respuesta durante la mañana.',
        checks: ['Signos reportados', 'Medicación pausada hasta confirmación', 'Familiar contactado'],
        notas: 'Se solicita revisión médica a la brevedad.',
      },
    ],
    [dailyReport],
  );

  const selectedReport = useMemo(
    () => reports.find((report) => report.id === selectedReportId) ?? null,
    [reports, selectedReportId],
  );

  useEffect(() => {
    if (!selectedReport) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedReportId(null);
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [selectedReport]);

  const closeReport = () => setSelectedReportId(null);

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Informes" subtitle="Historial de reportes diarios de la red de cuidado." />

      <section>
        <SectionTitle title="Reportes recientes" />
        <div className="stack-sm">
          {reports.map((report) => (
            <Card key={report.id} className="report-card">
              <div className="list-card__row">
                <p className="list-card__title">{`Informe de ${report.cuidador}`}</p>
                <Badge variant={getReportStatusVariant(report.estado)}>{getReportStatusLabel(report.estado)}</Badge>
              </div>
              <p className="list-card__meta">{`Fecha: ${formatDate(report.fecha)}`}</p>
              <p className="report-card__preview">{report.preview}</p>
              <div className="report-card__actions">
                <button type="button" className="text-button report-card__detail-link" onClick={() => setSelectedReportId(report.id)}>
                  Ver informe
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {selectedReport ? (
        <div className="activity-modal-backdrop" role="presentation" onClick={closeReport}>
          <div
            className="activity-modal-sheet task-modal-sheet reports-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reporte-detalle-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="activity-modal-sheet__handle" aria-hidden="true" />
            <h4 id="reporte-detalle-titulo" className="activity-modal-sheet__title">{`Informe de ${selectedReport.cuidador}`}</h4>

            <p className="muted-text">{`Fecha: ${formatDate(selectedReport.fecha)}`}</p>

            <p className="report-sheet__label">Observación general</p>
            <p className="task-modal-sheet__text task-modal-sheet__report-text">{selectedReport.observacion}</p>

            <p className="report-sheet__label">Tareas registradas</p>
            <div className="check-list" aria-label={`Tareas registradas del informe de ${selectedReport.cuidador}`}>
              {selectedReport.checks.map((check) => (
                <p key={check} className="check-list__item">
                  ✓ {check}
                </p>
              ))}
            </div>

            {selectedReport.notas ? (
              <>
                <p className="report-sheet__label">Notas</p>
                <p className="task-modal-sheet__text">{selectedReport.notas}</p>
              </>
            ) : null}

            <div className="task-modal-sheet__actions">
              <Button type="button" variant="secondary" fullWidth onClick={closeReport}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${dateIso}T00:00:00`));
}

function getReportStatusLabel(status: ReportStatus) {
  if (status === 'revisado') return 'Revisado';
  if (status === 'urgente') return 'Urgente';
  if (status === 'atencion') return 'Atención';
  return 'Nuevo';
}

function getReportStatusVariant(status: ReportStatus) {
  if (status === 'revisado') return 'neutral';
  if (status === 'urgente') return 'danger';
  if (status === 'atencion') return 'warning';
  return 'success';
}
