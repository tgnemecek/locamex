import moment from 'moment';

import directives from '/imports/api/slingshot/index';

export default class FileSender {
  constructor(item, uploadDirective) {
    this.item = item;
    this.uploadDirective = uploadDirective;
  }

  validateFiles = (files) => {
    var directive = directives[this.uploadDirective];
    Slingshot.fileRestrictions(this.uploadDirective, {
      maxSize: directive.maxSize,
      allowedFileTypes: directive.allowedFileTypes
    });
    for (var i = 0; i < files.length; i++) {
      var uploader = new Slingshot.Upload(this.uploadDirective);
      var error = uploader.validate(files[i]);
      if (error) {
        var translation;
        if (error.message.search('size')) {
          translation = `Imagem excede o tamanho limite de ${directive.maxSize} Bytes.`;
        }
        if (error.message.search('file types')) {
          translation = error.message;
        }
        return {isValid: false, translation};
      }
    }
    return {isValid: true};
  }

  createMetaContext = (imageIndex, file) => {
    var directive = directives[this.uploadDirective];
    var formattedDate = moment().format("YYYY-MM-DD");

    const getFilename = () => {
      switch (this.uploadDirective) {
        case "flyerUploads":
          return this.item.description.replace(/\W/g, '');
        default:
          return 'undefined';
      }
      // FIX THIS:
      //if (this.type === 'series') return item._id.toString();
    }
    const getType = () => {
      switch (this.uploadDirective) {
        case "flyerUploads":
          return this.item.type;
        default:
          return 'undefined';
      }
    }

    var metaContext = {
      documentId: this.item._id,
      filename: getFilename(),
      type: getType(),
      imageIndex,
      formattedDate,
      extension: file.name.split('.').pop(),
    }
    return metaContext;
  }

  send = (files, callback) => {
    var directive = directives[this.uploadDirective];
    if (!callback || typeof callback !== "function") {
      throw new Meteor.Error("Callback must be function");
    }
    if (!directive) callback("Wrong Directive", undefined);

    var urls = [];
    if (!Array.isArray(files)) files = [files];
    files = files.filter((file) => !!file);

    if (!files.length) {
      return callback("No files selected", undefined);
    }

    var validation = this.validateFiles(files);
    if (!validation.isValid) {
      return callback(validation.translation, undefined);
    }

    // Send files
    var metaContext;
    var sendCount = 0;

    files.forEach((file, imageIndex, arr) => {
      metaContext = this.createMetaContext(imageIndex, file);
      var uploader = new Slingshot.Upload(this.uploadDirective, metaContext);
      uploader.send(file, (error, downloadUrl) => {
        sendCount++;
        if (!error) {
          urls[imageIndex] = downloadUrl;
          if (sendCount === arr.length) {
            // Meteor.call('snapshot.add', metaContext, urls);
            return callback(undefined, urls);
          }
        } else return callback(error, undefined);
      });
    })
  }
}