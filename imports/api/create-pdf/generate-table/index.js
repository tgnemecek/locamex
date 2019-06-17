export default function generateTable(props) {
  function cleanArray(arr) {
    if (!arr) return [[]];
    if (!arr.length) return [[]];

    var filtered1 = arr.filter((row) => !!row);
    var filtered2 = Array.isArray(filtered1[0]) ? filtered1 : [filtered1];
    var filtered3 = filtered2.map((row) => {
      return row.filter((item) => !!item);
    })
    return filtered3;
  }

  var header = cleanArray(props.header);
  var body = cleanArray(props.body);
  var footer = cleanArray(props.footer);

  const maxColumns = () => {
    function count(arr) {
      return arr.reduce((acc, cur) => {
        var length = cur.length;
        cur.forEach((item) => {
          if (item.colSpan) length += (item.colSpan-1);
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

  return {table: {
    headerRows: header.length,
    keepWithHeaderRows: true,
    widths: props.widths,
    heights: props.styles.cellheight,
    body: result
  }, style: 'table'}
}