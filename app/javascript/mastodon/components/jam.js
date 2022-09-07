import React from 'react';
import Avatar from 'mastodon/components/avatar';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { JamProvider } from 'jam-core-react';
import JamRoom from './jam_room';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

export default class Jam extends React.PureComponent {

  static propTypes = {
    jam: ImmutablePropTypes.map,
    account: ImmutablePropTypes.map,
    enterJam: PropTypes.func,
    leaveJam: PropTypes.func,
    deployFloatingJam: PropTypes.func,
    jamInstance: PropTypes.object,
  };

  static defaultProps = {};

  componentWillUnmount() {
    if (this.props.jam.get('entered') && this.props.deployFloatingJam) {
      this.props.deployFloatingJam(this.props.jam);
    }
  }

  enterRoom = (e) => {
    e.preventDefault();

    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      const { enterJam } = this.props;
      enterJam();
    }
  }

  leaveRoom = (e) => {
    e.preventDefault();

    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      const { leaveJam } = this.props;
      leaveJam();
    }
  }

  renderJamLobby = (jam) => {
    const room_config = jam.get('room_config');
    const speakers = jam.get('speakers');
    let sched = null;
    let invalidsched = false
    if (room_config) {
      sched = room_config.get('schedule')
      if (sched && (typeof sched != 'string') && sched.get('date')) {

        let now = DateTime.now()
        let scheduledAt = DateTime.fromISO(`${sched.get('date')}T${sched.get('time') ? `${sched.get('time')}:00` : '00:00:00'}`, { zone: sched.get('timezone') })

        invalidsched = now < scheduledAt
      }
    }

    return (
    <div>
      <div className={'jam-room-outside'}>
        <ul>
          {speakers.map((speaker) => (

            <li key={speaker.get('acct')}>
              <div><Avatar account={speaker} size={48} /></div>
            </li>
          ))}
        </ul>
      </div>
      <div className='jam-action-bar'>
        {invalidsched ?
          <PreSchedLobby schedule={sched} enterRoom={this.enterRoom} /> :
          <button className={'button'} onClick={this.enterRoom}>Join Jam</button>
        }
      </div>
    </div>
    );
  }


  renderJamRoom = (jam, account) => {

    const [state, api] = this.props.jamInstance;

    return (
      <JamProvider
        state={state} api={api}
      >
        <JamRoom roomId={jam.get('room_id')} handleleaveRoom={this.leaveRoom} jam={jam} account={account} />
      </JamProvider>
    );

  }

  render() {

    const { jam, account } = this.props;

    return !!jam.get('entered') ? this.renderJamRoom(jam, account) : this.renderJamLobby(jam);
  };

}


function PreSchedLobby({ schedule }) {
  // add countdown ting

  let scheduleToLocal = DateTime.fromISO(`${schedule.get('date')}T${schedule.get('time') ? `${schedule.get('time')}:00` : '00:00:00'}`, { zone: schedule.get('timezone') })
  .setZone(Intl.DateTimeFormat().resolvedOptions().timeZone).toString()

  return (
    <div style={{ alignSelf: 'center' }}>
      🗓 scheduled for {scheduleToLocal.slice(0,10)} at {scheduleToLocal.slice(11,16)} <br />
      UTC{scheduleToLocal.slice(23,29)}
    </div>
  )
}
