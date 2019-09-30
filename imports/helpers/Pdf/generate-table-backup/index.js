export default function generateTable(data) {

  var header = explodeInnerArrays(data.header);
  header = styleHeader(header);

  var body = data.body || [];
  var footer = data.footer || [];

  var completeTable = header.concat(body, footer);

  completeTable = explodeInnerArrays(completeTable);
  completeTable = removeNull(completeTable);
  completeTable = fillRows(completeTable, data.widths);

  return {table: {
    widths: data.widths,
    body: completeTable
  }, style: 'table'}

}

function styleHeader(header) {
  if (!header) return header;
  return header.map((row) => {
    return row.map((cell) => {
      if (typeof cell === "object") {
        return {
          ...cell,
          bold: true
        }
      } else {
        return {
          text: cell,
          bold: true
        }
      }
    })
  })
}

function explodeInnerArrays(arrayOfRows) {
  if (!arrayOfRows) return arrayOfRows;
  return arrayOfRows.map((row) => {
    if (!row) return row;

    var newRow = [];
    row.forEach((cell) => {
      if (Array.isArray(cell)) {
        newRow = newRow.concat(cell);
      } else {
        newRow.push(cell);
      }
    })
    return newRow;
  })
}

function removeNull(arrayOfRows) {
  if (!arrayOfRows) return arrayOfRows;
  return arrayOfRows.map((row) => {
    var newRow = [];
    row.forEach((cell) => {
      if (cell !== undefined && cell !== null) {
        newRow.push(cell);
      }
    })
    return newRow;
  })
}

function fillRows(arrayOfRows, widths) {
  if (!arrayOfRows) return arrayOfRows;

  function getNumberOfColumns(arrayOfRows) {
    var numberOfColumns = 0;
    arrayOfRows.forEach((row) => {
      var currentRowNumber = 0;
      row.forEach((cell) => {
        if (typeof cell === "object") {
          if (typeof cell.colSpan === "number") {
            currentRowNumber += cell.colSpan;
          } else currentRowNumber++;
        } else currentRowNumber++;
      })
      if (currentRowNumber > numberOfColumns) {
        numberOfColumns = currentRowNumber;
      }
    })
    return numberOfColumns;
  }
  function fillGaps(arrayOfRows, numberOfColumns) {
    return arrayOfRows.map((row) => {
      var currentNumberOfColumns = 0;
      var fillCellIndex;
      var newRow = [];

      row.forEach((cell) => {
        newRow.push(cell);
        currentNumberOfColumns++;
        if (typeof cell === "object") {
          if (typeof cell.colSpan === "number") {
            for (var i = 0; i < cell.colSpan; i++) {
              newRow.push('');
              currentNumberOfColumns++;
            }
          } else if (cell.colSpan === "fill") {
            fillCellIndex = newRow.length-1;
          }
        }
      })

      if (fillCellIndex !== undefined) {
        var firstPart = newRow.slice(0, fillCellIndex+1);
        var lastPart = newRow.slice(fillCellIndex+1);

        for (var i = newRow.length; i < numberOfColumns; i++) {
          firstPart.push('');
        }
        newRow = firstPart.concat(lastPart);
      } else {
        if (numberOfColumns > newRow.length) {
          var lastItem = newRow[newRow.length-1];
          if (typeof lastItem === 'object') {
            lastItem.colSpan = numberOfColumns - newRow.length;
          } else {
            lastItem = {
              ...lastItem,
              colSpan: numberOfColumns - newRow.length
            }
          }
          for (var i = newRow.length; i < numberOfColumns; i++) {
            newRow.push('');
          }
        }
      }
      return newRow;
    })
  }
  return fillGaps(arrayOfRows, getNumberOfColumns(arrayOfRows));
}