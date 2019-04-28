import React from 'react';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default function Observations (props) {
  if (props.content) {
    return (
      <Box
        title="Observações do Item"
        closeBox={props.toggleWindow}>
        <Block
          column={1}
          options={[{block: 1, style: {width: "100%"}}]}
          title={props.title}>
          <div style={{maxWidth: "900px"}}>
            {props.content}
          </div>
          <FooterButtons buttons={[{text: "Voltar", className: "button--secondary", onClick: props.toggleWindow}]}/>
        </Block>
      </Box>
    )
  } else return null;
}