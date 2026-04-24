function isValidEntry(entry) {
  const trimmed = entry.trim();
  return /^[A-Z]->[A-Z]$/.test(trimmed) && trimmed[0] !== trimmed[3];
}

module.exports = { isValidEntry };
