import { saveAs } from 'file-saver';
import contractPDF from './contract/index';
import proposalPDF from './proposal/index';
import billPDF from './bill/index';

import generateTable from './generate-table/index';
import styles from './styles/index';

export default class Pdf {
  constructor(master, databases, extra) {
    this.master = master;
    this.databases = databases;
    this.extra = extra;
    if (!master) throw new Meteor.Error("no-master");
  }

  getClient = () => {
    return this.databases.clientsDatabase.find((client) => {
      return client._id === this.master.clientId;
    });
  }

  getAccount = (billingName) => {
    var accountId = this.master[billingName][0].account;
    return this.databases.accountsDatabase.find((account) => {
      return account._id === accountId;
    })
  }

  getSignatures = (master) => {
    master.representatives = [];
    master.client.contacts.forEach((contact) => {
      if (contact._id === master.negociatorId) {
        master.negociator = contact;
      }
      if (this.master.representativesId.includes(contact._id)) {
        master.representatives.push(contact);
      }
    });
    return master;
  }

  getCreatedBy = () => {
    var createdByUser = this.databases.usersDatabase.find((user) => {
      return user._id === this.master.createdBy;
    });
    if (!createdByUser) throw new Meteor.Error("user-not-found!");

    return createdByUser.firstName + " " + createdByUser.lastName;
  }

  generate = () => {
    if (this.master.type === "contract") {
      return this.contractGenerator();
    } else if (this.master.type === "proposal") {
      return this.proposalGenerator();
    } else if (this.master.type === "billing") {
      return this.billingGenerator();
    }
  }

  proposalGenerator = () => {
    return new Promise((resolve, reject) => {
      var master = this.master;
      master.createdByFullName = this.getCreatedBy();

      var props = {
        master,
        generateTable,
        styles
      }
      var containers = master.includeFlyer ? master.containers : [];

      proposalPDF(props).then((docDefinition) => {
        Meteor.call('pdf.proposal.create', docDefinition, containers, (err, res) => {
          if (err) {
            console.log(err);
            reject();
          }
          if (res) {
            saveAs(res, docDefinition.fileName);
            resolve();
          }
        })
      }).catch((err) => reject(err));
    })
  }

  contractGenerator = () => {
    return new Promise((resolve, reject) => {
      var master = this.master;
      master.createdByFullName = this.getCreatedBy();
      master.client = this.getClient();
      master = this.getSignatures(master);
      master.accountServices = this.getAccount('billingServices');
      master.accountProducts = this.getAccount('billingProducts');

      var props = {
        master,
        generateTable,
        styles
      }

      var docDefinition = contractPDF(props);

      Meteor.call('pdf.contract.create', docDefinition, (err, res) => {
        if (err) {
          console.log(err);
          reject();
        }
        if (res) {
          saveAs(res, docDefinition.fileName);
          resolve();
        }
      })
    })
  }

  billingGenerator = () => {
    return new Promise((resolve, reject) => {
      var master = this.master;
      master.createdByFullName = this.getCreatedBy();
      master.client = this.getClient();
      master.accountProducts = this.getAccount('billingProducts');

      var charge = this.extra;

      var props = {
        master,
        charge,
        generateTable,
        styles
      }

      billPDF(props).then((docDefinition) => {
        Meteor.call('pdf.bill.create', docDefinition, (err, res) => {
          if (err) {
            console.log(err);
            reject();
          }
          if (res) {
            saveAs(res, docDefinition.fileName);
            resolve();
          }
        })
      }).catch((err) => reject(err));
    })
  }
}