import { JAM_IMPORT } from 'mastodon/actions/importer';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

export default function jams(state = initialState, action) {
  switch(action.type) {
  case JAM_IMPORT:
    return state.set(action.jam.id, fromJS(action.jam));
  default:
    return state;
  }
};
