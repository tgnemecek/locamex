import moment from 'moment';

export default function createMetaContext (item, imageIndex, file) {

  var formattedDate = moment().format("YYYY-MM-DD");

  var metaContext = {
    type: item.type,
    imageIndex,
    formattedDate,
    extension: file.name.split('.').pop(),
  }

  if (item.type === 'fixed') {
    metaContext = {
      ...metaContext,
      documentId: item.parentId,
      filename: item.parentDescription,
      unitId: item._id
    }
  } else {
    metaContext = {
      ...metaContext,
      documentId: item._id,
      filename: item.description
    }
  }

  return metaContext;
}