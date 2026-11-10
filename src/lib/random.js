// Use secure browser random numbers when possible; do not send data to a server.
export function randomInt(max) {
  if (!Number.isSafeInteger(max) || max <= 0) throw new Error('Invalid random range');
  const crypto = globalThis.crypto;
  if (crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / max) * max;
    do { crypto.getRandomValues(values); } while (values[0] >= limit);
    return values[0] % max;
  }
  return Math.floor(Math.random() * max);
}

export function digits(length, firstNonZero = false) {
  let result = '';
  for (let i = 0; i < length; i++) result += String(randomInt(i === 0 && firstNonZero ? 9 : 10) + (i === 0 && firstNonZero ? 1 : 0));
  return result;
}

export function letters(length) {
  let result = '';
  for (let i = 0; i < length; i++) result += String.fromCharCode(65 + randomInt(26));
  return result;
}

export function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function pick(items) {
  return items[randomInt(items.length)];
}
