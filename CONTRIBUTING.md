# Contributing

Thanks for helping out! This is a small, independent project — the rules
below exist so the history stays readable and reviews stay quick.

> **Important.** This is an independent project, not an official publication
> of the Republic of Armenia. Legal texts are sourced from the Armenian Legal
> Information System ([ARLIS](https://www.arlis.am)). For the authoritative
> and most current version, consult ARLIS. Please keep that framing in any
> copy you add.

## Getting set up

```bash
npm install --include=dev   # dev deps are needed for tsc / vite / eslint
npm run dev                 # http://localhost:5173
npm run lint
npm run build               # tsc -b && vite build
```

Node 20+ is expected.

## ✍️ Commit rules

We use [Conventional Commits](https://www.conventionalcommits.org/) to keep
the history clean and readable. Every commit message starts with one of:

| Prefix      | Meaning                                                                              |
| ----------- | ------------------------------------------------------------------------------------ |
| `feat:`     | ✨ A new feature                                                                      |
| `hotfix:`   | 🚑 A critical fix                                                                     |
| `docs:`     | 📝 Documentation only changes                                                         |
| `style:`    | 💅 Changes that do not affect the meaning of the code (white-space, formatting, etc.) |
| `refactor:` | 🔨 A code change that neither fixes a bug nor adds a feature                          |
| `chore:`    | 👷 Dev setup, tooling, config or just some random task                                |
| `bugfix:`   | 🐛 A bug fix                                                                          |

Example:

```
feat: added new button component
```

Keep the subject in the imperative-ish, lower-case, no trailing period. Use
the body to explain *why* when it isn't obvious from the diff.

## 🌿 Branch naming

| Case                                             | Rule                                                                   | Example                                                                 |
| ------------------------------------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| From an Issue (preferred if an Issue exists)     | GitHub auto-adds the Issue number. Always use this when an Issue exists. | `feat/123-add-new-button-component`                                     |
| Without an Issue                                 | Standard `type/purpose` format.                                        | `feat/add-new-button-component` · `hotfix/fix-login-crash` · `bugfix/button-alignment` |

Branch from `main`, open a pull request back into `main`.

## Pull requests

- One topic per PR; small is good.
- `npm run lint` and `npm run build` must pass.
- If you touch the UI, attach a screenshot (both skins if the change is
  theme-sensitive — see *Themes* in the README).
- UI strings go through `src/lib/i18n.ts` in **both** languages. Armenian text
  must be rendered through `<Txt>` so it never lands in a Latin-only font.
- Don't add fonts that aren't open-licensed (OFL / similar).

## Data

`src/data/articles.json` is the Code as parsed from ARLIS. Please do not hand-
edit legal text; if you spot a parsing error, open an Issue with the article
number and the ARLIS reference so it can be fixed at the source.
