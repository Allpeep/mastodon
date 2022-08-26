import { connect } from 'react-redux';
import JamForm from '../components/jam_form';
import { changeJamTitle } from '../../../actions/compose';


const mapStateToProps = state => ({
    jam: state.getIn(['compose', 'jam']),
    title: state.getIn(['compose', 'jam', 'title']),
});

const mapDispatchToProps = dispatch => ({
    onChangeTitle(title) {
        dispatch(changeJamTitle(title));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(JamForm);