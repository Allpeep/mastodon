import { connect } from 'react-redux';
import { debounce } from 'lodash';

import Jam from 'mastodon/components/jam';
import { fetchJam } from 'mastodon/actions/jams';

const mapDispatchToProps = (dispatch, { jamId }) => ({
  refresh: debounce(
    () => {
      dispatch(fetchJam(jamId));
    },
    1000,
    { leading: true },
  ),
});

const mapStateToProps = (state, { jamId }) => ({
  jam: state.getIn(['jams', jamId]),
});

export default connect(mapStateToProps, mapDispatchToProps)(Jam);
