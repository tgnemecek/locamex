import React from 'react';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default function ConfirmationWindow (props) {
  // Props:
  // isOpen (bool)
  // title (string)
  // closeBox (function)
  // message (string)
  // leftButton, rightButton (objects)
  //    .text (string)
  //    .className (string)
  //    .onClick (function)
  if (props.isOpen) {
    return (
      <Box
        className="confirmation-window"
        title={props.title || "Aviso:"}
        closeBox={props.closeBox}>
        <p>{props.message || null}</p>
        <FooterButtons buttons={[
          {text: props.leftButton.text, className: props.leftButton.className, onClick: props.leftButton.onClick},
          {text: props.rightButton.text, className: props.rightButton.className, onClick: props.rightButton.onClick}
        ]}/>
      </Box>
    )
  } else return null;
}