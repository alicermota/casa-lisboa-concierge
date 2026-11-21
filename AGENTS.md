<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- The 3D tram (`src/features/guest/tram3d/`) is the main experience whenever motion is allowed and WebGL works: one fixed click-through canvas, path keys built from live section positions in `path.ts` (desktop side lanes reserved by `.tram-lane`/`.tram-lane-r`; phones cross only in the gaps between sections). The 2D layered tram in `src/features/guest/tram/` is the fallback for reduced motion, no WebGL or a 3D error. One flag in `tram/config.ts` turns both off. Why: the tram never covers content and the page works without it.
- 3D tram work lives in `src/features/guest/tram3d/` (React Three Fiber). `TramModel` exposes named parts (wheels, head, waveArm, body) so a hand-made GLB with the same parts can replace the procedural prototype; `/tram-lab` is the isolated test page. Why: the movement is built and tested independently of the final model.
