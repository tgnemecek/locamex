import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';

import StockVisualizer from '/imports/components/StockVisualizer/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';
import RegisterData from '/imports/components/RegisterData/index';

import DatabaseTable from './DatabaseTable/index';

export default class Database extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      editWindow: false,
      stockVisualizer: false,
      imageWindow: false
    }
  }

  toggleEditWindow = (item) => {
    if (item) {
      this.setState({
        editWindow: !this.state.editWindow,
        item
      });
    } else this.setState({ editWindow: false, item: null });
  }

  toggleStockVisualizer = (item) => {
    if (item) {
      this.setState({
        stockVisualizer: !this.state.stockVisualizer,
        item
      });
    } else this.setState({ stockVisualizer: false, item: null });
  }

  toggleImageWindow = (item) => {
    if (item) {
      this.setState({
        imageWindow: !this.state.imageWindow,
        item
      });
    } else this.setState({ imageWindow: false, item: null });
  }

  render () {
    return (
      <>
        <div className="page-content">
          <DatabaseTable
            type={this.props.match.params.database}
            item={this.state.item}
            toggleEditWindow={this.toggleEditWindow}
            toggleStockVisualizer={this.toggleStockVisualizer}
            toggleImageWindow={this.toggleImageWindow}
          />
        </div>
        {this.state.stockVisualizer ?
          <StockVisualizer
            type={this.state.item.type}
            item={this.state.item}
            toggleWindow={this.toggleStockVisualizer}
          />
        : null}
        {this.state.imageWindow ?
          <ImageVisualizer
            item={{...this.state.item, itemType: this.props.match.params.database}}
            toggleWindow={this.toggleImageWindow}
          />
        : null}
        {this.state.editWindow ?
          <RegisterData
            type={this.props.match.params.database}
            item={this.state.item}
            toggleWindow={this.toggleEditWindow}
          />
        : null}
      </>
    )
  }
}