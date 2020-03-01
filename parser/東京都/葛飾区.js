const parse = require('../parse.js');

const cols = [
  ['1', '2', '3', '4', '5', '6'],
  ['7', '8', '9', '11', '12', '13'],
  ['14', '15', '16', '17', '18', '19']
];

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    if(!('20' in row))continue;
    for(const col of cols) {
      let town = row[col[0]].replace(/\\n/g, '');
      const chou = row[col[1]];
      const addr = parse.address(town+chou);
      const schedule = {};
      schedule['燃やさないごみ'] = parse.day(row[col[2]]);
      schedule['プラごみ'] = parse.day(row[col[3]]);
      schedule['資源ごみ'] = parse.day(row[col[4]]);
      schedule['燃やすごみ'] = parse.day(row[col[5]]);
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