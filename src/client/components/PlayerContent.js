import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import NavBar from './NavBar.js';

const styles = theme => ({
  root: {
    marginTop: '10px',
    borderTop: '3px solid #34568f',
    backgroundColor: '#FFFFFF',
  },
  gridRoot: {
    flexGrow: 1,
  },
  textStyle: {
    color: '#34568f',
    fontFamily: "Roboto",
    textAlign: 'center',
  },
  loadTextStyle: {
    color: '#34568f',
    fontFamily: "Roboto",
    textAlign: 'center',
  },
  contentLayout: {
    border: '3px solid #34568f',
    padding: theme.spacing.unit * 2,
    marginLeft: '25px',
    marginRight: '25px',
    marginTop: '25px',
  }
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
        {stats ?
          <Stats textStyle={classes.textStyle} stats={stats} contentLayout={classes.contentLayout} gridStyle={classes.gridRoot}/> :
          <h1 className={classes.loadTextStyle}>Loading... please wait.</h1>
        }
      </div>
    );
  }
}

function Stats(props){
  return(
    <div className={props.gridStyle}>
      <Grid container spacing={24}>
        <Grid item xs={4}>
          <div className={props.contentLayout}>
            <h1 className={props.textStyle}>{props.stats}</h1>
          </div>
        </Grid>
        <Grid item xs={8}>
          <div className={props.contentLayout}>
            <h1 className={props.textStyle}>{props.stats}</h1>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className={props.contentLayout}>
            <h1 className={props.textStyle}>{props.stats}</h1>
          </div>
        </Grid>
        <Grid item xs={8}>
          <div className={props.contentLayout}>
            <h1 className={props.textStyle}>{props.stats}</h1>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default withStyles(styles)(PlayerContent);
