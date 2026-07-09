# Story 10: Add Local Observability Baseline

## Goal

Start basic logs, health checks, metrics, and dashboard early.

## Tasks

- Add structured JSON logs.
- Add request/correlation ID middleware.
- Add `/health` endpoint per service.
- Add basic `/metrics` endpoint if using Prometheus.
- Add OpenTelemetry Collector container.
- Add Grafana container.
- Add basic dashboard.
- Document how to view logs and dashboards.

## Acceptance Criteria

- Logs show request/correlation ID.
- Health endpoints work.
- Grafana dashboard is accessible locally.
- At least one service emits basic telemetry.

## Suggested Labels

`story`, `observability`, `grafana`, `otel`

