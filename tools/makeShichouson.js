const table = require('../parser/table.js');
const rawjson = require('../rawdata/shichouson.json');
const fs = require('fs');

(async () => {
  const json = table.parse(rawjson);
  const region = {};
  for (let key in json) {
    const row = json[key];
    if (row.length !== 5) {
      // データが５つ以外は無視
      continue;
    }
    ken = row[1];
    shi = row[2];
    if (!region[ken]) {
      region[ken] = {};
    }
    region[ken][shi] = [];
  }
  await fs.writeFileSync(`${__dirname}/../config/shichouson.json`, JSON.stringify(region, null, ' '));
})();