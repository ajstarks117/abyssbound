# Enemy movement after another enemy dies

Reproduced in local Chrome before the patch. Killing the first of three Hollow Crawlers stopped the AI updates of both survivors. A disabled enemy stays in its group. The old update callback returned false on that entry, which tells Phaser Set.iterate to end the entire loop. Arcade Physics continued moving the later bodies with their previous velocities while their targeting, timers and shadows stopped updating.

GameScene now skips each inactive entry without returning a stop signal. Each living enemy continues running its own state machine, target reacquisition, attack timers and chase-stall recovery. The same early-exit pattern was corrected in friendly and hostile projectile cleanup for partially active pools.

Changed production files: src/scenes/GameScene.js and src/systems/CombatSystem.js. Added tests/survivors-browser.mjs and registered it in tests/current-browser.mjs.

The new browser regression failed before the change and passed afterward. Coverage includes a normal projectile kill, three kill orders across crawlers, leeches and spitters, a mixed encounter, wall-adjacent and pillar pursuit, dodge, temporary slow, survivor attack cycles and shadow tracking, door locking until the last kill, travel through the cleared door, a surviving boss summon and sparse hostile projectile cleanup. The reported update-loop defect is resolved. All 25 logic tests and the complete Chrome regression suite passed, including the assisted six-floor campaign. The production build succeeded and a separate Chrome check confirmed survivor updates after the first kill in that build. Tests sample representative rooms and encounters.

# The Lost Chronicles — six-floor campaign

Kael descends through the Forgotten Crypt, Ashen Catacombs, Plague Laboratories, Drowned Archives, Hollow Sanctum and Heart of the Abyss. The entry floor introduces the portals. Each subsequent floor ends with a guardian. The campaign generator limits each floor to six or seven connected rooms with a healing fountain and treasure chamber. Boss victories restore up to two HP. Existing directional shooting, single-equipped active relics and manual fusion cooldowns carry across floors.

The Plague Architect vents spores, plants hazardous cultures and summons unstable experiments. The Archivist rotates ink-colored patterns around the arena, lays rune traps and teleports. Commander Aldren uses a sword sequence, committed charge, guarded counter and spectral reinforcements. Each has two phases, an exposed recovery, its own procedural silhouette, attack sound and death animation. Four new regular enemies introduce retaliatory spores, a delayed self-detonation, slowing ink pools and a vanish/reappear strike.

Twelve dated expedition documents occupy the safe entry and healing rooms. Press E beside the papers and use Previous and Next to reread discoveries. Varric draws the Bone Warden away, Maera seals the contaminated ward, Elian holds the sluice, Thorne preserves the first heartbeat on a cylinder and Aldren leads the corruption into his sword arm. Six environmental props corroborate their accounts. The original opening introduces the missing party and the ending reflects the evidence recovered.

## Verification

- All 25 logic tests passed, including the four new enemy state machines and 1,000 generator seeds. The campaign browser check also validated 100 seeds on each of the six floors.
- Assisted Chrome runs used the actual doors, portals, boss locks and victory flow. A run in the saved GAMES project read all twelve documents, navigated the journal, verified the cylinder ending and retried from victory. Controlled positioning, damage and attack selection accelerated these checks.
- Chrome checked host spore cooldown, scribe ink and expiry, wraith disappearance and return, spore detonation, phase changes, summons, new attack patterns, original bosses, death/retry, twelve rewards and five manual fusions. Scripted keyboard play beat the Bone Warden and final Heart after direct arena entry.
- The production build succeeded. A production launch opened the first document and verified all 28 new animation frames. Vite reports its existing bundle-size advisory.
- Human six-floor completion time and difficulty across loadouts remain unmeasured. The Game Development Studio command-line tool was unavailable. Art and audio use the existing local procedural pipeline.

# Combat stabilization and rebalance

## Reproduced failures

A nonlethal hostile projectile could make Kael disappear with HP remaining. Phaser supplies the single sprite first when overlapping a sprite and a group. The old callback passed that first argument to projectile impact, which disabled Kael's body. The room still accepted combat input, and the missing target looked like an AI freeze. The collision now names the player and bolt separately and retires the bolt. A lethal hit during a pending doorway fade could also be superseded by the queued room restart. Death now invalidates that transition and resets the fade.

GameScene owns the terminal state. Death stops combat, clears shots, queued echoes, zones and player visuals, pauses physics, and reveals Retry and Main Menu through an idempotent callback with a separate 300 ms fallback. Retry rebuilds the room and explicitly resumes physics. R now casts the equipped fusion.

Enemies can also stall behind pillars or keep firing into cover. EnemyAI now interrupts obstructed telegraphs, follows visible corners around pillars, and attempts a short sidestep only after a chase makes insufficient progress. Stationary attack and recovery frames retain their intended timings.

## Controls and balance

WASD moves, held arrows fire cardinal bolts, and the newest held arrow wins. Base damage is 8, interval 420 ms, speed 380 px/s and lifetime 1.2 seconds. This gives about 19 base damage per second before misses and recovery windows. Hostile bolts now travel at 215 px/s. Enemy HP and boss telegraph windows carry over.

Tab and Q select and activate one of four active relics. Shift+Tab and R select and activate one of five fusions. Their cooldowns use active run time across rooms and floors. The HUD shows readiness and remaining seconds. Guardian Shell grants one HP and Swift Feather grants 8% speed. Piercing, twin and ricochet bonuses use fourth, fifth and sixth shot/cast counters. Blood Pact grants 15% below 40% HP. Echo can repeat every fifth successful basic cast, and Soul Lantern restores one HP per twelve qualifying kills. A fusion has a shared 14 base-damage budget per boss before the boss's armor or exposure multiplier.

