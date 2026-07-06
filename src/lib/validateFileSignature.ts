/**
 * Confirms a file's actual bytes match its claimed MIME type. Browsers set
 * `File.type` from the client, so an upload endpoint that only checks that
 * string can be handed arbitrary bytes (e.g. an executable) disguised as an
 * allowed type. Only covers the types this app accepts uploads for.
 */
const SIGNATURES: Record<string, (bytes: Uint8Array) => boolean> = {
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/png':  (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  'image/webp': (b) =>
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  'image/gif': (b) =>
    b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 &&
    (b[4] === 0x37 || b[4] === 0x39) && b[5] === 0x61,
  'application/pdf': (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46,
  // Legacy .doc — OLE compound file
  'application/msword': (b) =>
    b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0,
  // .docx — a zip container (PK\x03\x04); can't verify the inner OOXML parts
  // from the header alone, but this rules out non-zip payloads entirely.
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': (b) =>
    b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04,
}

export function matchesFileSignature(buffer: Buffer, claimedMimeType: string): boolean {
  const check = SIGNATURES[claimedMimeType]
  if (!check) return false
  return check(buffer)
}
