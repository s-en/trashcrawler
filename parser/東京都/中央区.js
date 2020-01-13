const parse = require('../parse.js');

module.exports.parse = (table) => {
  console.log(table);
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    //console.log(row[1]);
    let chou = row['丁目'];
    if(chou === '全域'){
      chou = '';
    }
    const addr = parse.address(row['町名']+chou);
    const schedule = {};
    schedule['燃やすごみ'] = parse.day(row['燃やすごみ']);
    schedule['燃やさないごみ'] = parse.day(row['燃やさないごみ']);
    schedule['プラスチックごみ'] = parse.day(row['プラマーク']);
    schedule['資源ごみ'] = parse.day(row['資源']);
    schedule['粗大ごみ'] = parse.day(row['粗大ごみ']);
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