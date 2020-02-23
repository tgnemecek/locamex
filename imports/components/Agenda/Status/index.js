import React from 'react';
import { Link } from 'react-router-dom';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Icon from '/imports/components/Icon/index';

export default function Status(props) {
  var text = "";

  switch (props.status) {
    case "notReady":
      text = "Cobrança Não Pronta"
      break;
    case "ready":
      text = "Cobrança Pronta"
      break;
    case "billed":
      text = "Aguardando Pagamento"
      break;
    case "late":
      text = "Pagamento Atrasado"
        break;
    case "finished":
      text = "Cobrança Quitada"
      break;
  }

  text = props.prefix ? props.prefix + text : text;
  text = props.suffix ? text + props.suffix : text;

  return (
    <span>{text}</span>
  )
}