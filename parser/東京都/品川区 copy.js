function parseAddress(addrStr){
  const res = [];
  let addr = addrStr;
  if(!addr || addr.length === 0){
    return false;
  }
  // 「xx以外」パターン
  if(addr.indexOf('以外') >= 0){
    return ['other'];
  }
  // 数値部分抜出
  addr = addr.match(/(\d+.*?)[丁番号]/);
  if(!addr){
    return false;
  }
  addr = addr[1];
  // 範囲指定パターン
  if(addr.indexOf('~') >= 0){
    const range = addr.match(/(\d+)~(\d+)/);
    if(range && range.length >= 2){
      const start = Number(range[1]);
      const end = Number(range[2]);
      for(let i=start; i<= end; i++){
        res.push(''+i);
      }
    }
    addr = addr.replace(/(\d+)~(\d+)/, '');
  }
  // 個別指定パターン
  const ary = addr.split('･');
  for(const n of ary){
    if(n){
      res.push(n);
    }
  }
  
  return res;
}
function parseDay(dayStr){
  const day = dayStr;
  const res = [];
  // 第xx 
  let reg = /第(\d)･*第*(\d)*[ \n]*([月火水木金土日])[曜]*/;
  let d = day.match(reg);
  if(d){
    if(d[3]){
      res.push({no: d[1], day: d[3]});
      res.push({no: d[2], day: d[3]});
    }else{
      res.push({no: d[1], day: d[2]});
    }
    return res;
  }
  // 複数曜日
  reg = /([月火水木金土日])[曜]*[ ･\n]*([月火水木金土日])*[曜]*/;
  d = day.match(reg);
  if(d){
    res.push({day: d[1]});
    if(d[2])res.push({day: d[2]});
  }
  return res;
}

module.exports.parse = (table) => {
  const res = {};
  for(const row of table) {
    let town = row[1];
    let chou = parseAddress(row[2]);
    let ban = parseAddress(row[3]);
    let gou = row[3].split('番');
    if(gou.length === 2){
      gou = parseAddress(gou[1]);
    }else{
      gou = false;
    }
    const schedule = {};
    if(!town){
      continue;
    }
    if(table[0]){
      // ゴミ種別ごとの曜日
      schedule[table[0][4]] = parseDay(row[4]);
      schedule[table[0][5]] = parseDay(row[5]);
      schedule[table[0][6]] = parseDay(row[6]);
    }
    res[town] = res[town] || {};
    if(!chou){
      res[town]['other'] = schedule;
      continue;
    }
    for(const c of chou){
      res[town][c] = res[town][c] || {};
      if(!ban){
        res[town][c]['other'] = schedule;
        continue;
      }
      for(const b of ban){
        res[town][c][b] = res[town][c][b] || {};
        if(!gou){
          res[town][c][b]['other'] = schedule;
          continue;
        }
        for(const g of gou){
          res[town][c][b][g] = schedule;
        }
      }
    }
  }
  // ヘッダを削除
  delete res['町名'];
  return res;
};