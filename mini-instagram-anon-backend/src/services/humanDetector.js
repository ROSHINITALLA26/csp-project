/**
 * Human detection stub.
 * For privacy: reject images with humans. This stub enforces detection only if HUMAN_DETECTION='on'.
 * Replace the body with a real detector (e.g., spawn a Python YOLO/OpenCV script).
 */
export async function imageHasHuman(_absPath) {
  const mode = (process.env.HUMAN_DETECTION || 'on').toLowerCase();
  if (mode === 'off') return false; // allow images
  // TODO: Plug real detection here. For now, conservatively DISALLOW images while on.
  return true;
}
