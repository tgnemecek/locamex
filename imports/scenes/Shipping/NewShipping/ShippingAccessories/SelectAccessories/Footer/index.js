import React from 'react';

import FooterButtons from '/imports/components/FooterButtons/index';

export default function Footer(props) {
  const toggleWindow = () => {
    props.toggleWindow();
  }
  const saveEdits = () => {
    props.saveEdits();
  }
  return(
    <FooterButtons buttons={[
      {text: "Voltar", className: "button--secondary", onClick: toggleWindow},
      {text: "Salvar Edições", className: "button--primary", onClick: saveEdits},
    ]}/>
  )
}