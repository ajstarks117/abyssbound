# MASTER GAME DEVELOPMENT PROMPT
# ABYSSBOUND: ECHOES OF THE FORGOTTEN

## 1. ROLE AND OBJECTIVE

Act as a senior indie game developer, game systems designer, pixel artist, gameplay programmer, technical artist, and QA engineer.

Your task is to DESIGN, IMPLEMENT, TEST, and POLISH a complete, playable, original 2D top-down action roguelike called:

**ABYSSBOUND: ECHOES OF THE FORGOTTEN**

The game should be inspired by the satisfying room-based combat, randomization, replayability, and upgrade synergies of The Binding of Isaac: Rebirth.

However, do not reproduce its copyrighted characters, sprites, animations, UI, music, levels, or other distinctive artwork. Create an original dark-fantasy identity.

This is a college game development assignment demonstrating the capabilities of GPT-6 Astra.

The game must be more than a technical prototype. It should feel like a small but complete indie game with attractive art, responsive combat, enemy variety, procedural dungeons, interesting power-ups, boss battles, and proper presentation.

### Primary requirement

Build the complete game from the specifications below, including the required character artwork, enemy sprites, environmental graphics, visual effects, animations, UI assets, and gameplay systems.

Do not ask the user to supply artwork or missing sprites unless an external dependency is genuinely unavoidable.

When image generation or graphical asset tools are available, use them to create original game assets. Otherwise, implement attractive pixel-art-inspired assets using SVG, programmatically generated textures, canvas drawing, or other supported approaches.

Never depend on inaccessible external asset URLs for essential gameplay.

Do not claim to have generated an asset, animation, or sound unless it actually exists and is integrated into the project.

---

## 2. TECHNOLOGY STACK

Use the following:

- Game engine: Phaser 3
- Programming language: JavaScript (ES6+)
- Development environment: Vite
- Rendering: WebGL with Canvas fallback where Phaser supports it
- Physics: Phaser Arcade Physics
- Storage: Browser LocalStorage
- Audio: Phaser-compatible audio playback
- Platform: Desktop browser
- Target resolution: 1280 × 720
- Target frame rate: 60 FPS

Prefer a clean, modular codebase rather than a single enormous JavaScript file.

No backend or online AI service should be needed to play the game.

The final project must run locally using:

```bash
npm install
npm run dev
```

Also ensure the production build works using:

```bash
npm run build
```

---

## 3. GAME DESIGN PILLARS

The game should prioritize five qualities.

**1. Responsive combat**

Movement, aiming, firing, dodging, taking damage, and defeating enemies should all feel satisfying.

**2. Replayability**

Every run should have different room arrangements, enemy combinations, and relic choices.

**3. Interesting upgrades**

Relics should visibly change how the player attacks, not simply increase numerical stats.

**4. Distinctive visual identity**

Use an atmospheric dark-fantasy pixel-art style with a consistent palette, strong silhouettes, and readable gameplay.

**5. Complete experience**

The game must include a main menu, tutorial, gameplay, bosses, game-over screen, victory screen, settings, and restart functionality.

---

# PART A — VISUAL IDENTITY AND ART DIRECTION

## 4. ART STYLE

Create a cohesive 2D pixel-art game with these characteristics:

- Top-down or slightly elevated three-quarter perspective.
- Crisp pixel-art-inspired characters.
- Smooth movement and readable animations.
- Dark medieval fantasy environments.
- Ancient crypts, ruined temples, and magical underground chambers.
- Glowing relics and arcane projectiles.
- Subtle ambient particles.
- Detailed but uncluttered environmental textures.
- Strong contrast between characters and background.

### Color palette

| Purpose | Color |
|---|---|
| Main background | #10121C |
| Dungeon floor | #252938 |
| Stone walls | #42485A |
| Ancient gold | #D6A85C |
| Arcane cyan | #50D9E8 |
| Arcane purple | #9C67E8 |
| Corruption crimson | #CA425B |
| Toxic green | #70C48C |
| Text | #F2EBDC |

