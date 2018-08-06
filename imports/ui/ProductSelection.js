import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactModal from 'react-modal';

import { Services } from '../api/services';

export default class ProductSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    switch (this.props.database) {
      case 'services':
        this.title = "Seleção de Serviços";
        break;
    }
  }
  //
  // representativesOnChange = (e) => {
  //   var representatives = e.target.value;
  //   this.setState({ representatives });
  // }
  //
  // divisionChange = (e) => {
  //   var equalDivision = e.target.checked;
  //   this.setState({ equalDivision });
  // }
  //
  // inputFormat = (name, value, id, valid) => {
  //   var charges = this.state.charges;
  //   charges[name].price = value;
  //   this.setState({ charges });
  // }
  //
  // updateTable = (name, value) => {
  //   value = Number(value);
  //   var charges = JSON.parse(JSON.stringify(this.state.charges));
  //   var newCharges = [];
  //   var difference = Math.abs(charges.length - value);
  //   if (value > charges.length) {
  //     for (var i = 0; i < difference; i++) {
  //       newCharges.push({
  //         description: `Cobrança #${i +  charges.length + 1} referente ao Valor Total do Contrato`,
  //         value: ''
  //       })
  //     }
  //     charges = charges.concat(newCharges);
  //     this.setState({ charges });
  //   }
  //   if (value < charges.length) {
  //     for (var i = 0; i < value; i++) {
  //       newCharges.push(charges[i]);
  //     }
  //     this.setState({ charges: newCharges });
  //   }
  // }
  //
  // onChange = (name, value, id) => {
  //   this.inputValues[name] = value;
  //   var total = this.inputValues.reduce((acc, current) => acc + current);
  //   var difference = total - this.totalValue;
  //   this.setState({
  //     difference,
  //     valid: !difference
  //   });
  // }
  //
  // updateDescription = (e) => {
  //   var charges = this.state.charges;
  //   charges[e.target.name].description = e.target.value;
  //   this.setState({ charges });
  // }
  //
  // renderBody = () => {
  //   var equalValue = customTypes.round(this.totalValue / this.state.charges.length, 2);
  //   var equalValueStr;
  //   var rest = customTypes.round(this.totalValue - (equalValue * this.state.charges.length), 2);
  //   return this.state.charges.map((charge, i, array) => {
  //     var moment1 = moment(this.state.startDate).add((30 * i + i), 'days');
  //     var moment2 = moment(this.state.startDate).add((30 * i + 30 + i), 'days');
  //     if (i == 0) {
  //       equalValueStr = customTypes.format(equalValue + rest, "currency");
  //     } else {
  //       equalValueStr = customTypes.format(equalValue, "currency");
  //     }
  //     return (
  //       <tr key={i}>
  //         <td>{(i + 1) + '/' + array.length}</td>
  //         <td>{moment1.format("DD-MM-YY") + ' a ' +  moment2.format("DD-MM-YY")}</td>
  //         <td>{moment2.format("DD-MM-YY")}</td>
  //         <td><textarea name={i} value={charge.description} onChange={this.updateDescription}/></td>
  //         <td>{this.state.equalDivision ? equalValueStr : <CustomInput name={i} type="currency"
  //                                                             onChange={this.onChange}
  //                                                             placeholder={equalValueStr}
  //                                                             />}</td>
  //       </tr>
  //     )
  //   })
  // }
  //
  // calcDifference = () => {
  //   var value = customTypes.format(this.state.difference, 'currency');
  //   var className = this.state.difference != 0 ? "difference--danger" : "difference--zero";
  //   return <span className={className}>{value}</span>
  // }
  //
  // toggleCalendar = (e) => {
  //   e ? e.preventDefault() : null;
  //   var calendarOpen = !this.state.calendarOpen;
  //   this.setState({ calendarOpen });
  // }
  //
  // changeDate = (startDate) => {
  //   this.setState({ startDate });
  //   this.toggleCalendar();
  // }

  render() {
      return (
        <ReactModal
          isOpen={true}
          contentLabel="Emitir Documentos"
          appElement={document.body}
          onRequestClose={this.props.closeProductSelection}
          className="product-selection"
          overlayClassName="boxed-view boxed-view--modal"
          >
            <div>
              <button onClick={this.props.closeProductSelection} className="button--close-box">✖</button>
              <div className="product-selection__header">
                <h3>{this.title}</h3>
              </div>
              <div className="product-selection__body">
                <div className="product-selection__database">
                  <div>
                    <label>Banco de Dados:</label>
                    <input/>
                  </div>
                  <div>
                    <table>

                    </table>
                  </div>
                </div>
                <div className="product-selection__middle">
                  <div><button>⇨</button></div>
                  <div><button>⇦</button></div>
                </div>
                <div className="product-selection__contract">
                  <table className="table table--product-selection">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Quantidade</th>
                      </tr>
                    </thead>
                    <tbody>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="product-selection__footer">
                <button type="button" className="button button--primary" onClick={this.saveEdits}>Salvar</button>
              </div>
            </div>
        </ReactModal>
      )
  }
}