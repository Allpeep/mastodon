import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { createJam } from 'jam-core';

import Jam from '../components/jam';
import { fetchJam } from '../actions/jams';
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

  const jamHost = jam.get('jam_host');

  const jamInstance = state.getIn(['jam_instances', jamHost]);

  return {
    jam,
    account: state.getIn(['accounts', me]),
    jamInstance,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Jam);
