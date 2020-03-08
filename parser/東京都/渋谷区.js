const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    let town = row['0'].replace('(注)', '').replace('(1部地域)', '');
    let chou = row['1'].replace('―', '').replace('(注)', '').replace('(1部地域)', '').replace(/([0-9]+)($|[^丁･~0-9])/g, '$1番').replace(/\(.*?以外\)/g, '');
    const addr = parse.address(town+chou);
    const schedule = {};
    schedule['可燃ごみ'] = parse.day(row['2']);
    schedule['不燃ごみ'] = parse.day(row['3']);
    schedule['資源ごみ'] = parse.day(row['4']);
    parse.assignVal(addr, schedule);
    res = parse.merge(res, addr);
  }
  return res;
};