const pdf2json = require('../tools/pdf2json.js');
require("../lib/pdfjs/domstubs.js").setStubs(global);
const pdfjs = require('../lib/pdfjs/build/pdf.js');//require('pdfjs-dist');
pdfjs.GlobalWorkerOptions.workerSrc = './pdf.worker.js';

// 座標からむりやりテーブルを予測してjsonで返却
module.exports.get = async (url, pageno) => {
  return new Promise(async (ok, ng) => {
    try {
      const pdf = await pdfjs.getDocument({
        url: url,
        cMapUrl: 'https://unpkg.com/pdfjs-dist@1.9.426/cmaps/',
        cMapPacked: true,
      }).promise;
      const json = [];
      for(let pn of pageno){
        console.log('page'+pn);
        const p = await pdf.getPage(pn);
        const text = await p.getTextContent();
        const viewport = p.getViewport({ scale: 1.5 });
        const texts = [];
        //text.items = [text.items[110],text.items[111],text.items[112],text.items[113],text.items[114]]
        for(const item of text.items){
          const tx = pdfjs.Util.transform(
            pdfjs.Util.transform(viewport.transform, item.transform),
            [1, 0, 0, -1, 0, 0]
          );
          texts.push({
            text: item.str.replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, ''),
            x: Math.round(tx[4]/5),
            y: Math.round(tx[5]/5)
          });
          //console.log(item.str.replace(/\n/g, ''));
        }
        //console.log(texts);
        //
        // テーブル化
        //
        const table = [];
        // 列を推測
        const colCnt = {};
        for(const t of texts){
          colCnt[t.x] = colCnt[t.x] || 0;
          colCnt[t.x] += 1;
        }
        let cols = Object.keys(colCnt).filter(x => colCnt[x] >= 2);
        cols = cols.sort((a,b) => Number(a)-Number(b));
        // const reduceCols = [];
        // let curCol = [];
        // for(const col of cols){
        //   if(curCol.length === 0){
        //     curCol.push(col);
        //   } else {
        //     const lastCol = curCol[curCol.length-1];
        //     if(Number(col) - Number(lastCol) < 0){
        //       curCol.push(col);
        //     } else {
        //       reduceCols.push(curCol);
        //       curCol = [];
        //     }
        //   }
        // }
        // if(curCol.length > 0)reduceCols.push(curCol);
        // console.log(reduceCols);
        const colStartEnd = [];
        // for(const row of reduceCols){
        //   const start = row[0];
        //   let end = row[0];
        //   if(row.length > 0)end = row[row.length-1];
        //   colStartEnd.push({
        //     start: start,
        //     end: end
        //   });
        // }
        for(let i=1; i<cols.length; i++){
          colStartEnd.push({
            start: Number(cols[i-1]),
            end: Math.max(Number(cols[i]), Number(cols[i-1]))
          });
        }

        // 行を推測
        const rowCnt = {};
        for(const t of texts){
          rowCnt[t.y] = rowCnt[t.y] || 0;
          rowCnt[t.y] += 1;
        }
        let rows = Object.keys(rowCnt).filter(y => rowCnt[y] >= 3);
        rows = rows.sort((a,b) => Number(a)-Number(b));
        // const reduceRows = [];
        // let curRow = [];
        // for(const col of rows){
        //   if(curRow.length === 0){
        //     curRow.push(col);
        //   } else {
        //     const lastCol = curRow[curRow.length-1];
        //     if(Number(col) - Number(lastCol) < 0){
        //       curRow.push(col);
        //     } else {
        //       reduceRows.push(curRow);
        //       curRow = [];
        //     }
        //   }
        // }
        // if(curRow.length > 0)reduceRows.push(curRow);
        // console.log(reduceRows);
        const rowStartEnd = [];
        // for(const row of reduceRows){
        //   const start = row[0];
        //   let end = row[0];
        //   if(row.length > 0)end = row[row.length-1];
        //   rowStartEnd.push({
        //     start: start,
        //     end: end
        //   });
        // }
        for(let i=1; i<rows.length; i++){
          rowStartEnd.push({
            start: Number(rows[i-1]),
            end: Number(rows[i])
          });
        }

        let test = texts.filter(t => t.y === 206).map(t => t.text);
        test = texts.filter(t => t.x === 104).map(t => t.text);

        for(const cn of colStartEnd){
          const colTexts = texts.filter(t => t.x >= cn.start && t.x < cn.end);
          //console.log(colTexts.sort((a,b) => a.y-b.y).map(t => t.text));
        }
        
        // 行と列の矩形の中にいるテキストをテーブル化
        for(const rn of rowStartEnd){
          const rowTexts = texts.filter(t => t.y >= rn.start && t.y < rn.end);
          //console.log(rowTexts.sort((a,b) => a.x-b.x).map(t => t.text));
          const newRow = [];
          for(const cn of colStartEnd){
            let colTexts = rowTexts.filter(t => t.x >= cn.start && t.x < cn.end);
            colTexts = colTexts.sort((a,b) => a.y-b.y);
            //console.log(colTexts.map(t => t.text));
            newRow.push(colTexts.map(c => c.text).join(''));
          }
          table.push(newRow);
          //table.push(rowTexts.map(c => c.text).join(''));
        }
      }
      ok(json);
    } catch (error) {
      ng(error);
    }
  })
};