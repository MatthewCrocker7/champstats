import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import NavBar from './NavBar.js';
import PlayerSummary from './playerComponents/PlayerSummary.js';
import PlayerChampStats from './playerComponents/PlayerChampStats.js';
import { connect } from 'react-redux';

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
  loadTextStyle: {
    color: '#34568f',
    fontFamily: "Roboto",
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  return {
    selectedNav: state.playerNav
  };
};

class PlayerContent extends React.Component{
  state = {
    stats: null,
  };

  componentDidMount() {
    fetch('/api/champstats/playerSearch', {
        method: 'POST',
        timeout: 0,
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
    const { classes, players, selectedNav } = this.props;
    const { stats } = this.state;

    return(
      <div className={classes.root}>
        {stats ?
          <Stats stats={stats} selected={selectedNav} textStyle={classes.textStyle}/>
          :
          <h1 className={classes.textStyle}>Loading... please wait.</h1>
        }
      </div>
    );
  }
}

function Stats(props){
  if(props.stats[0] === ''){
    return(
      <h1 className={props.textStyle}>Player not found. Please search again.</h1>
    )
  }
  return(
    <div>
      <NavBar />
      {props.selected == 0 && <PlayerSummary stats={props.stats}/>}
      {props.selected == 1 && <PlayerChampStats stats={props.stats}/>}
    </div>
  );
}

export default connect(mapStateToProps)(withStyles(styles)(PlayerContent));
