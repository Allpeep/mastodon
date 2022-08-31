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

  renderJamLobby = (speakers) => {
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
        <button className={'button button--block'} onClick={this.enterRoom}>Join Jam</button>
      </div>
    </div>
    );
  }


  renderJamRoom = (jam, account) => {


    return (
      <JamProvider options={{
        jamConfig: {
          urls: {
            pantry: `http://localhost:8000/jam-proxy/${jam.get('jam_host')}/_/pantry`,
            stun: `stun:${jam.get('jam_host')}:3478`,
            turn: `turn:${jam.get('jam_host')}:3478`,
            turnCredentials: {
              username: 'test',
              credential: 'yieChoi0PeoKo8ni',
            },
          },
        }, debug: true }}
      >
        <JamRoom roomId={jam.get('room_id')} handleleaveRoom={this.leaveRoom} jam={jam} account={account} />
      </JamProvider>
    );

  }

  render() {

    const { jam, account } = this.props;

    const speakers = jam.get('speakers');

    if (!!jam.get('entered')) {
      return this.renderJamRoom(jam, account);
    } else {
      return this.renderJamLobby(speakers);
    }


  };

}
