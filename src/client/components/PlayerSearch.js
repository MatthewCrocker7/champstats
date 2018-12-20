import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  root: {
    margin: 'auto',
    backgroundColor: '#34568f',
  }
});

class PlayerSearch extends React.Component {
  render(){
    const { classes } = this.props;

    return(
      <div className={classes.root}>
        <h1>Test</h1>
      </div>
    );
  }
}

export default withStyles(styles)(PlayerSearch);
