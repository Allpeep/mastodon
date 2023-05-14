import { JAM_INSTANCES_CREATE } from '../actions/importer';
import { Map as ImmutableMap } from 'immutable';
import { createJam } from 'jam-core';

const initialState = ImmutableMap();

const createJamInstance = (jamHost, jamProxyBaseUrl, jamConfig) => createJam({
  jamConfig: {
    ...jamConfig,
    urls: {
      ...jamConfig.urls,
      pantry: `${jamProxyBaseUrl}/jam-proxy/${jamHost}/_/pantry`,
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
          return map.set(jamHost, createJamInstance(jamHost, action.jamProxyBaseUrl, action.jamConfig.toJS()));
        }
      }),
    );
  default:
    return state;
  }
};
