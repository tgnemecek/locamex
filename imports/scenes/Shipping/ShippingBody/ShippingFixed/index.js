import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

export default class ShippingFixed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageVisualizer: false,
      observationsVisualizer: false
    }
  }

  renderHeader = () => {
    return (
      <tr>
        <th>#</th>
        <th>Modelo</th>
        <th>Série</th>
      </tr>
    )
  }

  toggleImageWindow = (e) => {
    var index = e ? e.target.value : null;
    var imageVisualizer = this.state.imageVisualizer ? false : {...this.props.fixed[index]};
    this.setState({ imageVisualizer });
  }

  toggleObservationsWindow = (e) => {
    var index = e ? e.target.value : null;
    var observationsVisualizer = this.state.observationsVisualizer ? false : {...this.props.fixed[index]};
    this.setState({ observationsVisualizer });
  }

  getDescriptionPlace = (placeId) => {
    var place = this.props.placesDatabase.find((item) => {
      return item._id === placeId;
    });
    return place ? place.description : null;
  }

  getDescriptionModel = (model) => {
    var container = this.props.containersDatabase.find((item) => {
      return item._id === model;
    });
    return container ? container.description : null;
  }

  renderBody = () => {
    const renderOptions = (model, currentId) => {
      var filtered = this.props.seriesDatabase.filter((item) => {
        if (item.model === model && item.place !== 'rented') {
          return !this.props.fixed.find((element) => {
            if (element._id === item._id) {
              return (currentId !== item._id);
            } else return false;
          })
        }
      })
      return filtered.map((item, i) => {
        return <option key={i} value={item._id}>{`Série: ${item.serial} - Pátio: ${this.getDescriptionPlace(item.place)}`}</option>
      })
    }

    const onChange = (e) => {
      var value = e.target.value;
      var serial = tools.findUsingId(this.props.seriesDatabase, value);
      var fixed = tools.deepCopy(this.props.fixed);
      var index = e.target.name;
      fixed[index] = serial._id ? serial : { model: this.props.fixed[index].model };
      this.props.onChange({ fixed });
    }

    const canDisplayImages = (item) => {
      return (item._id && item.snapshots.length);
    }

    return this.props.fixed.map((item, i) => {
      return (
        <tr key={i}>
          <td className="table__small-column">{i+1}</td>
          <td>{this.getDescriptionModel(item.model)}</td>
          <td>
            <Input
              type="select"
              name={i}
              onChange={onChange}
              value={item._id}>
                <option value="">Selecione uma série</option>
                {renderOptions(item.model, item._id)}
            </Input>
          </td>
          <td className="table__small-column">
            {item.observations ? <button className="database__table__button" value={i} onClick={this.toggleObservationsWindow}>⚠</button>
            : null}
          </td>
          <td className="table__small-column">
            {canDisplayImages(item) ? <button className="database__table__button" value={i} onClick={this.toggleImageWindow}>🔍</button> : null}
          </td>
          <td className="table__small-column">
            {item._id ? <span style={{color: 'green'}}>✔</span> : <span style={{color: 'red'}}>✖</span>}
          </td>
        </tr>
      )
    })
  }

  render() {
    if (this.props.fixed.length > 0) {
      return (
        <Block columns={1} title="Containers Fixos">
          <table className="table">
            <thead>
              {this.renderHeader()}
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
          {this.state.imageVisualizer ?
            <ImageVisualizer
              item={{...this.state.imageVisualizer, itemType: 'fixed'}}
              readOnly={true}
              toggleWindow={this.toggleImageWindow}
            />
          : null}
          {this.state.observationsVisualizer ?
            <this.props.Observations
              title={this.getDescriptionModel(this.state.observationsVisualizer.model) + " - " + this.state.observationsVisualizer.serial}
              content={this.state.observationsVisualizer.observations}
              toggleWindow={this.toggleObservationsWindow}
            />
          : null}
        </Block>
      )
    } else return null;
  }
}