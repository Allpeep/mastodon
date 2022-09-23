import React from 'react';
import Avatar from 'mastodon/components/avatar';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { JamProvider } from 'jam-core-react';
import JamRoom from './jam_room';
import PropTypes from 'prop-types';


export default class Jam extends React.PureComponent {

  static propTypes = {
    jam: ImmutablePropTypes.map,
    account: ImmutablePropTypes.map,
    jamProxyBaseUrl: PropTypes.string,
    enterJam: PropTypes.func,
    leaveJam: PropTypes.func,
    deployFloatingJam: PropTypes.func,
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
    let boo = false
    let sched = null;
    if (room_config) {
      sched = room_config.get('schedule')
      if (sched && (typeof sched != 'string')) {
        boo = sched.get('date') ? true : false
      }
    }
    // let validsched = true


    return (<div>
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
        <button className={'button'} onClick={this.enterRoom}>Join Jam</button>
        {boo &&
          <PreSchedLobby schedule={sched} enterRoom={this.enterRoom} />
        }

      </div>
    </div>
    );
  }


  renderJamRoom = (jam, account) => {


    return (
      <JamProvider options={{
        jamConfig: {
          urls: {
            pantry: `${this.props.jamProxyBaseUrl}/jam-proxy/${jam.get('jam_host')}/_/pantry`,
            stun: `stun:${jam.get('jam_host')}:3478`,
            turn: `turn:${jam.get('jam_host')}:3478`,
            turnCredentials: {
              username: 'test',
              credential: 'yieChoi0PeoKo8ni',
            },
          },
        }, debug: true
      }}
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


function PreSchedLobby({ schedule, enterRoom }) {
  // add countdown ting

  return (
    <div style={{textAlign:'center'}}>
      🗓 scheduled for {schedule.get('date')} {schedule.get('time') ? ` at ${schedule.get('time')}\nin ${schedule.get('timezone')}` : ''}
    </div>


  )
}
