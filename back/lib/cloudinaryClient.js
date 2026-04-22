var cloudinary = require("cloudinary").v2;

function buildNovedadImageUrl(imgId) {
  if (!imgId) {
    return null;
  }

  return cloudinary.url(imgId, {
    width: 960,
    height: 200,
    crop: "fill",
  });
}

module.exports = {
  buildNovedadImageUrl,
};
