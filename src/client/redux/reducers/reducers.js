import {
  UPDATE_PLAYERS
} from '../constants/action-types.js';

const playerInitState = {
  players: [
    {
      name: '',
    }
  ]
}

export const rootReducer = (state = playerInitState, action) => {
  if(action.type == UPDATE_PLAYERS){
    return Object.assign({}, state, {
      players:
        action.payload    
    });
  }
  return state;
};
