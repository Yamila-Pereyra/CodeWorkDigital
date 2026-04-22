var crypto = require("crypto");
var util = require("util");

var scrypt = util.promisify(crypto.scrypt);
var SCRYPT_PREFIX = "scrypt";
var SCRYPT_KEYLEN = 64;

function md5Hex(value) {
  return crypto.createHash("md5").update(value, "utf8").digest("hex");
}

function isLegacyMd5Hash(hash) {
  return typeof hash === "string" && /^[a-f0-9]{32}$/i.test(hash);
}

function isScryptHash(hash) {
  return typeof hash === "string" && hash.startsWith(`${SCRYPT_PREFIX}$`);
}

async function hashPassword(password) {
  var salt = crypto.randomBytes(16).toString("hex");
  var derivedKey = await scrypt(password, salt, SCRYPT_KEYLEN);
  return `${SCRYPT_PREFIX}$${salt}$${derivedKey.toString("hex")}`;
}

async function verifyScryptPassword(password, storedHash) {
  var parts = storedHash.split("$");

  if (parts.length !== 3) {
    return false;
  }

  var salt = parts[1];
  var expectedHash = Buffer.from(parts[2], "hex");
  var derivedKey = await scrypt(password, salt, expectedHash.length);

  if (derivedKey.length !== expectedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(derivedKey, expectedHash);
}

async function verifyPassword(password, storedHash) {
  if (!storedHash) {
    return { valid: false, needsUpgrade: false };
  }

  if (isScryptHash(storedHash)) {
    return {
      valid: await verifyScryptPassword(password, storedHash),
      needsUpgrade: false,
    };
  }

  if (isLegacyMd5Hash(storedHash)) {
    var computed = Buffer.from(md5Hex(password), "hex");
    var expected = Buffer.from(storedHash, "hex");

    if (computed.length !== expected.length) {
      return { valid: false, needsUpgrade: false };
    }

    return {
      valid: crypto.timingSafeEqual(computed, expected),
      needsUpgrade: true,
    };
  }

  return { valid: false, needsUpgrade: false };
}

module.exports = {
  hashPassword,
  verifyPassword,
  isLegacyMd5Hash,
};
