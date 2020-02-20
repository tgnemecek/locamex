import tools from '/imports/startup/tools/index';
import moment from 'moment';

export default function flyerPdf(item, header) {
  try {
    return {
      fileName: `Locamex - Folder_${tools.makeValidFileName(item.description)}.pdf`,
      pageSize: 'A4',
      pageMargins: [ 40, 110, 40, 45 ], //[left, top, right, bottom]
      info: {
        title: `Folder: ${item.description}`,
        author: `Locamex`,
        subject: `Folder de Produto`
      },
      header: header(),
      content: [
        {text: item.description.toUpperCase(), style: 'flyerH1'},
        {text: item.flyer.paragraphs[0], style: 'subtitle'},
        {columns: [
          {text: item.flyer.paragraphs[1]},
          item.flyer.images[0] ? {
              image: item.flyer.images[0],
              fit: [250, 250]
            } : ''
        ], margin: [0, 0, 0, 60]},
        {columns: [
          item.flyer.images[1] ? {
              image: item.flyer.images[1],
              fit: [250, 250]
            } : '',
          {text: item.flyer.paragraphs[2]}
        ]}
      ]
    };
  }
  catch(err) {
    throw new Meteor.Error(err);
  }
}