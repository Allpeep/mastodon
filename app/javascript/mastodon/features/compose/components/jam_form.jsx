import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl } from 'react-intl';

class JamForm extends ImmutablePureComponent {
    constructor(props) {
        super(props);
        this.state = {
            scheduling: false,
            scheduleCandidate: {
                date: `${new Date().toISOString().split('T')[0]}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
        };
    }

    static propTypes = {
        jam: PropTypes.object,
        name: PropTypes.string,
        schedule: PropTypes.object,
        onChangeTitle: PropTypes.func.isRequired,
        onChangeSchedule: PropTypes.func.isRequired,
    };

    handleChange = (e) => {
        this.props.onChangeTitle(e.target.value);
    };

    handleScheduleChange = (e) => {

        const name = e.target.name;
        const value = e.target.value;
        this.setState((prevState) => {
            const newState = {
                scheduleCandidate: {
                    ...prevState.scheduleCandidate,
                    [name]: value,
                }
            }
            this.props.onChangeSchedule(newState.scheduleCandidate)
            return newState
        }
        )

    }

    render() {
        const { jam, schedule } = this.props;
        if (!jam) {
            return null;
        }

        return (
            <div className='jam-form'>
                <input placeholder='Jam room title' className='jam-form-input' value={this.props.name} onChange={this.handleChange} />
                {this.state.scheduling ?
                    <div style={{ display: 'flex' }}>
                        <input type="date" className="jam-time" name="date"
                            value={
                                schedule?.date ||
                                `${new Date().toISOString().split('T')[0]}`}
                            onChange={this.handleScheduleChange}
                            min={`${new Date(new Date() - 86400000).toISOString().split('T')[0]}`} />
                        <input
                            type="time"
                            className="jam-time"
                            name="time"
                            placeholder="hh:mm"
                            value={schedule?.time || ''}
                            onChange={this.handleScheduleChange}
                        />

                        <button className='button button-alternative' onClick={() => { this.setState({ scheduling: false }); this.props.onChangeSchedule(null); }}>❌</button>
                    </div>
                    :
                    <button className='button button-alternative' onClick={() => this.setState({ scheduling: true })}>🗓 schedule</button>
                }
            </div>
        );
    }

}

export default injectIntl(JamForm);
