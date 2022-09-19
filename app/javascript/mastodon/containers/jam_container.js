import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { createJam } from 'jam-core';

import Jam from 'mastodon/components/jam';
import { fetchJam } from 'mastodon/actions/jams';
import { me } from '../initial_state';
import { enter, leave } from '../actions/jams';

const mapDispatchToProps = (dispatch, { jamId }) => ({
  refresh: debounce(
    () => {
      dispatch(fetchJam(jamId));
    },
    1000,
    { leading: true },
  ),
  enterJam: () => {
    dispatch(enter(jamId));
  },
  leaveJam: () => {
    dispatch(leave(jamId));
  },
});



const mapStateToProps = (state, { jamId }) => {
  const jam = state.getIn(['jams', jamId]);
  const jamProxyBaseUrl = state.getIn(['meta', 'jam_proxy_base_url'])


  const jamInstance = state.get('jamInstance') || createJam({
    jamConfig: {
      urls: {
        pantry: `${jamProxyBaseUrl}/jam-proxy/${jam.get('jam_host')}/_/pantry`,
        stun: `stun:${jam.get('jam_host')}:3478`,
        turn: `turn:${jam.get('jam_host')}:3478`,
        turnCredentials: {
          username: 'test',
          credential: 'yieChoi0PeoKo8ni',
        },
      },
    }, debug: true,
  });

  state.set('jamInstance', jamInstance);

  return {
    jam,
    account: state.getIn(['accounts', me]),
    jamInstance,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Jam);
