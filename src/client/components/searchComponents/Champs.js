import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import DialogContentText from '@material-ui/core/DialogContentText';
import Divider from '@material-ui/core/Divider';

const styles = {
  textStyle: {
    color: '#34568f',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
};

class Champs extends React.Component {
  state = {
    champs: null
  };

  render() {
    const { champs } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <DialogContentText className={classes.textStyle}>
            Selected champs go here (images)
        </DialogContentText>
        <Divider variant="middle" />
        <DialogContentText className={classes.textStyle}>
            champ filter goes here
        </DialogContentText>
        <Divider variant="middle" />
        <DialogContentText className={classes.textStyle}>
            champ images go here
        </DialogContentText>
      </div>
    );
  }
}

export default withStyles(styles)(Champs);
