# React Quarkus MinIO

Project นี้เป็น monorepo สำหรับ Web Application ที่แยก Frontend และ Backend ออกจากกัน

- Frontend: React + TypeScript + Vite
- Backend: Quarkus
- Container Runtime: Podman
- Image Registry: GitHub Container Registry หรือ GHCR
- CI/CD: GitHub Actions
- Server: Ubuntu 24.04

---

## Project Structure

```text
react-quarkus-minio/
├─ frontend/
│  ├─ package.json
│  ├─ vite.config.ts
│  └─ src/
│
├─ backend/
│  ├─ pom.xml
│  └─ src/
│
├─ Containerfile.frontend
├─ Containerfile.backend
│
└─ .github/
   └─ workflows/
      ├─ cd-frontend.yml
      └─ cd-backend.yml