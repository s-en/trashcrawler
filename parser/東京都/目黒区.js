const parse = require('../parse.js');

module.exports.parse = (table) => {
  let res = {};
  for(let i=0; i<table.length; i++) {
    const row = table[i];
    let location = row['1'];
    const addr = parse.address(location);
    const schedule = {};
    schedule['資源ごみ'] = parse.day(row['2']);
    schedule['燃やすごみ'] = parse.day(row['3']);
    schedule['燃やさないごみ'] = parse.day(row['4']);
    if(!schedule['資源ごみ'] || schedule['資源ごみ'].length === 0){
      continue;
    }
    parse.assignVal(addr, schedule);
    res = parse.merge(res, addr);
  }
  return res;
};