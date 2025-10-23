MyWebsite_Docker

A personal website built with Flask and prepared to run in Docker.

## Developing in GitHub Codespaces

To run this site inside a Codespace (or any remote devcontainer):

1. Create a Codespace from this repository (GitHub -> Code -> Codespaces -> New codespace).
2. The devcontainer will build from the repository Dockerfile and forward port 5000.
3. The container runs `python app.py` automatically on start; if not, open the terminal and run the `Run Flask (dev)` task (Terminal -> Run Task).
4. In the Codespaces preview or forwarded ports panel, open http://localhost:5000 to view the site.

Notes:
- The devcontainer installs requirements from `requirements.txt` during creation.
- If you need to persist state for SQLite or other files, make sure they are in the workspace folder.
