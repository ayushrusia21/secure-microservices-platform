# Secure Microservices Platform

## Overview

This project demonstrates a production-grade, secure, and observable microservices platform deployed on Kubernetes.

It includes:

- Frontend (React + Nginx)
- Backend (Node.js + Express)
- PostgreSQL (StatefulSet)
- GitHub Actions CI/CD
- ArgoCD GitOps
- Prometheus + Grafana Monitoring
- Loki Logging
- Jaeger Distributed Tracing
- RBAC & Pod Security Standards
- Sealed Secrets
- Network Policies

---

# Architecture

Architecture diagram will be available in docs folder.

---

# Task 1 – Kubernetes

- Deployments for frontend & backend
- StatefulSet for PostgreSQL
- HPA for backend
- Resource limits & requests
- Liveness & readiness probes
- Pod Disruption Budget
- Network Policies
- TLS Ingress

---

# Task 2 – CI/CD

- Linting & Testing
- Docker build & push
- Trivy image scanning
- ArgoCD GitOps deployment
- Automated rollback capability

---

# Task 3 – Observability

- Prometheus monitoring
- Grafana dashboards
- Loki centralized logging
- Jaeger tracing
- Alert rules
- Defined SLO (99% availability)

---

# Task 4 – Security

- RBAC roles
- Pod Security Standards (baseline)
- Sealed Secrets
- Network segmentation
- TLS encryption
- Image vulnerability scanning

---

# Conclusion

This platform demonstrates secure, automated, observable Kubernetes infrastructure following production-grade best practices.

---

# Screenshots

## Running Pods
![Running Pods](docs/pods.png)

## Horizontal Pod Autoscaler
![HPA](docs/hpa.png)
