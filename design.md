# doc2mcp Design System

Two themes ship together. Toggle via the theme switcher (`class="dark"`).

| Mode | Name | Source |
| :--- | :--- | :--- |
| Light | **Luminous Engine** | `DESIGN (1).md` |
| Dark | **Midnight Sanctuary** | `DESIGN (2).md` |

Tokens live in `app/globals.css` (`:root` / `.dark`). Prefer semantic classes (`bg-primary`, `text-primary`, `bg-surface-container-low`) — never hardcode Gemini blues (`#4285f4` / `#8ab4f8`).

---

## Light — Luminous Engine

**North star:** High-end editorial “command center.” Tonal depth over boxes. White space as structure.

### Surfaces (no hard 1px section borders)

| Token | Hex | Role |
| :--- | :--- | :--- |
| `surface` / page | `#f8f9ff` | Base |
| `surface-container-low` | `#eff4ff` | Sections |
| `surface-container` | `#e5eeff` | Modules |
| `surface-container-highest` | `#d3e4fe` | Floating / modals |
| `surface-container-lowest` | `#ffffff` | Lifted cards |

### Accents

| Token | Hex | Role |
| :--- | :--- | :--- |
| `primary` (Energy) | `#006d32` | CTAs, focus, links |
| `primary-container` | `#00d166` | Gradients / glow |
| `secondary` (Water) | `#00639b` | Secondary actions |
| `on-surface` | `#0b1c30` | Body text |
| `outline-variant` | `#bbcbb9` @ 10–20% | Ghost borders only |

### Typography

- **Display:** Space Grotesk (`font-display`)
- **Body:** Inter (`font-sans`)
- **Mono:** JetBrains Mono

### Rules

- Boundaries via background shifts, not opaque grey borders.
- CTAs: `primary` → `primary-container` gradient (`btn-cta-gradient`).
- Glass: semi-transparent surface + 12–20px blur.
- Shadows: tinted with `#0b1c30` at 4–8% opacity, blur 24–40px.

---

## Dark — Midnight Sanctuary

**North star:** Restorative night UI — deep charcoal, sage glow, soft blush accents.

### Surfaces

| Token | Hex | Role |
| :--- | :--- | :--- |
| `surface` | `#121412` | Base |
| `surface-card` | `#1b221b` | Cards (Dark Forest) |
| `surface-container-low` | `#1a1c1a` | Grouping |
| `surface-container` | `#1e201e` | Modules |
| `surface-container-highest` | `#333533` | Highest lift |

### Accents

| Token | Hex | Role |
| :--- | :--- | :--- |
| `primary` (Luminous Sage) | `#9eb09e` | Buttons, focus, progress |
| `secondary` | `#b9cbb9` | Soft secondary |
| `accent` (Radiant Blush) | `#f0d8d8` | Warm highlights / chips |
| `on-surface` | `#e2e3df` | Body text |
| `outline-variant` | `#444843` | Subtle edges |

### Typography

- **Display + body:** Manrope (`.dark` overrides `--font-display` and `body`)
- **Labels / meta:** JetBrains Mono

### Rules

- Depth via tonal layers + glass (80% Dark Forest + 20px blur).
- Primary buttons: sage fill, charcoal text (`primary-foreground`).
- Card edge: 1px inner highlight at ~10% white.
- Glow: sage at ~20% opacity, 24px blur.

---

## Implementation checklist

1. Put new colors in `app/globals.css` tokens — not inline hex in components.
2. Use `bg-primary` / `text-primary` / `text-primary-foreground` for brand accents.
3. Prefer `bg-surface-container-*` for section nesting (Luminous “no-line” rule).
4. Keep light and dark readable when toggling; never assume dark-only defaults for brand color.
