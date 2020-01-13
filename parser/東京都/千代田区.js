const parse = require('../parse.js');

module.exports.parse = (table) => {
  //console.log(table);
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    //console.log(row[1]);
    if(!row[2] || row[2].length > 30){
      // 空もしくは長すぎる行は無視
      continue;
    }
    const addr = parse.address(row[1]);
    const schedule = {};
    schedule['燃やすごみ'] = parse.day(row[2]);
    schedule['燃やさないごみ'] = parse.day(row[3]);
    schedule['資源ごみ'] = parse.day(row[4]);
    schedule['プラスチックごみ'] = parse.day(row[5]);
    let skip = 0;
    for(const t in schedule){
      if(schedule[t].length === 0){
        // 空データはスキップ
        skip = 1; break;
      }
    }
    if(skip)continue;
    //console.log(schedule);
    parse.assignVal(addr, schedule);
    res = parse.merge(res, addr);
  }
  return res;
};