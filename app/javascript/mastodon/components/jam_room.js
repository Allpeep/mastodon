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
  let { enterRoom, leaveRoom, selectMicrophone, setProps, sendReaction, startRecording, stopRecording, downloadRecording } = api;
  let [
    myIdentity,
    peers,
    iPresenter,
    myVideo,
    remoteVideoStreams,
    { speakers, schedule, presenters },
    handRaised,
    micMuted,
    iAmSpeaker,
    availableMicrophones,
    isRecording,
    iAmModerator
  ] = use(state, [
    'myIdentity', 'peers', 'iAmPresenter', 'myVideo',
    'remoteVideoStreams', 'room', 'handRaised', 'micMuted', 'iAmSpeaker', 'availableMicrophones', 'isRecording', 'iAmModerator']);

  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 100);
      }, 100);
    } else if (!isRecording) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);



  const leave = function(e) {
    leaveRoom();
    handleleaveRoom(e);
  };


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

  let stagePeers = (speakers || []).filter(id => peers.includes(id));
  let audiencePeers = peers.filter(id => !stagePeers.includes(id));
  let mics = [];

  availableMicrophones?.forEach((mic) => {
    mics.push({ text: `${mic.label}`, action: () => { selectMicrophone(mic); setSelectedmic(mic.label) } });
  });

  return (
    <div>
      <div className='room-container'>
        <div className='jam-video-container'>
          {(myIdentity.info.id === presenters[presenters.length - 1]) ? <JamVideo stream={myVideo} /> :
            presenters.length > 0 ? <JamVideo stream={remoteVideoStreams[0]?.stream} /> :
              null}
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
          <button className='button room-button' onClick={(e)=> {if(isRecording) {stopRecording().then(()=> downloadRecording())};leave(e)}}>Leave Room</button>
          <button className='button button-alternative' onClick={() => { setProps('handRaised', !handRaised); setReactionshow(false) }}>
            {handRaised ? 'Stop raising hand' : '✋ Raise hand'}
          </button>
          <button className={`button button-alternative${reactionshow ? '-2' : ''}`} onClick={() => setReactionshow(prev => !prev)}>😄</button>
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
            <button className={`button button-alternative${micMuted ? '-2' : ''}`} onClick={() => setProps('micMuted', !micMuted)}>{micMuted ? '🔇' : '🔈'}</button>
          }
          <br />
          {(availableMicrophones.length >= 1) &&
          <DropdownMenuContainer direction='up' size={18} items={mics}>
            <button className={`button button-alternative`}>Change Mic</button>

          </DropdownMenuContainer>}
          {iAmModerator && <button
                              className={`button button-alternative${isRecording ? '-2' : ''}`}
                              onClick={() => {
                                          if (isRecording) {
                                            stopRecording().then(() => { downloadRecording('jam-recording'); setTime(0)});
                                          } else {
                                            startRecording();
                                          }
                                        }}
          >
            {isRecording ? `🟥 ${parseTimer(time)}` : '🔴 start recording'}
          </button>}
        </div>
      </div>

    </div>
  );
};

function parseTimer(time) {
  return `${('0' + Math.floor((time / 60000) % 60)).slice(-2)}:${('0' + Math.floor((time / 1000) % 60)).slice(-2)}`
}


export default JamRoom;