Use these colors as the foundation, with additional shades for lighting, depth, and shading.

The final visuals should not resemble basic debugging rectangles and circles.

If pixel-art sprites cannot be generated with available tools, use layered procedural artwork with coherent shapes, shadows, highlights, and animations.

## 5. CHARACTER ART — MAIN PLAYABLE CHARACTER

### Character name: Kael, the Last Warden

**Appearance:**

Kael is a small hooded adventurer wearing a dark navy cloak, worn leather armor, and a gold-trimmed belt.

Important design features:

- Dark hood with a partially obscured face.
- Two small glowing cyan eyes.
- Short flowing cloak.
- Leather boots and gloves.
- Small magical focus held in the right hand.
- Subtle cyan magical aura while firing.
- Distinctive silhouette visible against dungeon floors.

### Sprite specifications

- Logical sprite canvas: 32 × 32 pixels.
- Display scale: approximately 1.5–2×, configurable for gameplay.
- Transparent background.
- Crisp pixel rendering.
- Ground shadow beneath the character.
- Four directional facing states.

### Required player animations

| Animation | Frames | Behavior |
|---|---:|---|
| Idle | 4 | Subtle breathing and cloak motion |
| Walk | 6 | Alternating steps |
| Cast | 4 | Arm movement and magical flash |
| Dodge | 4 | Fast displacement and afterimage |
| Hurt | 2 | Brief recoil and damage flash |
| Death | 6 | Dissolve into arcane particles |

Each animation should be implemented for the required directions, using mirrored frames when visually appropriate.

Use a fallback animation system with procedural limb, cloak, and body movement if traditional sprite sheets are unavailable.

### Controls

- W / A / S / D: Movement
- Mouse: Aim
- Left mouse button: Fire magical projectiles
- Space: Dodge
- E: Interact
- Esc: Pause

Optional alternate controls:

- Arrow keys: Four-directional shooting

Movement must be normalized diagonally to prevent speed exploits.

## 6. CHARACTER STATS

Starting values:

- Maximum health: 6 HP
- Movement speed: 190 pixels/second
- Projectile damage: 10
- Attack interval: 350 milliseconds
- Projectile speed: 420 pixels/second
- Dodge duration: 180 milliseconds
- Dodge cooldown: 1.2 seconds
- Damage invulnerability: 800 milliseconds

These values are initial balancing targets, not immutable constants.

Display health as six segmented indicators or a visually equivalent readable health bar.

The player should be able to gain or lose health, movement speed, damage, attack speed, and projectile properties through relics.

---

# PART B — ENEMY ART AND GAMEPLAY AI

## 7. ENEMY DESIGN

Implement six visually distinct enemy types.

Every enemy needs:

- Original art.
- Idle or movement animation.
- Damage feedback.
- Death effect.
- Appropriate collision bounds.
- Distinctive attack behavior.
- Reasonable combat balancing.

### Enemy 1 — Hollow Crawler

**Appearance:** Small skeletal creature with pale bones, a hunched body, and glowing red eyes.

- Sprite: 32 × 32
- Health: 25
- Movement: 90
- Contact damage: 1
- Behavior: Moves directly toward the player.
- Animation: Four-frame crawling cycle.
- Death: Bone fragments scatter.

### Enemy 2 — Blight Spitter

**Appearance:** Green corrupted amphibious creature with swollen poison sacs.

- Sprite: 32 × 32
- Health: 35
- Movement: 65
- Behavior: Maintains distance and launches poison projectiles.
- Attack: Aimed green orb every 1.8 seconds.
- Death: Green particle burst.

### Enemy 3 — Shade Wisp

**Appearance:** Floating purple spirit with a smoky body and luminous eyes.

- Sprite: 32 × 32
- Health: 18
- Movement: 120
- Behavior: Drifts unpredictably and briefly teleports.
- Attack: Short-range energy burst.
- Death: Dissolves into purple particles.

### Enemy 4 — Iron Sentinel

