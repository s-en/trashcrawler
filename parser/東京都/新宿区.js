const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    let chou = row['0'];
    if(!chou || chou === '集積所の住所')continue;
    const addr = parse.address(chou);
    const schedule = {};
    schedule['資源ごみ'] = parse.day(row['1']);
    schedule['燃やすごみ'] = parse.day(row['2']);
    schedule['陶器ガラス金属ごみ'] = parse.day(row['3']);
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