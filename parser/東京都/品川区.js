const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    const town = row['1'];
    let chou = row['2'];
    if(row['3'] && !row['3'].match(/以外/)){
      chou = chou + row['3'];
    }
    const addr = parse.address(town + chou);
    const schedule = {};
    schedule['燃やすごみ'] = parse.day(row['4']);
    schedule['陶器ガラス金属ごみ'] = parse.day(row['5']);
    schedule['資源ごみ'] = parse.day(row['6']);
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