# CureAlly — Handoff final de `planning`

Última actualización: 3 de septiembre de 2026
Repositorio: `cureally_proto_alta`
Rama activa y desplegable: `planning`
Último commit funcional previo a este handoff: `ab9db2a` (`Unify family profile experience`)

## 1. Objetivo y estado actual

CureAlly es un prototipo mobile-first para una tesis sobre coordinación colaborativa del cuidado de personas mayores. El MVP permite demostrar, dentro de una misma aplicación, experiencias diferenciadas para familiares y cuidadores profesionales.

La versión de `planning` es la base vigente del prototipo y la rama utilizada por el despliegue de Cloudflare. No se incorporaron backend, autenticación real, persistencia remota ni integraciones externas.

Principios de producto preservados:

- Familiar: “¿Cómo está el cuidado?”
- Cuidador: “¿Qué tengo que hacer ahora?”
- Una acción operativa registrada por un cuidador se refleja en la supervisión familiar mientras la aplicación siga abierta.
- La interfaz utiliza español, una estética cálida en crema y verde azulado, tarjetas compartidas y navegación mobile-first.

## 2. Arquitectura y tecnologías

- React 19
- TypeScript
- Vite
- React Router
- Context providers y estado local de React
- `localStorage` únicamente para recordar el usuario demo seleccionado
- CSS tradicional con tokens y componentes visuales compartidos
- Sin backend ni base de datos

Archivos centrales:

- `src/app/main.tsx`: composición de providers y router.
- `src/app/router.tsx`: rutas públicas, familiares, de coordinación y de cuidadores.
- `src/app/auth.tsx`: sesión demo, selección de usuario y guards por rol.
- `src/app/care-store.tsx`: estado compartido de actividades, tareas, alertas, medicación, novedades, informes y stock.
- `src/types/domain.ts`: tipos de dominio.
- `src/data/mockData.ts`: personajes, datos de Juan y contenido inicial.
- `src/styles/tokens.css` y `src/styles/components.css`: sistema visual.

## 3. Identidades canónicas

No utilizar nombres como claves relacionales. Las asociaciones se realizan con IDs (`careMemberId`, `responsableId`, `cuidadorId`, `actorId`, etc.).

- Juan Pérez: persona cuidada, 76 años, diagnóstico mock de Alzheimer.
- Carina: hija y familiar responsable; coordinadora principal.
- Diego: hijo y familiar participante de la red.
- María: cuidadora profesional.
- Pedro: cuidador profesional.

Juan aparece exclusivamente como persona cuidada. No existe un segundo integrante familiar llamado Juan.

## 4. Login y sesión demo

El login no usa credenciales. La pantalla permite elegir visualmente:

- Carina — Familiar responsable.
- Diego — Familiar.
- María — Cuidadora profesional.
- Pedro — Cuidador profesional.

La selección establece identidad y rol y redirige a la experiencia correspondiente. Cambiar de perfil mediante “Cerrar sesión” mantiene el store compartido durante la misma ejecución. Recargar la página reinicia los datos mock, aunque la identidad demo queda recordada por `localStorage`.

## 5. Rutas y navegación

Públicas:

- `/` — Bienvenida.
- `/login` — Selección de perfil demo.

Compartidas con autenticación:

- `/messages`
- `/messages/:conversationId`
- `/patient-profile`

Familiares:

- `/home`
- `/calendar`
- `/alerts`
- `/stock`
- `/reports`
- `/reports/:reportId`
- `/profile`

Exclusivas de Carina mediante `RequireCoordinator`:

- `/calendar/add`
- `/tasks`

Cuidadores:

- `/caregiver/home`
- `/caregiver/tasks`
- `/caregiver/log`
- `/caregiver/profile`
- `/caregiver/agenda`
- `/caregiver/stock`

La navegación inferior conserva cuatro pestañas por rol. Agenda y Stock se presentan como accesos rápidos en la experiencia cuidadora para evitar sobrecargarla.

## 6. Experiencia familiar

### Carina — coordinación principal

Puede:

