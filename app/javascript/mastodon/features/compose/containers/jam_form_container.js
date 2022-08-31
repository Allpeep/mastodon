import { connect } from 'react-redux';
import JamForm from '../components/jam_form';
import { changeJamTitle } from '../../../actions/compose';


const mapStateToProps = state => ({
    jam: state.getIn(['compose', 'jam']),
    name: state.getIn(['compose', 'jam', 'name']),
});

const mapDispatchToProps = dispatch => ({
    onChangeTitle(name) {
        dispatch(changeJamTitle(name));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(JamForm);