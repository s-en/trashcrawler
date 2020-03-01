const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    let town = row['1'];
    if(row['2'] === undefined)continue;
    let chou = row['2'] + '丁目';
    const addr = parse.address(town+chou);
    const schedule = {};
    schedule['資源ごみ'] = parse.day(row['3']);
    schedule['可燃ごみ'] = parse.day(row['4']);
    schedule['不燃ごみ'] = parse.day(row['5']);
    schedule['ペットボトルごみ'] = parse.day(row['6']);
    parse.assignVal(addr, schedule);
    res = parse.merge(res, addr);
  }
  return res;
};