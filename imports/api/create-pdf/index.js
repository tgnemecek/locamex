import contractPDF from './contract/index';
import proposalPDF from './proposal/index';

import generateTable from './generate-table/index';
import styles from './styles/index';

export default function createPDF(master) {
  if (!master) throw new Meteor.Error("no-master");

  var newProps = {
    master,
    generateTable,
    styles
  }

  if (master.type === "contract") return contractPDF(newProps);
  if (master.type === "proposal") return proposalPDF(newProps);
  throw new Meteor.Error("type-not-set");
}