
---

## `README.md` for `courses-api-frontend` (React repo)

```markdown
# Courses UI - Frontend

This is the frontend built using React (Vite) to manage courses and their delivery instances. It connects to the Spring Boot REST API backend.

## Tech Stack

- React (Vite)
- TailwindCSS
- Docker

## DockerHub

- [`aarushiitiwarii/courses-api-frontend`](https://hub.docker.com/r/aarushiitiwarii/courses-api-frontend)

## Run via Docker

This frontend is meant to be launched using `docker-compose.yml` from the backend repo.

Or you can run it standalone:

```bash
docker run -p 5173:5173 aarushiitiwarii/courses-api-frontend
