const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    let town = row[0];
    if(!town)continue;
    let chou = row[1];
    if(chou === '都営光が丘第1ｱﾊﾟｰﾄ'){
      chou = '1丁目33番';
    }
    const addr = parse.address(town+chou);
    const schedule = {};
    schedule['可燃ごみ'] = parse.day(row[2]);
    schedule['不燃ごみ'] = parse.day(row[3]);
    schedule['プラスチック・古紙ごみ'] = parse.day(row[4]);
    schedule['びん・缶ごみ'] = parse.day(row[5]);
    schedule['ペットボトルごみ'] = parse.day(row[6]);
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