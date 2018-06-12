import React from 'react';
import Cleave from 'cleave.js/react';
import CleavePhone from 'cleave.js/dist/addons/cleave-phone.br';

export default class CustomCleave extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            rawValue: ''
        };
    }
    handlerChange = (event) => {
        this.setState({rawValue: event.target.rawValue});
    }
    formatPicker = () => {
      switch(this.props.format) {
        case "cnpj":
          return {
            blocks: [2, 3, 3, 4, 2],
            delimiters: ['.', '.', '/', '-'],
            numericOnly: true
          }
          break;
        case "cpf":
          return {
            blocks: [3, 3, 3, 2],
            delimiters: ['.', '.', '-'],
            numericOnly: true
          }
          break;
        case "registryES":
          return {
            blocks: [3, 3, 3, 3],
            delimiters: ['.', '.', '.'],
            numericOnly: true
          }
          break;
        case "registryMU":
            return {
              blocks: [3, 3, 3, 3],
              delimiters: ['.', '.', '.'],
              numericOnly: true
            }
            break;
          case "phone":
            return {
              phone: true,
              phoneRegionCode: 'BR'
            }
            break;
      }
    }
    render() {
        return (
          <Cleave options={this.formatPicker()} onChange={this.handlerChange}/>
        );
    }
}