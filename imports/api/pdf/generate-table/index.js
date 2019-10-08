export default function generateTable(data) {

  var header = data.header || [];
  var body = data.body || [];
  var footer = data.footer || [];


  header = explodeInnerArrays(header);
  header = styleHeader(header);

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
  var newHeader = [];
  header.forEach((row) => {
    if (row) {
      var newRow = row.map((cell) => {
        if (cell) {
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
        }
      })
      newHeader.push(newRow);
    }
  })
  return newHeader;
}

function explodeInnerArrays(arrayOfRows) {
  if (!arrayOfRows) return arrayOfRows;
  var newArrayOfRows = [];
  arrayOfRows.forEach((row) => {
    if (!row) return row;

    for (var i = 0; i < row.length; i++) {
      if (Array.isArray(row[i])) {
        newArrayOfRows.push(row[i]);
        // newRow = newRow.concat(cell);
      } else {
        newArrayOfRows.push(row);
        break;
        // newRow.push(cell);
      }
    }
  })
  return newArrayOfRows;
}

// function explodeInnerArrays(arrayOfRows) {
//   if (!arrayOfRows) return arrayOfRows;
//   return arrayOfRows.map((row) => {
//     if (!row) return row;
//
//     var newRow = [];
//     row.forEach((cell) => {
//       if (Array.isArray(cell)) {
//         newRow = newRow.concat(cell);
//       } else {
//         newRow.push(cell);
//       }
//     })
//     return newRow;
//   })
// }

function removeNull(arrayOfRows) {
  if (!arrayOfRows) return arrayOfRows;
  var newArrayOfRows = [];
  arrayOfRows.forEach((row) => {
    if (row) {
      var newRow = [];
      row.forEach((cell) => {
        if (cell !== undefined && cell !== null) {
          newRow.push(cell);
        }
      })
      newArrayOfRows.push(newRow);
    }
  })
  return newArrayOfRows;
}

function fillRows(arrayOfRows, widths) {
  if (!arrayOfRows) return arrayOfRows;

  return arrayOfRows.map((row) => {
    var fillCellIndex;
    var newRow = [];

    row.forEach((cell) => {
      newRow.push(cell);
      if (typeof cell === "object") {
        if (typeof cell.colSpan === "number") {
          for (var i = 0; i < cell.colSpan-1; i++) {
            newRow.push('');
          }
        } else if (cell.colSpan === "fill") {
          fillCellIndex = newRow.length-1;
        }
      }
    })

    var difference = widths.length - newRow.length;
    if (difference < 0) {
      throw new Meteor.Error('difference-error', `Error in fillRows function: The sum of cells + colSpan for this row is ${newRow.length} while the number of widths is ${widths.length}, and this is invalid. Widths must be equal or greater.`,
      {
        originalRow: row,
        newRow
      });
    } else if (difference === 0) {
      return newRow;
    }

    if (fillCellIndex === undefined) {
      fillCellIndex = newRow.length-1;
      if (typeof newRow[fillCellIndex] !== 'object') {
        newRow[fillCellIndex] = {
          text: newRow[fillCellIndex],
          colSpan: difference+1
        }
      } else newRow[fillCellIndex].colSpan = difference+1;
    } else newRow[fillCellIndex].colSpan = difference+1;

    var firstPart = newRow.slice(0, fillCellIndex+1);
    var lastPart = newRow.slice(fillCellIndex+1);

    for (var i = 0; i < difference; i++) {
      firstPart.push('');
    }
    console.log(firstPart.concat(lastPart));
    return firstPart.concat(lastPart);
  })
}