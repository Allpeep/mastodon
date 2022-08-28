import React from 'react';
import DropdownMenuContainer from '../containers/dropdown_menu_container';
import { use, useJam } from 'jam-core-react';


const SpeakerRing = ({peerId}) => {
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
  ] = use(state, [
    'iAmModerator', 'myIdentity', 'identities', 'room']);

  const { addPresenter, addSpeaker, addModerator, removeSpeaker, removeModerator, removePresenter } = api;

  const handleMakeSpeaker = () => addSpeaker(roomId, peerId);
  const handleMakeModerator = () => addModerator(roomId, peerId);
  const handleRemoveSpeaker = () => removeSpeaker(roomId, peerId);
  const handleRemoveModerator = () => removeModerator(roomId, peerId);
  const handleRemovePresenter = () => removePresenter(roomId, peerId);

  const handleMakePresenter = () => {
    presenters.forEach((id) => removePresenter(roomId, id));
    return addPresenter(roomId, peerId);
  };

  const isModerator = !!moderators.includes(peerId);
  const isSpeaker = !!speakers.includes(peerId);
  const isPresenter = !!presenters.includes(peerId);

  const isMe = myIdentity.info.id === peerId;

  let menu = [];
  if(iAmModerator) {
    if(isModerator) {
      menu.push({ text: 'Remove moderator', action: handleRemoveModerator });
    } else {
      menu.push({ text: 'Make moderator', action: handleMakeModerator() });
    }
    if(isSpeaker) {
      menu.push({ text: 'Remove speaker', action: handleRemoveSpeaker });
      if(!isPresenter) {
        menu.push({ text: 'Make presenter', action: handleMakePresenter });
      }
    } else {
      menu.push({ text: 'Make speaker', action: handleMakeSpeaker });
    }
    if(isPresenter) {
      menu.push({ text: 'Remove presenter', action: handleRemovePresenter });
    }
  }
  const info = isMe ? myIdentity.info : identities[peerId] || { id: peerId};

  return (
    <DropdownMenuContainer
      items={menu}
      size={18}
      direction='right'
    >
      <li key={peerId}>
        <div className={`avatar-container ${isSpeaker ? '' : 'audience'}`}>
          <SpeakerRing peerId={peerId} />
          <img className='avatar' src={info.avatar} alt={`Avatar ${info.name}`} />
        </div>
        <div className={`avatar-name ${isSpeaker ? '' : 'audience'}`}>{info.name}</div>
      </li>
    </DropdownMenuContainer>);

};



