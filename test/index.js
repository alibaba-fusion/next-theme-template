const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const variables = require('./variables.json');

const res = nunjucks.render(
  path.resolve(__dirname, '../content/variables.css'),
  { variables }
);

fs.writeFileSync(path.join(__dirname, './variables.css'), res);
