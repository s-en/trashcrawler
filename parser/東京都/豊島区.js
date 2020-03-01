const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    let town = row['2'];
    if(!town)continue;
    town = town.replace(/\\n/g, '').replace(/ /g, '').replace(/\(.+?[^号]\)/g, '');　// カッコ内の末尾が「号」以外のカッコは削除
    town = town.replace(/[()]/g, '');
    const addr = parse.address(town);
    const schedule = {};
    schedule['ビン・缶・ペットボトルごみ'] = parse.day(row['3']);
    schedule['紙・布ごみ'] = parse.day(row['4']);
    schedule['燃やすごみ'] = parse.day(row['5']);
    schedule['金属・陶器・ガラスごみ'] = parse.day(row['6']);
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