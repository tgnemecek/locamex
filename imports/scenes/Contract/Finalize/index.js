import { Meteor } from 'meteor/meteor';
import React from 'react';
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
      places: []
    }
    this.state.containers.forEach((container) => {
      container.selectedAssembled = container.quantity;
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
      return (
        <tr key={i}>
          <td>{container.serial || "-"}</td>
          <td>{container.description}</td>
          <td>
            <Input
              type="select"
              value={container.place}
              onChange={changePlace}>
              <option> </option>
              {this.renderPlaces()}
            </Input>
          </td>
          <td className="contract__finalize__center-column">
            {container.type == "fixed" ?
            "-"
            :
            <>
              <Input
                className="contract__finalize__assembled-input"
                type="number"
                max={container.quantity}
                value={container.selectedAssembled}
                onChange={changeAssembled}/>
              <span>/ {container.quantity}</span>
            </>
            }
          </td>
        </tr>
      )
    })
  }

  finalizeContract = () => {
    this.props.finalizeContract(this.state.containers, this.props.contract.accessories);
  }

  renderHeader = () => {
    return (
      <tr>
        <th>Série</th>
        <th>Descrição</th>
        <th>Pátio</th>
        <th className="contract__finalize__center-column">Manter Montado?</th>
      </tr>
    )
  }

  render () {
    return (
      <Box
        title="Retorno dos Containers Locados:"
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