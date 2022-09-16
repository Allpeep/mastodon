import React, { useEffect, useState } from 'react';
import { useJam, use } from 'jam-core-react';
import { JamAvatar } from './jam_avatar';
import { importDefaultIdentity } from 'jam-core';
import DropdownMenuContainer from '../containers/dropdown_menu_container';

const reactionEmojis = ['❤️', '💯', '😂', '😅', '😳', '🤔'];

const videoRef = React.createRef();

const JamVideo = ({ stream }) => {

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream, videoRef]);
  return (
    <video ref={videoRef} autoPlay />
  );
};

const JamRoom = ({ roomId, handleleaveRoom, jam, account }) => {

  let [reactionshow, setReactionshow] = useState(false)
  let [selectedmic, setSelectedmic] = useState('Default')

  let [state, api] = useJam();
  let { enterRoom, selectMicrophone, setProps, sendReaction } = api;


  let [
    myIdentity,
    peers,
    iPresenter,
    myVideo,
    remoteVideoStreams,
    { speakers, schedule },
    handRaised,
    micMuted,
    iAmSpeaker,
    availableMicrophones
  ] = use(state, [
    'myIdentity', 'peers', 'iAmPresenter', 'myVideo',
    'remoteVideoStreams', 'room', 'handRaised', 'micMuted', 'iAmSpeaker', 'availableMicrophones']);

  useEffect(() => {
    async function enter() {
        await importDefaultIdentity(
          {
            info: {
              name: account.get('display_name') || account.get('username'),
              avatar: account.get('avatar_static'),
            },
            seed: jam.get('jam_seed'),
          });

        await setProps({ userInteracted: true });
        await setProps('roomId', roomId);
        await enterRoom(roomId);

      }
      enter();
  }, []);

  let stagePeers = (speakers ?? []).filter(id => peers.includes(id));
  let audiencePeers = peers.filter(id => !stagePeers.includes(id));
  let mics = []

  availableMicrophones?.forEach((mic) => {
    mics.push({ text: `${mic.label}`, action: () => { selectMicrophone(mic); setSelectedmic(mic.label) } });
  });

  return (
    <div>
      <div className='room-container'>
        <div className='jam-video-container'>
          {iPresenter && <JamVideo stream={myVideo} />}
          {remoteVideoStreams.length > 0 && <JamVideo stream={remoteVideoStreams[0].stream} />}
        </div>
        <ul className='listwrap'>
          {state.iAmSpeaker && <JamAvatar
            roomId={roomId}
            key={myIdentity.info.id}
            peerId={myIdentity.info.id}
          />
          }
          {stagePeers.map(peerId => {

            return (<JamAvatar
              roomId={roomId}
              key={peerId}
              peerId={peerId}
            />);

          })}
        </ul>

        <div className='jam-audience-title'>
          Audience
        </div>
        <ul className='listwrap audiencelist' >
          {!state.iAmSpeaker &&
            <JamAvatar
              roomId={roomId}
              key={myIdentity.info.id}
              peerId={myIdentity.info.id}
            />
          }


          {audiencePeers.map(peerId => {
            return (
              <JamAvatar
                roomId={roomId}
                key={peerId}
                peerId={peerId}
              />
            )
          })}
        </ul>

        <div className='jam-action-bar'>
          <button className='button room-button' onClick={handleleaveRoom}>Leave Room</button>
          <button className='button button-alternative' onClick={() => { setProps('handRaised', !handRaised); setReactionshow(false) }}>
            {handRaised ? 'Stop raising hand' : '✋ Raise hand'}
          </button>
          <button className={`button button-alternative${reactionshow? '-2' : ''}`} onClick={() => setReactionshow(prev => !prev)}>😄</button>
          {reactionshow &&
            <div className='reaction-list'>
              {
                reactionEmojis.map((emoji) => (
                  <button onClick={() => sendReaction(emoji)} key={emoji}>
                    {emoji}
                  </button>
                ))
              }
            </div>
          }
          {iAmSpeaker &&
            <button className={`button button-alternative${micMuted? '-2' : ''}`} onClick={() => setProps('micMuted', !micMuted)}>{micMuted ? '🔇' : '🔈'}</button>
          }
          <br />
          {(availableMicrophones.length >= 1) &&
          <DropdownMenuContainer direction='up' size={18} items={mics}>
            <button className={`button button-alternative`}>Change Mic</button>

            </ DropdownMenuContainer>}
        </div>
      </div>

    </div>
  );
};

export default JamRoom;
