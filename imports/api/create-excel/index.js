import XLSX from 'xlsx';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import writeWorkbook from './write-workbook/index';
import saveExcel from './save-excel/index';

export default function createExcel(table, dbName) {

  var title = tools.translate(dbName) || dbName;

  table.unshift([["Database:"], title], []);

  var workbook = writeWorkbook(table);

  var extension = ".xlsx";
  var hour = moment().format("HH-mm");
  var date = moment().format("DD-MM-YY");
  var filename = `${title}_${hour}_${date}${extension}`;

  var options = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  };

  var output = XLSX.write(workbook, options);

  saveExcel(output, filename);

}