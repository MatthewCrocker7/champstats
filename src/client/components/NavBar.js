import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    marginTop: '10px',
    borderTop: '3px solid #34568f',
    backgroundColor: '#FFFFFF',
  },
  textStyle: {
    color: '#34568f',
    fontFamily: "Roboto",
    textAlign: 'center',
  },
});

class NavBar extends React.Component{
  render(){

    return(
      <div className={classes.root}>
        <h1 className={classes.textStyle}>test</h1>
      </div>
    );
  }
}

export default NavBar
