## Next session: sync first (one-time note, added 2026-11-25)

This repo was changed on GitHub on 2026-11-25. The agent rules moved from `CLAUDE.md` into this
file (`CLAUDE.md` is now one line that loads it), and the skills, commands and plugins this repo
uses now live in `.claude/` instead of on the machine. Before any other work:

1. **This repo's history was rewritten on 2026-11-25** (personal emails replaced by the GitHub
   no-reply address). Never `git pull` a copy made before that: it would merge the old history back.
   Save any uncommitted work, then `git fetch` and `git reset --hard origin/<default branch>`, and
   rebuild any old local branch with `git cherry-pick` onto it. Never push an old branch.
   The three third-party skills listed in `.gitignore` are local-only here: the sync brings them.
2. Pull the kit (`palasuhas/agent-context-kit`) and run
   `node <kit folder>/scripts/sync-skills.mjs .` from this repo. Commit what it changes, if anything.
3. Delete this section and push.

## Skills and plugins

The skills and commands in `.claude/` that the kit's `skill-sets.json` assigns to this repo are
copies: edit them in `agent-context-kit`, then re-run its `scripts/sync-skills.mjs` here. Plugins
are switched on in `.claude/settings.json`; none are installed machine-wide.
