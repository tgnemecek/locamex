// import ReactModal from 'react-modal';
// import React from 'react';
// import { Meteor } from 'meteor/meteor';
//
// import tools from '/imports/startup/tools/index';
// import AppHeader from './AppHeader';
// import { UserTypes } from '../api/user-types';
// import { Pages } from '../api/pages';
// import MessageBox from './MessageBox';
//
// export default class ListUserTypes extends React.Component {
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       database: []
//     }
//   };
//
//   componentDidMount() {
//     this.userTypesTracker = Tracker.autorun(() => {
//       Meteor.subscribe('userTypesPub');
//       const database = UserTypes.find({ visible: true }).fetch();
//       this.setState({ database });
//     })
//   }
//
//   render() {
//     return (
//       <div>
//         <AppHeader title="Permissões de Usuários"/>
//         <div className="page-content">
//           <table className="list-view__table">
//             <tbody className="list-view__tbody">
//               <tr>
//                 <th className="list-view__left-align list-view__small">Código</th>
//                 <th className="list-view__left-align">Descrição</th>
//                 <th className="list-view__right-align list-view__small"><UserTypeItem key={0} createNew={true}/></th>
//               </tr>
//               {this.state.database.map((usertype) => {
//                 return <UserTypeItem
//                   key={usertype._id}
//                   _id={usertype._id}
//                   description={usertype.description}
//                   permissions={usertype.permissions}
//                 />
//             })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       )
//   }
// }
//
// class UserTypeItem extends React.Component {
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       editOpen: false,
//       confirmationWindow: false,
//       formError: '',
//       pages: []
//     }
//     this.openEditWindow = this.openEditWindow.bind(this);
//     this.closeEditWindow = this.closeEditWindow.bind(this);
//     this.openConfirmationWindow = this.openConfirmationWindow.bind(this);
//     this.closeConfirmationWindow = this.closeConfirmationWindow.bind(this);
//     this.closeWithRemoval = this.closeWithRemoval.bind(this);
//     this.createNewUserType = this.createNewUserType.bind(this);
//   };
//
//   componentDidMount() {
//     this.pagesTracker = Tracker.autorun(() => {
//       Meteor.subscribe('pagesPub');
//       const pages = Pages.find({}).fetch();
//       this.setState({ pages });
//     })
//   }
//
//   openEditWindow() {
//     this.setState({editOpen: true});
//   };
//
//   closeEditWindow() {
//     this.setState({
//       editOpen: false,
//       confirmationWindow: false
//     });
//   };
//
//   closeWithRemoval() {
//     Meteor.call('userTypes.hide', this.props._id);
//   };
//
//   openConfirmationWindow() {
//     this.setState({confirmationWindow: true});
//   };
//
//   closeConfirmationWindow() {
//     this.setState({confirmationWindow: false});
//   }
//
//   removeSpecialCharacters(e) {
//     let value = e.target.value;
//     value = value.replace(/-./g, '');
//   }
//
//   showEditButton() {
//     if (this.props._id != '0000' && this.props._id != '0001') {
//         return <button className="button--pill list-view__button" onClick={this.openEditWindow}>Editar</button>
//     }
//   }
//
//   saveEdits(e) {
//     e.stopPropagation();
//
//     let description = this.refs.description.value.trim();
//     let toggles = Array.from(document.getElementsByClassName('onoffswitch-checkbox'));
//
//     let permissions = [];
//
//     for (var i = 0; i < toggles.length; i++) {
//        toggles[i].checked ? permissions.push(toggles[i].value) : null;
//     }
//
//     if (!description) {
//       this.setState({formError: 'Favor preencher a descrição'})
//       throw new Meteor.Error('required-fields-empty');
//     };
//     if (!permissions) {
//       this.setState({formError: 'Favor selecionar ao menos uma permissão'})
//       throw new Meteor.Error('required-permissions-empty');
//     };
//     Meteor.call('userTypes.update', this.props._id, description, permissions);
//     this.closeEditWindow();
//   }
//
//   createNewUserType(e) {
//     e.stopPropagation();
//
//     let description = this.refs.description.value.trim();
//     let toggles = Array.from(document.getElementsByClassName('onoffswitch-checkbox'));
//
//     let permissions = [];
//
//     for (var i = 0; i < toggles.length; i++) {
//        toggles[i].checked ? permissions.push(toggles[i].value) : null;
//     }
//
//     if (!description) {
//       this.setState({formError: 'Favor preencher todos os campos'})
//       throw new Meteor.Error('required-fields-empty');
//     }
//     if (permissions.length === 0) {
//       this.setState({formError: 'Favor selecionar ao menos uma permissão'})
//       throw new Meteor.Error('required-permissions-empty');
//     };
//     Meteor.call('userTypes.insert', description, permissions);
//     this.closeEditWindow();
//   }
//
//   editUserTypeScreen(open, _id, description, permissions, createNew) {
//     if (open) {
//       return(
//         <Box
//           isOpen={true}
//           className="boxed-view"
//           contentLabel="Editar Serviço"
//           appElement={document.body}
//           onRequestClose={() => this.setState({editOpen: false})}
//           className="boxed-view__box"
//           overlayClassName="boxed-view boxed-view--modal"
//           >
//             {createNew ? <h2>Criar Tipo de Usuário</h2> : <h2>Editar Tipo de Usuário</h2>}
//             {this.state.formError}
//             <form onSubmit={createNew ? this.createNewUserType.bind(this) : this.saveEdits.bind(this)}>
//               <div className="edit-user-types__main-div">
//                 <fieldset className="edit-user-types__fieldset">
//                   <legend>Permissões:</legend>
//                   {this.state.pages.map((page) => {
//                     return (
//                       <div key={page._id}>
//                         <div className="onoffswitch">
//                           <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id={page._id} value={page.name} defaultChecked={permissions.includes(page.name)}/>
//                           <label className="onoffswitch-label" htmlFor={page._id}>
//                             <span className="onoffswitch-inner"></span>
//                             <span className="onoffswitch-switch"></span>
//                           </label>
//                         </div>
//                         <label htmlFor={page._id}>{page.label}</label>
//                       </div>
//                     )})}
//                 </fieldset>
//                 <label>Descrição:</label><input type="text" ref="description" className="user-types__full-input" defaultValue={description}/>
//                 {createNew ? null : <button type="button" className="button button--danger edit-user-types--remove" onClick={this.openConfirmationWindow}>Remover</button>}
//               </div>
//               <div className="button__main-div">
//                 <button type="button" className="button button--secondary" onClick={this.closeEditWindow}>Fechar</button>
//                 {createNew ? <button className="button button--primary">Criar</button> : <button className="button button--primary">Salvar</button>}
//               </div>
//             </form>
//             {this.state.confirmationWindow ? <MessageBox
//               title="Deseja excluir este tipo de usuário?"
//               unmountMe={this.closeConfirmationWindow}
//               confirmMe={this.closeWithRemoval}/> : null}
//         </ReactModal>
//       )
//     }
//   }
//
//   render() {
//     if(this.props.createNew) {
//       return(
//         <div>
//           <button className="button--pill list-view__button" onClick={this.openEditWindow}>+</button>
//           {this.editUserTypeScreen(this.state.editOpen, '', '', '', true)}
//         </div>
//       )
//     } else {
//       return (
//           <tr>
//             <td className="list-view__left-align">{this.props._id}</td>
//             <td className="list-view__left-align">{this.props.description}</td>
//             <td className="list-view__right-align list-view__edit">
//               {this.showEditButton()}
//             </td>
//             {this.editUserTypeScreen(this.state.editOpen, this.props._id, this.props.description, this.props.permissions)}
//           </tr>
//       )
//     }
//   }
// }