const bunbetsu = require('./config/bunbetsu.json');
const htmltable = require('./crawler/htmltable.js');
const jconv = require('jaconv');
const csv = require('async-csv');
const fs = require('fs');
const beautify = require("json-beautify");
const pdf2html = require('./crawler/pdf2html.js');
const radical2kanji = require('./crawler/radical2kanji.js');

const convert = (str) => {
  // 日本語以外の漢字変換
  str = radical2kanji(str);
  // 全角数字変換
  str = jconv.toHan(str);
  // 漢数字変換
  str = str.replace(/一/g, '1').replace(/二/g, '2').replace(/三/g, '3').replace(/四/g, '4').replace(/五/g, '5').replace(/六/g, '6').replace(/七/g, '7').replace(/八/g, '8').replace(/九/g, '9').replace(/〇/g, '0');
  // 記号変換
  str = str.replace(/､/g, ',').replace(/(\d)(丁目?)?から(\d)/g, '$1~$3').replace('除く', '以外');
  // 丸文字変換
  str = str.replace('①', '1').replace('②', '2').replace('③', '3').replace('④', '4');
  // チルダ変換
  str = str.replace(/〜/g, '~');
  return str;
};

(async () => {
  const calendar = {};
  for (const ken in bunbetsu) {
    for (const shi in bunbetsu[ken]) {
      const urls = bunbetsu[ken][shi];
      if (urls.length === 0) continue;
      // if(shi !== '江東区')continue;
      console.log(`${ken} ${shi}`);
      let table = [];
      // pdfファイル取得&json変換
      for (let [urlno, url] of urls.entries()) {
        // ページタイプ判判定
        let option = '';
        let type = '';
        if(typeof url === 'object'){
          if(url.option)option = url.option;
          if(url.type)type = url.type;
          url = url.url;
        }
        if(url.match(/\.pdf$/)) {
          let t = await pdf2html.get(url, ken, `${shi}-${urlno}`, option);
          if (type === 'csv') {
            const csvString = await fs.promises.readFile(`./rawdata/${ken}/${shi}.csv`, 'utf-8');
            t = await csv.parse(csvString);
          }
          table = [...table, ...t];
        } else {
          // html
          const pages = await htmltable.get(url);
          for(const p of pages){
            table = [...table, ...p];
          }
        }
      }
      
      for(let i=0;i<table.length;i++){
        if(Array.isArray(table[i])){
          for(let c=0;c<table[i].length;c++) {
            // 変換
            table[i][c] = convert(table[i][c]);
          }
        }else{
          for(const k of Object.keys(table[i])){
            // 変換
            table[i][k] = convert(table[i][k]);
          }
        }

      }
      // 取得データを保存
      await fs.promises.mkdir(`${__dirname}\\rawdata\\${ken}`, { recursive: true }).catch(console.error);
      await fs.writeFileSync(`${__dirname}\\rawdata\\${ken}\\${shi}.json`, beautify(table, null, 2, 100));
      // 市町村ごとにパース
      const parser = require(`./parser/${ken}/${shi}.js`);
      const res = parser.parse(table);
      //console.log(res);
      calendar[ken] = calendar[ken] || {};
      calendar[ken][shi] = res;
    }
  }
  await fs.writeFileSync(`${__dirname}\\calendar.json`, beautify(calendar, null, 2, 120));
})();


