const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(const row of table) {
    const towns = row['0'].split(/\n|   |\\n/);
    if(!row['1'] || !row['3'] || !row['4']){
      continue;
    }
    for(const town of towns){
      const addr = parse.address(town);
      const schedule = {};
      schedule['資源ごみ'] = parse.day(row['1'].replace(/\\n| /g, ''));
      schedule['燃やすごみ'] = parse.day(row['2'].replace(/\\n| /g, ''));
      schedule['燃やさないごみ'] = parse.day(row['3'].replace(/\\n| /g, ''));
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