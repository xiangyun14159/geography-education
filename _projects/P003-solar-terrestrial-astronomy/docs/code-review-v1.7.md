# Windows v1.7 code review

## Fixed in this revision

1. The second-view duck shadow used an arbitrary translated circle. It now uses the physical projection relationship `height / tan(solar altitude)`, starts at the duck's feet, points away from the solar azimuth, and renders separate umbra and penumbra layers.
2. The second-view directional light was fixed above the scene. It now follows the displayed Sun, so model lighting and the cast shadow agree.
3. The azimuth formula divided by terms that become singular at the poles and zenith. The replacement uses local east/north components with `atan2` and has finite-value boundary tests.
4. The current solar trajectory was recalculated twice per update. The duplicate call was removed.
5. Electron now denies new windows and navigation, enables sandboxing explicitly, and applies a local-only Content Security Policy.
6. Electron and electron-builder versions are pinned so the build resolves the same runtime each time.

## Verification added

- Pure Node tests cover equinox noon, both poles, polar day/night, horizon visibility, shadow monotonicity, and near-horizon projection limits.
- An Electron smoke test exercises the real second-view time slider, validates WebGL state and canvas pixels, and captures the rendered result.

## Recommended next work

1. Split the 1,400-line `index.html` into scene, astronomy, UI, and rendering modules. The embedded base64 Earth texture should become a packaged asset to keep source reviewable.
2. Establish one shared web-app source for Android WebView and Electron. The current duplicate `index.html` files have already drifted in pixel ratio, throttling, and backdrop-filter behavior.
3. Upgrade the deprecated Three.js global script to ES modules and add a locked dependency/update policy.
4. Add visual regression cases for sunrise, noon, sunset, polar day, polar night, and both hemispheres.
5. Label time values explicitly as local solar time. Civil time zones, equation of time, atmospheric refraction, and terrain are outside the current teaching model and should not be implied as measured clock-time precision.
6. Configure a real Windows signing certificate before public distribution. Unsigned portable builds will continue to trigger reputation warnings on some systems.

## Build environment note

The v1.7 unpacked application was built and launch-tested with Electron 33.4.11. Single-file portable packaging requires NSIS 3.0.4.1; both GitHub and npmmirror downloads were terminated by the current network with EOF, so this run produced a ZIP of the verified unpacked application instead.