- supervisar estado general, agenda, tareas, alertas, informes y stock;
- crear actividades y medicaciones;
- asignar o reasignar responsables;
- solicitar confirmaciones;
- consultar registros realizados por cuidadores;
- registrar compras o reposiciones;
- comunicarse con la red;
- consultar y navegar la red de cuidado.

No puede marcar tareas operativas ni registrar una medicación como administrada en nombre del cuidador.

Su perfil muestra avatar, rol, badge “Coordinadora principal”, Juan como persona cuidada, métricas de coordinación, accesos relevantes y preferencias de notificaciones.

### Diego — familiar colaborador

Puede:

- consultar el estado del cuidado, agenda, alertas e información de Juan;
- acceder a mensajes y a la red de cuidado;
- consultar stock y movimientos;
- registrar compras o reposiciones.

No tiene accesos para gestionar responsables, crear planificación, reasignar tareas ni solicitar confirmaciones administrativas.

Su perfil utiliza el mismo lenguaje visual, con badge “Miembro de la red” y accesos acotados a Datos de Juan, Red de cuidado, Stock e insumos y Mensajes.

## 7. Experiencia del cuidador

María y Pedro comparten la misma arquitectura y reciben contenido filtrado por su `careMemberId`.

El Inicio “Mi turno” incluye:

- saludo e identidad;
- tarjeta de Juan con la misma foto usada por la experiencia familiar;
- estado del turno;
- próxima medicación;
- acciones rápidas operativas;
- tareas pendientes;
- agenda del día;
- alertas relevantes ordenadas por prioridad;
- accesos de consulta a Agenda y Stock.

Pueden:

- consultar y completar sus tareas;
- registrar una medicación asignada como administrada;
- agregar una novedad u observación;
- completar un informe diario;
- acceder a mensajes;
- consultar la información de Juan en modo lectura;
- consultar el calendario compartido e identificar actividades propias;
- consultar stock y últimos movimientos;
- registrar una reposición si realizaron una compra;
- señalar un faltante, generando una alerta compartida.

No pueden:

- gestionar la red;
- crear o reorganizar la planificación general;
- reasignar responsables;
- modificar la información de Juan;
- acceder a acciones administrativas de Carina.

El perfil cuidador muestra avatar, rol, turno activo, Juan asociado, métricas, accesos a Datos de Juan, registros, mensajes y Mi turno, más permisos resumidos visualmente.

## 8. Estado compartido y flujo demostrable

El flujo principal previsto para la demo es:

1. Carina asigna o supervisa.
2. María o Pedro consultan su turno.
3. El cuidador ejecuta y registra.
4. Carina o Diego visualizan la actualización.

Ejemplos implementados:

- Cuidador completa una tarea → aparece confirmada para la familia.
- Cuidador administra medicación → se registra la acción y la familia la ve.
- Cuidador agrega una novedad → aparece en el Inicio familiar.
- Cuidador completa un informe → aparece en Informes.
- Familiar o cuidador registra una reposición → cambia el stock y queda trazabilidad del autor.
- Cuidador administra medicación → disminuye una unidad del producto asociado y se genera un movimiento negativo.
- Cuidador señala faltante → se agrega una alerta para la red.

## 9. Stock y trazabilidad

La pantalla de Stock maneja medicamentos e insumos con cantidades simples, estados visuales y últimos movimientos.

Cada movimiento registra:

- producto mediante `stockItemId`;
- cantidad positiva o negativa;
- tipo (`reposicion` o `administracion`);
- autor mediante `actorId`;
- observación opcional;
- referencia temporal mock.

No incluye compras online, farmacias, lotes, vencimientos, reservas ni gestión avanzada de inventario.

## 10. Alertas

Las alertas se ordenan siempre por:

1. Alta.
2. Media.
3. Baja.

Dentro de la misma severidad se utiliza horario/recencia como segundo criterio. El helper compartido está en `src/features/alerts/alertSorting.ts` y se usa tanto en el centro familiar como en el Inicio cuidador.

## 11. Pantallas y componentes relevantes

