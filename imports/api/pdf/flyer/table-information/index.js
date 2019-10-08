import moment from 'moment';
import tools from '/imports/startup/tools/index';

export default function tableInformation(props) {
  var proposal = props.proposal + "." + (Number(props.proposalVersion)+1);

  var today = moment().format("DD/MM/YY");

  return props.generateTable({
    body: [
        [ 'Contrato', (props._id + "." + (props.activeVersion)), 'Proposta', proposal, 'Data de Emissão', today ]
      ],
    widths: ['*', '*', '*', '*', '*', '*']
  })
}