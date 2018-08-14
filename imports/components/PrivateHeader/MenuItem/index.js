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
      <div className="dropdown">
        <button className="button--header" onClick={this.openPages.bind(this)}>{this.props.categoryName}</button>
        <div className="dropdown-content">
          {this.props.categoryPages.map((category) => {
            return <Link className="button button--link button--header-page" key={category.link} to={category.link}>{category.name}</Link>
            })}
        </div>
      </div>
    )
  }
}