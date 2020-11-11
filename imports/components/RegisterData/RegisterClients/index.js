import { Meteor } from "meteor/meteor";
import React from "react";
import ErrorBoundary from "/imports/components/ErrorBoundary/index";
import tools from "/imports/startup/tools/index";

import Block from "/imports/components/Block/index";
import Box from "/imports/components/Box/index";
import Input from "/imports/components/Input/index";
import FooterButtons from "/imports/components/FooterButtons/index";

import Tab from "./Tab/index";
import MainTab from "./MainTab/index";
import AddressTab from "./AddressTab/index";
import ContactTab from "./ContactTab/index";
import ObservationsTab from "./ObservationsTab/index";
import checkRequiredFields from "./check-required-fields/index";

export default class RegisterClients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || "",
      description: this.props.item.description || "",
      officialName: this.props.item.officialName || "",
      type: this.props.item.type || "company",
      registry: this.props.item.registry || "",
      registryES: this.props.item.registryES || "",
      registryMU: this.props.item.registryMU || "",
      rg: this.props.item.rg || "",
      phone1: this.props.item.phone1 || "",
      phone2: this.props.item.phone2 || "",
      email: this.props.item.email || "",
      address: this.props.item.address || {
        number: "",
        street: "",
        city: "",
        state: "SP",
        cep: "",
        additional: "",
      },
      observations: this.props.item.observations || "",
      contacts: this.props.item.contacts || [
        {
          _id: "",
          name: "",
          phone1: "",
          phone2: "",
          email: "",
          cpf: "",
          rg: "",
          visible: true,
        },
      ],
      tab: "main",
      errorMsg: "",
      errorKeys: [],
    };
  }
  onChange = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    var errorKeys = [...this.state.errorKeys];
    var fieldIndex = errorKeys.findIndex((key) => key === e.target.name);
    errorKeys.splice(fieldIndex, 1);

    this.setState({ [key]: value, errorKeys });
  };
  saveEdits = () => {
    var contacts = [...this.state.contacts];
    var check = checkRequiredFields({
      ...this.state,
      contacts: [],
    });

    if (check !== true) {
      this.setState({
        errorMsg: "Campos obrigatórios não preenchidos/inválidos.",
        errorKeys: check,
      });
    } else {
      var contacts = contacts.filter((contact, i) => {
        contact._id = tools.generateId();
        return !!contact.name;
      });

      var state = {
        ...this.state,
        contacts,
      };

      this.props.databaseLoading();
      if (this.props.item._id) {
        Meteor.call("clients.update", state, (err, res) => {
          if (err) this.props.databaseFailed(err);
          if (res) this.props.databaseCompleted();
        });
      } else {
        Meteor.call("clients.insert", state, (err, res) => {
          if (err) this.props.databaseFailed(err);
          if (res) this.props.databaseCompleted(res);
        });
      }
    }
  };
  changeTab = (tab) => {
    if (tab === "+") {
      this.addNewTab();
      tab = this.state.contacts.length + 2;
    }
    this.setState({ tab });
  };
  renderTabs = () => {
    var arr1 = [
      { value: "main", title: "Principal" },
      { value: "address", title: "Endereço" },
    ];
    var arr2 = this.state.contacts.map((contact, i) => {
      if (this.state.type == "company") {
        return { value: i + 2, title: `Contato ${i + 1}` };
      } else return { value: i + 2, title: `Contato Adicional ${i + 1}` };
    });
    var arr3 = [{ value: "+", title: "+" }];
    var arr4 = [{ value: "observations", title: "OBS" }];
    if (this.disabled()) {
      arr3 = [];
    }
    return arr1.concat(arr2, arr3, arr4);
  };
  addNewTab = () => {
    var contacts = [...this.state.contacts];
    contacts.push({
      _id: "",
      name: "",
      phone1: "",
      phone2: "",
      email: "",
      cpf: "",
      rg: "",
      visible: true,
    });
    this.setState({ contacts });
  };
  disabled = () => {
    if (this.props.disabled) return true;
    return !tools.isWriteAllowed("clients");
  };
  render() {
    return (
      <ErrorBoundary>
        <Box
          className="register-data"
          title={this.props.item._id ? "Editar Cliente" : "Criar Novo Cliente"}
          closeBox={this.props.toggleWindow}
          width="800px"
        >
          <Input
            type="select"
            name="type"
            className="register-clients__type-select"
            disabled={!!this.props.item._id}
            value={this.state.type}
            onChange={this.onChange}
          >
            <option value="company">Pessoa Jurídica</option>
            <option value="person">Pessoa Física</option>
          </Input>
          <div className="error-message">{this.state.errorMsg}</div>
          <Tab
            tab={this.state.tab}
            addNewTab={this.addNewTab}
            changeTab={this.changeTab}
            tabArray={this.renderTabs()}
          />
          {this.state.tab === "main" ? (
            <MainTab
              onChange={this.onChange}
              item={this.state}
              disabled={this.disabled()}
            />
          ) : null}
          {this.state.tab === "address" ? (
            <AddressTab
              onChange={this.onChange}
              item={this.state}
              disabled={this.disabled()}
            />
          ) : null}
          {Number(this.state.tab) > 1 ? (
            <ContactTab
              key={this.state.tab}
              onChange={this.onChange}
              item={this.state}
              disabled={this.disabled()}
            />
          ) : null}
          {this.state.tab === "observations" ? (
            <ObservationsTab
              onChange={this.onChange}
              item={this.state}
              disabled={this.disabled()}
            />
          ) : null}
          <FooterButtons
            disabled={this.disabled()}
            buttons={[
              {
                text: "Voltar",
                className: "button--secondary",
                onClick: this.props.toggleWindow,
              },
              { text: "Salvar", onClick: this.saveEdits },
            ]}
          />
        </Box>
      </ErrorBoundary>
    );
  }
}
