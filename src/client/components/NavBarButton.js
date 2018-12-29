import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
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

  render(){
    const { classes, label } = this.props;
    const { selected } = this.state;

    return(
      <div>
        <ButtonBase className={buttonNormal}>
          <Typography variant='button' className={classes.textStyle}>
          {label}
          </Typography>
        </ButtonBase>
      </div>
    );
  }
}

export default withStyles(styles)(NavBar);
