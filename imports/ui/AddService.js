import React from 'react';

import { Services } from '../api/services';

export default class AddService extends React.Component {

  listServices() {
    let servicesArray = Services.find().fetch();
    return servicesArray.map((services) => {
      return <option key={services._id} value={services._id} onChange={this.setPrice()}>{services.description}</option>
    });
  };

  setPrice() {
    this.refs.price.defaultValue = services.price;
  };

  render() {
     return (
       <div className="boxed-view">
         <div className="boxed-view__box">
           <h1>Adicionar Serviço</h1>
           <select name="services">
             {this.listServices()}
           </select>
           <input ref="price" type="number" defaultValue={this.service.value}/>
           <button className="button">Adicionar</button>
         </div>
       </div>
     );
  };
}