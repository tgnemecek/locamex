import tools from '/imports/startup/tools/index';

export default function resultFormat(input) {
  return {text: tools.format(input, 'currency'), alignment: 'right', bold: true};
}