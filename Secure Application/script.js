/**
 * ============================================================
 *  StegoSafe — LSB Steganography + Optional AES-256 Encryption
 *  All processing is 100% client-side. No network requests.
 *
 *  PAYLOAD FORMAT (big-endian):
 *  ┌─────────────────────────────────────────────────────────┐
 *  │ Magic        : 4 bytes  "STEG" (0x53 0x54 0x45 0x47)    │
 *  │ Flags        : 1 byte   0x00 = plain, 0x01 = AES-CBC     │
 *  │ Payload Len  : 4 bytes  uint32 (ciphertext length)      │
 *  │ Salt (opt.)  : 16 bytes present only if encrypted       │
 *  │ IV   (opt.)  : 16 bytes present only if encrypted       │
 *  │ Cipher/Plain : N bytes  actual message data             │
 *  └─────────────────────────────────────────────────────────┘
 *  LSB embedding: message bits are written into the RGB
 *  channels only (alpha untouched), MSB-first, row-major.
 * ============================================================
 */
'use strict';

/* ----------------------------------------------------------
   1. DOM REFERENCES
---------------------------------------------------------- */
// Tabs
const tabHide       = document.getElementById('tabHide');
const tabExtract    = document.getElementById('tabExtract');
const panelHide     = document.getElementById('panelHide');
const panelExtract  = document.getElementById('panelExtract');

// Hide panel
const coverImageInput = document.getElementById('coverImageInput');
const coverFileInfo   = document.getElementById('coverFileInfo');
const coverPreview    = document.getElementById('coverPreview');
const coverPlaceholder= document.getElementById('coverPlaceholder');
const secretMessage   = document.getElementById('secretMessage');
const hidePassword    = document.getElementById('hidePassword');
const hideBtn         = document.getElementById('hideBtn');
const resetHideBtn    = document.getElementById('resetHideBtn');
const hideStatus      = document.getElementById('hideStatus');
const stegoPreview    = document.getElementById('stegoPreview');
const stegoPlaceholder= document.getElementById('stegoPlaceholder');
const stegoFileInfo   = document.getElementById('stegoFileInfo');
const downloadBtn     = document.getElementById('downloadBtn');

// Extract panel
const stegoImageInput = document.getElementById('stegoImageInput');
const extractFileInfo = document.getElementById('extractFileInfo');
const extractPreview  = document.getElementById('extractPreview');
const extractPlaceholder = document.getElementById('extractPlaceholder');
const extractPassword = document.getElementById('extractPassword');
const extractBtn      = document.getElementById('extractBtn');
const clearExtractBtn = document.getElementById('clearExtractBtn');
const extractStatus   = document.getElementById('extractStatus');
const recoveredMessage= document.getElementById('recoveredMessage');
const copyRecoveredBtn= document.getElementById('copyRecoveredBtn');

/* ----------------------------------------------------------
   2. STATE
---------------------------------------------------------- */
let coverImageElement = null;    // loaded HTMLImageElement for Hide
let coverFileName     = '';
let generatedBlob     = null;    // Blob of the stego PNG
let generatedFileName = 'stego_image.png';

/* ----------------------------------------------------------
   3. CONSTANTS — PAYLOAD FORMAT
---------------------------------------------------------- */
const MAGIC          = new Uint8Array([0x53, 0x54, 0x45, 0x47]); // "STEG"
const FLAG_ENCRYPTED = 0x01;
const FLAG_PLAIN     = 0x00;
const SALT_LEN       = 16;
const IV_LEN         = 16;
const PBKDF2_ITERS   = 100000;

/* ----------------------------------------------------------
   4. STATUS HELPER
---------------------------------------------------------- */
function setStatus(el, text, type) {
  el.textContent = text;
  el.className = 'status-msg' + (type ? ' ' + type : '');
}

/* ----------------------------------------------------------
   5. TAB SWITCHING
---------------------------------------------------------- */
function switchTab(which) {
  const hideActive = which === 'hide';
  tabHide.classList.toggle('active', hideActive);
  tabExtract.classList.toggle('active', !hideActive);
  tabHide.setAttribute('aria-selected', String(hideActive));
  tabExtract.setAttribute('aria-selected', String(!hideActive));
  panelHide.classList.toggle('active', hideActive);
  panelExtract.classList.toggle('active', !hideActive);
}
tabHide.addEventListener('click', () => switchTab('hide'));
tabExtract.addEventListener('click', () => switchTab('extract'));

