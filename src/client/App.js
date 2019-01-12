import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import 'typeface-roboto';
import PlayerSearch from './components/PlayerSearch.js';
import PlayerContent from './components/PlayerContent.js';
import { connect } from 'react-redux';

const styles = theme => ({
  root: {
    border: '3px solid #34568f',
    width: '100%',
    height: '100vh',
  },
  navBarHome: {
    marginTop: '15%',
  },
  navBarLoad: {
    marginTop: '0%',
  },
  textStyleLoaded: {
    color: '#34568f',
    fontFamily: "Roboto",
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  textStyleMain: {
    color: '#34568f',
    marginTop: '5%',
    fontSize: 80,
    fontFamily: "Roboto",
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
});


const mapStateToProps = state => {
  return {
    players: state.players.players
  };
};

class App extends Component {
  state = { username: null};

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    const { username } = this.state;
    const { classes, players } = this.props;

    return (
      <div className={classes.root}>
        <Header username={username} textStyle={players ? classes.textStyleLoaded : classes.textStyleMain}/>
        <div className={players ? classes.navBarLoad : classes.navBarHome } >
        <PlayerSearch players={players}/>
        </div>
        {players && <PlayerContent players={players} />}
      </div>
    );
  }
}

export function Header(props) {
  if(props.username){
    return(
      <h1 className={props.textStyle}>champstats.gg</h1>
    );
  }
  else {
    return (
      <h1 className={props.textStyle}>Loading.. please wait!</h1>
    );
  }
}

export default connect(mapStateToProps)(withStyles(styles)(App));
