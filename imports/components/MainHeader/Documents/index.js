import React from 'react';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import tools from '/imports/startup/tools/index';

import DocContractCompany from './DocContractCompany/index';
import DocContractPerson from './DocContractPerson/index';
import DocProposal from './DocProposal/index';
import Texts from './Texts/index';

export default class DocumentsSelector extends React.Component {
  constructor(props) {
    super(props);
    this.newProps = {
      ...this.props,
      master: {
        ...this.props.master,
        client: this.props.master.type === "contract" ?
          this.props.databases.clientsDatabase.find((client) => client._id === this.props.master.clientId) : this.props.master.client
      }
    }
    if (this.props.master.type === "contract") {
      if (this.newProps.master.client.type === "company") {
        this.Component = DocContractCompany;
      }
      if (this.newProps.master.client.type === "person") {
        this.Component = DocContractPerson;
      }
    } else this.Component = DocProposal;
  }

  render() {
    return (
      <this.Component {...this.newProps}>
        <Texts
          master={this.props.master}
          toggleWindow={this.toggleWindow}
          updateMaster={this.props.updateMaster}
          disabled={this.props.disabled}
        />
      </this.Component>
    )
  }
}