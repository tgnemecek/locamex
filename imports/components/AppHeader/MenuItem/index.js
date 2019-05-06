import React from 'react';
import { Link } from 'react-router-dom';

export default class MenuItem extends React.Component {
  renderMultiple = () => {
    var pages = this.props.pages;
    return pages.map((page, i) => {
      return <Link key={i} to={page.link}>{page.title}</Link>
    })
  }
  render() {
    var pages = this.props.pages;
    if (pages.length > 1) {
      return (
        <div className="menu-item">
          {this.props.title}
          <div className="menu-item__dropbox">
            {this.renderMultiple()}
          </div>
        </div>
      )
    } else if (pages.length === 1) {
      return <Link className="menu-item" to={pages[0].link}>{pages[0].title}</Link>
    } else return null;
  }
}
// import React from 'react';
// import { Link } from 'react-router-dom';
//
// export default class MenuItem extends React.Component {
//   renderMultiple = (filteredPages) => {
//     return filteredPages.map((filteredPage, i) => {
//       return <Link key={i} to={filteredPage.link}>{filteredPage.title}</Link>
//     })
//   }
//   render() {
//     if (this.props.filteredPages.length > 1) {
//       return (
//         <div className="menu-item">
//           {this.props.name}
//           <div className="menu-item__dropbox">
//             {this.renderMultiple(filteredPages)}
//           </div>
//         </div>
//       )
//     } else if (filteredPages.length === 1) {
//       return (
//           <Link className="menu-item" to={filteredPages[0].link}>{filteredPages[0].title}</Link>
//       )
//     } else return null;
//   }
// }