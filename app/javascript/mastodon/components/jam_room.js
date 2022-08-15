import React from 'react';
import Avatar from 'mastodon/components/avatar';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { useJam, use } from 'jam-core-react';


export default class JamRoom extends React.PureComponent {

  static propTypes = {
    speakers: ImmutablePropTypes.list,
  };


  static defaultProps = {};

  state = {
    inRoom: false,
  };


  handleEnterRoom = (e) => {
    e.preventDefault();
    console.log('Entering room');

    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      const inRoom = true;
      this.setState({ inRoom });
    }
  }

  renderJamRoom() {

  }

  renderJamLobby(speakers) {
    return (<div className={'jam-room-outside'}>
      <button onClick={this.handleEnterRoom}>Enter room</button>
      <ul>
        {speakers.map((speaker) => (

          <li key={speaker.get('acct')}>
            <div><Avatar account={speaker} size={24} /></div>
          </li>
        ))}
      </ul>
    </div>);
  }

  render() {
    let { inRoom } = this.state;
    let { speakers } = this.props;



    return inRoom ? (<Room />) : this.renderJamLobby(speakers);


  };


}

function Room() {
  let [state, api] = useJam();
  let { enterRoom, leaveRoom, setProps } = api;
  let [myIdentity, roomId, speaking, peers, iSpeaker] = use(state, ['myIdentity', 'roomId', 'speaking', 'peers', 'iAmSpeaker']);

  //speakers
  async function enter() {

    await setProps({ userInteracted: true });

    await enterRoom(roomId)
  }
  enter();

  let amIspeaking = speaking.has(myIdentity.info.id)
  let amIspeaker = iSpeaker
  console.log(amIspeaker)
  return (<div className='room-container'>
    <div>{amIspeaking ? "speaking" : "not speaking"}</div>
    <img src={myIdentity.info.avatar}></img>
    <div>{myIdentity.info.name}</div>
    <div>{amIspeaker}</div>
    {/* peers.map ..., new Avatar component? */}
  </div>);
}

