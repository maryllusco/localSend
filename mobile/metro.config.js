const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const projectRoot = path.resolve(__dirname, '..');

// Bloquear SOLO las carpetas electron/ y src/ de la raíz del monorepo,
// no cualquier carpeta "src" dentro de node_modules
config.resolver.blockList = [
  new RegExp(`^${projectRoot.replace(/[/\\]/g, '[/\\\\]')}[/\\\\]electron[/\\\\].*`),
  new RegExp(`^${projectRoot.replace(/[/\\]/g, '[/\\\\]')}[/\\\\]src[/\\\\].*`),
];

config.watchFolders = [__dirname];

module.exports = config;
