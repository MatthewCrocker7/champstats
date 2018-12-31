import {
  UPDATE_PLAYERS,
  UPDATE_PLAYER_NAV,
} from '../constants/action-types.js';

const playerInitState = {
  players: [
    {
      name: '',
    }
  ],
  playerNav: 0,
}

export const rootReducer = (state = playerInitState, action) => {
  if(action.type == UPDATE_PLAYERS){
    return Object.assign({}, state, {
      players: action.payload
    });
  }
  if(action.type == UPDATE_PLAYER_NAV){
    return Object.assign({}, state, {
      playerNav: action.payload.value
    });
  }
  return state;
};
