import React, { useEffect } from 'react';
import { useJam, use } from 'jam-core-react';
import Avatar from 'mastodon/components/avatar';
import { StageAvatar } from './jam_avatar';
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
    moderators,
  } = room || {};
  let speakers = account.get('speakers')

  return (
    <div>
      <div><button className='status__content__spoiler-link jam-button' onClick={handleleaveRoom}>Leave Room</button></div>
      <div className='room-container'>
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
    </div>
  );
}

export default JamRoom; 