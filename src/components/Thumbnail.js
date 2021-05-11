import React, { Component } from 'react';

class Thumbnail extends Component {

  constructor(props) {
    super(props);
  }


  render() {

    const thumbnailUrl = "https://img.youtube.com/vi/" + this.props.img + "/default.jpg";
    //console.log(this.props.img );

    return (
      <img src={thumbnailUrl} alt="" />
    )
  }

}

export default Thumbnail