'use strict';

const fs = require('fs');
const path = require('path');

const QUERY_PATH = path.join('.', 'queries');
const TRANSFORM_PATH = path.join('.', 'transforms');
const TARGET_FILENAME = path.join('.', 'manifest.json');

fs.writeFileSync(
  TARGET_FILENAME,
  JSON.stringify(
    {
      queries: [...retrieveFragments(QUERY_PATH)],
      transforms: [...retrieveFragments(TRANSFORM_PATH)],
    },
    null,
    '\t'
  ),
  'utf8'
);

function retrieveFragments(fragmentsPath) {
  return getPluginFragments(fragmentsPath).map(plugin => {
    console.log(`\tReading fragment: ${plugin}`);
    return JSON.parse(fs.readFileSync(plugin, 'utf8'));
  });
}

function getPluginFragments(fragmentsPath) {
  const dir = fs.readdirSync(fragmentsPath, { withFileTypes: true });
  return dir.reduce((list, file) => {
    const fileStat = fs.statSync(path.join(fragmentsPath, file.name));
    return fileStat?.isDirectory()
      ? [...list, path.join(fragmentsPath, file.name, 'manifest.json')]
      : list;
  }, []);
}
