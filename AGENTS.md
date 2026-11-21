# AGENTS.md

Le istruzioni complete del progetto sono in `CLAUDE.md`.

## Application architecture

- Keep hackathon content in separate `src/data` modules and user choices in the shared client context; the demo must not call a backend.
- Read and write localStorage only after hydration or from event handlers; this keeps the initial render SSR-safe.
- Each navigation destination has a dedicated TanStack route with its own head metadata so direct links remain usable.
- Keep Factanza presentation tokens and reusable visual rules in the global stylesheet and use the facta Button variant for actions.
- Keep category slugs, names and pop-art icons (`src/assets/categorie/*.png`) in one catalog; category pages use all matching mock news independently of personalized home interests.
- Follow the visual system documented in `CLAUDE.md`: tokens and shared components only, pop-art category icons instead of generic icons.
