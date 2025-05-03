self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');

self.onmessage = function (e) {
  try {
    const { buffer } = e.data;
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const html = XLSX.utils.sheet_to_html(sheet);
    self.postMessage({ html });
  } catch (err) {
    self.postMessage({ error: err.message });
  }
};
