# CureAlly Handoff (Branch: `planning`)

Last updated: May 14, 2026  
Repository: `cureally_proto_alta`  
Active branch: `planning`  
Latest commit on branch: `b9072f7` (`Polish welcome screen and integrate CureAlly logo`)

## 1) Project intent and current product framing

This is a **mobile-first, low-fidelity but polished** React + Vite + TypeScript prototype for **CureAlly**.

Primary user flow is **family member coordination** (María supervising her father Juan’s care), not direct caregiver task execution.

Key product messaging across implemented UX:
- clarity
- organization
- trust
- calm

All UI copy is in Spanish.

## 2) High-level architecture

- Framework: React 19 + React Router + Vite
- State: local React state + context providers (no backend)
- Auth: mocked login + `localStorage` session flag
- Design system: CSS tokens + shared component classes

Main wiring:
- [src/app/main.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/app/main.tsx)
- [src/app/router.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/app/router.tsx)
- [src/app/auth.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/app/auth.tsx)
- [src/app/care-store.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/app/care-store.tsx)

## 3) Route map and navigation behavior

Public:
- `/` → Welcome
- `/login` → Login

Protected (inside `RequireAuth` + `AppShell`):
- `/home`
- `/messages`
- `/calendar`
- `/tasks`
- `/alerts`
- `/profile`

Bottom nav is intentionally 4 tabs (family flow):
- Inicio
- Mensajes
- Alertas
- Perfil

`Tareas` and `Calendario` are intentionally accessed from Home quick-access cards (not bottom tabs).

## 4) Auth/session behavior

Demo credentials:
- Email: `maria@cureally.com`
- Password: `123456`

Behavior:
- Valid credentials set `localStorage` key `cureally:isAuthenticated = true`
- `RequireAuth` redirects unauthenticated access to `/login`
- Logout from Perfil clears auth and navigates to `/` (Welcome), not directly Login

File:
- [src/app/auth.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/app/auth.tsx)

## 5) Shared data model and mock content

Types:
- [src/types/domain.ts](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/types/domain.ts)

Mock source:
- [src/data/mockData.ts](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/data/mockData.ts)

Important current mock decisions:
- Patient: Juan Pérez (76, Alzheimer)
- Care network: María (familiar responsable), Carolina (cuidadora), Juan (Padre)
- Alerts are family-oriented (missing confirmations, upcoming appointment, new report)
- Tasks include caregiver-responsible statuses (`sin_confirmar`, `pendiente`, `confirmada`)

## 6) Screen-by-screen implementation status

### Welcome
- Replaced old `CA` placeholder with logo image:
  - [public/cureally-logo.svg](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/public/cureally-logo.svg)
- Improved vertical hierarchy and polish while keeping warm cream/teal style.
- Files:
  - [src/features/welcome/WelcomeScreen.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/features/welcome/WelcomeScreen.tsx)
  - [src/styles/components.css](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/styles/components.css)

### Login
- Spanish copy
- Demo credentials prefilled
- Validation with mocked auth only
- No real account recovery/signup; shows helper errors
- File: [src/features/auth/LoginScreen.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/features/auth/LoginScreen.tsx)

### Home (`Inicio`)
- Family-oriented header: “Estado de cuidado de Juan”
- Includes:
  - patient summary card
  - Estado de hoy card
  - quick-access grid (Calendario/Tareas/Alertas/Perfil)
  - Próximas actividades list
- Standalone “Próxima actividad” card was intentionally removed to avoid duplication.
- Activity detail bottom sheet now opens from each activity in the list via “Ver detalle”.
- File: [src/features/home/HomeScreen.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/features/home/HomeScreen.tsx)

### Calendar
- Month navigation arrows added (prev/next month)
- Selected-day agenda list
- “+ Agregar actividad o medicación” opens bottom sheet with mocked form:
  - Tipo
  - Nombre (placeholder changes by type)
  - Custom time selector (hour/minute/am-pm, no native time picker)
  - Responsable dropdown (Carolina/Pedro/María)
  - Repetición + Duración + Fecha finalización (conditional)
  - Nota opcional
- Saves in-memory and shows success feedback
- Basic recurrence display is handled in activity metadata
- File: [src/features/calendar/CalendarScreen.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/features/calendar/CalendarScreen.tsx)

### Tasks
- Family-oriented behavior (no direct completion by María)
- Actions:
  - Solicitar confirmación
  - Ver detalle (modal)
  - Contactar cuidador (routes to Messages compose)
