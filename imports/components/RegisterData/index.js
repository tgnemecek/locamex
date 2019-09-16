import React from 'react';

import RegisterAccessories from './RegisterAccessories/index';
import RegisterAccounts from './RegisterAccounts/index';
import RegisterClients from './RegisterClients/index';
import RegisterContainers from './RegisterContainers/index';
import RegisterHistory from './RegisterHistory/index';
import RegisterModules from './RegisterModules/index';
import RegisterPacks from './RegisterPacks/index';
import RegisterPlaces from './RegisterPlaces/index';
import RegisterServices from './RegisterServices/index';
import RegisterSeries from './RegisterSeries/index';
import RegisterUsers from './RegisterUsers/index';

import Footer from './Footer/index';


export default function RegisterData(props) {

  switch (props.type) {
    case 'accessories':
      return <RegisterAccessories {...props} Footer={Footer} />
      break;
    case 'accounts':
      return <RegisterAccounts {...props} Footer={Footer} />
      break;
    case 'models':
      return <RegisterContainers {...props} Footer={Footer} />
      break;
    case 'clients':
      return <RegisterClients {...props} Footer={Footer} />
      break;
    case 'history':
      return <RegisterHistory {...props} Footer={Footer} />
      break;
    case 'series':
      return <RegisterSeries {...props} Footer={Footer} />
      break;
    case 'modules':
      return <RegisterModules {...props} Footer={Footer} />
      break;
    case 'packs':
      return <RegisterPacks {...props} Footer={Footer} />
      break;
    case 'places':
      return <RegisterPlaces {...props} Footer={Footer} />
      break;
    case 'services':
      return <RegisterServices {...props} Footer={Footer} />
      break;
    case 'users':
      return <RegisterUsers {...props} Footer={Footer} />
      break;
    default:
      return null;
  }
}