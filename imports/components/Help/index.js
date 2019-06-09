import React from 'react';
import Box from '/imports/components/Box/index';
import Button from '/imports/components/Button/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      helpBox: false
    }
  }
  toggleHelpBox = () => {
    this.setState({ helpBox: !this.state.helpBox });
  }
  render() {
    return (
      <div className={this.props.className}>
        <Button onClick={this.toggleHelpBox} icon="help" />
        {this.state.helpBox ?
          <Box
            title="Ajuda:"
            width="50%"
            closeBox={this.toggleHelpBox}>
            <p style={{textAlign: "left"}}>{this.props.help}</p>
            <FooterButtons buttons={[
              {text: "OK, Entendi", className: "button--secondary", onClick: this.toggleHelpBox}
            ]}/>
          </Box>
        : null}
      </div>
    )
  }
}