const PDFParser = require('pdf2json');
const fetch = require('node-fetch');

module.exports.get = async (url) => {
  const pdfParser = new PDFParser();

  return new Promise(async (ok, ng) => {
    try {
      pdfParser.on('pdfParser_dataError', errData => ng(errData) );
      pdfParser.on('pdfParser_dataReady', pdfData => {
        const json = JSON.parse(decodeURI(JSON.stringify(pdfData)));
        let res = [];
        for (let [i, page] of json.formImage.Pages.entries()) {
          const data = page.Texts.map(t => {
            return {
              x:t.x,
              y:t.y + i*10000,
              t:t.R[0].T
            }
          });
          res = [...res, ...data];
        }
        ok(res);
      });
      const response = await fetch(url);
      pdfParser.parseBuffer(await response.buffer());
    } catch (error) {
      ng(error);
    }
  })
};