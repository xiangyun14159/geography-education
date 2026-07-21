const assert = require('node:assert/strict');
const test = require('node:test');

const { dayLength, shadowGeometry, sunAltAz } = require('../app/astronomy-core');

test('equinox sun is overhead at the equator at noon', () => {
  const sun = sunAltAz(0, 0, 12);
  assert.ok(Math.abs(sun.alt - 90) < 1e-9);
  assert.equal(sun.above, true);
});

test('solar azimuth remains finite at both poles', () => {
  for (const latitude of [-90, 90]) {
    const sun = sunAltAz(latitude, 23.44, 8);
    assert.ok(Number.isFinite(sun.alt));
    assert.ok(Number.isFinite(sun.az));
  }
});

test('day length handles equinox and polar day/night boundaries', () => {
  assert.ok(Math.abs(dayLength(30, 0) - 12) < 1e-9);
  assert.equal(dayLength(90, 23.44), 24);
  assert.equal(dayLength(90, -23.44), 0);
  assert.equal(dayLength(90, 0), 12);
});

test('duck shadow shortens as the sun rises', () => {
  const low = shadowGeometry(10);
  const middle = shadowGeometry(30);
  const high = shadowGeometry(75);
  assert.ok(low.length > middle.length);
  assert.ok(middle.length > high.length);
  assert.ok(high.centerDistance < middle.centerDistance);
});

test('duck shadow disappears at and below the apparent horizon', () => {
  assert.equal(shadowGeometry(-1).visible, false);
  assert.equal(shadowGeometry(0.5).visible, false);
  assert.equal(shadowGeometry(1).visible, true);
});

test('near-horizon shadow is capped inside the teaching dome', () => {
  const shadow = shadowGeometry(0.51);
  assert.ok(shadow.length <= 2.32 + Number.EPSILON * 4);
  assert.ok(shadow.width > 0);
  assert.ok(shadow.coreOpacity >= 0 && shadow.coreOpacity <= 1);
});
