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
    window.addEventListener('resize', this.handleResize, {passive: true});
    const { jam, account } = this.props;
    importDefaultIdentity(
      {
        info: {
          name: account.get('display_name') || account.get('username'),
          avatar: account.get('avatar_static'),
        },
        seed: jam.get('jam_seed'),
      }).then(() => this.setState({ isIdentitySet: true })).catch(console.log);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  _setDimensions() {
    const width = this.node.offsetWidth;

    this.setState({width});
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
      <button className={'status__content__spoiler-link'} onClick={this.enterRoom}>Enter room</button>
      <ul>
        {speakers.map((speaker) => (

          <li key={speaker.get('acct')}>
            <div><Avatar account={speaker} size={24} /></div>
          </li>
        ))}
      </ul>
    </div>);
  }


  renderJamRoom = (jam) => {

    const jamConfig = {
      domain: 'beta.jam.systems',
      development: true,
      sfu: true,
    };

    return (
      // <JamProvider options={{ jamConfig }}>
      //   <JamRoom speakers={jam.get('speakers')} />
      // </JamProvider>
      <JamProvider options={{ jamConfig, initialProps: { roomId: jam.get('room_id') } }}>
        <h3>Test</h3>
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
    const inRoom = this.state.inRoom;
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    console.log(inRoom);

    console.log(speakers.map((s) => s));

    if(this.state.isIdentitySet && this.state.inRoom) {
      return this.renderJamFrame(jam, account);
    } else {
      return this.renderJamLobby(speakers);
    }


  };

}
