const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    let town = row['0'];
    const addr = parse.address(town);
    const schedule = {};
    schedule['資源ごみ'] = parse.day(row['1']);
    schedule['燃やすごみ'] = parse.day(row['2']);
    schedule['燃やさないごみ'] = parse.day(row['3']);
    parse.assignVal(addr, schedule);
    res = parse.merge(res, addr);
  }
  return res;
};