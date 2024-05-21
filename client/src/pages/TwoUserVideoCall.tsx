import React, { useState } from 'react'
import "../styles/pageStyles/TwoUserVideoCall.css"

import { MdCallEnd } from "react-icons/md";

import LocalStream from '../components/LocalStream';

import RemoteStream from '../components/RemoteStream';

import { VscUnmute } from "react-icons/vsc";
import { HiDotsVertical } from "react-icons/hi";
import { VscMute } from "react-icons/vsc";

const TwoUserVideoCall = () => {

  const [audioMute, setAudioMute] = useState(false);



  const muteUnMuteAudio = () => {

    try {

      if (audioMute) {

        setAudioMute(false)

        console.log(audioMute);

      } else {

        setAudioMute(true)

        console.log(audioMute);

      }

    } catch (err) {

      console.log(err);

    }

  }


  return (

    <div className="main-peer-to-peer-calls-container">

      <div className='video-conversation-container'>


        <div className='local-video-container video-container'>
          <LocalStream />
        </div>



        <div className='remote-video-container video-container'>
          <RemoteStream />
        </div>


        <div className='otherOptionsContainer'>

          <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

          <MdCallEnd className='endCallIcon callIcon' />

          {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

        </div>

      </div>

    </div>

  )
}

export default TwoUserVideoCall