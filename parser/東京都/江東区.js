const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    let town = row['0'];
    let ban = row['1'];
    const addr = parse.address(town+ban+'番');
    const schedule = {};
    schedule['資源ごみ'] = parse.day(row['2']);
    schedule['プラスチックごみ'] = parse.day(row['3']);
    schedule['燃やすごみ'] = parse.day(row['4']);
    schedule['燃やさないごみ'] = parse.day(row['5']);
    schedule['粗大ごみ'] = parse.day(row['6']);
    parse.assignVal(addr, schedule);
    res = parse.merge(res, addr);
  }
  return res;
};