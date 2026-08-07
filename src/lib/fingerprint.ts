/**
 * SpiderQueens Lightweight Browser Fingerprint Generator
 * Generates a stable client-side device hash without external dependencies.
 * Combines canvas rendering hash, screen parameters, user-agent, hardware concurrency,
 * and timezone metrics to prevent VPN and mobile hotspot IP bypass attempts.
 */
export function getBrowserFingerprint(): string {
  if (typeof window === 'undefined') return 'sqfp_server_side';

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let canvasHash = '';
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px "Arial"';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('SpiderQueens 2026! 🕷️👑', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('SpiderQueens 2026! 🕷️👑', 4, 17);
      canvasHash = canvas.toDataURL();
    }

    const nav = window.navigator;
    const screen = window.screen;
    const rawData = [
      nav.userAgent,
      nav.language,
      screen.colorDepth,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      nav.hardwareConcurrency || 1,
      nav.maxTouchPoints || 0,
      canvasHash.slice(-60),
    ].join('||');

    // Fast FNV-1a 32-bit hash algorithm
    let hash = 0x811c9dc5;
    for (let i = 0; i < rawData.length; i++) {
      hash ^= rawData.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    const hashHex = (hash >>> 0).toString(16).padStart(8, '0');
    return 'sqfp_' + hashHex;
  } catch (e) {
    return 'sqfp_fallback_' + Math.random().toString(36).substring(2, 10);
  }
}
