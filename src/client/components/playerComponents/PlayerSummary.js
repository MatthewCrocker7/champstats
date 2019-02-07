import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  gridRoot: {
    flexGrow: 1,
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

class PlayerSummary extends React.Component {
  render() {
    const { classes, stats } = this.props;

    return(
      <div className={classes.gridRoot}>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <div className={classes.contentLayout}>
              {stats.map(x => <h1 className={classes.textStyle} key={x.name}>{x.name} - {x.level}</h1>)}
            </div>
          </Grid>
          <Grid item xs={8}>
            <div className={classes.contentLayout}>
              {stats.map(x => <h1 className={classes.textStyle} key={x.name}>{x.matchHistory.totalGames}</h1>)}
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className={classes.contentLayout}>
              {stats.map(x => <h1 className={classes.textStyle} key={x.name}>Total Games: {x.matchHistory.totalGames}</h1>)}
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className={classes.contentLayout}>
              {stats.map(x => <h1 className={classes.textStyle} key={x.name}>{x.matchHistory.totalGames}</h1>)}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(PlayerSummary);
