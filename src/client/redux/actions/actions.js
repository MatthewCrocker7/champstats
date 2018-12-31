import {
  UPDATE_PLAYERS,
  UPDATE_PLAYER_NAV,
} from '../constants/action-types.js';

export const updatePlayers = players => ({
  type: UPDATE_PLAYERS,
  payload: players
});

export const updatePlayerNav = value => ({
  type: UPDATE_PLAYER_NAV,
  payload: value
});
