import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import NavBar from './NavBar';
import PlayerSummary from './playerComponents/PlayerSummary';
import PlayerChampStats from './playerComponents/PlayerChampStats';

const styles = theme => ({
  root: {
    marginTop: '10px',
    borderTop: '3px solid #34568f',
    backgroundColor: '#FFFFFF',
  },
  textStyle: {
    color: '#34568f',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  loadTextStyle: {
    color: '#34568f',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    selectedNav: state.playerNav
  };
};

class PlayerContent extends React.Component {
  state = {
    searchID: null,
    statusCode: null,
    stats: null,
  };

  componentDidMount() {
    this.searchPlayer();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.players !== this.props.players) {
      this.searchPlayer();
    }
  }

  async getData() {
    let attempts = 1;
    const interval = setInterval(async () => {
      console.log('Attempt number: ', attempts);
      attempts += 1;
      try {
        const response = await fetch(`/api/champstats/playerSearch/${this.state.searchID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const user = await response.json();
          this.setState({
            searchID: null,
            statusCode: null,
            stats: user.stats,
          });
          console.log('SEARCH COMPLETE, ENDING INTERVAL.');
          clearInterval(interval);
        } else {
          console.log('Error Code: ', response.status);
          if (response.status !== 504) {
            this.setState({
              statusCode: response.status,
              stats: 'Error'
            });
            console.log('SEARCH ERROR, ENDING INTERVAL.');
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.log('Get Data Error, ending request: ', error);
        clearInterval(interval);
        throw new Error(error);
      }
    }, 10000);
  }

  async searchPlayer() {
    try {
      const response = await fetch('/api/champstats/initiatePlayerSearch', {
        method: 'POST',
        body: JSON.stringify({
          players: this.props.players,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const user = await response.json();
      this.setState({
        searchID: user.searchID,
        stats: null
      });
      console.log('SearchID is: ', this.state.searchID);
      this.getData();
    } catch (error) {
      console.log('Search Player Error: ', error);
      this.setState({ searchID: null });
    }
  }

  render() {
    const { classes, players, selectedNav } = this.props;
    const { statusCode, stats } = this.state;

    return (
      <div className={classes.root}>
        {stats ? (
          <Stats
            stats={stats}
            statusCode={statusCode}
            selected={selectedNav}
            textStyle={classes.textStyle}
          />
        ) : (
          <h1 className={classes.textStyle}>
          Loading summoner data... this may take a few minutes.
          </h1>
        )}
      </div>
    );
  }
}

function Stats(props) {
  if (props.statusCode) {
    return <ErrorCheck statusCode={props.statusCode} textStyle={props.textStyle} />
  }

  return (
    <div>
      <NavBar />
      {props.selected === 0 && <PlayerSummary stats={props.stats} />}
      {props.selected === 1 && <PlayerChampStats stats={props.stats} />}
    </div>
  );
}

function ErrorCheck(props) {
  switch (props.statusCode) {
    case 400:
      return (<h1 className={props.textStyle}>Bad request, please revise your search.</h1>);
    case 404:
      return (<h1 className={props.textStyle}>Player not found. Please search again.</h1>);
    case 408:
      return (<h1 className={props.textStyle}>This is a long request... please keep waiting.</h1>);
    case 500:
      return (<h1 className={props.textStyle}>Player not found. Please search again.</h1>);
    case 503:
      return (<h1 className={props.textStyle}>Service unavailable.</h1>);
    default:
      return (<h1 className={props.textStyle}>Unhandled error!</h1>);
  }
}

export default connect(mapStateToProps)(withStyles(styles)(PlayerContent));
