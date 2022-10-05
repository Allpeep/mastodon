import React, { useEffect, useState } from 'react';
import DropdownMenuContainer from '../containers/dropdown_menu_container';
import { use, useJam } from 'jam-core-react';
import animateEmoji from '../utils/animate-emoji';

const reactionEmojis = ['❤️', '💯', '😂', '😅', '😳', '🤔'];

const SpeakerRing = ({ peerId }) => {
  let [state] = useJam();
  let [speaking] = use(state, ['speaking']);
  let isSpeaking = speaking && speaking.has(peerId);
  return <div className={`speaker-ring ${isSpeaking ? 'active' : ''}`} />;
};

export const JamAvatar = ({
  roomId,
  peerId,
}) => {

  let [state, api] = useJam();
  let [
    iAmModerator,
    myIdentity,
    identities,
    { moderators, speakers, presenters },
    handRaised,
    peerState,
    reactions,
    micMuted
  ] = use(state, [
    'iAmModerator', 'myIdentity', 'identities', 'room', 'handRaised', 'peerState', 'reactions', 'micMuted']);

  const { addPresenter, addSpeaker, addModerator, removeSpeaker, removeModerator, removePresenter } = api;

  const handleMakeSpeaker = () => addSpeaker(roomId, peerId);
  const handleMakeModerator = () => addModerator(roomId, peerId);
  const handleRemoveSpeaker = () => removeSpeaker(roomId, peerId);
  const handleRemoveModerator = () => removeModerator(roomId, peerId);
  const handleRemovePresenter = () => removePresenter(roomId, peerId);

  const handleMakePresenter = async () => {
    for (let i = 0; i < presenters.length; i++) {
      await removePresenter(roomId, presenters[i])
    }
    return addPresenter(roomId, peerId);
  };

  const isModerator = !!moderators.includes(peerId);
  const isSpeaker = !!speakers.includes(peerId);
  const isPresenter = !!presenters.includes(peerId);

  const isMe = myIdentity.info.id === peerId;

  let menu = [];
  if (iAmModerator) {
    if (isModerator) {
      menu.push({ text: 'Remove moderator', action: handleRemoveModerator });
    } else {
      menu.push({ text: 'Make moderator', action: handleMakeModerator });
    }
    if (isSpeaker) {
      menu.push({ text: 'Remove speaker', action: handleRemoveSpeaker });
      if (!isPresenter) {
        menu.push({ text: 'Make presenter', action: handleMakePresenter });
      }
    } else {
      menu.push({ text: 'Make speaker', action: handleMakeSpeaker });
    }
    if (isPresenter) {
      menu.push({ text: 'Remove presenter', action: handleRemovePresenter });
    }
  }
  const info = isMe ? myIdentity.info : identities[peerId] || { id: peerId };
  const isHandRaised = isMe ? handRaised : peerState[peerId]?.handRaised;
  const reactions_ = reactions[peerId];
  const ismicMuted = isMe ? micMuted : peerState[peerId]?.micMuted;

  return (
    <DropdownMenuContainer
      items={menu}
      size={18}
      direction='right'
    >
      <button className='avatar-list-item' key={peerId}>
        <div className={`avatar-container ${isSpeaker ? '' : 'audience'}`}>
          <SpeakerRing peerId={peerId} />
          <img className='avatar' src={info.avatar} alt={`Avatar ${info.name}`} />
          <Reactions
            reactions={reactions_}
            className='reaction'
          />
          {isHandRaised &&
            <div className='jam-hand'>✋</div>
          }
          {(ismicMuted && isSpeaker) &&
            <div className='jam-mute'>🔇</div>}
        </div>
        <div className={`avatar-name ${isSpeaker ? '' : 'audience'}`}>{peerId.slice(0, 7)}</div>
      </button>
    </DropdownMenuContainer>);

};


function Reactions({ reactions, className }) {
  if (!reactions) return null;
  return (
    <>
      {reactions.map(
        ([r, id]) =>
          reactionEmojis.includes(r) && (
            <AnimatedEmoji
              key={id}
              emoji={r}
              className={className}
              style={{
                alignSelf: 'center',
              }}
            />
          )
      )}
    </>
  );
}

function AnimatedEmoji({ emoji, ...props }) {
  let [element, setElement] = useState(null);
  useEffect(() => {
    if (element) animateEmoji(element);
  }, [element]);
  return (
    <div ref={setElement} {...props}>
      {emoji}
    </div>
  );
}

