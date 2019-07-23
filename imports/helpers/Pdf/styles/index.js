const styleGlobals = {
  fontFamily: "Arial",
  h1Size: 11,
  h2Size: 10,
  pSize: 9,
  marginBottom: 10,
  cellheight: 1
}

export default {
  h1: {
    fontFamily: styleGlobals.fontFamily,
    fontSize: styleGlobals.h1Size,
    bold: true,
    alignment: 'center',
    margin: [0, 0, 0, styleGlobals.marginBottom]
  },
  h2: {
    fontFamily: styleGlobals.fontFamily,
    fontSize: styleGlobals.h2Size,
    bold: true,
    alignment: 'justify',
    margin: [0, 0, 0, styleGlobals.marginBottom]
  },
  p: {
    fontFamily: styleGlobals.fontFamily,
    fontSize: styleGlobals.pSize,
    alignment: 'justify',
    margin: [0, 0, 0, styleGlobals.marginBottom]
  },
  table: {
    fontFamily: styleGlobals.fontFamily,
    fontSize: styleGlobals.pSize,
    alignment: 'left',
    margin: [0, 0, 0, styleGlobals.marginBottom]
  },
  ol: {
    fontFamily: styleGlobals.fontFamily,
    fontSize: styleGlobals.pSize,
    margin: [30, 0, 0, styleGlobals.marginBottom]
  },
  ul: {
    fontFamily: styleGlobals.fontFamily,
    fontSize: styleGlobals.pSize,
    margin: [0, 0, 0, styleGlobals.marginBottom]
  },
  sig: {
    fontFamily: styleGlobals.fontFamily,
    fontSize: styleGlobals.pSize,
    alignment: 'center',
    margin: [0, 0, 0, 0]
  },
  sigDiv: {
    margin: [0, 0, 0, 30]
  },
  footer: {
    color: "#545454",
    italics: true,
    fontFamily: styleGlobals.fontFamily,
    fontSize: styleGlobals.pSize,
    alignment: 'center',
    margin: [ 0, 10, 0, 0 ]
  }
}