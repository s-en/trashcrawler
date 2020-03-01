const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    if ('12' in table[i]) {
      continue;
    }
    for(let r=0; r<2; r++) {
      const base = r*6;
      const row = table[i];
      let town = row[`${(1+base)}`];
      let chou = row[`${(2+base)}`].replace(/[()]/g, '');
      const addr = parse.address(town+chou);
      const schedule = {};
      schedule['燃やすごみ'] = parse.day(row[`${(3+base)}`]);
      schedule['燃やさないごみ'] = parse.day(row[`${(4+base)}`]);
      schedule['資源ごみ'] = parse.day(row[`${(5+base)}`]);
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
  }
  return res;
};