import React from 'react';

import createPdf from '/imports/api/create-pdf/proposal/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import tools from '/imports/startup/tools/index';

import DocumentsCompany from './DocumentsCompany/index';
import DocumentsPerson from './DocumentsPerson/index';

export default function Documents(props) {
  const getClient = () => {
    return props.databases.clientsDatabase.find((client) => client._id === props.proposal.clientId);
  }
  var client = getClient();
  var proposal = {
    ...props.proposal,
    client
  }
  var newProps = {
    ...props,
    proposal
  }
  if (client.type === "company") return <DocumentsCompany {...newProps}/>
  if (client.type === "person") return <DocumentsPerson {...newProps}/>
}