import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';
import { Places } from '/imports/api/places/index';
import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Finalize extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containers: this.props.contract.containers,
      accessories: this.props.contract.accessories,
      places: []
    }
    this.state.containers.forEach((container) => {
      container.selectedAssembled = 0;
    })
  }

  componentDidMount = () => {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('placesPub');
      var places = Places.find({ visible: true }).fetch();
      this.setState({ places });
    })
  }

  renderPlaces = () => {
    return this.state.places.map((place, i) => {
      return <option key={i} value={place._id}>{place.description}</option>
    })
  }

  renderContainers = () => {
    return this.state.containers.map((container, i) => {
      const changePlace = (e) => {
        var containers = tools.deepCopy(this.state.containers);
        containers[i].place = e.target.value;
        this.setState({ containers });
      }
      const changeAssembled = (e) => {
        var containers = tools.deepCopy(this.state.containers);
        containers[i].selectedAssembled = e.target.value;
        this.setState({ containers });
      }
      const maintenance = (e) => {
        container.status = e.target.value ? "maintenance" : "available";

        this.setState({ containers });
      }
      return (
        <tr key={i}>
          <td>{container._id}</td>
          <td>{container.description}</td>
          <td>
            {container.type == "fixed" ?
            <Input
              title="Pátio:"
              type="select"
              value={container.place}
              onChange={changePlace}>
              {this.renderPlaces()}
            </Input>
            :
            <Input
              title="Manter Montado:"
              type="number"
              max={container.quantity}
              value={container.selectedAssembled}
              onChange={changeAssembled}/>}
          </td>
        </tr>
      )
    })
  }

  finalizeContract = () => {
    var products = this.state.containers.concat(this.state.accessories);
    this.props.finalizeContract(products);
  }

  renderHeader = () => {
    return (
      <tr>
        <th>Código</th>
        <th>Descrição</th>
        <th>Opções</th>
      </tr>
    )
  }

  render () {
    return (
      <Box
        title="Retorno dos Itens Locados:"
        closeBox={this.props.toggleWindow}>
        <table className="table">
          <thead>
            {this.renderHeader()}
          </thead>
          <tbody>
            {this.renderContainers()}
          </tbody>
        </table>
        <FooterButtons buttons={[
          {text: "Cancelar", className: "button--secondary", onClick: () => this.props.toggleWindow()},
          {text: "Confirmar", onClick: () => this.finalizeContract()}
        ]}/>
      </Box>
    )
  }

}