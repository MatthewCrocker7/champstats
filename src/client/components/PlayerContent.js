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
    searchID: null,
    stats: null,
  };

  async searchPlayer() {
    try{
      const response = await fetch('/api/champstats/initiatePlayerSearch', {
        method: 'POST',
        body: JSON.stringify({
          players: this.props.players,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const user = await response.json();
      this.setState({ searchID: user.searchID });
      console.log('SearchID is: ' + this.state.searchID);
    }catch(error){
      console.log('Search Player Error: ', error);
      this.setState({ searchID: null });
    }
  }

  async getData() {
    try{
      var interval = setInterval(async () => {
        const response = await fetch(`/api/champstats/playerSearch/${this.state.searchID}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const user = await response.json();
        this.setState({
          searchID: null,
          stats: user.stats,
        });
        console.log('Data Retreived, end interval.');
        clearInterval(interval);
      }, 10000);
    }catch(error){
      console.log('GetData Error: ', error);
    }
  }

  componentDidMount() {
    this.searchPlayer();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.players != this.props.players){
      this.setState({stats: null});
      this.searchPlayer();
    }
    if(prevState.searchID != this.state.searchID && this.state.searchID){
      this.getData();
    }
  }

  render(){
    const { classes, players, selectedNav } = this.props;
    const { searchID, stats } = this.state;

    return(
      <div className={classes.root}>
        {searchID && <h1 className={classes.textStyle}>Loading summoner data... this may take a few minutes.</h1>}
        {stats && <Stats stats={stats} selected={selectedNav} textStyle={classes.textStyle}/>}
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
