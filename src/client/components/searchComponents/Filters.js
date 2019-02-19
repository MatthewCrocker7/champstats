/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Selector from './Selector';

const styles = {
  rootStyle: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%', // Width of entire filter group
    height: '25%', // border: '2px solid #34568f'                
  },
  textStyle: {
    color: '#34568f',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
};

class Filters extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.rootStyle}>
        <Selector buttonText="Your Champs" />
        <Selector buttonText="Ally Filters" />
        <Selector buttonText="Enemy Filters" />
        <Selector buttonText="seasons" />
        <Selector buttonText="game length" />
      </div>
    );
  }
}

export default withStyles(styles)(Filters);