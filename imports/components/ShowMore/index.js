import React from "react";

export default class ShowMore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false,
    };
  }
  showMore = (e) => {
    e.preventDefault();
    this.setState(
      {
        showAll: true,
      },
      () => this.props.showMore()
    );
  };

  render() {
    if (!this.state.showAll) {
      return (
        <div className="show-more">
          {`Exibindo ${this.props.count} itens. `}
          <button className="show-more__button" onClick={this.showMore}>
            Mostrar tudo.
          </button>
        </div>
      );
    } else {
      return null;
    }
  }
}
