# ADR 0003 — Vistas del globo: Equipo y Empresas

**Estado:** Aceptado · 2026-11-01

## Decisión

El globo tiene dos tabs (Radix Tabs):

- **Equipo:** 13 nacionalidades de los compañeros de equipo. Demuestra que trabaja en español e inglés con equipos multiculturales. Marcador: punto en `--accent-2`.
- **Empresas:** sedes de las empresas donde trabajó (5 países: Colombia, Francia, Estados Unidos, Panamá y Venezuela; confirmado el 2026-11-02). Marcador: anillo en `--accent` con tooltip que lista las empresas.

Los arcos salen siempre de Cajicá, Colombia (`HOME` en `content/countries.ts`). Al cambiar de tab, los puntos hacen una transición y se recalculan los arcos.

## Confidencialidad

Nunca se muestran nombres de compañeros, proveedores, bancos ni clientes. Los nombres de empresas empleadoras sí se permiten.
