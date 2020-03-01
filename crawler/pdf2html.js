const fetch = require('node-fetch');
const fs = require('fs');
const execSync = require('child_process').execSync;
const htmltable = require('./htmltable.js');

module.exports.get = async (url, ken, fname, option) => {
  const resp = await fetch(url);
  // save pdf
  const folder = `rawpdf\\${ken}`;
  const path = `${folder}\\${fname}tmp.pdf`;
  await fs.promises.mkdir(folder, { recursive: true }).catch(console.error);
  await fs.writeFileSync(path, await resp.buffer());

  // convert to html
  const htmlpath = `rawdata\\${ken}`;
  await execSync(`crawler\\mutool.exe clean ${path} ${folder}\\${fname}.pdf`);
  await execSync(`del ${path}`);
  await execSync(`python ${__dirname}\\read_pdf.py ${ken} ${fname} "${option.replace(/"/g, '\\"')}"`);
  // html to json
  let files = fs.readdirSync(htmlpath).filter(f => f.match(fname));
  let table = [];
  for(const file of files){
    const buffer = await fs.readFileSync(`${htmlpath}\\${file}`);
    const pages = await htmltable.getByBuffer(buffer);
    for(const p of pages){
      table = [...table, ...p];
    }
  }
  return table;
};