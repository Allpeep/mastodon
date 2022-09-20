import { JAM_INSTANCES_CREATE } from '../actions/importer';
import { Map as ImmutableMap } from 'immutable';
import { createJam } from 'jam-core';

const initialState = ImmutableMap();

const createJamInstance = (jamHost, jamProxyBaseUrl) => createJam({
  jamConfig: {
    urls: {
      pantry: `${jamProxyBaseUrl}/jam-proxy/${jamHost}/_/pantry`,
      stun: `stun:${jamHost}:3478`,
      turn: `turn:${jamHost}:3478`,
      turnCredentials: {
        username: 'test',
        credential: 'yieChoi0PeoKo8ni',
      },
    },
  }, debug: false,
});

export default function jamInstances(state = initialState, action) {
  switch(action.type) {
  case JAM_INSTANCES_CREATE:
    return state.withMutations(map => action.jamHosts.forEach(
      jamHost => {
        if(state.get(jamHost)) {
          return map;
        } else {
          console.log('CREATING JAM INSTANCE FOR', jamHost);
          return map.set(jamHost, createJamInstance(jamHost, action.jamProxyBaseUrl));
        }
      }),
    );
  default:
    return state;
  }
};
