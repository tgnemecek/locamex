export default function generateTable(props) {
  function cleanArray(arr) {
    if (!arr) return [[]];
    if (!arr.length) return [[]];

    // Enforce arr to be an array of arrays (rows)
    var step1 = Array.isArray(arr[0]) ? arr : [arr];
    return step1.map((row) => {
      var newRow = [];
      row.forEach((item) => {
        if (Array.isArray(item)) {
          newRow.concat(item);
        } else if (item !== null && item !== undefined) {
          newRow.push(item);
        }
      })
      return newRow;
    })
  }

  var header = cleanArray(props.header);
  var body = cleanArray(props.body);
  var footer = cleanArray(props.footer);

  const maxColumns = () => {
    function count(arr) {
      return arr.reduce((acc, cur) => {
        var length = cur.length;
        cur.forEach((item) => {
          if (typeof item === "object" && item !== null) {
            if (item.colSpan) length += (item.colSpan-1);
          }
        })
        return acc > length ? acc : length;
      }, 0)
    }

    var headerColumns = count(header);
    var bodyColumns = count(body);
    var footerColumns = count(footer);
    if (headerColumns > bodyColumns && headerColumns > footerColumns) {
      return headerColumns;
    } else return bodyColumns > footerColumns ? bodyColumns : footerColumns;
  }

  var numberOfColumns = maxColumns();

  function createEmptyCells(number) {
    var cells = [];
    number = number < 0 ? (0 - number) : number;
    number = number > numberOfColumns ? numberOfColumns : number;
    for (var i = 0; i < number; i++) {
      cells.push('');
    }
    return cells;
  }

  const format = (arr) => {
    var rows = arr.map((row) => {
      var formattedRow = [];
      var cellsUsed = 0;
      row.forEach((item) => {
        if (typeof(item) === "string" || typeof(item) === "number") {
          formattedRow.push(item.toString());
          cellsUsed++;
        } else if (Array.isArray(item)) {
          throw new Meteor.Error('item-cannot-be-array');
        } else if (item !== null && item !== undefined) {
          formattedRow.push(item);
          if (item.colSpan) {
            var maxCells = numberOfColumns - cellsUsed;
            item.colSpan = item.colSpan > maxCells ? maxCells : item.colSpan;
            formattedRow = formattedRow.concat(createEmptyCells(item.colSpan-1));
            cellsUsed = cellsUsed + item.colSpan;
          } else cellsUsed++;
        }
      })
      return formattedRow;
    })
    return rows;
  }

  var result = [];

  format(header).concat(format(body), format(footer)).forEach((row) => {
    var difference = row.length - numberOfColumns;
    if (row.length > 0) {
      if (difference !== 0) {
        result.push(row.concat(createEmptyCells(difference)));
      } else result.push(row);
    }
  })
  debugger;

  return {table: {
    headerRows: header.length,
    keepWithHeaderRows: true,
    widths: props.widths,
    heights: props.styles.cellheight,
    body: result
  }, style: 'table'}
}