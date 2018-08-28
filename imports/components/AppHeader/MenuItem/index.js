import React from 'react';
import { Link } from 'react-router';

export default class MenuItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  };

  openPages() {
    this.setState({isOpen: true});
  }

  render() {
    return(
      <div className="header__menu-item">
        <button onClick={this.openPages.bind(this)}>{this.props.categoryName}</button>
        <div className="header__menu-item--content">
          {this.props.categoryPages.map((category) => {
            return <Link className="button button--link" key={category.link} to={category.link}>{category.name}</Link>
            })}
        </div>
      </div>
    )
  }
}