**Appearance:** Heavy armored construct with a cracked stone body, golden highlights, and a glowing core.

- Sprite: 48 × 48
- Health: 85
- Movement: 45
- Behavior: Slowly approaches and performs telegraphed charges.
- Attack: High-impact collision.
- Death: Shatters into stone pieces.

### Enemy 5 — Blood Leech

**Appearance:** Small crimson insect-like monster with elongated legs.

- Sprite: 24 × 24
- Health: 15
- Movement: 150
- Behavior: Swarms the player in groups.
- Attack: Fast close-range contact.
- Death: Crimson particle effect.

### Enemy 6 — Void Watcher

**Appearance:** Floating dark sphere surrounded by a rotating ring of magical symbols.

- Sprite: 40 × 40
- Health: 45
- Movement: 50
- Behavior: Repositions between attacks.
- Attack: Fires three-projectile spreads toward the player.
- Death: Implodes into a magical vortex.

## 8. ENEMY AI SYSTEM

Implement enemy behavior using finite state machines.

Suggested states:

- Idle
- Patrol
- Chase
- Reposition
- Telegraph
- Attack
- Recover
- Stunned
- Dead

Not every enemy needs every state.

The enemy AI must support:

1. Player tracking.
2. Collision avoidance.
3. Attack cooldowns.
4. Telegraph animations.
5. Different attack ranges.
6. Obstacle interaction.
7. Death transitions.
8. Basic coordinated spawning.

Enemies must not attack continuously without cooldowns or visual warning.

Keep enemy states separated from rendering logic.

Use straightforward steering for simple enemies. Implement grid-based pathfinding where obstacles make direct pursuit unreliable.

---

# PART C — COMBAT SYSTEM

## 9. PRIMARY COMBAT

The player attacks using an Arcane Focus, which launches magical projectiles.

Default projectile:

- Appearance: Bright cyan orb with glowing center.
- Size: Approximately 10–12 pixels.
- Speed: 420 pixels/second.
- Damage: 10.
- Lifetime: 1.5 seconds.
- Small luminous trail.
- Impact particle effect.

The system must support:

- Directional aiming.
- Projectile pooling.
- Enemy collision.
- Wall collision.
- Damage calculations.
- Knockback.
- Critical hits introduced by relics.
- Multiple simultaneous projectiles.
- Piercing attacks.
- Bouncing attacks.
- Elemental status effects.

### Combat feedback

Implement:

- Small camera shake on significant hits.
- Brief enemy white flash.
- Damage numbers where readable.
- Projectile impact sparks.
- Hit sound.
- Death particles.
- Boss hit feedback.
- Smooth health changes.

Avoid excessive effects that obscure enemy projectiles.

## 10. DODGE SYSTEM

Pressing Space performs a short directional dodge.

Requirements:

- Fast movement burst.
- Short invulnerability window.
- Semi-transparent afterimage.
- Clear cooldown indication.
- Cannot be spammed infinitely.
- If the player is stationary, dodge in the last movement direction.

The dodge must respect room boundaries and collision rules.

---

# PART D — RELIC FUSION SYSTEM

## 11. RELIC SYSTEM

Relics are magical artifacts that permanently modify the player for the duration of a run.

Implement a data-driven relic manager.

Each relic must have:

- Unique ID.
- Name.
- Description.
- Rarity.
- Icon.
- Stat or behavior modifier.
- Equip/collection effect.
- Synergy compatibility.

### Required relics

| Relic | Effect |
|---|---|
| Ember Heart | Adds burn damage to attacks |
| Frost Fang | Applies slowing effects |
| Storm Eye | Adds chain lightning |
| Void Pearl | Chance to create a small singularity |
| Twin Sigil | Fires two projectiles |
| Piercing Thorn | Projectiles pierce one additional enemy |
| Echo Crystal | Chance to repeat a shot |
| Guardian Shell | Grants additional maximum health |
| Swift Feather | Increases movement speed |
| Blood Pact | Increases damage while at low HP |
| Ricochet Rune | Allows projectiles to bounce |
| Soul Lantern | Restores health after a set number of enemy kills |

