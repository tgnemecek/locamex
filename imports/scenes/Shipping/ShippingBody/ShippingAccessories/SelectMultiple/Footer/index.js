import React from 'react';

import FooterButtons from '/imports/components/FooterButtons/index';

export default function Footer(props) {
  return(
    <FooterButtons buttons={[
      {text: "Voltar", className: "button--secondary", onClick: props.toggleWindow},
      {text: "Salvar Edições", className: "button--primary", onClick: props.saveEdits},
    ]}/>
  )
}