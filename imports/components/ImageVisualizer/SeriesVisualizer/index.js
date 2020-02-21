import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import moment from 'moment';

import Icon from '/imports/components/Icon/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class SeriesVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registryIndex: 0,
      imageIndex: 0
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.item.snapshots.length
      !== this.props.item.snapshots.length) {
      this.setState({
        registryIndex: 0,
        imageIndex: 0
      })
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
          <div className="image-visualizer__top">
            {this.getRegistry() ?
              <Input
                type="select"
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
        </div>
        {this.props.item.snapshots.length ?
          <img
            src={this.getRegistry()
              .images[this.state.imageIndex] + "?" + new Date().getTime()}/>
        : null}
        {this.props.item.snapshots.length
          && this.getRegistry().images.length ?
          <div className="image-visualizer__controls">
            <button onClick={this.indexDown}>
              <Icon icon="arrowLeft"/>
            </button>
            <div>
              {this.state.imageIndex+1} de {this.getMaxIndex()+1}
            </div>
            <button onClick={this.indexUp}>
              <Icon icon="arrowRight"/>
            </button>
          </div>
        : <p>Nenhuma imagem disponível</p>}
      </div>
    )
  }
}