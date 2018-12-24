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
  state = {
    stats: null,
  };

  componentDidMount() {
    fetch('/api/champstats/playerSearch', {
        method: 'POST',
        body: JSON.stringify({
          stats: this.props.players,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(user => this.setState({
          stats: user.stats,
        }));
  }

  componentDidUpdate(prevProps) {
    if(prevProps.players != this.props.players){
      this.setState({stats: null});
      fetch('/api/champstats/playerSearch', {
          method: 'POST',
          body: JSON.stringify({
            stats: this.props.players,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(user => this.setState({
            stats: user.stats,
          }));
    }
  }

  render(){


    const { classes, players } = this.props;
    const { stats } = this.state;

    return(
      <div className={classes.root}>
        {stats ? <h1 className={classes.textStyle}>{stats}</h1> : <h1 className={classes.textStyle}>Loading... please wait.</h1>}
        {players.map(x =>
        <h1 className={classes.textStyle} key={x.toString()}>{x}</h1>)}
      </div>
    );
  }
}

function getStats(){

}

export default withStyles(styles)(PlayerContent);
