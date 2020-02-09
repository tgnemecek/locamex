import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import { Modules } from '/imports/api/modules/index';
import { Places } from '/imports/api/places/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import ModulesTable from './ModulesTable/index';

export default class RegisterPacks extends React.Component {
  render(){
    return null;
  }
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     _id: this.props.item._id,
  //     place: this.props.item.place || '',
  //     modules: this.props.item.modules,
  //
  //     modulesDatabase: [],
  //     placesDatabase: [],
  //
  //     confirmationWindow: false
  //   }
  // }
  // componentDidMount = () => {
  //   this.tracker = Tracker.autorun(() => {
  //     Meteor.subscribe('modulesPub');
  //     Meteor.subscribe('placesPub');
  //     var modulesDatabase = Modules.find().fetch();
  //     var placesDatabase = Places.find().fetch();
  //     this.setState({ modulesDatabase, placesDatabase });
  //   })
  // }
  // componentWillUnmount = () => {
  //   this.tracker.stop();
  // }
  // renderOptions = (database) => {
  //   return this.state[database].map((item, i) => {
  //     return <option key={i} value={item._id}>{item.description}</option>
  //   })
  // }
  // onChange = (e) => {
  //   this.setState({ [e.target.name]: e.target.value });
  // }
  // toggleConfirmationWindow = () => {
  //   var confirmationWindow = !this.state.confirmationWindow;
  //   this.setState({ confirmationWindow });
  // }
  // saveEdits = () => {
  //   Meteor.call('packs.update', this.state);
  //   this.props.toggleWindow();
  // }
  // renderPlaces = (database) => {
  //   return this.state.placesDatabase.map((item, i) => {
  //     return <option key={i} value={item._id}>{item.description}</option>
  //   })
  // }
  // toggleConfirmationWindow = () => {
  //   this.setState({ confirmationWindow: !this.state.confirmationWindow })
  // }
  // unmountPack = () => {
  //   Meteor.call('packs.unmount', {
  //     ...this.props.item,
  //     ...this.state
  //   });
  //   this.props.toggleWindow();
  // }
  // render() {
  //   return (
  //     <Box className="register-data"
  //       title="Editar Pacote"
  //       closeBox={this.props.toggleWindow}
  //       width="700px">
  //       <Input
  //         title="Descrição:"
  //         type="text"
  //         name="description"
  //         readOnly={true}
  //         value={this.props.item.description}
  //         onChange={this.onChange}/>
  //       <ModulesTable
  //         item={this.state}
  //         modulesDatabase={this.state.modulesDatabase}/>
  //       <ConfirmationWindow
  //         isOpen={this.state.confirmationWindow}
  //         closeBox={this.toggleConfirmationWindow}
  //         message="Deseja mesmo desmontar o container e retornar os componentes para o estoque?"
  //         leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
  //         rightButton={{text: "Sim", className: "button--danger", onClick: this.unmountPack}}/>
  //       <FooterButtons buttons={[
  //         {text: "Desmontar Pacote", className: "button--danger", onClick: this.toggleConfirmationWindow},
  //         {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
  //         {text: "Salvar", onClick: this.saveEdits}
  //       ]}/>
  //     </Box>
  //   )
  // }
}