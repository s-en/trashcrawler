const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    if(!row[1])continue;
    let chous = row[2].replace(/〔|\(|\)|全域/g, '').split(/(.+?丁目)[･]/g).filter(s => s && s !== '');
    let chous2 = [];
    for(let chou of chous){
      chous2.push(...chou.split('〕').filter(s => s && s !== ''));
    }
    if(chous2.length === 0){
      chous2 = [''];
    }
    for(const chou of chous2){
      const location = row[1]+chou;
      const addr = parse.address(location);
      const schedule = {};
      schedule['資源ごみ'] = parse.day(row[3]);
      schedule['可燃ごみ'] = parse.day(row[4]);
      schedule['不燃ごみ'] = parse.day(row[5]);
      if(!schedule['資源ごみ'] || schedule['資源ごみ'].length === 0){
        continue;
      }
      parse.assignVal(addr, schedule);
      res = parse.merge(res, addr);
    }
  }
  return res;
};