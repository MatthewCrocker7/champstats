import {
  UPDATE_PLAYERS
} from '../constants/action-types.js';

export const updatePlayers = players => ({
  type: UPDATE_PLAYERS,
  payload: players
});
