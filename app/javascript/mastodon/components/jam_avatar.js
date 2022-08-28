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
  api,
  state,
  peerId,
  audience,
}) => {

  let { addPresenter, addSpeaker, addModerator } = api;
  const handleMakeModerator = () => {
    alert('test');
  };
  const handleMakePresenter = () => {
    addPresenter(roomId, peerId);
  };


  let menu = [];
  menu.push({ text: 'Make moderator', action: handleMakeModerator });
  menu.push({ text: 'Make presenter', action: handleMakePresenter });

  info = info || { id: peerId};
  let { inRoom = null } = peerState || {};

  return inRoom && (
    <DropdownMenuContainer
      items={menu}
      size={18}
      direction='right'
    >
      <li key={peerId}>
        <div className={`avatar-container ${audience ? 'audience' : ''}`}>
          <SpeakerRing peerId={peerId} />
          <img className='avatar' src={info.avatar} alt={`Avatar ${info.name}`} />
        </div>
        <div className={`avatar-name ${audience ? 'audience' : ''}`}>{info.name}</div>
      </li>
    </DropdownMenuContainer>);

};



