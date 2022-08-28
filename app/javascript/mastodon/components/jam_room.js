import React, { useEffect } from 'react';
import { useJam, use } from 'jam-core-react';
import { JamAvatar } from './jam_avatar';
import { importDefaultIdentity } from 'jam-core';

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
  let [state, api] = useJam();
  let { enterRoom, leaveRoom, setProps } = api;
  let [
    myIdentity,
    speaking,
    peers,
    peerState,
    iSpeaker,
    iModerator,
    iPresenter,
    reactions,
    identities,
    room,
    myPeerState,
    myVideo,
    remoteVideoStreams,
  ] = use(state, [
    'myIdentity', 'speaking', 'peers', 'peerState', 'iAmSpeaker',
    'iAmModerator', 'iAmPresenter', 'reactions', 'identities', 'room',
    'myPeerState', 'myVideo', 'remoteVideoStreams']);

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

    return () => {
      leaveRoom();
    };
  }, []);

  let {
    speakers,
    moderators,
  } = state.room || {};

  let stagePeers = (speakers ?? []).filter(id => peers.includes(id));
  let audiencePeers = peers.filter(id => !stagePeers.includes(id));


  return (
    <div>
      <div className='buttonflex'><button className='jam-button room-button' onClick={handleleaveRoom}>Leave Room</button></div>
      <div className='room-container'>
        <div className='jam-video-container'>
          {iPresenter && <JamVideo stream={myVideo} />}
          {remoteVideoStreams.length > 0 && <JamVideo stream={remoteVideoStreams[0].stream} />}
        </div>
        <ul className='listwrap'>
          {state.iAmSpeaker && <JamAvatar
            roomId={roomId}
            api={api}
            key={myIdentity.info.id}
            peerId={myIdentity.info.id}
            {...{ speaking }}
            canSpeak
            peerState={myPeerState}
            info={myIdentity.info}
          />
          }
          {stagePeers.map(peerId => {

            return (<JamAvatar
              roomId={roomId}
              api={api}
              key={peerId}
              {...{ speaking }}
              {...{ peerId, peerState, reactions }}
              canSpeak
              peerState={peerState[peerId]}
              info={identities[peerId] || { peerId }}
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
              api={api}
              {...{ reactions, room }}
              peerId={myIdentity.info.id}
              peerState={myPeerState}
              info={myIdentity.info}
            />
          }


          {audiencePeers.map(peerId => {
            return (
              <JamAvatar
                roomId={roomId}
                api={api}
                key={peerId}
                {...{ speaking }}
                {...{ peerId, peerState, reactions }}
                audience
                peerState={peerState[peerId]}
                info={identities[peerId]}
              />
            )
          })}
        </ul>
      </div>

    </div>
  );
}

export default JamRoom;
