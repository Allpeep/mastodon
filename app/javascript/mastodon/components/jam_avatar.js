import React, {useState} from "react"

export const StageAvatar = ({
    speaking,
    canSpeak,
    moderators,
    peerId,
    peerState,
    reactions,
    info,
}) => {

    const [dropdown, setDropdown] = useState(false)

    const handleDropdown = () => {

    }

    let amSpeaking = speaking.has(peerId)


    return (<li className='avatar-container' key={peerId} >
        <div className={amSpeaking ? "speak-circle" : 'quiet-circle'} onClick={() => {setDropdown(true)}} onMouseLeave={() => setDropdown(false)}>
            <img className='avatar' src={info.avatar} ></img>
            {dropdown ? 
        <div className="avatar-dropdown" onBlur={() => setDropdown(false)}>
            <ul>
                Speaker
            </ul>
        </div> : null}
        </div>
        <h3>{info.name}</h3>
        
    </li >)

}


export function AudienceAvatar({
    room,
    peerId,
    peerState,
    // reactions,
    info,
    // handRaised,
    onClick,
}) {

    let { inRoom = null } = peerState || {};
    info = info || { id: peerId };
    return (
        inRoom && (
            <li className="avatar-container">
                <div className="quiet-circle">
                    <img className="avatar audience-avatar" src={info.avatar} />
                </div>
            </li>
        )
    );
}

