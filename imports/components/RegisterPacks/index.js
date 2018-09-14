import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import { Modules } from '/imports/api/modules/index';
import { Places } from '/imports/api/places/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';
import ModulesTable from './ModulesTable/index';

export default class RegisterPacks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id,
      place: this.props.item.place || '',
      modules: this.props.item.modules,

      modulesDatabase: [],
      placesDatabase: [],

      confirmationWindow: false
    }
  }
  componentDidMount = () => {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('modulesPub');
      Meteor.subscribe('placesPub');
      var modulesDatabase = Modules.find({ visible: true }).fetch();
      var placesDatabase = Places.find({ visible: true }).fetch();
      this.setState({ modulesDatabase, placesDatabase });
    })
  }
  componentWillUnmount = () => {
    this.tracker.stop();
  }
  renderOptions = (database) => {
    return this.state[database].map((item, i) => {
      return <option key={i} value={item._id}>{item.description}</option>
    })
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  toggleConfirmationWindow = () => {
    var confirmationWindow = !this.state.confirmationWindow;
    this.setState({ confirmationWindow });
  }
  saveEdits = () => {
    Meteor.call('packs.update', this.state);
    this.props.toggleWindow();
  }
  renderPlaces = (database) => {
    return this.state.placesDatabase.map((item, i) => {
      return <option key={i} value={item._id}>{item.description}</option>
    })
  }
  unmountPack = () => {
    Meteor.call('packs.unmount', {
      ...this.props.item,
      ...this.state
    });
    this.props.toggleWindow();
  }
  render() {
    return (
      <Box
        title="Editar Pacote"
        closeBox={this.props.toggleWindow}
        width="700px">
          <Block columns={2.5} options={[{block: 0, span: 0.5}]}>
            <Input
              title="Código:"
              type="text"
              name="_id"
              readOnly={true}
              value={this.props.item._id}
              onChange={this.onChange}
            />
            <Input
              title="Descrição:"
              type="text"
              name="description"
              readOnly={true}
              value={this.props.item.description}
              onChange={this.onChange}
            />
            <Input
              title="Pátio:"
              type="select"
              name="place"
              value={this.state.place}
              onChange={this.onChange}>
                <option> </option>
                {this.renderPlaces()}
            </Input>
          </Block>
          <ModulesTable
            item={this.state}
            modulesDatabase={this.state.modulesDatabase}/>
          <button className="button button--danger" style={{width: "100%"}} onClick={this.unmountPack}>Desmontar Pacote</button>
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: () => this.props.toggleWindow()},
            {text: "Salvar", onClick: () => this.saveEdits()}
          ]}/>
      </Box>
    )
  }
}