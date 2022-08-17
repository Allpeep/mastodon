import React, { useEffect } from 'react';
import { useJam, use } from 'jam-core-react';
import Avatar from 'mastodon/components/avatar';
import { StageAvatar } from './jam_avatar';

const JamRoom = ({ roomId, handleleaveRoom }) => {
  let [state, api] = useJam();
  let { enterRoom, leaveRoom, setProps } = api;
  let [myIdentity, speaking, peers, peerState, iSpeaker, reactions, identities, room, myPeerState] = use(state, ['myIdentity', 'speaking', 'peers', 'peerState', 'iAmSpeaker', 'reactions', 'identities', 'room', 'myPeerState']);


  useEffect(() => {

    async function enter() {

      await setProps({ userInteracted: true });
      await setProps('roomId', roomId);
      await enterRoom(roomId);

      return () => {
        leaveRoom();
      }
    }
    enter();

  }, [])

  let {
    speakers,
    moderators,
  } = room || {};





  return (
    <div className='room-container'>
      <button className='status__content__spoiler-link' onClick={handleleaveRoom}>Leave Room</button>
      <img src={myIdentity.info.avatar}></img>
      <div>{myIdentity.info.name}</div>
      <div>{myIdentity.info.avatar}</div>
      <ul className='speakerlist'>
        {<StageAvatar
          key={myIdentity.info.id}
          peerId={myIdentity.info.id}
          {...{ speaking, moderators, reactions, room }}
          canSpeak={true}
          peerState={myPeerState}
          info={myIdentity.info}
        />
        }

        {(speakers ?? []).filter(id => peers.includes(id)).map(peerId => {

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

    </div>
  );
}

export default JamRoom; 