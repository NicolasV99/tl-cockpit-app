# TL Cockpit — Luxury Presence

Central hub for Team Leaders on the PET (Product Experience Team). Reúne en un solo lugar todas las herramientas, alertas automáticas y recursos que un TL usa en su día a día — sin tener que buscar links en Slack, Coda o bookmarks.

---

## Qué incluye

### Alerts & Reports — Auggie Automations
Alertas automáticas que Auggie publica en Slack. Desde aquí se puede acceder directo al canal correspondiente.

| Tool | Descripción |
|---|---|
| **Draft Deadline Alerts** | Notifica tareas que se acercan a su due date en `#pet-pro-draft-deadline-alerts` |
| **WB Report Alerts** | Reporte de Website Drafts por Web Builder en `#wb-report-alerts` |

### Win Back Sites — Coda Docs
Tracking de Win Back Sites con breakdown por Web Builder.

| Tool | Descripción |
|---|---|
| **Win Back Sites Report** | Doc en Coda con el estado de cada WB site y quién lo tiene asignado |

### TL Reports — Claude Artifacts
Herramientas interactivas construidas en Claude para generar reportes del equipo.

| Tool | Descripción |
|---|---|
| **TL Report Generator** | Genera reportes estructurados de Team Lead con datos de performance |
| **WB Available Workforce Hub** | Muestra el status de disponibilidad de cada Web Builder por TL |
| **EOW Performance Reviewer** | Sube un CSV y genera el reporte de performance de fin de semana automáticamente |

---

## Funcionalidades de la UI

- **Sidebar de navegación** — filtra por sección (All Tools / Alerts & Reports / Win Back Sites / TL Reports)
- **Toggle Grid / List** — cambia entre vista de cards o filas compactas
- **Dark / Light mode** — dark por defecto, persiste en `localStorage`
- **Live indicator** — muestra que las alertas de Auggie están activas

---

## Stack

- [Next.js 15](https://nextjs.org) — App Router
- [Tailwind CSS v4](https://tailwindcss.com)
- [next-themes](https://github.com/pacocoursey/next-themes) — theme switching

---

## Correr en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).
