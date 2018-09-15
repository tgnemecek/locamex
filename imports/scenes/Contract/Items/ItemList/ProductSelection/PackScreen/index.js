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

export default class PackScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modulesDatabase: [],
      placesDatabase: []
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
  renderPlaces = (database) => {
    return this.state.placesDatabase.map((item, i) => {
      return <option key={i} value={item._id}>{item.description}</option>
    })
  }

  render() {
    return (
      <Box
        title="Editar Pacote"
        closeBox={this.props.toggleWindow}
        width="550px">
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
              disabled={true}
              value={this.props.item.place}
              onChange={this.onChange}>
                <option> </option>
                {this.renderPlaces()}
            </Input>
          </Block>
          <ModulesTable
            item={this.props.item}
            modulesDatabase={this.state.modulesDatabase}/>
          {this.props.packScreenType === 1 ?
            <FooterButtons buttons={[
              {text: "Voltar", className: "button--secondary", onClick: () => this.props.toggleWindow()},
              {text: "Adicionar", onClick: () => this.props.addPack()}
            ]}/>
            :
            <FooterButtons buttons={[
              {text: "Voltar", className: "button--secondary", onClick: () => this.props.toggleWindow()},
              {text: "Remover", className: "button--danger", onClick: () => this.props.removePack()}
            ]}/>
          }

      </Box>
    )
  }
}