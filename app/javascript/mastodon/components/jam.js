import React from 'react';
import Avatar from 'mastodon/components/avatar';
import { debounce } from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { JamProvider } from 'jam-core-react';
import JamRoom from './jam_room';


export default class Jam extends React.PureComponent {

  static propTypes = {
    jam: ImmutablePropTypes.map,
    account: ImmutablePropTypes.map,
  };

  static defaultProps = {};

  state = {
    isIdentitySet: false,
    inRoom: false,
  };


  componentDidMount() {
    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  _setDimensions() {
    const width = this.node.offsetWidth;

    this.setState({ width });
  }

  enterRoom = (e) => {
    e.preventDefault();

    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      const inRoom = true;
      this.setState({ inRoom });
    }
  }

  leaveRoom = (e) => {
    e.preventDefault();

    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      const inRoom = false;
      this.setState({ inRoom });
    }
  }


  handleResize = debounce(() => {
    if (this.node) {
      this._setDimensions();
    }
  }, 250, {
    trailing: true,
  });


  setRef = c => {
    this.node = c;

    if (this.node) {
      this._setDimensions();
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

    if (this.state.inRoom) {
      return this.renderJamRoom(jam, account);
    } else {
      return this.renderJamLobby(speakers);
    }


  };

}
