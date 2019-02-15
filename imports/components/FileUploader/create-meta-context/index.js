import moment from 'moment';

export default function createMetaContext (item, imageIndex, file) {

  var formattedDate = moment().format("YYYY-MM-DD");

  const writeFilename = () => {
    if (item.description) return item.description.replace(/\W/g, '');
    if (item.serial) return item.serial.toString();
    return 'undefined';
  }

  var metaContext = {
    documentId: item._id,
    filename: writeFilename(),
    type: item.type,
    imageIndex,
    formattedDate,
    extension: file.name.split('.').pop(),
  }
  return metaContext;
}