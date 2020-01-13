const bunbetsu = require('./config/bunbetsu.json');
const pdf = require('./crawler/pdf.js');
const htmltable = require('./crawler/htmltable.js');
const jconv = require('jaconv');
const fs = require('fs');
const beautify = require("json-beautify");

(async () => {
  const calendar = {};
  for (const ken in bunbetsu) {
    for (const shi in bunbetsu[ken]) {
      const urls = bunbetsu[ken][shi];
      if (urls.length === 0) continue;
      //if(shi !== '中央区')continue;
      console.log(`${ken} ${shi}`);
      let table = [];
      // pdfファイル取得&json変換
      for (const url of urls) {
        // ページタイプ判判定
        if(url.match(/\.pdf$/)) {
          const pdfjson = await pdf.get(url);
          for(const page of pdfjson.pageTables){
            const t = page.tables;
            // セル結合適用
            for(const key in page.merges){
              const r = page.merges[key];
              for(let x=r.col; x<r.col+r.width; x++){
                for(let y=r.row; y<r.row+r.height; y++){
                  t[y][x] = t[r.row][r.col];
                }
              }
            }
            // 結果に追加
            table = [...table, ...t];
          }
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
            // 全角数字変換
            table[i][c] = jconv.toHan(table[i][c]);
            // 漢数字変換
            table[i][c] = table[i][c].replace(/一/g, '1').replace(/二/g, '2').replace(/三/g, '3').replace(/四/g, '4').replace(/五/g, '5').replace(/六/g, '6').replace(/七/g, '7').replace(/八/g, '8').replace(/九/g, '9').replace(/〇/g, '0');
          }
        }else{
          for(const k of Object.keys(table[i])){
            // 全角数字変換
            table[i][k] = jconv.toHan(table[i][k]);
            // 漢数字変換
            table[i][k] = table[i][k].replace(/一/g, '1').replace(/二/g, '2').replace(/三/g, '3').replace(/四/g, '4').replace(/五/g, '5').replace(/六/g, '6').replace(/七/g, '7').replace(/八/g, '8').replace(/九/g, '9').replace(/〇/g, '0');
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


