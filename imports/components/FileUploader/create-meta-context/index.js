import moment from 'moment';

export default function createMetaContext (item, imageIndex, file) {

  var formattedDate = moment().format("YYYY-MM-DD");

  var metaContext = {
    documentId: item._id,
    filename: item.description || item.serial,
    type: item.type,
    imageIndex,
    formattedDate,
    extension: file.name.split('.').pop(),
  }
  return metaContext;
}