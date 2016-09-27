import styles from '../assets/css/styles.sss';
import React, { Component } from 'react';

const Hello = React.createClass({
  render() {
    return(
      <h1 className={styles.whatever}>Hello, {this.props.name}!</h1>
    )
  }
});

export default Hello;