Use appropriate icons and visual feedback for all 12 relics.

## 12. RELIC SYNERGIES

The most important distinctive system in the game is Relic Fusion.

Implement at least five combinations.

**Combination 1: Ember Heart + Storm Eye**

Name: Thunderfire

Effect: Lightning jumps between enemies and applies burn damage.

Visual: Orange and cyan electrical arcs.

**Combination 2: Frost Fang + Twin Sigil**

Name: Frozen Barrage

Effect: Both projectiles apply freezing buildup.

Visual: Two icy blue magical bolts.

**Combination 3: Void Pearl + Ricochet Rune**

Name: Gravity Well

Effect: Bouncing projectiles occasionally generate miniature gravity fields that pull nearby enemies.

Visual: Violet distortion ring.

**Combination 4: Blood Pact + Echo Crystal**

Name: Crimson Echo

Effect: While below half health, repeated attacks deal additional damage.

Visual: Red afterimage projectiles.

**Combination 5: Piercing Thorn + Ember Heart**

Name: Inferno Lance

Effect: Piercing projectiles leave a short-lived burning trail.

Visual: Narrow flaming bolt with orange embers.

The relic system must calculate compatible modifiers consistently.

Avoid modifying shared base-stat objects in ways that produce unintended permanent stacking.

Relic fusion should be visually communicated through an announcement or small on-screen notification.

---

# PART E — DUNGEON GENERATION

## 13. PROCEDURAL DUNGEONS

Create interconnected dungeon rooms with randomized arrangements.

Each run should use a different random seed.

Provide three dungeon floors:

1. The Forgotten Crypt
2. The Ashen Catacombs
3. The Hollow Sanctum

Every floor should have its own atmosphere, color variations, enemy distribution, and environmental decoration.

### Room dimensions

- Game display: 1280 × 720
- HUD area: approximately 80 pixels high
- Room gameplay region: approximately 1100 × 560
- Use a consistent logical grid for room layout.
- Walls surround the playable arena.
- Doorways appear at valid room connections.

### Room types

- Starting room
- Normal combat room
- Treasure room
- Healing room
- Elite encounter room
- Boss room

Use approximately 6–9 rooms per floor, based on the available content and run length.

### Generation requirements

1. Generate a connected room graph.
2. Choose a valid starting location.
3. Place the boss room at an appropriately distant node.
4. Place treasure and healing rooms at valid locations.
5. Populate combat rooms.
6. Prevent unreachable rooms.
7. Prevent doors from opening into walls.
8. Place decorations without blocking essential paths.
9. Use deterministic random generation from a seed.
10. Validate room accessibility before gameplay begins.

Create at least 15 handcrafted room layout templates, using randomized decorations, enemy groups, and room arrangements.

The level structure should be procedurally assembled, not purely random obstacles scattered everywhere.

## 14. ROOM INTERACTION

When entering a combat room:

- Close active doors.
- Spawn enemies.
- Begin encounter music if appropriate.
- Display clear enemy attack indicators.
- Unlock doors after all enemies are defeated.
- Play room-clear feedback.
- Allow the player to progress.

Previously cleared rooms should remain cleared when revisited during the same run.

Save their state in the active dungeon data.

## 15. ENVIRONMENT ART

Create the following reusable assets:

### Dungeon floors

- Cracked stone floor tiles.
- Dark stone floor tiles.
- Mossy floor variations.
- Damaged floor panels.
- Ritual circle decals.
- Dust and rubble details.

### Walls

- Stone walls.
- Corner wall pieces.
- Damaged wall variants.
- Ancient columns.
- Archway and doorway graphics.

### Obstacles

- Wooden crates.
- Stone pillars.
- Broken statues.
- Ancient urns.
- Tombstones.
- Ritual altars.

### Interactive objects

- Treasure chest.
- Health fountain.
- Locked door.
- Boss doorway.
- Relic pedestal.
- Exit portal.

### Visual requirements

