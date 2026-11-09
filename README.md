# ABYSSBOUND: Echoes of the Forgotten

Eldoria's seals are failing. Kael, the last apprentice of the Warden Order, carries his missing mentor's Arcane Focus into a dungeon that rearranges itself each run. The Lost Chronicles follows the expedition through six floors. Twelve optional papers connect the people who entered the prison to the creatures Kael encounters.

## Play

On Windows, double-click PLAY.cmd in this folder. For a fresh checkout, install Node.js 22.12 or newer, run `npm ci` in this directory, then run `npm run dev` and open the printed local address. Choose **Enter the Crypt**. The illustrated opening runs for roughly 49 seconds. Space, Enter, or Skip advances straight into play. Choose **Replay introduction** to see it again. Retry begins immediately.

## Controls

| Action | Input |
| --- | --- |
| Move | WASD |
| Shoot | Hold an arrow key. The most recent held direction wins. |
| Choose and use an active relic | Tab, then Q |
| Choose and use a fusion | Shift + Tab, then R |
| Dodge in movement direction | Space |
| Travel, read, heal, claim a reward or descend | E near the object |
| Pause, mute or restart | Esc to pause, M to mute, Restart Run in the pause menu |

## The descent

Each seeded floor has 6–7 connected rooms. Fight ten enemy types, watch the minimap for discovered exits, and return to cleared rooms safely. Health and relics carry into the next floor. A healing fountain works once. For a reproducible layout, append `?seed=eldoria` to the game URL.

1. **The Forgotten Crypt** introduces exploration, rewards and the descent portal.
2. **The Ashen Catacombs** end at the Bone Warden. Dodge across its charge line, avoid the expanding slam, and shoot the exposed chest during recovery. Below 60% health it can chain slams and fire a bone barrage.
3. **The Plague Laboratories** hold the Architect, Plague Hosts and explosive Spore Crawlers. Dodge to shed poison.
4. **The Drowned Archives** hold the Archivist, ink-casting Scribes and vanishing Ink Wraiths. Step out of the square rune marks.
5. **The Hollow Sanctum** holds Commander Aldren. Recognize his sword drill and resist firing into his guard.
6. **The Heart of the Abyss** houses the Abyssal Heart. Its phases change below 65% and 30% health. Watch for returning volleys and move to a cyan lane during the Collapse countdown. Defeating the Heart plays the ending and reveals your run statistics.

## Relic Fusion

Choose one relic from an offered set. Owning both pieces unlocks a manual fusion in either order. Each fusion has its own cooldown. Basic bolts deal 8 damage every 420 ms and travel up to 456 pixels. Aiming and moving use independent keys.

| Relics | Fusion | Effect |
| --- | --- | --- |
| Ember Heart + Storm Eye | Thunderfire | Chain lightning ignites its target. |
| Frost Fang + Twin Sigil | Frozen Barrage | Fire three parallel slowing bolts. |
| Void Pearl + Ricochet Rune | Gravity Well | Place a damaging gravity field ahead. |
| Blood Pact + Echo Crystal | Crimson Echo | Cast a crimson burst with a bonus below 40% health. |
| Piercing Thorn + Ember Heart | Inferno Lance | Fire a piercing lance that leaves burning ground. |

## Demo sequence

Play the opening, then read the starting-room tablet. Enter a combat room and demonstrate aimed casting, an enemy warning and a dodge. Open the reward, take a relic, and return through a cleared door to show the minimap. Explore for its fusion partner and select the unlocked fusion and press R to demonstrate its cast. Descend, punish a Bone Warden recovery, then use the journal’s Previous and Next controls to compare Maera’s observations with the Architect’s ledger. Follow the flooded archive to Aldren’s duel and descend to the Heart. Show the Heart's returning projectiles and Collapse lanes before landing the final hit. Let the ending run through to the victory score. Reward offers vary by run.

## Build and verification

Phaser 3 Arcade Physics, JavaScript modules, Vite and Web Audio power the game. The original title and story illustrations ship locally alongside runtime-generated pixel art and synthesized music. Run `npm test` for the logic suite and `npm run test:browser` for Chrome gameplay checks. The test scripts default to the Windows Chrome installation. Run `npm run build` for a production copy in dist, then `npm run preview` to play that build over HTTP.

The controls target desktop keyboard and mouse. Run progress lasts for the active session. Captions and music carry the story. See DEVELOPMENT_STATUS.md for measured performance and balance limits.
