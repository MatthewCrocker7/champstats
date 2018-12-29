import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    margin: 'auto',
    marginTop: '0px',
    borderLeft: '3px solid #34568f',
    borderBottom: '3px solid #34568f',
    borderRight: '3px solid #34568f',
    width: '30%',
    height: '30px',
  },
  buttonNormal: {
    width: '33%',
    height: '100%',
    margin: 'auto',
  },
  buttonSelected: {
    width: '33%',
    height: '100%',
    margin: 'auto',
    backgroundColor: '#7aa0c4',
  },
  textStyle: {
    color: '#34568f',
    margin: 'auto',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class NavBar extends React.Component{
  state = {
    selected: 0
  }

  handleChange = (event, value) => {
    console.log(event.toString() + ' ' + value);
    this.setState({selected: value});
  }

  render(){
    const { classes } = this.props;
    const { selected } = this.state;

    return(
      <div className={classes.root}>
        <ButtonBase className={selected == 0 ? classes.buttonSelected : classes.buttonNormal}>
          <Typography variant='button' className={classes.textStyle}>
          Summary {selected}
          </Typography>
        </ButtonBase>
        <ButtonBase onClick={this.handleChange()} value={1} className={selected == 1 ? classes.buttonSelected : classes.buttonNormal}>
          <Typography variant='button' className={classes.textStyle}>
          Champ Stats
          </Typography>
        </ButtonBase>
        <ButtonBase className={selected == 2 ? classes.buttonSelected : classes.buttonNormal}>
          <Typography variant='button' className={classes.textStyle}>
          Other
          </Typography>
        </ButtonBase>
      </div>
    );
  }
}

export default withStyles(styles)(NavBar);
