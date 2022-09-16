import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl } from 'react-intl';

@injectIntl
class JamForm extends ImmutablePureComponent {

    static propTypes = {
        jam: PropTypes.object,
        name: PropTypes.string,
        schedule: PropTypes.string,
        onChangeTitle: PropTypes.func.isRequired,
        onChangeSchedule: PropTypes.func.isRequired,
    };

    handleChange = (e) => {
        this.props.onChangeTitle(e.target.value);
    };

    handleScheduleChange = (e) => {
        this.props.onChangeSchedule(e.target.value)
    }

    render() {
        const { jam, schedule } = this.props;
        let currentDate = new Date().toISOString().slice(0, 16)
        if (!jam) {
            return null;
        }

        return (
            <div className='jam-form'>
                <input placeholder='Jam room title' className='jam-form-input' value={this.props.name} onChange={this.handleChange} />
                <div>
                    Set optional Date for the Room
                </div>
                <input type="datetime-local" id="jam-time"
                    name="jam-time" value={schedule} onChange={this.handleScheduleChange}
                    min={currentDate} />
            </div>
        );
    }

}

export default JamForm;