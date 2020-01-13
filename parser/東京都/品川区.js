const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(const row of table) {
    let town = row[1];
    let chou = parse.block(row[2]);
    let ban = parse.block(row[3]);
    let gou = row[3].split('番');
    if(gou.length === 2){
      gou = parse.block(gou[1]);
    }else{
      gou = false;
    }
    const schedule = {};
    if(!town){
      continue;
    }
    if(table[0]){
      // ゴミ種別ごとの曜日
      schedule['燃やすごみ'] = parse.day(row[4]);
      schedule['陶器ガラス金属ごみ'] = parse.day(row[5]);
      schedule['資源ごみ'] = parse.day(row[6]);
    }
    parse.mergeEach(res, schedule, town, chou, ban, gou);
  }
  // ヘッダを削除
  delete res['町名'];
  return res;
};