Use a base tile scale of 32 × 32 or 48 × 48 pixels.

Keep every tile aligned to the level's chosen tile grid.

Ensure collision boundaries match the visible solid portions of walls and obstacles.

Layer decorations correctly so they do not hide important gameplay.

Include subtle flickering torchlight, shadows, and floating dust.

---

# PART F — BOSS BATTLES

## 16. BOSS 1 — THE BONE WARDEN

**Location:** The Forgotten Crypt or Ashen Catacombs.

**Appearance:**

A giant armored skeletal knight carrying an oversized cracked mace. Its chest contains a glowing crimson core, and its shoulders are decorated with ancient gold armor.

- Sprite target: 96 × 96 pixels.
- Large readable silhouette.
- Glowing eyes.
- Heavy attack animations.
- Distinctive death animation.

### Phase 1 — 100% to 50% health

Attacks:

- Mace slam with expanding shockwave.
- Short forward charge.
- Summon two Hollow Crawlers.

### Phase 2 — Below 50% health

Changes:

- Faster attack cadence.
- Double shockwave attack.
- Longer charge distance.
- Crimson visual aura.

Every attack must have a clear telegraph.

The boss must not use unavoidable attacks.

## 17. BOSS 2 — THE ABYSSAL HEART

**Location:** The Hollow Sanctum.

**Appearance:**

A giant floating corrupted heart surrounded by rotating magical rings, violet smoke, and dark crystalline fragments.

- Sprite target: 128 × 128 pixels.
- Animated pulsing core.
- Rotating rings.
- Strong purple and crimson glow.
- Elaborate death effect.

### Phase 1

Attacks:

- Radial projectile burst.
- Aimed triple projectiles.
- Slow-moving magical mines.

### Phase 2

Attacks:

- Rotating bullet patterns.
- Short teleport between arena positions.
- Summoned Shade Wisps.
- Temporary hazardous floor areas.

### Final phase

At low health, the boss enters an aggressive final phase with faster but clearly telegraphed attacks.

Maintain fair opportunities for the player to escape and counterattack.

After defeating the final boss, show a unique victory animation and ending screen.

---

# PART G — UI AND UX

## 18. MAIN MENU

Create a polished title screen with:

- ABYSSBOUND logo.
- Subtitle: Echoes of the Forgotten.
- Animated dungeon background.
- Floating magical particles.
- Subtle ambient effects.
- Play button.
- How to Play.
- Settings.
- Credits.

The menu should feel like a real indie game.

## 19. GAME HUD

Display:

- Health indicators at top-left.
- Current floor name.
- Minimap at top-right.
- Relic inventory icons.
- Dodge cooldown.
- Pause indicator.
- Boss health bar during boss encounters.

Keep the HUD compact and readable.

The minimap should display discovered rooms, visited rooms, current room, and relevant special rooms.

## 20. RELIC SELECTION SCREEN

When a relic is discovered, show an elegant selection interface.

Display:

- Relic icon.
- Relic name.
- Description.
- Rarity.
- Current synergy information when relevant.

For treasure reward rooms, provide a choice between two or three relics when appropriate.

The game should pause while the selection interface is open.

## 21. PAUSE SCREEN

Include:

- Resume.
- Restart Run.
- Settings.
- Main Menu.

## 22. GAME-OVER SCREEN

Display:

- "THE ABYSS CLAIMS ANOTHER SOUL"
- Floor reached.
- Enemies defeated.
- Relics collected.
- Run duration.
- Run seed.
- Retry button.
- Main menu button.

## 23. VICTORY SCREEN

Display:

- "THE CURSE IS BROKEN"
- Distinct victory artwork.
- Total run time.
- Total enemies defeated.
- Relics collected.
- Final score.
- Play Again button.

## 24. SETTINGS

Implement:

- Master volume.
- Music volume.
- Sound effects volume.
- Screen shake toggle.
- Fullscreen toggle if browser permissions allow it.
- Persistent settings using LocalStorage.

