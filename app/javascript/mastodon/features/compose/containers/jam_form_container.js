import { connect } from 'react-redux';
import JamForm from '../components/jam_form';
import { changeJamTitle, changeJamSchedule } from '../../../actions/compose';


const mapStateToProps = state => ({
    jam: state.getIn(['compose', 'jam']),
    name: state.getIn(['compose', 'jam', 'name']),
    schedule: state.getIn(['compose', 'jam', 'schedule'])
});

const mapDispatchToProps = dispatch => ({
    onChangeTitle(name) {
        dispatch(changeJamTitle(name));
    },
    onChangeSchedule(schedule) {
        dispatch(changeJamSchedule(schedule))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(JamForm);
