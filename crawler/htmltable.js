const tabletojson = require('tabletojson');
const iconv = require('iconv-lite');
const Encoding = require('encoding-japanese');
const fetch = require('node-fetch');

module.exports.get = async (url) => {
  const res = await fetch(url);
  const buffer = await res.buffer();
  const charcode = Encoding.detect(buffer);
  const html = iconv.decode(buffer, charcode);
  const converted = tabletojson.convert(html,{
    forceIndexAsNumber: true
  });
  return converted;
};

module.exports.getByBuffer = async (buffer) => {
  const charcode = Encoding.detect(buffer);
  const html = iconv.decode(buffer, charcode);
  const converted = tabletojson.convert(html,{
    forceIndexAsNumber: true
  });
  return converted;
};