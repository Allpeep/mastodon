import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
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
    <video ref={videoRef} autoPlay playsInline />
  );
};

JamVideo.propTypes = {
  stream: PropTypes.instanceOf(MediaStream),
};



const JamRoom = ({ roomId, handleleaveRoom, jam, account }) => {


  let [reactionShow, setReactionShow] = useState(false);

  let [state, api] = useJam();
  let { enterRoom, leaveRoom, selectMicrophone, setProps, sendReaction, startServerRecording, stopServerRecording, getRecordingsDownloadLink } = api;
  let [
    myIdentity,
    peers,
    myVideo,
    remoteVideoStreams,
    { speakers, presenters },
    handRaised,
    micMuted,
    iAmSpeaker,
    availableMicrophones,
    isServerRecording,
    iAmModerator,
  ] = use(state, [
    'myIdentity', 'peers', 'myVideo',
    'remoteVideoStreams', 'room', 'handRaised', 'micMuted', 'iAmSpeaker', 'availableMicrophones', 'isServerRecording', 'iAmModerator']);

  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isServerRecording) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 100);
      }, 100);
    } else if (!isServerRecording) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isServerRecording]);



  const leave = async function(e) {
    await leaveRoom();
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
    mics.push({ text: `${mic.label}`, action: () => selectMicrophone(mic) });
  });

  return (
    <div>
      <div className='room-container'>
        <div className='jam-video-container'>
          {(myIdentity.info.id === presenters[presenters.length - 1]) ? <JamVideo stream={myVideo} /> :
            presenters.length > 0 && <JamVideo stream={remoteVideoStreams[0]?.stream} /> }
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
            );
          })}
        </ul>

        <div className='jam-action-bar'>
          <button
            className='button room-button' onClick={leave}
          >
            Leave Room
          </button>
          <button
            className='button button-alternative' onClick={() => {
              setProps('handRaised', !handRaised); setReactionShow(false);
            }}
          >
            {handRaised ? 'Stop raising hand' : '✋ Raise hand'}
          </button>
          <button
            className={`button button-alternative${reactionShow ? '-2' : ''}`}
            onClick={() => setReactionShow(prev => !prev)}
          >
            😄
          </button>
          {reactionShow &&
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
            <button className={'button button-alternative'}>Change Mic</button>

          </DropdownMenuContainer>}
          {iAmModerator && <button
            className={`button button-alternative${isServerRecording ? '-2' : ''}`}
            onClick={async () => {
              if (isServerRecording) {
                await stopServerRecording();
                const recordingDownloadLink = await getRecordingsDownloadLink(roomId);
                download(recordingDownloadLink);
                setTime(0);
              } else {
                await startServerRecording();
              }
            }}
          >
            {isServerRecording ? `🟥 ${parseTimer(time)}` : '🔴 start recording'}
          </button>}
        </div>
      </div>

    </div>
  );
};

JamRoom.propTypes = {
  roomId: PropTypes.string.isRequired,
  handleleaveRoom: PropTypes.func.isRequired,
  jam: ImmutablePropTypes.map,
  account: ImmutablePropTypes.map,
};


function parseTimer(time) {
  return `${('0' + Math.floor((time / 60000) % 60)).slice(-2)}:${('0' + Math.floor((time / 1000) % 60)).slice(-2)}`;
}

function download(link) {
  const a = document.createElement('a');
  a.href = link;
  a.download = 'download';
  a.click();
}

export default JamRoom;
