import type { DailyReport } from '../../types/domain';
import { getCareMemberName } from '../../data/mockData';

export type ReportStatus = 'revisado' | 'nuevo' | 'atencion' | 'urgente';

export interface CareReport {
  id: string;
  cuidador: string;
  fecha: string;
  preview: string;
  estado: ReportStatus;
  observacion: string;
  checks: string[];
  notas?: string;
}

export function getCareReports(dailyReport: DailyReport, caregiverReports: DailyReport[] = []): CareReport[] {
  const submittedReports: CareReport[] = caregiverReports.map((report) => ({
    id: report.id,
    cuidador: getCareMemberName(report.cuidadorId),
    fecha: report.fecha,
    preview: report.observaciones,
    estado: 'nuevo',
    observacion: report.observaciones,
    checks: report.checks,
    notas: `Informe correspondiente al turno ${formatShift(report.turno)}.`,
  }));

  return [
    ...submittedReports,
    {
      id: 'report-maria',
      cuidador: 'María',
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
      id: 'report-maria-concern',
      cuidador: 'María',
      fecha: '2026-05-11',
      preview: 'Juan tuvo poco apetito durante el almuerzo.',
      estado: 'nuevo',
      observacion: 'Juan tuvo poco apetito durante el almuerzo.',
      checks: ['Medicación del mediodía registrada', 'Hidratación parcial verificada', 'Almuerzo ofrecido'],
      notas: 'Comió menos de lo habitual. Se sugiere observar la cena y consultar si la situación continúa.',
    },
    {
      id: 'report-pedro-attention',
      cuidador: 'Pedro',
      fecha: '2026-05-10',
      preview: 'Se observó desorientación y rechazo de la medicación.',
      estado: 'atencion',
      observacion: 'Durante la tarde Juan presentó mayor desorientación y rechazó la medicación indicada.',
      checks: ['Intento de administración realizado', 'Signos observados registrados', 'Familiar notificado'],
      notas: 'Se recomienda seguimiento cercano y confirmar con el profesional tratante.',
    },
    {
      id: 'report-maria-urgent',
      cuidador: 'María',
      fecha: '2026-05-09',
      preview: 'Juan presentó malestar general y somnolencia inusual.',
      estado: 'urgente',
      observacion: 'Juan presentó malestar general, somnolencia inusual y menor respuesta durante la mañana.',
      checks: ['Signos reportados', 'Medicación pausada hasta confirmación', 'Familiar contactado'],
      notas: 'Se solicita revisión médica a la brevedad.',
    },
  ];
}

function formatShift(shift: DailyReport['turno']) {
  if (shift === 'manana') return 'mañana';
  if (shift === 'tarde') return 'tarde';
  return 'noche';
}

export function formatReportDate(dateIso: string) {
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${dateIso}T00:00:00`));
}

export function getReportStatusLabel(status: ReportStatus) {
  if (status === 'revisado') return 'Revisado';
  if (status === 'urgente') return 'Urgente';
  if (status === 'atencion') return 'Atención';
  return 'Nuevo';
}

export function getReportStatusVariant(status: ReportStatus) {
  if (status === 'revisado') return 'neutral';
  if (status === 'urgente') return 'danger';
  if (status === 'atencion') return 'warning';
  return 'success';
}
