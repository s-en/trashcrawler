const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    let town = row[0]+row[1]+row[2];
    const addr = parse.address(town);
    const schedule = {};
    schedule['可燃ごみ'] = parse.day(row[3]);
    schedule['不燃ごみ'] = parse.day(row[4]);
    schedule['古紙ごみ'] = parse.day(row[5]);
    schedule['びん・缶・ペットボトルごみ'] = parse.day(row[6]);
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