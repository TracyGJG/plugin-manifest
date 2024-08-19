'use strict';

const fs = require('fs');
const path = require('path');

const QUERY_PATH = path.join('.', 'queries');
const TRANSFORM_PATH = path.join('.', 'transforms');

fs.writeFileSync(
  './manifest.json',
  JSON.stringify(
    {
      queries: [...retreiveFragments(QUERY_PATH)],
      transforms: [...retreiveFragments(TRANSFORM_PATH)],
    },
    null,
    '\t'
  ),
  'utf8'
);

function retreiveFragments(fragmentsPath) {
  return getPlugins(fragmentsPath).map(plugin => {
    console.log(`Reading fragment: ${plugin}`);
    return JSON.parse(fs.readFileSync(plugin, 'utf8'));
  });
}

function getPlugins(fragmentsPath) {
  const dir = fs.readdirSync(fragmentsPath, { withFileTypes: true });
  const plugins = dir.reduce((list, file) => {
    const fileSource = path.join(fragmentsPath, file.name);
    const fileStat = fs.statSync(fileSource);
    if (fileStat?.isDirectory()) {
      return [...list, path.join(fragmentsPath, file.name, 'manifest.json')];
    }
    return list;
  }, []);
  return plugins;
}
