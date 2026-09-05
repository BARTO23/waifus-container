# Gentle AI — Capacidades y uso diario

Gentle AI es una capa de workflow sobre Claude Code, no un modelo aparte. Resumen de qué hace y cómo se usa en este proyecto.

## Memoria persistente (Engram)
Guarda decisiones, bugs y convenciones entre sesiones automáticamente. No hace falta pedirlo.

## SDD (Spec-Driven Development)
Para features grandes: explorar → proponer → especificar → diseñar → tareas → implementar → verificar → archivar.
- `/gentle-sdd-new` — arranca el ciclo completo
- `/gentle-sdd-ff` — salta directo a las tareas (fast-forward)

Es **opcional**: solo se usa cuando el cambio lo amerita, no reemplaza el trabajo directo para tareas chicas.

## RDD (Receipt-Driven Development)
Sistema de revisión con recibos/lineage antes de entregar cambios. **Apagado por default** — se activa explícitamente:
```
gentle-ai review mode enable|disable|status
```
Nunca se activa solo.

## Judgment Day
Revisión adversarial ciega: dos jueces independientes revisan el mismo código sin verse entre sí, después se concilian los hallazgos.
- `/judgment-day`

## Skills puntuales
- `branch-pr` — armar PRs
- `comment-writer` — comentarios de review
- `chained-pr` — dividir PRs grandes
- `issue-creation` — crear/triagear issues

## Cómo se usa en el día a día
- Tareas chicas o mecánicas: se resuelven directo.
- Si hace falta leer 4+ archivos o escribir varias cosas no triviales: se delega en un sub-agente para no inflar el contexto.
- SDD, RDD y Judgment Day son herramientas que se piden explícitamente cuando el caso lo amerita — no se activan solas.
