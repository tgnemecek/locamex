import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';
import SuggestionBar from '/imports/components/SuggestionBar/index';
import Icon from '/imports/components/Icon/index';
import SelectModules from './SelectModules/index';

export default class ShippingModules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectMultiple: {
        isOpen: false,
        item: {},
        title: ""
      }
    }
  }

  renderHeader = () => {
    const addNew = () =>  {
      var modules = [...this.props.modules];
      modules.push({
        _id: tools.generateId(),
        productId: '',
        description: '',
        selected: []
      })
      this.props.onChange({ modules });
    }
    return (
      <tr>
        <th className="table__small-column">#</th>
        <th>Componente</th>
        <th className="table__small-column">Seleção</th>
        <th className="table__small-column" onClick={addNew} className="database__table__button" style={{textAlign: "center"}}>+</th>
      </tr>
    )
  }

  toggleMultipleWindow = (e) => {
    if (!e) return this.setState({ selectMultiple: { isOpen: false } });
    var index = e.target.value;
    var _id = this.props.modules[index]._id;
    var productId = this.props.modules[index].productId;
    if (!productId) return;
    var item = this.props.modules[index];
    var selectMultiple = {
      isOpen: true,
      item: item,
      title: "Produto: " + item.description
    }
    this.setState({ selectMultiple });
  }

  renderBody = () => {
    function checkmark(item, quantity) {
      if (!item._id || !quantity) return <span style={{color: 'red'}}>⦸</span>;
      return <span style={{color: 'green'}}>✔</span>
    }

    const filterOptions = (currentId) => {
      return this.props.modulesDatabase.filter((item) => {
        return !this.props.modules.find((element) => {
          if (element.productId === item._id) {
            return (currentId !== element._id);
          } else return false;
        })
      })
    }

    const removeItem = (e) => {
      var index = e.target.value;
      var modules = [...this.props.modules];
      modules.splice(index, 1);
      this.props.onChange({ modules });
    }

    const onClick = (e, module) => {
      var modules = [...this.props.modules];
      var i = e.target.name;
      modules[i] = {
        ...modules[i],
        productId: module._id,
        description: module.description,
        selected: [],
        place: tools.findUsingId(this.props.modulesDatabase, module._id).place
      }
      this.props.onChange({ modules });
    }

    function calculateQuantity(selected) {
      if (!selected) return 0;
      return selected.reduce((acc, cur) => {
        return acc + cur.selected;
      }, 0);
    }

    return this.props.modules.map((item, i) => {
      return (
        <tr key={i}>
          <td className="table__small-column">{i+1}</td>
          <td>
            <SuggestionBar
              name={i}
              database={filterOptions(item._id)}
              value={item._id}
              showAll={true}
              onClick={onClick}/>
          </td>
          <td className="table__small-column">{calculateQuantity(item.selected)}</td>
          <td className="table__small-column">
            <Icon value={i} onClick={this.toggleMultipleWindow} icon="transaction"/>
          </td>
          <td className="table__small-column">
            <Icon onClick={removeItem} icon="not"/>
          </td>
          <td className="table__small-column">{checkmark(item, calculateQuantity(item.selected))}</td>
        </tr>
      )
    });
  }

  onChange = (changedItem) => {
    var modules = [...this.props.modules];
    var itemIndex = modules.findIndex((element) => {
      return element._id === changedItem._id;
    })
    modules[itemIndex] = {
      ...modules[itemIndex],
      ...changedItem
    };
    this.props.onChange({ modules });
  }

  render() {
    return (
      <Block columns={1} title="Componentes">
        <table className="table">
          <thead>
            {this.renderHeader()}
          </thead>
          <tbody>
            {this.renderBody()}
          </tbody>
        </table>
        {this.state.selectMultiple.isOpen ?
          <SelectModules
            onChange={this.onChange}
            item={this.state.selectMultiple.item}
            title={this.state.selectMultiple.title}
            toggleWindow={this.toggleMultipleWindow}
            productFromDatabase={tools.findUsingId(this.props.modulesDatabase, this.state.selectMultiple.item.productId)}

            modulesDatabase={this.props.modulesDatabase}
            placesDatabase={this.props.placesDatabase}
          />
        : null}
      </Block>
    )
  }
}