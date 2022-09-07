import { connect } from 'react-redux';
import { debounce } from 'lodash';

import Jam from 'mastodon/components/jam';
import { fetchJam } from 'mastodon/actions/jams';
import { me } from '../initial_state';
import { enter, leave, setJamInstance } from '../actions/jams';

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
    dispatch(setJamInstance(null));
    dispatch(leave(jamId));
  },
  setInstance: (instance) => {
    dispatch(setJamInstance(instance))
  }
});

const mapStateToProps = (state, { jamId }) => ({
  jam: state.getIn(['jams', jamId]),
  account: state.getIn(['accounts', me]),
  jamProxyBaseUrl: state.getIn(['meta', 'jam_proxy_base_url']),
  jamInstance: state.get('jamInstance'),
});

export default connect(mapStateToProps, mapDispatchToProps)(Jam);
