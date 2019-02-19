import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { red } from '@material-ui/core/colors';
import App from './App';
import store from './redux/store/store';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#34568f',
    },
    secondary: red
  },
  typography: {
    useNextVariants: true,
  },
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