- `src/features/home/HomeScreen.tsx`: dashboard familiar.
- `src/features/caregiver/CaregiverHomeScreen.tsx`: dashboard operativo.
- `src/features/caregiver/CaregiverTasksScreen.tsx`: tareas propias.
- `src/features/caregiver/CaregiverLogScreen.tsx`: medicación, novedades e informe.
- `src/features/caregiver/CaregiverProfileScreen.tsx`: perfil cuidador.
- `src/features/profile/ProfileScreen.tsx`: perfil adaptado para Carina y Diego.
- `src/features/calendar/CalendarScreen.tsx`: calendario familiar y agenda cuidadora en modo consulta.
- `src/features/stock/StockScreen.tsx`: stock compartido y trazabilidad.
- `src/features/patient/PatientProfileScreen.tsx`: información de Juan y red de cuidado.
- `src/components/cards/ActivityList.tsx`: actividades y señalización de responsable.
- `src/components/cards/AlertList.tsx`: presentación ordenada de alertas.
- `src/components/cards/QuickAccessGrid.tsx`: accesos visuales reutilizados entre roles.
- `src/components/navigation/BottomNav.tsx`: navegación diferenciada por rol.

## 12. Decisiones de alcance

Fuera del MVP actual:

- backend y persistencia real;
- autenticación productiva;
- historial de salud avanzado;
- integraciones con prepagas, HealthTech o farmacias;
- telemedicina;
- inteligencia artificial;
- pagos o compras online;
- inventario avanzado;
- mejoras generales de mensajería ajenas al flujo de coordinación.

## 13. Limitaciones conocidas

1. El estado funcional vive en memoria y se reinicia al refrescar.
2. La sesión demo se recuerda, pero no existen usuarios ni permisos de servidor.
3. Las fechas y “hoy” están fijadas en `DEMO_TODAY = 2026-05-13` para que la tesis tenga una demostración predecible.
4. Los horarios y textos de recencia son mock.
5. El aviso de faltante es deliberadamente simple y genera una alerta; no abre un flujo de resolución.
6. La foto de Juan es un asset local grande y podría optimizarse si el peso del bundle se vuelve relevante.
7. No hay suite automatizada de tests; las validaciones disponibles son ESLint, TypeScript/Vite build y revisión manual de recorridos.

## 14. Validación y ejecución local

Comandos:

```bash
npm install
npm run dev
npm run lint
npm run build
```

Vite utiliza normalmente `http://localhost:5173/`; durante la última revisión local se utilizó `http://127.0.0.1:5188/` para evitar conflictos con otros proyectos.

Antes del cierre de este handoff se validaron visualmente:

- selección de los cuatro perfiles;
- Inicio y Perfil de Carina, Diego, María y Pedro;
- límites de permisos de Diego y cuidadores;
- agenda cuidadora en modo consulta;
- orden de alertas;
- reposiciones familiares y cuidadoras;
- señalamiento de faltante;
- administración de medicación y descuento de stock;
- reflejo de acciones entre roles durante la misma sesión.

## 15. Commits funcionales de esta evolución

- `41968b7` Add demo roles and normalize care identities
- `0aaef68` Build caregiver dashboard and operational flows
- `351d384` Reflect caregiver records in family experience
- `d74c6db` Tighten shared role boundaries and caregiver links
- `5f7fd86` Align thesis identities and add stock traceability
- `7ad97d8` Refine caregiver navigation and visual continuity
- `ab9db2a` Unify family profile experience

## 16. Invariantes para continuar

Salvo instrucción explícita, preservar:

- `planning` como base de trabajo y rama desplegable;
- Juan exclusivamente como persona cuidada;
- Carina como coordinadora principal;
- Diego como familiar colaborador;
- María y Pedro como cuidadores profesionales;
- relaciones por ID, no por nombre;
- separación entre supervisión familiar y ejecución cuidadora;
- estado compartido dentro de la misma sesión;
- navegación inferior de cuatro pestañas;
- estética cálida y consistente entre roles;
- alcance de prototipo de tesis sin sobrearquitectura.
