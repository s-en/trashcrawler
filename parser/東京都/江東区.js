const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    let town = row['0'];
    const addr = parse.address(town);
    const schedule = {};
    schedule['資源ごみ'] = parse.day(row['2']);
    schedule['プラスチックごみ'] = parse.day(row['3']);
    schedule['燃やすごみ'] = parse.day(row['4']);
    schedule['燃やさないごみ'] = parse.day(row['5']);
    schedule['粗大ごみ'] = parse.day(row['6']);
    // 隔週
    if(['1','2','9','10','11','12'].includes(row['1'])){
      const days = schedule['燃やさないごみ'];
      for(d of days){
        d['window'] = '1';
      }
    }
    if(['3','4','5','6','7','8'].includes(row['1'])){
      const days = schedule['燃やさないごみ'];
      for(d of days){
        d['window'] = '2';
      }
    }
    parse.assignVal(addr, schedule);
    res = parse.merge(res, addr);
  }
  return res;
};