import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';

export default class RegisterHistory extends React.Component {
  render(){
    return null;
  }
  // renderAlterations = () => {
  //   var data = this.props.item.data;
  //   var array = [];
  //
  //   for (var key in data) {
  //     if (data[key] === true) {
  //       data[key] = "true";
  //     } if (data[key] === false) {
  //       data[key] = "false";
  //     }
  //     array.push(<p key={key}>{key}: {data[key]}</p>)
  //   }
  //   return array;
  // }
  //
  // render() {
  //   return (
  //     <Box className="register-data"
  //       title="Detalhes da Alteração"
  //       closeBox={this.props.toggleWindow}
  //       width="800px">
  //       <div className="register-history">
  //         <h4>Resumo:</h4>
  //         <div>
  //           <p>Usuário responsável pela alteração: {this.props.item.user.firstName + " " + this.props.item.user.lastName}</p>
  //         </div>
  //         <div>
  //           <p>Banco de Dados alterado: {tools.format(this.props.item.type, "database")}</p>
  //         </div>
  //         <div>
  //           <p>Dia: {moment(this.props.item.insertionDate).format("DD-MM-YYYY")}</p>
  //         </div>
  //         <div>
  //           <p>Horário: {moment(this.props.item.insertionDate).format("HH:mm:ss")}</p>
  //         </div>
  //         <h4>Novo objeto:</h4>
  //         {this.renderAlterations()}
  //       </div>
  //         <button className="button button--secondary" style={{width: "100%"}} onClick={this.props.toggleWindow}>Voltar</button>
  //     </Box>
  //   )
  // }
}