/* ----------------------------------------------------------
   6. CRYPTO HELPERS (Web Crypto API)
---------------------------------------------------------- */
/**
 * Derive an AES-256 key from a password using PBKDF2-HMAC-SHA256.
 */
async function deriveKey(password, salt, usage) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-CBC', length: 256 },
    false,
    [usage]
  );
}

/**
 * Encrypt a plaintext string with AES-256-CBC.
 * Returns { salt, iv, ciphertext: Uint8Array }.
 */
async function encryptPayload(plaintext, password) {
  const enc  = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const iv   = crypto.getRandomValues(new Uint8Array(IV_LEN));
  const key  = await deriveKey(password, salt, 'encrypt');
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    enc.encode(plaintext)
  );
  return { salt, iv, ciphertext: new Uint8Array(ciphertext) };
}

/**
 * Decrypt AES-256-CBC ciphertext back into a UTF-8 string.
 */
async function decryptPayload(ciphertext, password, salt, iv) {
  const key = await deriveKey(password, salt, 'decrypt');
  const plainBuf = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(plainBuf);
}

/* ----------------------------------------------------------
   7. PAYLOAD BUILDER  (Hide side)
---------------------------------------------------------- */
async function buildPayload(message, password) {
  const encoder    = new TextEncoder();
  const msgBytes   = encoder.encode(message);
  let flags        = FLAG_PLAIN;
  let salt         = null;
  let iv           = null;
  let cipherBytes  = msgBytes;

  if (password && password.length > 0) {
    const encResult = await encryptPayload(message, password);
    salt        = encResult.salt;
    iv          = encResult.iv;
    cipherBytes = encResult.ciphertext;
    flags       = FLAG_ENCRYPTED;
  }

  const headerLen = 4 + 1 + 4 + (flags === FLAG_ENCRYPTED ? SALT_LEN + IV_LEN : 0);
  const totalLen  = headerLen + cipherBytes.length;
  const payload   = new Uint8Array(totalLen);
  let offset = 0;

  payload.set(MAGIC, offset); offset += 4;
  payload[offset] = flags;    offset += 1;

  // ciphertext length as big-endian uint32
  new DataView(payload.buffer, offset, 4).setUint32(0, cipherBytes.length, false);
  offset += 4;

  if (flags === FLAG_ENCRYPTED) {
    payload.set(salt, offset); offset += SALT_LEN;
    payload.set(iv,   offset); offset += IV_LEN;
  }
  payload.set(cipherBytes, offset);
  return payload;
}

/* ----------------------------------------------------------
   8. LSB EMBED  (Hide side)
---------------------------------------------------------- */
function embedPayload(pixelData, payloadBytes) {
  const totalPixels     = pixelData.length / 4;
  const availableBitsRGB = totalPixels * 3 * 8;
  const requiredBits     = payloadBytes.length * 8;

  if (requiredBits > availableBitsRGB) {
    throw new Error(
      `Image too small: needs ${requiredBits} bits, capacity is ${availableBitsRGB} bits (RGB).`
    );
  }

  let bitIndex = 0;
  const payloadLen = payloadBytes.length;

  for (let i = 0; i < pixelData.length && bitIndex < payloadLen * 8; i++) {
    if (i % 4 === 3) continue;                    // skip alpha
    const byteIndex = bitIndex >> 3;
    const bitOffset = 7 - (bitIndex & 7);         // MSB first
    const bit       = (payloadBytes[byteIndex] >> bitOffset) & 1;
    pixelData[i]    = (pixelData[i] & 0xFE) | bit;
    bitIndex++;
  }
  return pixelData;
}

/* ----------------------------------------------------------
   9. LSB EXTRACT  (Extract side)
---------------------------------------------------------- */
function extractPayload(pixelData) {
  const totalBits = Math.floor((pixelData.length / 4) * 3 * 8);
  const bytes     = [];
  let currentByte = 0;
  let bitCount    = 0;

  for (let i = 0; i < pixelData.length && bitCount < totalBits; i++) {
    if (i % 4 === 3) continue;                    // skip alpha
    const bit = pixelData[i] & 1;
    currentByte = (currentByte << 1) | bit;
    bitCount++;
    if (bitCount % 8 === 0) {
      bytes.push(currentByte);
      currentByte = 0;
    }
  }
  return new Uint8Array(bytes);
}

