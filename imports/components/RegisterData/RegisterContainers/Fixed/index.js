import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Modules } from '/imports/api/modules/index';
import { Places } from '/imports/api/places/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

class Fixed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      price: this.props.item.price || '',
      restitution: this.props.item.restitution || '',

      errorMsg: '',
      errorKeys: []
    }
  }
  renderOptions = (database) => {
    return this.state[database].map((item, i) => {
      return <option key={i} value={item._id}>{item.description}</option>
    })
  }
  onChange = (e) => {
    var errorKeys = [...this.state.errorKeys];
    var fieldIndex = errorKeys.findIndex((key) => key === e.target.name);
    errorKeys.splice(fieldIndex, 1);

    this.setState({ [e.target.name]: e.target.value, errorKeys });
  }
  setFlyer = (e) => {
    var flyer = e.target.files[0];
    this.setState({ flyer });
  }
  removeItem = () => {
    this.props.databaseLoading();
    Meteor.call('containers.hide', this.props.item._id, (err, res) => {
      if (err) this.props.databaseFailed(err);
      if (res) this.props.databaseCompleted();
    });
  }
  saveEdits = () => {
    var errorKeys = [];
    if (!this.state.description.trim()) {
      errorKeys.push("description");
      this.setState({ errorMsg: "Favor informar uma descrição.", errorKeys });
    } else {
      this.props.databaseLoading();
      if (this.props.item._id) {
        Meteor.call('containers.fixed.update', this.state, (err, res) => {
          if (err) this.props.databaseFailed(err);
          if (res) this.props.databaseCompleted();
        });
      } else Meteor.call('containers.fixed.insert', this.state, (err, res) => {
        if (err) this.props.databaseFailed(err);
        if (res) this.props.databaseCompleted();
      });
    }
  }
  render() {
    return (
      <Box className="register-data"
        title={this.props.item._id ? "Editar Container Fixo" : "Criar Novo Container Fixo"}
        closeBox={this.props.toggleWindow}
        width="800px">
        <div className="error-message">{this.state.errorMsg}</div>
          <Block columns={4} options={[{block: 0, span: 2}]}>
            <Input
              title="Descrição:"
              type="text"
              name="description"
              error={this.state.errorKeys.includes("description")}
              value={this.state.description}
              onChange={this.onChange}
            />
            <Input
              title="Valor Mensal:"
              type="currency"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
            />
            <Input
              title="Indenização:"
              type="currency"
              name="restitution"
              value={this.state.restitution}
              onChange={this.onChange}
            />
          </Block>
          <FooterButtons
            disabled={!tools.isWriteAllowed('containers')}
            buttons={this.props.item._id ?
              [
                {text: "Excluir Registro",
                className: "button--danger",
                onClick: () => this.props.toggleConfirmationWindow(this.removeItem)},
                {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
                {text: "Salvar", onClick: this.saveEdits}
              ]
            :
            [
              {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
              {text: "Salvar", onClick: this.saveEdits}
            ]}/>
      </Box>
    )
  }
}

sendFile = (file) => {

  var metaContext;
  var sendCount = 0;

  metaContext = createMetaContext(this.props.item, imageIndex, file);
  var uploader = new Slingshot.Upload(this.props.uploadDirective, metaContext);
  uploader.send(file, (error, downloadUrl) => {
    sendCount++;
    if (!error) {
      urls[imageIndex] = downloadUrl;
      if (sendCount === arr.length) {
        Meteor.call('snapshot.add', metaContext, urls);
        alert(urls.length + ' arquivo(s) enviado(s) com sucesso!');
        this.props.toggleWindow(true);
      }
    } else console.error(error);
  });
}

export default FixedWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var placesDatabase = Places.find().fetch();
  return {
    placesDatabase
  }
})(Fixed);