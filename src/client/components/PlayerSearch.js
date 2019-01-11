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
  rootHome: {
    display: 'flex',
    justifyContent: 'center',
  },
  rootLoad: {
    display: 'flex',
    marginLeft: '5%',
    justifyContent: 'left',
  },
  textField: {
    margin: '0px',
    width: '25%',
    backgroundColor: '#FFFFFF',
  },
  buttonStyle: {
    textAlign: 'center',
    display: 'inline-block',
    margin: '0px',
    width: '10%',
    backgroundColor: '#34568f',
  },
  cssLabel: {
      color : '#34568f'
    },

    cssOutlinedInput: {
      '&$cssFocused $notchedOutline': {
        borderColor: `${'#34568f'} !important`,
      },
    },

    cssFocused: {},

    notchedOutline: {
      borderWidth: '1px',
      borderColor: '#34568f !important'
    },
});

const mapDispatchToProps = dispatch => {
  return {
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
    this.props.updatePlayers({players: this.state.playerSearch.split( /[:;!@?#$%^&*()=|+,]+/g )});
  }

  keyPress = event => {
    if(event.keyCode == 13){
      this.props.updatePlayers({players: event.target.value.split( /[:;!@?#$%^&*()=|+,]+/g )});
      console.log(event.target.value.split( /[ ,]+/g ));
    }
  }

  render(){
    const { classes, players } = this.props;
    const { playerSearch, playerLoaded } = this.state;


    return(
      <div className={players ? classes.rootLoad : classes.rootHome }>
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
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
          }}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            },
          }}
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
