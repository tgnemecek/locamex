import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import moment from 'moment';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class SeriesVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snapshots: this.props.item.snapshots || [],
      registryIndex: this.props.item.snapshots.length-1,
      imageIndex: 0,

      uploadWindow: false,
      confirmationWindow: false
    }
  }
  indexUp = () => {
    var imageIndex = this.state.imageIndex;
    var nextIndex = imageIndex+1;

    if (nextIndex > this.getMaxIndex()) nextIndex = 0;
    this.setState({ imageIndex: nextIndex })
  }
  indexDown = () => {
    var imageIndex = this.state.imageIndex;
    var nextIndex = imageIndex-1;

    if (nextIndex < 0) nextIndex = this.getMaxIndex();
    this.setState({ imageIndex: nextIndex })
  }
  getMaxIndex = () => {
    if (!this.getRegistry()) return 0;
    if (this.getRegistry().images) {
      return this.getRegistry().images.length-1
    } else return 0;
  }
  getRegistry = () => {
    var index = this.state.registryIndex;
    return this.props.item.snapshots[index];
  }
  changeRegistryIndex = (e) => {
    this.setState({
      registryIndex: e.target.value,
      imageIndex: 0
    })
  }
  render() {
    return (
      <div>
        <div className="image-visualizer__date">
          {this.getRegistry() ?
            <Input
              type="select"
              className="image-visualizer__select"
              value={this.state.registryIndex}
              onChange={this.changeRegistryIndex}
              >
                {this.props.item.snapshots.map((snapshot, i) => {
                  return (
                    <option key={i} value={i}>
                      {moment(snapshot.date).format('DD-MM-YYYY')}
                    </option>
                  )
                })}
            </Input>
          : null}
        </div>
        <div className="image-visualizer__image-wrap">
          {this.state.snapshots.length ?
            <img
              src={this.getRegistry().images[this.state.imageIndex]}/>
          : null}
        </div>
        {this.getMaxIndex() ?
          <div className="image-visualizer__controls-wrap">
            <button onClick={this.indexDown}>
              ◀
            </button>
            {this.state.imageIndex+1} de {this.getMaxIndex()+1}
            <button onClick={this.indexUp}>
              ▶
            </button>
          </div>
        : <p>Nenhuma imagem disponível</p>}
      </div>
    )
  }
}