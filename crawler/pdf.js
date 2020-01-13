const pdf2json = require('../tools/pdf2json.js');
const fetch = require('node-fetch');
const pdfjs = require('pdfjs-dist');

module.exports.get = async (url) => {
  return new Promise(async (ok, ng) => {
    try {
      const response = await fetch(url);
      const buffer = await response.buffer();
      const pdf = await pdfjs.getDocument(buffer).promise;
      const json = await pdf2json(pdf);
      ok(json);
    } catch (error) {
      ng(error);
    }
  })
};