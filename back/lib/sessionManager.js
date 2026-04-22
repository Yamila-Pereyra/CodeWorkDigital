function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function applyAuthenticatedUserSession(req, user) {
  req.session.id_usuario = user.id;
  req.session.nombre = user.usuario;
  req.session.id_nombre = user.usuario;
  req.session.authenticated_at = new Date().toISOString();
}

module.exports = {
  regenerateSession,
  destroySession,
  saveSession,
  applyAuthenticatedUserSession,
};
