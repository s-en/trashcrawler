const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(const row of table) {
    if(row['0'] === '台 場'){
      // 台場だけ特殊処理
      let town = row['0'];
      let chou = row['1'].replace(/\\n/g, '');
      const addr = parse.address(town+chou);
      const schedule = {};
      schedule['プラスチックごみ'] = parse.day(row['2']);
      schedule['ビン・缶ごみ'] = parse.day(row['3']);
      schedule['ペットボトル・古紙ごみ'] = parse.day(row['4']);
      schedule['可燃ごみ'] = parse.day(row['5']);
      schedule['不燃ごみ'] = parse.day(row['6']);
      parse.assignVal(addr, schedule);
      res = parse.merge(res, addr);
      continue;
    }
    let base = Object.keys(row).length===6?0:1;
    let town = row[`${base+0}`];
    let chou = row[`${base+1}`];
    // 丁目を頭に持ってくる
    const hit = chou.match(/\\n[0-9]+丁目/g);
    if(hit && hit.length === 1){
      chou = hit[0] + chou.replace(/\\n[0-9]+丁目/, '');
    }
    chou = chou.replace(/\\n/g, '');
    const addr = parse.address(town+chou);
    const schedule = {};
    schedule['プラスチックごみ'] = parse.day(row[`${base+2}`]);
    schedule['資源ペットボトル・ビン・缶・古紙ごみ'] = parse.day(row[`${base+3}`]);
    schedule['可燃ごみ'] = parse.day(row[`${base+4}`]);
    schedule['不燃ごみ'] = parse.day(row[`${base+5}`]);
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