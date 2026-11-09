# Milestone 1 art bible and provenance

Style: original top-down, three-quarter pixel art. Gameplay sprites use crisp 32px canvases at 2× scale. Palette: ink #10121C, floor #252938, stone #42485A, gold #D6A85C, cyan #50D9E8, purple #9C67E8, crimson #CA425B, text #F2EBDC. Kael follows the master specification's hooded warden design rather than the orange-coated reference character.

## Generated image

- `public/assets/ui/title-art.png`: 1536×1024 original host ImageGen illustration, used on the title screen. No downloaded stock assets.
- Prompt: Create original game title background artwork, landscape 1536x1024. High-quality dark fantasy pixel art, crisp pixel clusters with limited palette navy #10121C, stone #252938, ancient gold #D6A85C, arcane cyan #50D9E8. A tiny solitary hooded warden with dark navy cloak, gold belt, leather boots, face hidden except two cyan eyes, holding glowing cyan magical focus stands on right third in an ancient ruined underground crypt. Enormous carved arch behind him, cyan runes, stone stairs, orange candles and dust. Atmospheric dramatic lighting, polished indie game key art. Left half very dark with subtle stone detail and empty negative space for game title overlaid by code. No text, no letters, no logo, no watermark. This is an illustration not a sprite sheet.
- No separate negative-prompt parameter; exclusions are in the prompt. No paid third-party provider was invoked.

## Procedural alternatives (integrated)

- 56 Kael frames: four directions × (4 idle + 6 walk + 4 cast).
- Four Hollow Crawler crawling frames; hurt uses a white flash and death uses scattered bone-colored particles.
- Eight 48×48 floor tiles, 48×64 pillar, 24×32 urn, 16×16 arcane orb, 4×4 spark, and 32×12 ground shadow.
- Walls, arch, ritual marking, torches, HUD, panels, targeting reticle and portal are drawn by code.
- Sound effects use oscillator synthesis. No recorded audio or soundtrack is included.
- Sprite source: `src/art/textures.js`; environment source: `src/art/room.js`. Exported PNGs are exact copies of runtime textures. Texture exports total 73 PNGs.

## Tool limitation

The requested Game Development Studio asset-production skill was read and its local execution requirements inspected. The plugin is skills-only; the required `game-dev` executable was not present on PATH and no executable is bundled with the installed plugin. Consequently its CLI capabilities/doctor, provider jobs, canonical package build and package verification could not run. This project does not claim Game Development Studio-generated or package-verified assets. It uses the user-authorized procedural fallback and optional host-native ImageGen. No credentials, paid generation, Blender, or third-party asset licenses were needed.

All game art was created for this project. Phaser/Vite/Playwright retain their own dependency licenses. No third-party visual reference images are redistributed.

## Milestone 2 additions

`src/art/combatTextures.js` creates four Blight Spitter frames, four Shade Wisp frames, and a poison projectile (nine new transparent 32×32 textures). Total exported textures: 82. Kael dodge uses a bounded pool of existing-frame cyan afterimages; damage uses white flashes; deaths use bone/green/violet particles. Door bars animate independently. These are original code-native pixel assets matching the Milestone 1 palette. No new external assets, image services, or dependencies were used.