/* ----------------------------------------------------------
   10. PAYLOAD PARSER  (Extract side)
---------------------------------------------------------- */
function parsePayload(rawBytes) {
  if (rawBytes.length < 9) {
    throw new Error('No hidden data found or payload corrupted.');
  }
  if (rawBytes[0] !== 0x53 || rawBytes[1] !== 0x54 ||
      rawBytes[2] !== 0x45 || rawBytes[3] !== 0x47) {
    throw new Error('No StegoSafe hidden message found in this image.');
  }

  const flags     = rawBytes[4];
  const cipherLen = new DataView(rawBytes.buffer, 5, 4).getUint32(0, false);

  let offset = 9;
  let salt   = null;
  let iv     = null;

  if (flags & FLAG_ENCRYPTED) {
    if (rawBytes.length < offset + SALT_LEN + IV_LEN + cipherLen) {
      throw new Error('Payload corrupted: missing salt/IV or ciphertext.');
    }
    salt = rawBytes.slice(offset, offset + SALT_LEN); offset += SALT_LEN;
    iv   = rawBytes.slice(offset, offset + IV_LEN);   offset += IV_LEN;
  } else if (rawBytes.length < offset + cipherLen) {
    throw new Error('Payload corrupted: incomplete message.');
  }

  const cipherOrPlain = rawBytes.slice(offset, offset + cipherLen);
  return { flags, cipherOrPlain, salt, iv };
}

/* ----------------------------------------------------------
   11. IMAGE LOADING & PIXEL DATA
---------------------------------------------------------- */
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Unsupported file type. Please select an image.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload  = () => resolve(img);
      img.onerror = () => reject(new Error('Could not decode image.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('File could not be read.'));
    reader.readAsDataURL(file);
  });
}

function getImagePixelData(img) {
  const canvas = document.createElement('canvas');
  canvas.width  = img.naturalWidth  || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/* ==========================================================
   12. HIDE MODULE — EVENT HANDLERS
========================================================== */

/* --- Cover image selection --- */
coverImageInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  coverFileName = file.name;
  coverFileInfo.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  try {
    const img = await loadImageFromFile(file);
    coverImageElement = img;
    coverPreview.src = img.src;
    coverPreview.style.display = 'block';
    coverPlaceholder.style.display = 'none';
    setStatus(hideStatus, `Cover image loaded: ${img.naturalWidth}×${img.naturalHeight}px`, 'info');
  } catch (err) {
    setStatus(hideStatus, err.message, 'error');
    coverImageElement = null;
  }
});

/* --- Generate stego image --- */
hideBtn.addEventListener('click', async () => {
  if (!coverImageElement) {
    setStatus(hideStatus, 'Please select a cover image first.', 'error');
    return;
  }
  const message = secretMessage.value.trim();
  if (!message) {
    setStatus(hideStatus, 'Please enter a secret message.', 'error');
    return;
  }

  const password = hidePassword.value;   // optional
  hideBtn.disabled = true;
  setStatus(hideStatus, 'Processing: encrypting and embedding…', 'info');

  try {
    // 1. Build payload (encrypt if password given)
    const payload = await buildPayload(message, password);

    // 2. Read pixels
    const imageData = getImagePixelData(coverImageElement);
    const data      = imageData.data;

    // 3. Capacity check
    const totalPixels      = data.length / 4;
    const availableBits    = totalPixels * 3 * 8;
    const requiredBits     = payload.length * 8;
    if (requiredBits > availableBits) {
      throw new Error(
        `Image too small. Need ${requiredBits} bits, capacity is ${availableBits} bits. ` +
        `Use a larger image or a shorter message.`
      );
    }

    // 4. Embed LSB
    embedPayload(data, payload);

    // 5. Export as PNG
    const canvas = document.createElement('canvas');
    canvas.width  = imageData.width;
    canvas.height = imageData.height;
    canvas.getContext('2d').putImageData(imageData, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) {
        setStatus(hideStatus, 'Failed to create output PNG.', 'error');
        hideBtn.disabled = false;
        return;
      }
      generatedBlob     = blob;
      generatedFileName = 'stego_' +
        (coverFileName.replace(/\.[^.]+$/, '') || 'image') + '.png';

      const url = URL.createObjectURL(blob);
      stegoPreview.src = url;
      stegoPreview.style.display = 'block';
      stegoPlaceholder.style.display = 'none';
      stegoFileInfo.textContent = `${generatedFileName} (${(blob.size / 1024).toFixed(1)} KB)`;
      downloadBtn.disabled = false;
      setStatus(hideStatus, `✅ Message embedded successfully (${payload.length} bytes payload).`, 'success');
      hideBtn.disabled = false;
    }, 'image/png');
  } catch (err) {
    setStatus(hideStatus, '❌ ' + err.message, 'error');
    hideBtn.disabled = false;
  }
});

