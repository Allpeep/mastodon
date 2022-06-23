import { connect } from 'react-redux';
import JamButton from '../components/jam_button';
import { addJam, removeJam } from '../../../actions/compose';

const mapStateToProps = state => ({
  unavailable: state.getIn(['compose', 'is_uploading']) || (state.getIn(['compose', 'media_attachments']).size > 0),
  active: state.getIn(['compose', 'jam']),
});

const mapDispatchToProps = dispatch => ({

  onClick () {

    dispatch((_, getState) => {
      console.log(getState().getIn(['compose', 'jam']));
      if (getState().getIn(['compose', 'jam'])) {
        dispatch(removeJam());
      } else {
        dispatch(addJam());
      }
    });
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(JamButton);
