(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.AstronomyCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var DEG = Math.PI / 180;
  var EPSILON = 1e-10;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function sunAltAz(latitudeDeg, declinationDeg, localSolarHour) {
    var latitude = latitudeDeg * DEG;
    var declination = declinationDeg * DEG;
    var hourAngle = (localSolarHour - 12) * 15 * DEG;
    var sinAltitude =
      Math.sin(latitude) * Math.sin(declination) +
      Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle);
    var altitude = Math.asin(clamp(sinAltitude, -1, 1));

    // atan2 on the local east/north components remains stable at the poles.
    var east = -Math.cos(declination) * Math.sin(hourAngle);
    var north =
      Math.sin(declination) * Math.cos(latitude) -
      Math.cos(declination) * Math.sin(latitude) * Math.cos(hourAngle);
    var azimuth = Math.abs(east) + Math.abs(north) < EPSILON ? 0 : Math.atan2(east, north);

    return {
      alt: altitude / DEG,
      az: azimuth / DEG,
      above: sinAltitude >= 0
    };
  }

  function dayLength(latitudeDeg, declinationDeg) {
    var latitude = latitudeDeg * DEG;
    var declination = declinationDeg * DEG;
    var numerator = -Math.sin(latitude) * Math.sin(declination);
    var denominator = Math.cos(latitude) * Math.cos(declination);

    if (Math.abs(denominator) < EPSILON) {
      if (numerator < -EPSILON) return 24;
      if (numerator > EPSILON) return 0;
      return 12;
    }

    var cosHourAngle = numerator / denominator;
    if (cosHourAngle <= -1) return 24;
    if (cosHourAngle >= 1) return 0;
    return 2 * Math.acos(cosHourAngle) / (15 * DEG);
  }

  function shadowGeometry(altitudeDeg, options) {
    options = options || {};
    var horizonCutoff = options.horizonCutoff == null ? 0.5 : options.horizonCutoff;
    if (!Number.isFinite(altitudeDeg) || altitudeDeg <= horizonCutoff) {
      return { visible: false };
    }

    var height = options.height == null ? 0.238 : options.height;
    var footprintLength = options.footprintLength == null ? 0.12 : options.footprintLength;
    var footprintWidth = options.footprintWidth == null ? 0.10 : options.footprintWidth;
    var maxProjection = options.maxProjection == null ? 2.20 : options.maxProjection;
    var altitude = clamp(altitudeDeg, horizonCutoff, 90) * DEG;
    var projectedLength = clamp(height / Math.max(Math.tan(altitude), EPSILON), 0, maxProjection);
    var directness = Math.pow(clamp(Math.sin(altitude), 0, 1), 0.35);

    return {
      visible: true,
      centerDistance: projectedLength * 0.5,
      length: footprintLength + projectedLength,
      width: footprintWidth + Math.min(projectedLength * 0.04, footprintWidth * 0.5),
      coreOpacity: 0.16 + directness * 0.24,
      penumbraOpacity: 0.05 + directness * 0.07
    };
  }

  return {
    dayLength: dayLength,
    shadowGeometry: shadowGeometry,
    sunAltAz: sunAltAz
  };
});
