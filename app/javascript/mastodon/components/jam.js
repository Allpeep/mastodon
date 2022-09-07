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
    const speakers = jam.get('speakers');
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
