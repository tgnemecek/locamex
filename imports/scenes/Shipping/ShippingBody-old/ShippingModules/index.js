import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';
import SuggestionBar from '/imports/components/SuggestionBar/index';

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
    return (
      <tr>
        <th>#</th>
        <th>Componente</th>
        <th>Quantidade</th>
        <th>Seleção</th>
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
    function checkmark(item) {
      if (!item._id || !item.selectedList) return <span style={{color: 'red'}}>⦸</span>;
      return <span style={{color: 'green'}}>✔</span>
    }

    const filterOptions = (currentId) => {
      return this.props.modulesDatabase.filter((item) => {
        return !this.props.modules.find((element) => {
          if (element._id === item._id) {
            return (currentId !== item._id);
          } else return false;
        })
      })
    }

    const removeItem = (e) => {
      var index = e.target.value;
      var modules = tools.deepCopy(this.props.modules);
      modules.splice(index, 1);
      this.props.onChange({ modules });
    }

    const onClick = (e, module) => {
      var modules = tools.deepCopy(this.props.modules);
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

    return this.props.modules.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td>
            <SuggestionBar
              name={i}
              database={filterOptions(item._id)}
              value={item._id}
              showAll={true}
              onClick={onClick}/>
          </td>
          <td>{item.renting}</td>
          <td><button className="database__table__button" value={i} onClick={this.toggleMultipleWindow}>⟳</button></td>
          <td><button className="database__table__button" value={i} onClick={removeItem}>✖</button></td>
          <td className="table__small-column">{checkmark(item)}</td>
        </tr>
      )
    });
  }

  renderAddNew = () => {
    const onClick = () =>  {
      var modules = tools.deepCopy(this.props.modules);
      modules.push({
        _id: tools.generateId(),
        productId: '',
        description: ''
      })
      this.props.onChange({ modules });
    }
    return (
      <tr onClick={onClick}>
        <td colSpan="5" className="shipping__modules__add-new">Adicionar novo Componente</td>
      </tr>
    )
  }

  onChange = (changedItem) => {
    var modular = tools.deepCopy(this.props.modular);
    var itemIndex = modular.findIndex((element) => {
      return element._id === changedItem._id;
    })
    modular[itemIndex] = {
      ...modular[itemIndex],
      ...changedItem
    };
    this.props.onChange({ modular });
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
            {this.renderAddNew()}
          </tbody>
        </table>
        {this.state.selectMultiple.isOpen ?
          <this.props.SelectMultiple
            onChange={this.onChange}
            item={this.state.selectMultiple.item}
            title={this.state.selectMultiple.title}
            toggleWindow={this.toggleMultipleWindow}

            modulesDatabase={this.props.modulesDatabase}
            placesDatabase={this.props.placesDatabase}
          />
        : null}
      </Block>
    )
  }
}