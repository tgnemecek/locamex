import React from 'react';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import tools from '/imports/startup/tools/index';

import DocContractCompany from './DocContractCompany/index';
import DocContractPerson from './DocContractPerson/index';
import DocProposal from './DocProposal/index';

export default class DocumentsSelector extends React.Component {
  getClient = () => {
    if (this.props.master.type === "contract") {
      return this.props.databases.clientsDatabase.find((client) => client._id === this.props.master.clientId);
    } else return this.props.master.client;
  }

  render() {
    var newProps = {
      ...this.props,
      master: {...this.props.master, client: this.getClient()}
    }
    if (this.props.master.type === "contract") {
      if (newProps.master.client.type === "company") {
        return <DocContractCompany {...newProps}/>
      }
      if (newProps.master.client.type === "person") {
        return <DocContractPerson {...newProps}/>
      }
    } else return <DocProposal {...this.props}/>
  }
}