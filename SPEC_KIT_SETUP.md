# Spec Kit setup

This project includes its initial constitution at `.specify/memory/constitution.md`.

To finish installing the official Spec Kit command templates, run these commands in a normal PowerShell session where Python 3.11+ and `uv` are available:

```powershell
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
cd architectural-portfolio
specify init . --integration codex --script ps --force
```

Then use Codex's `$speckit-*` commands to specify, plan, task, and implement future changes. Keep the existing constitution when prompted.
