const pdf2json = require('../tools/pdf2json.js');
require("../lib/pdfjs/domstubs.js").setStubs(global);
const pdfjs = require('../lib/pdfjs/build/pdf.js');//require('pdfjs-dist');
pdfjs.GlobalWorkerOptions.workerSrc = './pdf.worker.js';

module.exports.get = async (url, pageno) => {
  return new Promise(async (ok, ng) => {
    try {
      const pdf = await pdfjs.getDocument({
        url: url,
        cMapUrl: 'https://unpkg.com/pdfjs-dist@1.9.426/cmaps/',
        cMapPacked: true,
      }).promise;
      const json = await pdf2json(pdf, pageno);
      const p = await pdf.getPage(2);
      const text = await p.getTextContent();
      const viewport = p.getViewport({ scale: 1.5 });
      let tx = pdfjs.Util.transform(
        pdfjs.Util.transform(viewport.transform, text.items[1].transform),
        [1, 0, 0, -1, 0, 0]
      );
      tx = pdfjs.Util.transform(
        pdfjs.Util.transform(viewport.transform, text.items[2].transform),
        [1, 0, 0, -1, 0, 0]
      );
      ok(json);
    } catch (error) {
      ng(error);
    }
  })
};