Ensure UI works at the target desktop resolution and scales cleanly for different desktop browser sizes.

---

# PART H — AUDIO AND ANIMATIONS

## 25. SOUND EFFECTS

Create or integrate sounds for:

- Menu selection.
- Movement when appropriate.
- Magical shooting.
- Projectile impact.
- Enemy damage.
- Enemy death.
- Player damage.
- Dodge.
- Relic collection.
- Door unlocking.
- Chest opening.
- Boss introduction.
- Boss defeat.
- Victory.
- Game over.

When original sound files cannot be generated, use basic Web Audio synthesis for nonessential effects.

Do not leave the game silent simply because audio files are missing.

Never present synthesized placeholders as professionally composed sound assets.

## 26. MUSIC

Use an original or properly licensed soundtrack appropriate for:

- Main menu: Mysterious dark ambient.
- Dungeon exploration: Low-intensity atmospheric.
- Combat: Rhythmic tension.
- Boss fights: Intense dramatic track.
- Victory: Atmospheric resolution.

If music assets are unavailable, focus on completing the game first. Provide a functioning sound system and use suitable original ambient synthesis where practical.

Music must not restart unnecessarily when moving between ordinary rooms.

## 27. PARTICLE AND VISUAL EFFECTS

Implement:

- Arcane projectile trails.
- Magical muzzle flashes.
- Enemy hit sparks.
- Dust when dodging.
- Fire particles.
- Ice particles.
- Lightning arcs.
- Void vortex particles.
- Boss phase transition effects.
- Relic pickup glow.
- Death dissolves.
- Torch flickering.
- Subtle ambient dust.

Use particle pooling or other performance-conscious rendering approaches.

---

# PART I — GAME PROGRESSION

## 28. COMPLETE GAME LOOP

1. Player launches the game.
2. Main menu appears.
3. Player starts a new run.
4. The game generates Floor 1.
5. Player explores interconnected rooms.
6. Combat rooms contain enemies.
7. Cleared rooms unlock their doors.
8. Player discovers treasure and relics.
9. Relics modify combat abilities.
10. Player fights the first boss.
11. Player advances to the next floor.
12. The difficulty increases.
13. Player reaches the final boss.
14. Defeating the final boss completes the run.
15. Victory statistics are displayed.

If the player dies, the run ends.

Restarting creates a new seed and dungeon.

## 29. DIFFICULTY PROGRESSION

Floor 1:

- Basic enemies.
- Short projectile patterns.
- Easy encounters.
- Introduction to relics.

Floor 2:

- Mixed enemy compositions.
- More ranged attacks.
- Elite rooms.
- More complex obstacles.

Floor 3:

- Stronger enemy combinations.
- Advanced projectile patterns.
- Final boss.
- Higher difficulty.

Balance difficulty primarily through enemy composition, attack patterns, and encounter design—not simply massive health increases.

---

# PART J — ASSET CREATION PIPELINE

## 30. REQUIRED ART ASSET INVENTORY

Create and integrate the following.

### Character assets

- 1 playable character.
- Directional movement frames.
- Attack frames.
- Dodge frames.
- Hurt frames.
- Death frames.

### Enemy assets

- 6 enemy designs.
- Movement animations.
- Attack animations.
- Death effects.

### Boss assets

- 2 unique bosses.
- Multiple attack animations.
- Phase-transition effects.
- Death animations.

### Environment assets

- 3 dungeon visual themes.
- Reusable floor tiles.
- Walls and corners.
- Doors.
- Obstacles.
- Decorative elements.
- Relic pedestals.
- Treasure chests.
- Portals.

### UI assets

- Game logo.
- Menu button treatments.
- Health indicators.
- Minimap markers.
- Boss health bar.
- 12 relic icons.
- Fusion notification visuals.
- Screen backgrounds.

### Projectile assets

- Arcane orb.
- Fire bolt.
- Ice projectile.
- Lightning effect.
- Poison projectile.
- Void energy.
- Boss projectiles.

### Asset quality requirements

