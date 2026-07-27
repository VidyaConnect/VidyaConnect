const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Fix for Windows: prevent Metro from trying to create directories with colons
// in their names (like node:sea, node:crypto, etc.) which are invalid on Windows
config.resolver.nodeExternalsPattern = /^(?!.*:).+$/;

module.exports = config;
