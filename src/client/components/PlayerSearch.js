import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import 'typeface-roboto';
import { connect } from 'react-redux';
import { updatePlayers } from '../redux/actions/actions.js';

const styles = theme => ({
  root: {
    display: 'flex',
    margin: 'auto',
    marginTop: '10%',
    justifyContent: 'center',
  },
  textField: {
    margin: '0',
    width: '25%',
  },
  buttonStyle: {
    display: 'inline-block',
    margin: '0',
    width: '8%',
    backgroundColor: '#34568f',
  },
  textStyle: {

  }
});

const mapDispatchToProps = dispatch => {
  return {
    //updatePlayers: players => dispatch(updatePlayers(String(players).match(/[ ,]+/g)))
    updatePlayers: players => dispatch(updatePlayers(players))
  };
};

class PlayerSearch extends React.Component {
  state = {
    playerSearch: '',
  };

  updatePlayer = event => {
    this.setState({playerSearch: event.target.value});
  }

  searchPlayer = event => {
    this.props.updatePlayers({players: this.state.playerSearch.split( /[ ,]+/g )});
  }

  keyPress = event => {
    if(event.keyCode == 13){
      this.props.updatePlayers({players: event.target.value.split( /[ ,]+/g )});
      console.log(event.target.value.split( /[ ,]+/g ));
    }
  }

  render(){
    const { classes } = this.props;
    const { playerSearch, playerLoaded } = this.state;


    return(
      <div className={classes.root}>
        <TextField
          onChange={this.updatePlayer}
          id="Player Name"
          label="Player Name"
          placeholder="Player1, Player2, Player3, ..."
          className={classes.textField}
          type="text"
          autoComplete="username"
          margin="normal"
          variant="outlined"
          value={playerSearch}
          onKeyDown={this.keyPress}
        />
        <Button
          onClick={this.searchPlayer}
          variant="contained"
          size="medium"
          color="primary"
          className={classes.buttonStyle}
        >
          Search
        </Button>
      </div>
    );
  }
}
//Idea: On search, animate center search onto a nav bar, smaller in size left justified. Raise to the top. Stats below.



export default connect(null, mapDispatchToProps)(withStyles(styles)(PlayerSearch));