1. Original designs only.
2. Consistent pixel scale.
3. Transparent backgrounds where appropriate.
4. No watermarks.
5. No unrelated stock imagery.
6. No mixing incompatible art styles.
7. No missing sprites.
8. No visible placeholder shapes in the final deliverable unless they are deliberately stylized.
9. Clearly organized assets in the project.
10. All referenced assets must exist.

## 31. ART GENERATION WORKFLOW

Before implementing the full game:

1. Establish a consistent art bible.
2. Create the main character design.
3. Create one complete enemy design.
4. Create a basic dungeon tileset.
5. Integrate them into a playable test room.
6. Confirm readability and scale.
7. Expand to the remaining assets.

If dedicated image-generation tools are available, generate original character sheets, tiles, UI icons, and boss concepts.

Do not assume that a concept illustration is automatically a usable sprite sheet.

Prepare or process assets into consistent game-ready sizes with transparent backgrounds and aligned frames.

If those tools are unavailable, implement procedural graphics using Phaser Graphics, SVG, canvas textures, and reusable drawing functions.

The procedural fallback should still have coherent silhouettes, layered shading, highlights, and animated details.

Use the same visual language throughout the game.

---

# PART K — SOFTWARE ARCHITECTURE

## 32. PROJECT STRUCTURE

Use a clean structure similar to:

```text
abyssbound/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── assets/
│       ├── characters/
│       ├── enemies/
│       ├── bosses/
│       ├── tiles/
│       ├── objects/
│       ├── projectiles/
│       ├── effects/
│       ├── ui/
│       └── audio/
├── src/
│   ├── main.js
│   ├── config/
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   ├── UIScene.js
│   │   ├── PauseScene.js
│   │   ├── GameOverScene.js
│   │   └── VictoryScene.js
│   ├── entities/
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   ├── Boss.js
│   │   └── Projectile.js
│   ├── systems/
│   │   ├── CombatSystem.js
│   │   ├── DungeonGenerator.js
│   │   ├── RoomManager.js
│   │   ├── RelicManager.js
│   │   ├── FusionSystem.js
│   │   ├── EnemyAI.js
│   │   ├── AudioManager.js
│   │   └── SaveManager.js
│   ├── data/
│   │   ├── enemies.js
│   │   ├── relics.js
│   │   ├── bosses.js
│   │   └── rooms.js
│   └── utils/
├── tests/
└── README.md
```

Adapt this structure where necessary, but maintain a modular architecture.

Avoid circular dependencies and oversized scene classes.

## 33. DESIGN PATTERNS

Use these patterns where appropriate:

**State Pattern:** Enemy AI and boss phases.

**Factory Pattern:** Creating enemies, projectiles, and room objects.

**Observer / Event Pattern:** Health changes, enemy deaths, room completion, and UI updates.

**Strategy Pattern:** Different enemy attack behaviors.

**Object Pool Pattern:** Projectile and particle reuse.

**Data-Driven Design:** Relics, enemy stats, and room configurations.

Do not overengineer simple systems merely to demonstrate a pattern.

---

# PART L — DEVELOPMENT EXECUTION

## 34. IMPLEMENTATION ORDER

Develop the project in clear milestones.

### Milestone 1 — Playable foundation

- Initialize Phaser and Vite.
- Build the first scene.
- Implement player movement.
- Add character visuals.
- Add aiming and shooting.
- Add collisions.
- Add a simple playable dungeon room.

At this milestone, the player must be able to move and fire inside a complete room.

### Milestone 2 — Core combat

- Add three enemy types.
- Implement enemy state machines.
- Add damage and health.
- Add dodge mechanics.
- Add death effects.
- Implement room-clear logic.

### Milestone 3 — Procedural dungeon

- Generate connected rooms.
- Implement doors and transitions.
- Add a minimap.
- Create treasure and healing rooms.
- Make room states persistent within a run.

### Milestone 4 — Relic system

- Implement 12 relics.
- Add relic icons.
- Add the relic selection UI.
- Implement five fusions.
- Verify that combined upgrades work.

