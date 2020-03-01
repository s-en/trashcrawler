const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=1; i<table.length; i++) {
    const row = table[i];
    let town = row['0'];
    let chouban = row['1'];
    // スペースを削除
    town = town.replace(/ /g, '');
    if(chouban.match(/\d$/)){
      // 末尾が数字なら、それは番地と推定
      chouban += '番';
    }
    const addr = parse.address(town+chouban);
    const schedule = {};
    schedule['可燃ごみ'] = parse.day(row['2']);
    schedule['不燃ごみ'] = parse.day(row['3']);
    schedule['資源ごみ'] = parse.day(row['4']);
    schedule['粗大ごみ'] = parse.day(row['5']);
    if(!schedule['可燃ごみ'] || schedule['可燃ごみ'].length === 0 || town.length > 30){
      continue;
    }
    parse.assignVal(addr, schedule);
    res = parse.merge(res, addr);
  }
  return res;
};