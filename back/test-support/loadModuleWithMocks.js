var path = require("path");

function clearModule(modulePath) {
  try {
    delete require.cache[require.resolve(modulePath)];
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      throw error;
    }
  }
}

function loadModuleWithMocks(targetRelativePath, mocks) {
  var targetPath = path.join(__dirname, "..", targetRelativePath);
  var resolvedTargetPath = require.resolve(targetPath);
  var mockEntries = [];

  Object.entries(mocks).forEach(function ([relativePath, exports]) {
    var mockPath = path.join(path.dirname(resolvedTargetPath), relativePath);
    var resolvedMockPath = require.resolve(mockPath);

    mockEntries.push({
      path: resolvedMockPath,
      previous: require.cache[resolvedMockPath],
    });

    require.cache[resolvedMockPath] = {
      id: resolvedMockPath,
      filename: resolvedMockPath,
      loaded: true,
      exports: exports,
    };
  });

  clearModule(resolvedTargetPath);

  try {
    return require(resolvedTargetPath);
  } finally {
    clearModule(resolvedTargetPath);

    mockEntries.forEach(function (entry) {
      if (entry.previous) {
        require.cache[entry.path] = entry.previous;
      } else {
        delete require.cache[entry.path];
      }
    });
  }
}

module.exports = {
  loadModuleWithMocks,
};
