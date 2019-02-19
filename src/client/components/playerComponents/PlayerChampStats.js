/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Filters from '../searchComponents/Filters';

const styles = theme => ({
  rootStyle: {
    flexGrow: 1,
    height: '100vh',
    width: '100%',
  },
  textStyle: {
    color: '#34568f',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  contentLayout: {
    border: '3px solid #34568f',
    padding: theme.spacing.unit * 2,
    marginLeft: '25px',
    marginRight: '25px',
    marginTop: '25px',
  }
});

class PlayerChampStats extends React.Component {
  render() {
    const { classes, stats } = this.props;

    return (
      <div className={classes.rootStyle}>
        <Filters />
        <Divider variant="middle" />
        <h1 className={classes.textStyle}>stats go here</h1>
      </div>
    );
  }
}

export default withStyles(styles)(PlayerChampStats);