## Verification

- All 21 logic tests passed, including 1,000 seeds, the six state machines, fusion recipes, cross-floor ability state, obstruction handling and per-boss damage budgets.
- Chrome exercised seven death/retry paths: enemy contact, projectile, boss attack, rift, active enchantment with interrupted death tween, room entry and pending doorway. All seven displayed a single Retry screen and rejected subsequent attacks. A separate nonlethal projectile hit left Kael visible with an enabled body.
- Chrome exercised simultaneous WASD and shooting, newest-arrow priority and release fallback, mouse attack suppression, Tab and Shift+Tab selection, 12 relic rewards, five manual fusions, exploration, settings, the three-floor campaign, boss phase changes, victory and ending playback. All six regular enemies repeated attack and recovery cycles during a 12-second encounter following a retry and a dodge.
- With baseline gear and scripted keyboard input after direct arena entry, both bosses fell. The Heart reached 24 observed hostile projectiles. A full human campaign and balance across different equipment combinations remain unverified.
- Production build passed. Vite emitted its existing bundle-size advisory. Game Development Studio's local executable was unavailable. Testing used the project's Playwright/Chrome harness and retained the existing artwork.

Earlier milestone notes below describe their respective releases.

# Milestone VII — The Last Warden

The title now leads to six illustrated panels with timed captions, drifting clouds and dust, seal and focus effects, atmospheric music, and keyboard or mouse skip. Replay returns to the title. Two optional lore objects per floor track discoveries for the active run. The final boss hands control to a four-panel ending before victory statistics.

The Bone Warden commits to its charge direction and exposes its core after heavy attacks. Below 60% health it gains a delayed second shockwave, faster charge and five-shot barrage. The Heart changes patterns below 65% and 30%, with mines, rotating volleys, sequential rifts, returning shots and a 2.5-second Collapse warning. During heavy recovery, a base 10-damage shot deals 16.5 rather than the armored 8.5. Each boss can sustain up to three minions. Later floors add mixed elite chambers. Normal is the sole difficulty.

## Release checks

- All 18 logic tests passed, including 1,000 dungeon seeds, six enemy state machines and all five fusion recipes.
- Chrome checked nine-room exploration and backtracking, restarts, menus, settings, death, relic collection and fusion. The assisted campaign reached the third-floor ending and victory. Separate browser checks observed every timed panel, replay, skipping, lore, exact boss thresholds, exposed-core damage, bone fan, reversing shots, reachable Collapse lanes, hazard damage and the post-death attack guard.
- Two automated combat runs used ordinary keyboard and mouse input after fixture entry to each boss room. Both bosses fell in both trials with baseline equipment. The Heart peaked at 24 observed hostile shots out of 32 pooled slots. The Warden died before its barrage in these runs. Its barrage was exercised separately in the pattern test. Sustained ranged fire can skip late patterns and stronger relic builds may shorten fights further.
- Headless Chrome reported mean Phaser frame rates of 48/48 FPS (Warden/Heart) in one trial and 141/144 FPS in another. These are engine timing samples on a single machine. A stable 60 FPS on representative laptops, input latency and long-session graphics memory remain unverified.
- After garbage collection, JavaScript heap measured 9.0 MiB initially and 9.5 MiB after six run restarts, peaking at 10.0 MiB. Each restart retained one E interaction listener. This is a short restart check.
- Production build succeeded. Vite reports a bundle-size advisory for the engine and game. Gameplay sprites, effects and audio remain procedural. Story panels use original generated artwork and captions. Human readability, healing frequency across a complete unassisted run, and balance across all loadouts still need player testing.

The README includes setup, controls, fusion recipes and the release demo sequence. Earlier milestone notes follow.

# Milestone VI — presentation and player experience

The title screen includes Play, How to Play, Settings and Credits. Pause includes Resume, Restart Run, Settings and Main Menu. Settings control master/music/effects levels, screen shake and supported fullscreen, with preferences saved locally. Victory and defeat panels show active campaign time, floor, kills and relic count. Victory also shows the score (3,000 + 100 per kill + 250 per relic) and a gold/cyan particle burst.

Presentation changes include floor-specific runes, ember fissures and crystals, animated torch halos, bounded ambient motes, revised door sigils, chamber status, a dodge meter, cast aura, dodge lean, brief death dissolve, enemy anticipation, boss transition bursts, rarity-colored reward cards and room-clear feedback.

Audio uses original lightweight Web Audio synthesis for menu, exploration, boss, victory and defeat moods, plus interaction, combat, treasure and fusion cues. Music and effects have independent gain controls. Playback follows browser gesture and fullscreen policies.

Verification in Chrome: title navigation, controls guide, credits, settings persistence, all volume controls, audio initialization, screen shake preference, entering/exiting fullscreen, pause settings, death cleanup and retry. Campaign browser and relic browser suites passed including the assisted three-floor run, boss victory, death/restart and twelve rewards/five fusions. All 18 logic tests passed. Title/HUD screenshots reviewed at 1280×720. No sustained frame-rate or listening-panel benchmark.

Changed modules include MenuScene, GameScene, MenuDialog, widgets, RelicUI, AudioManager, Campaign, RoomManager, combat effects, Player, Enemy, Boss, atmosphere and UI styles. Existing art and collision geometry are reused. Game Development Studio workflow was consulted; its separately installed game-dev executable was unavailable. Assets and effects use the project's own procedural pipeline.

Run npm test, node tests/polish-browser.mjs, node tests/campaign-browser.mjs, node tests/relic-browser.mjs, and npm run build.
