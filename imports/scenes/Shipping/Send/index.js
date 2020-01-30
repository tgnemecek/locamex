import React from 'react';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';

import SendPacks from './SendPacks/index';
import SendFixed from './SendFixed/index';
import SendAccessories from './SendAccessories/index';
import Footer from './Footer/index';

export default class Send extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fixed: [],
      packs: [],
      accessories: [],

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
        this.props.currentlyRented.packs
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

    const setPacks = () => {
      var modulars = [];
      this.props.contract.containers.forEach((item) => {
        if (item.type === "modular") {
          for (var j = 0; j < item.renting; j++) {
            modulars.push({
              ...item,
              label: tools.convertToLetter(j)
            })
          }
        }
      })
      var newArray = [];
      modulars.forEach((item) => {
        var canRent = !this.props.currentlyRented.packs.find((obj) => {
          return obj.label === item.label;
        })
        var productFromDatabase = tools.findUsingId(this.props.databases.containersDatabase, item.productId);
        newArray.push({
          _id: tools.generateId(),
          label: item.label,
          productId: item.productId,
          description: productFromDatabase.description,
          modules: [],
          allowedModules: productFromDatabase.allowedModules
        })
      })
      return newArray;
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
        packs: setPacks(),
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
    this.setState({
      confirmationWindow: !this.state.confirmationWindow
    });
  }

  sendProducts = () => {
    var state = {
      ...this.state,
      _id: this.props.contract._id
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

  render() {
    return (
      <Box
        className="shipping__select"
        closeBox={this.props.toggleSend}
        title="Realizar Nova Entrega">
        <SendFixed
          onChange={this.onChange}
          fixed={this.state.fixed}

          containersDatabase={this.props.databases.containersDatabase}
          placesDatabase={this.props.databases.placesDatabase}
          seriesDatabase={this.sortSeriesDatabase()}/>
        {!this.state.fixed.length &&
          !this.state.accessories.length &&
          !this.state.packs.length ?
          "Não há itens disponíveis para envio!"
        : null}
        {!!this.state.packs.length ?
          <SendPacks
            onChange={this.onChange}
            packs={this.state.packs}

            modulesDatabase={this.props.databases.modulesDatabase}
            placesDatabase={this.props.databases.placesDatabase}/>
        : null}
        <SendAccessories
          onChange={this.onChange}
          accessories={this.state.accessories}

          accessoriesDatabase={this.props.databases.accessoriesDatabase}
          placesDatabase={this.props.databases.placesDatabase}/>
        <Footer
          hidden={
            !this.state.fixed.length &&
            !this.state.accessories.length &&
            !this.state.packs.length}
          fixed={this.state.fixed}
          packs={this.state.packs}
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