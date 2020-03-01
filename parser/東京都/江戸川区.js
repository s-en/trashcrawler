const parse = require('../parse.js');

const getLast = (str) => {
  const ary = str.split(/\n|\t/g);
  return ary[ary.length-1];
};

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    let town = row['0'].replace(/\n|\t/g, '');
    let chou = row['1'];
    // 以外を除外
    chou = chou.replace(/\(.*?以外\)/, '');
    // 不要文字は削除
    chou = chou.replace('289号線','').replace('環7通り','').replace(/[^0-9号丁目‘番･~,]/g, '');
    // 例外変換
    if(row['1'].match(/^\(([0-9~･]+)\)/)) {
      const mat = row['1'].match(/\(([0-9~･]+)\)/g);
      chou = '';
      for(let m=0; m<mat.length; m++){
        chou += mat[m].replace(/[()]/g,'')+'番';
      }
    }
    if(row['1'].match('都営清新町2丁目第2ｱﾊﾟｰﾄ'))chou = '2番1号';
    if(chou.match(/\d$/)){
      // 末尾が数字なら、それは番地と推定
      chou += '番';
    }
    const addr = parse.address(town+chou);
    const schedule = {};
    schedule['資源ごみ'] = parse.day(getLast(row['2']));
    schedule['燃やすごみ'] = parse.day(getLast(row['3']));
    schedule['燃やさないごみ'] = parse.day(getLast(row['4']));
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