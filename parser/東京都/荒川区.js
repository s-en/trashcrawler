const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    let town = row['0'];
    if(!town)continue;
    town = town.replace(/\(.*?\)/g, ''); // カッコは削除
    const addr = parse.address(town);
    const schedule = {};
    schedule['燃やすごみ'] = parse.day(row['1']);
    schedule['燃やさないごみ'] = parse.day(row['2']);
    let skip = 0;
    for(const t in schedule){
      if(schedule[t].length === 0){
        // 空データはスキップ
        skip = 1; break;
      }
    }
    if(skip)continue;
    parse.assignVal(addr, schedule);
    res = parse.merge(res, addr);
  }
  return res;
};