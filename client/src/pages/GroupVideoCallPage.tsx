import React, { useState } from 'react'
import "../styles/pageStyles/GroupVideoCallPage.css"

import RemoteStream from '../components/RemoteStream'
import { RxCross2 } from "react-icons/rx";

import { VscUnmute } from "react-icons/vsc";
import { HiDotsVertical } from "react-icons/hi";

import { VscMute } from "react-icons/vsc";
import MeetingOptions from '../components/MeetingOptions';


const GroupVideoCallPage = () => {

  const [audioMute, setAudioMute] = useState(false);



  const muteUnMuteAudio = () => {

    try {

      if (audioMute) {

        setAudioMute(false);

      } else {

        setAudioMute(true);

      }

    } catch (err) {

      console.log(err);

    }

  }





  return (

    <MeetingOptions>


      <div className='group-video-call-main-page'>

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}


        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}


        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}


        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 


        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 


        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 


        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 


        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 


        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 


        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 

        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}

          <p className='videoSharerName'>shubham</p>

          <div className='options-container'>

            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />

            <RxCross2 className='crossRemoveUserIcon clickableIcon' />

            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>

          <RemoteStream />

        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}

 
 

      </div>

    </MeetingOptions>



  )
}

export default GroupVideoCallPage