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
  };

  static defaultProps = {};

  componentWillUnmount() {
    // pictureInPicture
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
    return (<div className={'jam-room-outside'}>
      <ul>
        {speakers.map((speaker) => (

          <li key={speaker.get('acct')}>
            <div><Avatar account={speaker} size={48} /></div>
          </li>
        ))}
      </ul>
      <button className={'jam-button'} onClick={this.enterRoom}>Join Jam</button>
    </div>);
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
        {/* <ColorPalette></ColorPalette> */}
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

// function ColorPalette() {

//   return (
//     <div className='colors'>
//       <div className="one">1</div>
//       <div className="two">2</div>
//       <div className="tree">3</div>
//       <div className="four">4</div>
//       <div className="five">5</div>
//       <div className="six">6</div>
//       <div className="seven">7</div>
//       <div className="eight">8</div>
//       <div className="nine">9</div>
//     </div>
//   )




// }
