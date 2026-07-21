const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow } = require('electron');

const artifactDir = path.join(__dirname, 'artifacts');

async function captureSecondView() {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      backgroundThrottling: false,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  const pageErrors = [];
  window.webContents.on('console-message', (_event, level, message) => {
    if (level >= 3) pageErrors.push(message);
  });

  await window.loadFile(path.join(__dirname, '..', 'app', 'index.html'));
  window.showInactive();
  await window.webContents.executeJavaScript(
    `enterCelestialView();
     document.getElementById('celestialTime').value=7.5;
     document.getElementById('celestialTime').dispatchEvent(new Event('input'));
     renderer.render(scene2,camera2);`
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await window.webContents.executeJavaScript('renderer.render(scene2,camera2);');

  const state = await window.webContents.executeJavaScript(`({
    view: currentView,
    displayedTime: document.getElementById('celestialTimeVal').textContent,
    shadowVisible: _celestialShadow.visible,
    shadowPosition: _celestialShadow.position.toArray(),
    umbraScale: _celestialShadow.userData.umbra.scale.toArray(),
    sunPosition: sunDotCelestial.position.toArray()
  })`);
  assert.equal(state.view, 'celestial');
  assert.equal(state.displayedTime, '07:30');
  assert.equal(state.shadowVisible, true);
  assert.ok(state.umbraScale[0] > state.umbraScale[1]);
  assert.ok(state.shadowPosition.every(Number.isFinite));
  assert.ok(state.sunPosition.every(Number.isFinite));

  const image = await window.capturePage();
  const size = image.getSize();
  const bitmap = image.toBitmap();
  let nonDarkPixels = 0;
  for (let index = 0; index < bitmap.length; index += 4) {
    if (bitmap[index] + bitmap[index + 1] + bitmap[index + 2] > 45) nonDarkPixels += 1;
  }
  const nonDarkRatio = nonDarkPixels / (size.width * size.height);
  assert.ok(nonDarkRatio > 0.05, `rendered canvas is too dark: ${nonDarkRatio}`);
  assert.deepEqual(pageErrors, []);

  fs.mkdirSync(artifactDir, { recursive: true });
  fs.writeFileSync(path.join(artifactDir, 'second-view-shadow.png'), image.toPNG());
  fs.writeFileSync(
    path.join(artifactDir, 'second-view-shadow.json'),
    JSON.stringify({ ...state, nonDarkRatio }, null, 2)
  );
  window.destroy();
}

app.whenReady()
  .then(captureSecondView)
  .then(() => app.exit(0))
  .catch((error) => {
    console.error(error);
    app.exit(1);
  });
