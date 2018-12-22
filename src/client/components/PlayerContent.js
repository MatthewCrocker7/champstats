import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    marginTop: '10px',
    borderTop: '3px solid #34568f',
    backgroundColor: '#FFFFFF',
    height: '100vh'
  },
  textStyle: {
    color: '#34568f',
    fontFamily: "Roboto",
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
});

class PlayerContent extends React.Component{
  render(){
    const { classes, players } = this.props;
    return(
      <div className={classes.root}>
        {players.map(x =>
        <h1 className={classes.textStyle} key={x.toString()}>{x}</h1>)}
      </div>
    );
  }
}

export default withStyles(styles)(PlayerContent);
