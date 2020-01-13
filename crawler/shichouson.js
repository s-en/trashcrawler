const pdf = require('./pdf.js');
const fs = require('fs');
const url = 'https://www.soumu.go.jp/main_content/000632830.pdf';

(async () => {
  const json = await pdf.get(url);
  let table = [];
  for(const page of json.pageTables){
    table = [...table, ...page.tables];
  }
  await fs.writeFileSync(`${__dirname}/../rawdata/shichouson.json`, JSON.stringify(table, null, ' '));
})();