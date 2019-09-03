export default function generateTable(data) {
  if (!data.body) throw new Meteor.Error("table-must-have-body", data);
  if (!Array.isArray(data.body)) throw new Meteor.Error("body-must-be-array", data);
  if (!data.widths) throw new Meteor.Error("table-must-have-widths", data);

  var widths = data.widths;

  var header = data.header ? data.header.map((row) => {
    return row.map((cell) => {
      var newCell = typeof cell === "string" ? {text: cell} : cell;
      return {
        ...newCell,
        bold: true
      }
    })
  }) : [];

  var footer = data.footer || [];

  var body = header.concat(data.body, footer).filter((row) => !!row);

  function fillColSpan(row, index, widths) {
    var firstPart = row.slice(0, index+1);
    var lastPart = row.slice(index+1);
    var currentCells = row.reduce((acc, cur) => {
      var toAdd = 1;
      if (typeof cur.colSpan === "number") {
        toAdd = cur.colSpan
      }
      return acc + toAdd;
    }, 0);
    var fill = widths.length - currentCells;
    if (fill < 0) {
      throw new Meteor.Error("rows-with-spans-cant-be-smaller-than-widths", row);
    }
    firstPart[index].colSpan = fill+1;
    for (var i = 0; i < fill; i++) {
      firstPart.push("");
    }
    return firstPart.concat(lastPart);
  }

  body = body.map((row) => {
    if (!Array.isArray(row)) throw new Meteor.Error("row-must-be-array-of-arrays", row);
    if (row.length > widths.length) {
      throw new Meteor.Error("rows-cant-be-bigger-than-widths", row);
    }
    var newRow = [];
    var fillCellIndex;
    row.forEach((cell) => {
      var newCell = cell;
      if (!cell) {
        newCell = "";
      } else if (typeof cell === "object" && !cell.text) {
        newCell = {
          ...cell,
          text: ""
        }
      }
      newRow.push(newCell);
      if (typeof newCell === "object") {
        if (newCell.colSpan === "fill") {
          fillCellIndex = newRow.length-1;
        } else if (newCell.colSpan > 1) {
          for (var j = 0; j < newCell.colSpan-1; j++) {
            newRow.push("");
          }
        }
      }
    })
    if (fillCellIndex !== undefined) {
      newRow = fillColSpan(newRow, fillCellIndex, widths);
    }
    if (newRow.length > widths.length) {
      throw new Meteor.Error("rows-with-spans-cant-be-bigger-than-widths", row);
    } else if (newRow.length < widths.length) {
      throw new Meteor.Error("rows-with-spans-cant-be-smaller-than-widths", row);
    }
    return newRow;
  });
  return {table: {
    widths,
    body
  }, style: 'table'}
}