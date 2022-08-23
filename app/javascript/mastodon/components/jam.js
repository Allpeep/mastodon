import React from 'react';
import Avatar from 'mastodon/components/avatar';
import { debounce } from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { importDefaultIdentity } from 'jam-core';
import { JamProvider, useJam, use } from 'jam-core-react';
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

  // componentWillReceiveProps (nextProps) {
  //   nextProps;
  // }


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
      // <JamProvider options={{ jamConfig }}>
      //   <JamRoom speakers={jam.get('speakers')} />
      // </JamProvider>
      <JamProvider options={{ jamConfig: { urls: { pantry: `http://localhost:8000/jam-proxy/${jam.get('jam_host')}/_/pantry` } } }}>
        <JamRoom roomId={jam.get('room_id')} handleleaveRoom={this.leaveRoom} jam={jam} account={account} />
        {/* <ColorPalette></ColorPalette> */}
      </JamProvider>
    );

  }

  renderJamFrame = (jam, account) => {

    const jamConfig = {
      ux: {
        //autoRejoin: true,
        //autoJoin: true,
        noLeave: true,
        //userInteracted: true,
      },
      identity: {
        name: account.get('display_name') || account.get('username'),
        avatar: account.get('avatar_static'),
      },
      keys: {
        seed: jam.get('jam_seed'),
      },
    };

    const jamHash = window.btoa(JSON.stringify(jamConfig));

    return (<div><button className={'status__content__spoiler-link'} onClick={this.leaveRoom}>Leave room</button><iframe
      title={'Jam'}
      className={'jam__iframe'}
      allow='microphone;*'
      src={`${jam.get('server_url')}/${jam.get('room_id')}?debug=yes#${jamHash}`}
    /></div>);

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