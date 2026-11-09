# Milestone 2 verification

Nine logic tests pass. The expanded browser suite covers the preserved foundation plus dodge, immunity, cooldown rejection, collision safety, both knockbacks, poison damage/wall impacts, wisp burst and teleport safety, pillar cover, terminal death, final-enemy door unlocking and hostile projectile cleanup. See `DEVELOPMENT_STATUS.md` and the current `tests/artifacts/browser-results.json`.

Development and production builds are checked in Chrome/WebGL at 1280×720. No extra dependencies were added. No hardware-wide or sustained FPS claims are made.

---

The following is the historical Milestone 1 report; its feature omissions have been superseded by DEVELOPMENT_STATUS.md.

# Milestone 1 verification — 2 November 2026

## Results

- `npm install`: successful; lockfile included.
- Patched Vite 6.4.5 dependency audit: zero reported vulnerabilities at verification time.
- `npm test`: 4/4 passed (normalized movement, directional facing, AI transitions/dead behavior, immutable independent stats).
- `npm run build`: successful. Vite reports a non-failing large-chunk advisory because Phaser is bundled in the approximately 1.50 MB JavaScript output (approximately 349 KB gzip).
- Chrome desktop, 1280×720, Phaser WebGL: development launch passed; production preview passed the browser suite. No JavaScript or failed-resource console errors in the recorded final run.
- Visual review: title screen and in-game room screenshots inspected.

## Browser verification

Title and Play button; WASD movement; diagonal velocity; player collision against outer walls and a column; three 10-damage hits defeating a 25 HP crawler; room clear and E exit; projectile-wall collisions; pause/resume; 800ms player damage protection; an overlapping attacking enemy triggering the loss panel; R restart resetting health/enemy; sound preference persistence; repeated scene restarts preserving a single death listener and a 48-projectile pool; pause-menu restart restoring animations. The suite also verifies and exports 73 texture PNGs.

See `tests/artifacts/browser-results.json` and PNG screenshots for recorded evidence. Test setup positions actors and sets health/AI states for repeatable collision and loss checks; movement, shooting, menus, pause and interaction use browser input.

## Limits

No sustained 60 FPS benchmark, cross-browser/hardware matrix, Canvas-fallback test, or tests for later-milestone features are claimed. Crawler steering is local obstacle avoidance for this handcrafted room, not grid pathfinding. No dodge, relics, procedural dungeon, bosses, full settings panel, recorded soundtrack, or separate dodge/hurt/death animation sheets are delivered.

## Corrections made during verification

Fixed ritual artwork drawing behind opaque tiles, cleaned input and global animation state on scene shutdown, corrected the test harness to actually restart active scenes, used floating-point tolerance for movement assertions, and removed incidental Phaser text textures from the reusable asset export.