/* --- Download stego PNG --- */
downloadBtn.addEventListener('click', () => {
  if (!generatedBlob) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(generatedBlob);
  a.download = generatedFileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
});

/* --- Reset hide panel --- */
resetHideBtn.addEventListener('click', () => {
  coverImageInput.value = '';
  coverImageElement = null;
  coverFileName = '';
  coverFileInfo.textContent = 'No file selected';
  coverPreview.style.display = 'none';
  coverPreview.src = '';
  coverPlaceholder.style.display = 'block';
  secretMessage.value = '';
  hidePassword.value = '';
  stegoPreview.style.display = 'none';
  stegoPreview.src = '';
  stegoPlaceholder.style.display = 'block';
  stegoFileInfo.textContent = '';
  downloadBtn.disabled = true;
  generatedBlob = null;
  setStatus(hideStatus, '', '');
});

/* ==========================================================
   13. EXTRACT MODULE — EVENT HANDLERS
========================================================== */

/* --- Stego image selection --- */
stegoImageInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  extractFileInfo.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  try {
    const img = await loadImageFromFile(file);
    extractPreview.src = img.src;
    extractPreview.style.display = 'block';
    extractPlaceholder.style.display = 'none';
    setStatus(extractStatus, `Image loaded: ${img.naturalWidth}×${img.naturalHeight}px`, 'info');
  } catch (err) {
    setStatus(extractStatus, err.message, 'error');
    extractPreview.style.display = 'none';
    extractPlaceholder.style.display = 'block';
  }
});

/* --- Extract message --- */
extractBtn.addEventListener('click', async () => {
  const file = stegoImageInput.files[0];
  if (!file) {
    setStatus(extractStatus, 'Please select a stego image first.', 'error');
    return;
  }

  extractBtn.disabled = true;
  recoveredMessage.value = '';
  copyRecoveredBtn.disabled = true;
  setStatus(extractStatus, 'Extracting…', 'info');

  try {
    const img       = await loadImageFromFile(file);
    const imageData = getImagePixelData(img);
    const rawBytes  = extractPayload(imageData.data);

    const parsed = parsePayload(rawBytes);
    const { flags, cipherOrPlain, salt, iv } = parsed;

    let message = '';
    if (flags & FLAG_ENCRYPTED) {
      const pwd = extractPassword.value;
      if (!pwd) {
        throw new Error('This message is encrypted. Please enter the password.');
      }
      try {
        message = await decryptPayload(cipherOrPlain, pwd, salt, iv);
      } catch {
        throw new Error('Decryption failed. Incorrect password or corrupted payload.');
      }
    } else {
      message = new TextDecoder().decode(cipherOrPlain);
    }

    if (!message) throw new Error('Empty message recovered.');

    recoveredMessage.value = message;
    copyRecoveredBtn.disabled = false;
    setStatus(
      extractStatus,
      `✅ Message recovered${(flags & FLAG_ENCRYPTED) ? ' (decrypted)' : ''}.`,
      'success'
    );
  } catch (err) {
    setStatus(extractStatus, '❌ ' + err.message, 'error');
  } finally {
    extractBtn.disabled = false;
  }
});

/* --- Clear extract panel --- */
clearExtractBtn.addEventListener('click', () => {
  stegoImageInput.value = '';
  extractFileInfo.textContent = 'No file selected';
  extractPreview.style.display = 'none';
  extractPreview.src = '';
  extractPlaceholder.style.display = 'block';
  extractPassword.value = '';
  recoveredMessage.value = '';
  copyRecoveredBtn.disabled = true;
  setStatus(extractStatus, '', '');
});

/* --- Copy recovered message to clipboard --- */
copyRecoveredBtn.addEventListener('click', async () => {
  if (!recoveredMessage.value) return;
  try {
    await navigator.clipboard.writeText(recoveredMessage.value);
    setStatus(extractStatus, '📋 Copied to clipboard.', 'success');
  } catch {
    setStatus(extractStatus, 'Clipboard access denied by browser.', 'error');
  }
});

/* ==========================================================
   14. INITIAL STATE
========================================================== */
setStatus(hideStatus, 'Select a cover image and enter a message.', 'info');