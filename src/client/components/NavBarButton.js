import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
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
  },
  textNormal: {
    color: '#34568f',
    margin: 'auto',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightRegular,
  },
  textSelected: {
    color: '#34568f',
    margin: 'auto',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightRegular * 2,
  },
});

class NavBarButton extends React.Component{
  render(){
    const { classes, label, value, selected, onChange} = this.props;

    return(
      <ButtonBase onClick={() => onChange(value)} value={this.props.value} className={value == selected ? classes.buttonSelected : classes.buttonNormal}>
        <Typography variant='button' className={value == selected ? classes.textSelected : classes.textNormal}>
        {label}
        </Typography>
      </ButtonBase>
    );
  }
}

export default withStyles(styles)(NavBarButton);
