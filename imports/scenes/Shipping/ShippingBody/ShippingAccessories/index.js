import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

import WithVariations from './WithVariations/index';
import WithoutVariations from './WithoutVariations/index';

export default class ShippingAccessories extends React.Component {
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
        <th>Produto</th>
        <th>Variações</th>
        <th>Pátio</th>
      </tr>
    )
  }

  toggleImageWindow = (e) => {
    var index = e ? e.target.value : null;
    var imageVisualizer = this.state.imageVisualizer ? false : {...this.props.accessories[index]};
    this.setState({ imageVisualizer });
  }

  toggleObservationsWindow = (e) => {
    var index = e ? e.target.value : null;
    var observationsVisualizer = this.state.observationsVisualizer ? false : {...this.props.accessories[index]};
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
    return this.props.accessories.map((item, i) => {
      if (item.variations) {
        return <WithVariations {...this.props} item={item} i={i} />
      } else return <WithoutVariations {...this.props} item={item} i={i} />
    })
  }

  render() {
    if (this.props.accessories.length > 0) {
      return (
        <Block columns={1} title="Acessórios">
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
              item={{...this.state.imageVisualizer, itemType: 'accessories'}}
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