### Milestone 5 — Content expansion

- Add the remaining enemies.
- Add both bosses.
- Add three dungeon visual themes.
- Add progression and difficulty balancing.
- Add the complete final run.

### Milestone 6 — Polish

- Main menu.
- Settings.
- Game-over screen.
- Victory screen.
- Music and SFX.
- Camera effects.
- Particles.
- Animation improvements.
- Accessibility and usability adjustments.

### Milestone 7 — Testing

- Test movement and collisions.
- Test every enemy.
- Test every relic.
- Test every fusion.
- Test procedural connectivity.
- Test bosses.
- Test restart behavior.
- Test menus.
- Test performance.
- Test production build.

Do not skip verification between milestones.

---

# PART M — QUALITY ASSURANCE

## 35. REQUIRED TEST CASES

Verify:

1. The game launches without JavaScript errors.
2. The main menu is usable.
3. Player movement is smooth.
4. Diagonal movement is normalized.
5. Projectiles damage enemies correctly.
6. Enemies cannot attack after death.
7. Dodge invulnerability works.
8. Doors unlock after clearing a room.
9. Procedural maps remain connected.
10. The boss room is reachable.
11. Relics apply their effects correctly.
12. Relic synergies activate correctly.
13. Enemy projectiles can be avoided.
14. Boss phases change at correct health thresholds.
15. The player can complete all three floors.
16. Death displays the game-over screen.
17. Restarting creates a new run.
18. Menu buttons work.
19. Audio settings persist.
20. The production build succeeds.

Generate and test multiple procedural dungeon seeds.

Ensure that no procedural generation arrangement creates an unwinnable level.

## 36. PERFORMANCE REQUIREMENTS

Target:

- 60 FPS on a typical modern laptop.
- Smooth combat with multiple enemies and projectiles.
- No uncontrolled object creation.
- No memory leaks during repeated room transitions.
- Minimal input latency.
- No excessive full-screen post-processing.

Use sprite and particle pooling where useful.

Only update active room enemies and gameplay objects.

---

# PART N — FINAL DELIVERABLES

## 37. DELIVERABLES

Provide:

1. Complete source code.
2. Playable local game.
3. All required game assets.
4. Working menu and settings.
5. Three playable dungeon floors.
6. Six enemy types.
7. Two boss encounters.
8. Twelve collectible relics.
9. Five relic synergies.
10. Game-over and victory states.
11. README with installation and controls.
12. Architecture summary.
13. Explanation of procedural generation.
14. Explanation of enemy AI.
15. Explanation of Relic Fusion.
16. Testing instructions.
17. A short explanation of how GPT-6 Astra contributed to implementation.

## 38. ACCEPTANCE CRITERIA

Consider the assignment complete only when:

- A new player can open the game and understand the controls.
- A full run is playable from start to victory.
- Every critical mechanic works.
- The game looks visually cohesive.
- The enemies provide different challenges.
- Boss fights are challenging but fair.
- Relics produce meaningful gameplay changes.
- Different runs vary in layout and upgrades.
- No mandatory asset is missing.
- The project builds successfully.

Prioritize a smaller fully functional game over a larger collection of incomplete systems.

If time or tooling constraints prevent every requested feature from being completed, retain a complete playable vertical slice with a menu, one generated floor, several enemies, a boss, several working relics, and proper victory/death states before expanding further.

## 39. FINAL INSTRUCTION TO GPT-6 ASTRA

You are responsible for the technical implementation, visual consistency, gameplay systems, integration, and testing of this game.

Make sensible implementation decisions autonomously.

Do not repeatedly ask the user for sprites, character references, sound files, tilemaps, or basic design decisions already specified in this document.

Create original assets when your tools permit it. Otherwise, generate polished in-engine alternatives.

Do not insert broken image links or leave missing assets unresolved.

Work iteratively, keeping the game playable after every major milestone.

Produce the strongest complete and polished version of ABYSSBOUND: ECHOES OF THE FORGOTTEN that the available environment and tools can support.