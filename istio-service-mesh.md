# Task 5: Istio Service Mesh – Knowledge Assessment

## 1. Role of Istio in Kubernetes & Sidecar Proxy Model

Istio is a service mesh that enhances Kubernetes networking by providing:

- Secure service-to-service communication using mTLS
- Advanced traffic management (retries, timeouts, traffic splitting)
- Observability (metrics, logs, distributed tracing)
- Policy enforcement (authorization and access control)

Istio uses the sidecar proxy model. An Envoy proxy is injected as a sidecar container into each pod. All inbound and outbound traffic flows through this proxy using iptables redirection.

This allows Istio to:

- Encrypt traffic automatically with mutual TLS
- Apply routing rules without modifying application code
- Collect telemetry consistently across services
- Enforce security and authorization policies centrally

Compared to application-level networking, Istio removes the need to implement retries, TLS, logging, and resilience logic inside each service, separating networking concerns from business logic.

---

## 2. PeerAuthentication vs AuthorizationPolicy

### PeerAuthentication

PeerAuthentication controls how services authenticate each other, primarily configuring mTLS mode.

Modes include:
- PERMISSIVE
- STRICT
- DISABLE

To enforce strict mTLS across all services in a namespace:

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: secure-app
spec:
  mtls:
    mode: STRICT
```

This ensures that all service-to-service communication within the namespace uses mutual TLS encryption.

---

### AuthorizationPolicy

AuthorizationPolicy controls who is allowed to access a service after authentication succeeds.

It defines:
- Allowed identities (service accounts)
- HTTP methods
- Paths
- Conditions

Example allowing only the frontend service account to access the backend:

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: backend-policy
  namespace: secure-app
spec:
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/secure-app/sa/frontend"]
```

PeerAuthentication handles encryption and identity verification.  
AuthorizationPolicy enforces access control rules.

---

## 3. Traffic Management & Canary Deployment

Istio separates traffic routing from Kubernetes Services using:

- DestinationRule
- VirtualService

### DestinationRule

Defines subsets (versions) of a service.

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: backend
spec:
  host: backend
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
```

### VirtualService (Canary Example)

Route 90% of traffic to version v1 and 10% to version v2:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: backend
spec:
  hosts:
  - backend
  http:
  - route:
    - destination:
        host: backend
        subset: v1
      weight: 90
    - destination:
        host: backend
        subset: v2
      weight: 10
```

This enables progressive rollout without modifying application code. Traffic distribution can be gradually adjusted to shift more traffic to the new version.

---

## 4. Istio Ingress Gateway vs Kubernetes Ingress

### Kubernetes Ingress

- Provides basic HTTP and HTTPS routing
- Requires an Ingress controller (e.g., NGINX)
- Limited traffic management capabilities

### Istio Ingress Gateway

- Built on Envoy proxy
- Fully integrated with the service mesh
- Supports advanced features such as:
  - mTLS
  - Traffic splitting
  - JWT validation
  - Rate limiting
  - Circuit breaking
  - Canary deployments

The Istio Ingress Gateway acts as a programmable entry point into the mesh and provides significantly more control than a standard Kubernetes Ingress controller.

---

## 5. Observability with Istio

Istio improves observability automatically via Envoy sidecars.

### Prometheus

Istio exposes metrics such as:

- Request count
- Request latency
- Error rate
- mTLS status

Prometheus scrapes these metrics from Envoy proxies.

### Grafana

Grafana visualizes:

- Service-to-service traffic
- Success and error ratios
- Workload health
- Latency distributions

Istio provides built-in dashboards for quick insights.

### Jaeger (Distributed Tracing)

Envoy proxies generate trace spans automatically.

Jaeger enables:

- End-to-end request tracing
- Latency breakdown per service
- Root cause analysis
- Identification of bottlenecks

This observability is achieved without modifying application code.

---

## Summary

Istio enhances Kubernetes by providing:

- Zero-trust service communication through mTLS
- Fine-grained traffic control
- Centralized policy enforcement
- Built-in observability
- Support for progressive delivery strategies such as canary deployments

By separating networking from application logic, Istio improves security, resilience, and operational visibility in microservices environments.
