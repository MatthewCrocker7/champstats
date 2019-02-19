import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import Champs from './Champs';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = {
  rootStyle: { // Div will contain dialog button as well as selected options
    display: 'inline-block',
    height: '80%',
    width: '19%',
    justifyContent: 'center',
    margin: 'auto',
    border: '2px solid #34568f',
  },
  buttonStyle: {
    width: '60%',
    height: '22%',
    marginTop: '5%',
    marginLeft: '20%',
  },
  textStyle: {
    color: '#34568f',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
};

class Selector extends React.Component {
    state = {
      open: false,
      dialogWidth: true,
    };

    handleOpen = () => {
      this.setState({ open: true });
    };

    handleClose = () => {
      this.setState({ open: false });
    };

    render() {
      const { open, dialogWidth } = this.state;
      const { classes, buttonText } = this.props;

      return (
        <div className={classes.rootStyle}>
          <Button variant="outlined" color="primary" onClick={this.handleOpen} className={classes.buttonStyle}>
            {buttonText}
          </Button>
          <Dialog
            open={open}
            onClose={this.handleClose}
            TransitionComponent={Transition}
            maxWidth="md"
            fullWidth={dialogWidth}
            aria-labelledby="form-dialog-title"
          >
            <h1 id="form-dialog-title" className={classes.textStyle}>
                Select {buttonText}
            </h1>
            <DialogContent>
              <Champs textStyle={classes.textStyle}/>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
}

export default withStyles(styles)(Selector);
