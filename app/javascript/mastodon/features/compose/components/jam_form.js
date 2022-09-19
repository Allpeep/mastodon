import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl } from 'react-intl';

@injectIntl
class JamForm extends ImmutablePureComponent {
    constructor(props) {
        super(props);
        this.state = { scheduling: false };
    }

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
                {this.state.scheduling ?
                    <div style={{display:'flex'}}>
                        <input type="datetime-local" id="jam-time"
                            name="jam-time" value={schedule} onChange={this.handleScheduleChange}
                            min={currentDate} />

                        <button className='button button-alternative' onClick={() => { this.setState({ scheduling: false }); this.props.onChangeSchedule(null); }}>❌</button>
                    </div>
                    :

                    <button className='button button-alternative' onClick={() => this.setState({ scheduling: true })}>🗓 schedule</button>
                }
            </div>
        );
    }

}

export default JamForm;