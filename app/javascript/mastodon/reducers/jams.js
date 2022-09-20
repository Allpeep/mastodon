import { JAM_IMPORT, JAMS_IMPORT } from '../actions/importer';
import { JAM_ENTER, JAM_LEAVE } from '../actions/jams';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

const importJams = (state, jams) => state.withMutations(map => jams.forEach(jam => map.set(jam.id, fromJS(jam))));

export default function jams(state = initialState, action) {
  switch(action.type) {
  case JAMS_IMPORT:
    return importJams(state, action.jams);
  case JAM_IMPORT:
    return state.set(action.jam.id, fromJS(action.jam));
  case JAM_ENTER:
    return state.setIn([action.jamId, 'entered'], true);
  case JAM_LEAVE:
    return state.setIn([action.jamId, 'entered'], false);
  default:
    return state;
  }
};
