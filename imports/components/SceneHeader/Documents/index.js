import React from 'react';

import createPDF from '/imports/api/create-pdf/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import tools from '/imports/startup/tools/index';

import DocumentsCompany from './DocumentsCompany/index';
import DocumentsPerson from './DocumentsPerson/index';

export default class DocumentsSelector extends React.Component {
  quickGenerate(props) {
    props.updateMaster({
      version: props.master.version++
    }, () => {
      props.saveMaster(createPDF(props.master));
    });
  }

  getClient = () => {
    if (this.props.master.type === "contract") {
      return this.props.databases.clientsDatabase.find((client) => client._id === this.props.master.clientId);
    } else return this.props.master.client;
  }

  render() {
    var newProps = {
      ...this.props,
      master: {...this.props.master, client: this.getClient()},
      createPDF
    }
    if (this.props.master.type === "contract") {
      if (newProps.master.client.type === "company") return <DocumentsCompany {...newProps}/>
      if (newProps.master.client.type === "person") return <DocumentsPerson {...newProps}/>
    } else return null;
  }
}