import React, { useEffect } from 'react';
import { useJam, use } from 'jam-core-react';
import Avatar from 'mastodon/components/avatar';
import { AudienceAvatar, StageAvatar } from './jam_avatar';
import { importDefaultIdentity } from 'jam-core';

const JamRoom = ({ roomId, handleleaveRoom, jam, account }) => {
  let [state, api] = useJam();
  let { enterRoom, leaveRoom, setProps } = api;
  let [myIdentity, speaking, peers, peerState, iSpeaker, reactions, identities, room, myPeerState] = use(state, ['myIdentity', 'speaking', 'peers', 'peerState', 'iAmSpeaker', 'reactions', 'identities', 'room', 'myPeerState']);



  useEffect(() => {

    importDefaultIdentity(
      {
        info: {
          name: account.get('display_name') || account.get('username'),
          avatar: account.get('avatar_static'),
        },
        seed: jam.get('jam_seed'),
      })



    async function enter() {

      await setProps({ userInteracted: true });
      await setProps('roomId', roomId);
      await enterRoom(roomId);

    }
    enter();

    return () => {
      leaveRoom();
    }
  }, [])

  let {
    speakers,
    moderators,
  } = room || {};

  let stagePeers = (speakers ?? []).filter(id => peers.includes(id));


  return (
    <div>
      <div className='buttonflex'><button className='jam-button room-button' onClick={handleleaveRoom}>Leave Room</button></div>
      <div className='room-container'>

        <div className='jam-title'>
          Speakers
        </div>
        <ul className='listwrap'>

          {iSpeaker && <StageAvatar
            key={myIdentity.info.id}
            peerId={myIdentity.info.id}
            {...{ speaking }}
            canSpeak={true}
            peerState={myPeerState}
            info={myIdentity.info}
          />
          }
          {stagePeers.map(peerId => {

            return <StageAvatar
              key={peerId}
              {...{ speaking }}
              {...{ peerId, peerState, reactions }}
              canSpeak={true}
              peerState={peerState[peerId]}
              info={identities[peerId]}
            />

          })}
        </ul>

        <div className='jam-mini-title'>
          Audience
        </div>
        <ul className='listwrap audiencelist' >
          {!iSpeaker &&
            <AudienceAvatar {...{ reactions, room }}
              peerId={myIdentity.info.id}
              peerState={myPeerState}
              info={myIdentity.info}
            />
          }

          {peers.filter(id => !stagePeers.includes(id)).map(peerId => {
            return (
              <AudienceAvatar
                key={peerId}
                {...{ speaking }}
                {...{ peerId, peerState, reactions }}
                canSpeak={true}
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