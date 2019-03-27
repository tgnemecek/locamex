import React from 'react';

import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import SelectMultiple from './SelectMultiple/index';

export default class SelectModules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: this.props.item.selectedList || [],
      selectMultiple: false,
      itemToSelect: {}
    }
  }

  toggleMultipleWindow = (e) => {
    var moduleId = e ? e.target.value : null;
    var itemToSelect = this.state.selectMultiple ? false : tools.findUsingId(this.props.modulesDatabase, moduleId);
    this.setState({ selectMultiple: !this.state.selectMultiple, itemToSelect });
  }

  renderAllowedModules = () => {

    const renderQuantities = (moduleId) => {
      var selectedList = this.state.selectedList;
      if (!selectedList.length) return 0;
      var index = selectedList.findIndex((item) => moduleId === item._id);
      return selectedList[index].selected || 0;
    }

    return this.props.productFromDatabase.allowedModules.map((moduleId, i) => {
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td>{tools.findUsingId(this.props.modulesDatabase, moduleId).description}</td>
          <td>{renderQuantities(moduleId)}</td>
          <td><button className="database__table__button" value={moduleId} onClick={this.toggleMultipleWindow}>⟳</button></td>
        </tr>
      )
    })
  }

  render() {
    return (
      <Box
        title="Adicionar Componentes"
        closeBox={this.props.toggleWindow}
        >
        <Block columns={1}>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Descrição</th>
                <th>Qtd</th>
                <th>Seleção</th>
              </tr>
            </thead>
            <tbody>
              {this.renderAllowedModules()}
            </tbody>
          </table>
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Salvar Edições", className: "button--primary", onClick: this.saveEdits},
          ]}/>
        {this.state.selectMultiple && this.state.itemToSelect ?
          <SelectMultiple
            onChange={this.onChange}
            productFromDatabase={tools.findUsingId(this.props.containersDatabase, this.state.itemToSelect._id)}
            placesDatabase={this.props.placesDatabase}
            toggleWindow={this.toggleMultipleWindow}
            item={this.state.itemToSelect}
          />
        : null}
        </Block>
      </Box>

    )
  }
}