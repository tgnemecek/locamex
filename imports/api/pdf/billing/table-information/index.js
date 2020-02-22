import moment from 'moment';
import tools from '/imports/startup/tools/index';

export default function tableInformation(
  proposalId, proposalIndex, generateTable, contractId, activeVersion) {

  return generateTable({
    body: [[
      'Contrato',
      (contractId + "." + (activeVersion)),
      'Proposta', proposalId + "." + (proposalIndex+1), 'Data de Emissão',
      moment().format("DD/MM/YY")
    ]],
    widths: ['*', '*', '*', '*', '*', '*']
  })
}