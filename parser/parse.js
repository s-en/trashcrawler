const numReg = `[0-9]+|の?偶数|の?奇数`;
const townReg = new RegExp(`^(.+?)($|[( ]|(${numReg})([~･,](${numReg}))*[丁番])`);
const addrReg = new RegExp(`^[･,()]?(${numReg})([丁番号][目地]?)?(~(${numReg})([丁番号]?[目地]?))?|([･,](${numReg})([丁番号]?[目地]?))?`);

const DAYS = ['月','火','水','木','金','土','日'];

module.exports.address = function(addrStr){
  const res = {};
  let addr = addrStr;
  if(!addr || addr.length === 0){
    return false;
  }
  // 不要な文字を削除
  addr = addr.replace(/ /g, '').replace(/\n/g, '').replace('全域', '').replace(/\(.*以外\)/g, '').replace(/[上下]記以外の?(地域)?/, '');
  let town = '';
  let chou = [];
  let ban = [];
  // 町名取得
  //let reg = /^(.+?)($|[0-9]+([~･][0-9][丁番])*)/;
  let reg = townReg;
  let str = addr.match(reg);
  if(str && str[1]){
    town = str[1];
    res[town] = res[town] || {};
    addr = addr.replace(str[1], '').trim();
  }
  let cnt = 0;
  let prevType = '';
  while(addr.length > 0 && cnt++ < 100){
    // 数字部分取得
    //reg = /^･?([0-9]+)([丁番号][目地]?)?(~([0-9]+)([丁番号]?[目地]?))?|(･([0-9]+)([丁番号]?[目地]?))?/;
    reg = addrReg;
    str = addr.match(reg);
    //console.log(str);
    if(!str){
      console.error(addr);
      console.error(str);
      break;
    }
    const range = [];
    let start = Number(str[1]);
    if(start){
      range.push(start+'');
    }
    if(str[4]){
      // ～指定
      const end = Number(str[4]);
      start = start?start+1:end;
      for(let i=start;i<=end;i++){
        range.push(i+'');
      }
    }
    if(str[7]){
      // ・指定
      range.push(str[7]);
    }
    // 偶数、奇数
    if(str[1] && str[1].indexOf('偶数') >= 0){
      range.push('even');
    }
    if(str[1] && str[1].indexOf('奇数') >= 0){
      range.push('odd');
    }
    // xx以外
    if(str[1] && str[1].indexOf('以外') >= 0){
      range.push('other');
    }
    //console.log(range);
    // 種別判定
    let type = '';
    let min = 1000;
    let num = addr.indexOf('丁');
    if(num >=0 && num < min){ min = num; type = 'chou'; }
    num = addr.indexOf('番');
    if(num >=0 && num < min){ min = num; type = 'ban'; }
    num = addr.indexOf('号');
    if(num >=0 && num < min){ min = num; type = 'gou'; }
    // ヒットした文字を削除
    addr = addr.replace(str[0], '').trim();
    // 種類ごとに処理
    if(type === 'chou'){
      chou=[];
      if(type !== prevType){
        // 違うタイプに切り替わった場合、今までの累計番号を消す
        ban=[];
      }
      for(const n of range){
        res[town][n] = res[town][n] || {};
        chou.push(n);
      }
    }else if(type === 'ban'){
      type = 'ban';
      if(chou.length === 0){
        chou = ['other'];
        res[town]['other'] = res[town]['other'] || {};
      }
      ban = [];
      for(const c of chou){
        for(const n of range){
          res[town][c][n] = res[town][c][n] || {};
          ban.push(n);
        }
      }
    }else if(type === 'gou'){
      type = 'gou';
      if(chou.length === 0){
        chou = ['other'];
        res[town]['other'] = res[town]['other'] || {};
      }
      for(const c of chou){
        if(ban.length === 0){
          ban = ['other'];
          res[town][chou]['other'] = res[town][chou]['other'] || {};
        }
        for(const b of ban){
          for(const n of range){
            res[town][c][b][n] = res[town][c][b][n] || {};
          }
        }
      }
    }
    prevType = type;
  }
  
  return res;
}

module.exports.block = function(addrStr) {
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
module.exports.day = function (dayStr) {
  if(!dayStr)return [];
  dayStr = dayStr.replace(/㈪/g,'月').replace(/㈫/g,'火').replace(/㈬/g,'水').replace(/㈭/g,'木').replace(/㈮/g,'金').replace(/㈯/g,'土').replace(/㈰/g,'日');
  const day = dayStr.replace(/⾦/g,'金').replace(/⽇/g,'日').replace(/ /g, '').replace(/\\n/g, '');
  const res = [];
  // 第xx 
  let reg = /第(\d)･*第*(\d)*[ \n]*([月火水木金土日])[曜日?]?/;
  let d = day.match(reg);
  if(d){
    if(d[3]){
      if(d[1])res.push({no: d[1], day: d[3]});
      if(d[2])res.push({no: d[2], day: d[3]});
    }else{
      res.push({no: d[1], day: d[2]});
    }
    return res;
  }
  // 管路
  reg = /管路/;
  if(day.match(reg)){
    return [{ day: '管路'}];
  }

  // ～回目の～曜日
  reg = /((\d)回?目?)(･(\d)回目)?の?([月火水木金土日])[曜日?]?/;
  d = day.match(reg);
  if(d){
    const n1 = d[2];
    const n2 = d[4];
    const you = d[5];
    if(n1 && you){
      res.push({no: n1, day: you});
      res.push({no: n2, day: you});
    }
    return res;
  }
  
  // 範囲
  let ds = day.split('~');
  if(ds.length === 2){
    const start = DAYS.findIndex(d => ds[0].indexOf(d) >= 0);
    const end = DAYS.findIndex(d => ds[1].indexOf(d) >= 0);
    if(start >= 0 && end >= 0){
      let max = end;
      if(end < start)max = start + (7 - end);
      for(let i=start;i<=max; i++){
        const dn = i%7;
        res.push({day: DAYS[dn]});
      }
    }
  }else{
    // 複数曜日
    reg = /([月火水木金土日])(曜日|曜)?/g;
    ds = day.match(reg);
    if(ds){
      for(d of ds){
        reg = /([月火水木金土日])?/;
        d = d.match(reg);
        if(d)res.push({day: d[1]});
      }
    }
  }
  return res;
}

module.exports.merge = function (obj1, obj2) {
  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if ( obj2[p].constructor==Object ) {
        obj1[p] = module.exports.merge(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}
module.exports.mergeEach = function (res, schedule, town, chou, ban, gou) {
  res[town] = res[town] || {};
  if(!chou){
    res[town]['other'] = schedule;
    return;
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
  return res;
}

module.exports.assignVal = function(o, val){
  if(typeof o !== 'object')return;
  const keys = Object.keys(o);
  if(keys.length === 0)o = Object.assign(o, val);
  for(const k of keys)module.exports.assignVal(o[k], val);
}