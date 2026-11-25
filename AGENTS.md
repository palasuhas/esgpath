## Next session: sync first (one-time note, added 2026-11-25)

This repo was changed on GitHub on 2026-11-25. The agent rules moved from `CLAUDE.md` into this
file (`CLAUDE.md` is now one line that loads it), and the skills, commands and plugins this repo
uses now live in `.claude/` instead of on the machine. Before any other work:

1. Pull the default branch into the local folder, and rebase any open worktree branch on it, so the
   local copy matches GitHub.
2. Pull the kit (`palasuhas/agent-context-kit`) and run
   `node <kit folder>/scripts/sync-skills.mjs .` from this repo. Commit what it changes, if anything.
3. Delete this section and push.

## Skills and plugins

The skills and commands in `.claude/` that the kit's `skill-sets.json` assigns to this repo are
copies: edit them in `agent-context-kit`, then re-run its `scripts/sync-skills.mjs` here. Plugins
are switched on in `.claude/settings.json`; none are installed machine-wide.
