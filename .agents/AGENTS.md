# Project Rules & Guidelines for Viet-Interview

## Git & Deployment Rules
- This project utilizes two remote Git repositories that MUST be kept in sync at all times:
  - **Private Repository (origin)**: `https://github.com/phoductien/app-phong-van.git` (Linked directly to Vercel and Render for automatic deployments).
  - **Public Repository (public_repo)**: `https://github.com/phoductien/App_Phong_Van.git` (Used as the public code version).
- **Rule**: Whenever you commit and push changes, you MUST push to BOTH remotes to prevent drift:
  ```bash
  git push origin main
  git push public_repo main --force
  ```
- **Rule (Token Optimization & Commit Batching)**:
  - To save tokens and execution costs, avoid committing and pushing after every minor file change.
  - Instead, perform all required edits first, update the session memory (`.agent/workflows/session_memory.md`), and only perform a single consolidated `git commit` and `git push` to both remotes at the very end of your task/turn.

