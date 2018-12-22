import React, { Component } from 'react';
import './app.css';
import PlayerSearch from './components/PlayerSearch.js';
import { connect } from 'react-redux';

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
    const { players } = this.props;

    return (
      <div>
        {username ? <h1>{`Hello ${username}`}, welcome to Champstats.co</h1> : <h1>Loading.. please wait!</h1>}
        <PlayerSearch />
        {players ? players.map(x =>
          <h1 key={x.toString()}>{x}</h1>
        ) : <h1></h1>}
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
