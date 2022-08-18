import React from "react"

export const StageAvatar = ({
    speaking,
    canSpeak,
    moderators,
    peerId,
    peerState,
    reactions,
    info,
}) => {

    let amSpeaking = speaking.has(peerId)


    return (<li className='avatar-container' key={peerId} >
        <div className={amSpeaking ? "speak-circle" : 'quiet-circle'}>
            <img className='avatar' src={info.avatar} ></img>
        </div>
        <h3>{info.name}</h3>
    </li >)

}
