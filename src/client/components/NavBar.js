import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import NavBarButton from './NavBarButton.js';
import { connect } from 'react-redux';
import { updatePlayerNav } from '../redux/actions/actions.js';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    margin: 'auto',
    marginTop: '0px',
    borderLeft: '2px solid #34568f',
    borderBottom: '2px solid #34568f',
    borderRight: '2px solid #34568f',
    width: '30%',
    height: '30px',
  },
});

const mapDispatchToProps = dispatch => {
  return {
    updateSelected: value => dispatch(updatePlayerNav(value))
  };
};

class NavBar extends React.Component{
  state = {
    selected: 0
  }

  handleChange = (value) => {
    this.props.updateSelected({value: value});
    this.setState({selected: value});
  }

  render(){
    const { classes } = this.props;
    const { selected } = this.state;

    return(
      <div className={classes.root}>
        <NavBarButton onChange={this.handleChange} value={0} selected={this.state.selected} label={'Summary'} />
        <NavBarButton onChange={this.handleChange}  value={1} selected={this.state.selected}  label={'Champ Stats'} />
        <NavBarButton onChange={this.handleChange}  value={2} selected={this.state.selected}  label={'Other'} />
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(NavBar));
