import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Settings } from '/imports/api/settings/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';
import AppHeader from '/imports/components/AppHeader/index';
import Input from '/imports/components/Input/index';
import MainHeader from '/imports/components/MainHeader/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

class Configuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: this.props.settings,
      databaseStatus: false
    }
  }

  onChangeProposalConditions = (e) => {
    function formatConditions(conditions) {
      if (conditions === '') return '';
      conditions = conditions.replace(/\n•$/gm, '');
      conditions = conditions.replace(/• ?/g, '');
      conditions = conditions.replace(/\n/g, '\n• ');
      return '• ' + conditions;
    }

    var settings = {
      ...this.state.settings,
      proposal: {
        ...this.state.settings.proposal,
        [e.target.name]: formatConditions(e.target.value)
      }
    };

    this.setState({ settings });
  }

  saveEdits = () => {
    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('settings.update', this.state.settings, (err, res) => {
        if (res) {
          this.setState({ databaseStatus: "completed" });
        }
        if (err) {
          this.setState({ databaseStatus: "failed" });
        }
      })
    })
  }

  render () {
    return (
      <div className="page-content">
        <RedirectUser currentPage="configuration"/>
        <div className="main-scene configuration">
          <MainHeader
            title="Configurações"
            type="configuration"/>
            <div>
              <h2>Configurações de Proposta</h2>
              <Input
                title="Condições da Proposta a Longo Prazo"
                type="textarea"
                value={this.state.settings.proposal.defaultConditionsMonths}
                name="defaultConditionsMonths"
                onChange={this.onChangeProposalConditions}/>
              <Input
                title="Condições da Proposta a Curto Prazo"
                type="textarea"
                value={this.state.settings.proposal.defaultConditionsDays}
                name="defaultConditionsDays"
                onChange={this.onChangeProposalConditions}/>
            </div>
            <FooterButtons buttons={[
              {text: "Salvar Alterações", onClick: this.saveEdits}
            ]}/>
          <DatabaseStatus status={this.state.databaseStatus}/>
        </div>
      </div>
    )
  }
}

function ConfigurationLoader (props) {
  if (props.settings) {
    return <Configuration {...props} />
  }
  return null;
}

export default ConfigurationWrapper = withTracker((props) => {
  Meteor.subscribe('settingsPub');

  var settings = Settings.findOne({});

  return {
    settings
  }
})(ConfigurationLoader);
