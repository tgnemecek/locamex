import { saveAs } from 'file-saver';

export default function saveExcel(output, filename) {
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  saveAs(new Blob( [s2ab(output)], {type:""} ), filename);
}