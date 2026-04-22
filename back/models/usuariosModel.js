var pool = require("./bd");
var { hashPassword, verifyPassword, isLegacyMd5Hash } = require("../lib/passwords");

async function getUserByUsername(user) {
  try {
    var query = "select * from usuarios where usuario = ? limit 1";
    var rows = await pool.query(query, [user]);
    return rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateUserPasswordHash(id, passwordHash) {
  try {
    var query = "update usuarios set password = ? where id = ?";
    await pool.query(query, [passwordHash, id]);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function verifyUserCredentials(user, password) {
  try {
    var foundUser = await getUserByUsername(user);

    if (!foundUser) {
      return null;
    }

    var verification = await verifyPassword(password, foundUser.password);

    if (!verification.valid) {
      return null;
    }

    if (verification.needsUpgrade || isLegacyMd5Hash(foundUser.password)) {
      var newHash = await hashPassword(password);
      await updateUserPasswordHash(foundUser.id, newHash);
      foundUser.password = newHash;
      foundUser.passwordUpgraded = true;
    }

    return foundUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  getUserByUsername,
  updateUserPasswordHash,
  verifyUserCredentials,
};