- Read-only caregiver daily report card
- File: [src/features/tasks/TasksScreen.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/features/tasks/TasksScreen.tsx)

### Alerts
- Family-oriented alert center
- Alert examples and actions:
  - Solicitar confirmación
  - Contactar cuidadora (routes to Messages compose)
  - Ver calendario
  - Ver informe (bottom sheet)
- High-priority (`Alta`) alerts now visually emphasized with soft danger tint/border/icon.
- Files:
  - [src/features/alerts/AlertsScreen.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/features/alerts/AlertsScreen.tsx)
  - [src/components/cards/AlertList.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/components/cards/AlertList.tsx)

### Messages
- Main section in bottom nav (replacing Tareas tab)
- Conversation list with avatar/name/role/preview/time/status
- Card action simplified to only “Abrir conversación”
- “Nuevo” status badge now green (not red)
- Top “Enviar nuevo mensaje” button removed
- Conversation bottom sheet supports sending messages in-thread
- Compose sheet still exists and is used when coming from Tasks/Alerts `Contactar` actions via route state
- File: [src/features/messages/MessagesScreen.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/features/messages/MessagesScreen.tsx)

### Profile
- Patient info + care network + profile action cards
- Role correction applied in care network mock (`Juan` as `Padre`)
- Added `Cerrar sesión` destructive action
- File: [src/features/profile/ProfileScreen.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/features/profile/ProfileScreen.tsx)

## 7) Important reusable components

- Activity detail + optional modal behavior:
  - [src/components/cards/ActivityList.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/components/cards/ActivityList.tsx)
- Tasks list:
  - [src/components/cards/TaskList.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/components/cards/TaskList.tsx)
- Alerts list:
  - [src/components/cards/AlertList.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/components/cards/AlertList.tsx)
- App shell / persistent frame:
  - [src/components/layout/AppShell.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/components/layout/AppShell.tsx)
  - [src/components/layout/PatientContextStrip.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/components/layout/PatientContextStrip.tsx)
- Bottom nav:
  - [src/components/navigation/BottomNav.tsx](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/components/navigation/BottomNav.tsx)

## 8) Visual system and spacing notes

Tokens:
- [src/styles/tokens.css](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/styles/tokens.css)

Main style file:
- [src/styles/components.css](/Users/catalinadearzubiagamenghi/Documents/cureally/proto_alta/src/styles/components.css)

Current design direction:
- cream canvas
- white/cream cards
- teal accents
- subtle borders/shadows
- soft but professional surfaces

Recent layout fix:
- Reduced excessive blank area above bottom nav by changing `app-shell__content` bottom padding.

## 9) Known caveats / technical debt to be aware of

1. `AuthProvider` exposes `loginDemoMode` but it is currently unused in UI.
2. `CareStore` still has `confirmAlert` method from earlier behavior; current Alerts flow doesn’t use it.
3. `ProximaActividadCard` component exists but Home currently no longer uses it (kept in repo).
4. “Today” in Home is currently hardcoded to `2026-05-13` for predictable prototype output.
5. Data is in-memory (except auth localStorage). Refresh resets activities/tasks/alerts to mock defaults.

## 10) QA state at handoff

Most recent checks run successfully:
- `npm run lint`
- `npm run build`

No automated test suite is configured beyond lint/build.

## 11) How to run locally

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:5173/`

## 12) Recent commit history (most relevant)

- `b9072f7` Polish welcome screen and integrate CureAlly logo
- `689cb91` Refine family flow navigation, alerts, and messages UX
- `b683cd9` Refactor alerts into family-oriented coordination flow
- `f35a43a` Add functional task detail and caregiver contact modals
- `486ec63` Polish UI and enhance calendar flow with month nav and recurrence
- `8cdc789` refine login spacing and warm visual system polish
- `f820daf` add implementation

## 13) Practical continuation guidance for next agent

If new requests come in, preserve these invariants unless explicitly changed by user:
- Spanish UI text
- family coordinator role framing (María does not directly mark caregiving tasks as completed)
- 4-tab bottom nav (`Inicio`, `Mensajes`, `Alertas`, `Perfil`)
- `Tareas` and `Calendario` reachable from Home quick access
- cream + teal warm style
- low-fidelity but polished, professional visual tone

For future screen polish, prefer editing shared classes in `components.css` over per-screen one-off rules unless the request is intentionally screen-specific.

