const parse = require('../parse.js');

module.exports.parse = (table) => {
  console.log(table);
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    //console.log(row[1]);
    const addr = parse.address(row[1]+row[2]+row[3]);
    const schedule = {};
    schedule['燃やすごみ'] = parse.day(row[4]);
    schedule['陶器ガラス金属ごみ'] = parse.day(row[5]);
    schedule['資源ごみ'] = parse.day(row[6]);
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