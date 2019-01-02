import React from 'react';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default function ConfirmationWindow (props) {
  return (
    <Box
      title={props.title}
      closeBox={props.closeBox}>
      <p>{props.message}</p>
      <FooterButtons buttons={[
        {text: props.leftButton.description, className: props.leftButton.className, onClick: props.leftButton.method},
        {text: props.rightButton.description, className: props.rightButton.className, onClick: props.rightButton.method}
      ]}/>
    </Box>
  )
}