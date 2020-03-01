const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    let base = 1;
    if('23' in row){
      base = 2;
    }
    let town = row[`${base+0}`];
    let chou = row[`${base+1}`];
    if(!town || !chou){
      continue;
    }
    chou = chou.replace(/ |\\n/g, '');
    if(!chou.match(/^[0-9]+/)){
      chou = chou.replace(/[^0-9･~]/g, '') + '丁目';
    }else{
      chou = chou.replace(/\\n/g, '');
    }
    town = town.split('\\n');
    if(town.length !== 2){
      continue;
    }
    town = town[0];
    town = town.replace(/ /g, '');
    const addr = parse.address(town+chou);
    const schedule = {};
    schedule['びん・缶・プラごみ'] = parse.day(row[`${base+3}`]);
    schedule['古紙・ペットボトルごみ'] = parse.day(row[`${base+4}`]);
    schedule['可燃ごみ'] = parse.day(row[`${base+5}`]);
    schedule['不燃ごみ'] = parse.day(row[`${base+6}`]+row[`${base+7}`]);
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