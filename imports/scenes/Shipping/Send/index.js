import React from 'react';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';

import ShippingModules from './ShippingModules/index';
import ShippingFixed from './ShippingFixed/index';
import ShippingAccessories from './ShippingAccessories/index';
import Footer from './Footer/index';

export default class Send extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fixed: [],
      modules: [],
      accessories: [],
      allowedModules: [],

      databaseStatus: '',
      confirmationWindow: false
    }
  }

  componentDidMount() {
    this.setup();
  }

  setup = () => {
    const countHowManyCanRent = (currentItem) => {
      var productId = currentItem.productId;
      var renting = currentItem.renting;
      var count = 0;
      var all = this.props.currentlyRented.fixed.concat(
        this.props.currentlyRented.accessories,
        this.props.currentlyRented.modules
      );
      all.forEach((item) => {
        if (item.productId === productId) {
          if (item.selected) {
            count += item.selected;
          } else count += item.renting || 1;
        }
      })
      return renting - count;
    }

    const setFixed = () => {
      var newArray = [];
      this.props.contract.containers.forEach((item) => {
        if (item.type === 'fixed') {
          var canRent = countHowManyCanRent(item);
          for (var i = 0; i < canRent; i++) {
            var productFromDatabase = tools.findUsingId(this.props.databases.containersDatabase, item.productId);
            newArray.push({
              _id: tools.generateId(),
              productId: item.productId,
              seriesId: '',
              description: productFromDatabase.description,
              place: item.place
            })
          }
        }
      })
      return newArray;
    }

    const setAllowedModules = () => {
      var allowedModules = [];
      var modularList = [];
      if (!this.props.databases.containersDatabase.length) return [];
      this.props.contract.containers.forEach((container) => {
        if (container.type === 'modular') {
          var productFromDatabase = tools.findUsingId(this.props.databases.containersDatabase, container.productId);

          productFromDatabase.allowedModules.forEach((module) => {
            if (!allowedModules.includes(module)) {
              allowedModules.push(module);
            }
          })
        }
      })
      return allowedModules;
    }

    const setAccessories = () => {
      var newArray = [];
      this.props.contract.accessories.forEach((item) => {
        var canRent = countHowManyCanRent(item);
        if (canRent > 0) {
          var productFromDatabase = tools.findUsingId(this.props.databases.accessoriesDatabase, item.productId);
          newArray.push({
            _id: tools.generateId(),
            productId: item.productId,
            renting: canRent,
            selected: [],
            description: productFromDatabase.description
          })
        }
      })
      return newArray;
    }

    if (this.props.contract) {
      this.setState({
        fixed: setFixed(),
        allowedModules: setAllowedModules(),
        accessories: setAccessories()
      });
    }
  }

  onChange = (changes) => {
    this.setState({
      ...changes
    })
  }

  toggleConfirmationWindow = () => {
    this.setState({ confirmationWindow: !this.state.confirmationWindow });
  }

  sendProducts = () => {
    var state = {
      ...this.state,
      _id: this.props.contract._id,
      modules: this.state.modules.map((module) => {
        return {...module, place: ""}
      })
    }
    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('contracts.shipping.send', state, (err, res) => {
        if (res) {
          this.setState({ databaseStatus: {
            status: "completed",
            callback: this.props.toggleSend
          } });
        } if (err) this.setState({ databaseStatus: "failed"});
      });
    })
  }

  sortSeriesDatabase = () => {
    var seriesDatabase = [...this.props.databases.seriesDatabase];
    return seriesDatabase.sort((a, b) => {
      var comparison = a.place.localeCompare(b.place);
      if (comparison === 0) {
        return a._id.localeCompare(b._id);
      } else return comparison;
    })
  }

  filterModulesDatabase = () => {
    return this.props.databases.modulesDatabase.filter((item) => {
      return this.state.allowedModules.includes(item._id);
    })
  }

  render() {
    return (
      <Box
        className="shipping__select"
        closeBox={this.props.toggleSend}
        title="Realizar Nova Entrega">
        <ShippingFixed
          onChange={this.onChange}
          fixed={this.state.fixed}

          containersDatabase={this.props.databases.containersDatabase}
          placesDatabase={this.props.databases.placesDatabase}
          seriesDatabase={this.sortSeriesDatabase()}/>
        {!this.state.fixed.length &&
          !this.state.accessories.length &&
          !this.state.modules.length ?
          "Não há itens disponíveis para envio!"
        : null}
        {!!this.state.allowedModules.length ?
          <ShippingModules
            onChange={this.onChange}
            modules={this.state.modules}

            modulesDatabase={this.filterModulesDatabase()}
            placesDatabase={this.props.databases.placesDatabase}/>
        : null}
        <ShippingAccessories
          onChange={this.onChange}
          accessories={this.state.accessories}

          accessoriesDatabase={this.props.databases.accessoriesDatabase}
          placesDatabase={this.props.databases.placesDatabase}/>
        <Footer
          hidden={
            !this.state.fixed.length &&
            !this.state.accessories.length &&
            !this.state.modules.length}
          fixed={this.state.fixed}
          modules={this.state.modules}
          accessories={this.state.accessories}
          toggleConfirmationWindow={this.toggleConfirmationWindow}
          />
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow}
          closeBox={this.toggleConfirmationWindow}
          message="Deseja enviar os produtos selecionados?"
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.sendProducts}}
        />
        <DatabaseStatus status={this.state.databaseStatus} />
      </Box>
    )
  }
}