import React from 'react';

class Animation extends React.Component {
  constructor(props) {
    super(props);
    this.setup = false;
    this.state = {
      opacity: 0
    }
  }

  componentDidMount() {
    if (this.props.fadeIn) this.fadeIn();
    this.setup = true;
  }

  fadeIn = () => {
    const loop = (duration) => {
      var wait = 10;
      var timesWillRun = duration / wait;
      var increment =  1 / timesWillRun;
      var interval = setInterval(() => {
        if (this.state.opacity >= 1) clearInterval(interval);
        var opacity = this.state.opacity + increment;
        this.setState({ opacity })
      }, wait);
    }
    var fadeIn = this.props.fadeIn;
    if (typeof fadeIn === "number") {
      fadeIn = {
        duration: fadeIn,
        offset: 0
      };
    }
    setTimeout(() => loop(fadeIn.duration), fadeIn.offset);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mounted && !this.props.mounted) {
      this.unMount()
    }
  }

  unMount = () => {
    const fadeOut = (duration) => {
      var rate = 100;
      var increment = rate / duration;
      var interval = setInterval(() => {
        if (this.state.opacity <= 0) {
          clearInterval(interval);
          this.props.unMount();
        }
        var opacity = this.state.opacity - increment;
        this.setState({ opacity })
      }, rate);
    }
    if (this.props.fadeOut) {
      fadeOut(this.props.fadeOut);
    } else this.props.unMount();
  }

  render() {
    var Tag = this.props.tag || "div";
    return (
      <Tag
        className={this.props.className || ""}
        style={{
          opacity: this.state.opacity
        }}
        >
        {this.props.children}
      </Tag>
    )
  }
}

export default class AnimationWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: true
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.mounted && !this.state.mounted) {
      this.setState({ mounted: true });
    }
  }

  unMount = () => {
    this.setState({ mounted: false });
  }

  render() {
    if (this.state.mounted) {
      return <Animation {...this.props} unMount={this.unMount}/>
    } else return null;
  }
}