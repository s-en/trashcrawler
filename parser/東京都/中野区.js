const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    let town = row['0'];
    let chou = row['1'].replace('全域', '');
    const addr = parse.address(town+chou);
    const schedule = {};
    schedule['プラスチックごみ'] = parse.day(row['2']);
    schedule['びん・缶ペットボトルごみ'] = parse.day(row['3']);
    schedule['燃やすごみ'] = parse.day(row['4']);
    schedule['陶器・ガラス・金属ごみ'] = parse.day(row['5']);
    parse.assignVal(addr, schedule);
    res = parse.merge(res, addr);
  }
  return res;
};