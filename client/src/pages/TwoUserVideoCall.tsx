import React, { useEffect, useState } from 'react'
import "../styles/pageStyles/TwoUserVideoCall.css"

import { MdCallEnd } from "react-icons/md";

import LocalStream from '../components/LocalStream';

import RemoteStream from '../components/RemoteStream';

import { VscUnmute } from "react-icons/vsc";
import { HiDotsVertical } from "react-icons/hi";
import { VscMute } from "react-icons/vsc";
import { addStream } from '../features/streamsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addPeerConnection } from '../features/peerConnectionSlice';
import createPeerConnection from '../utils/createPeerConnection';

const TwoUserVideoCall = () => {




  const streams = useSelector((state: any) => state.streams)

  const peerConnection = useSelector((state: any) => state.peerConnection.peerConnection)


  const [audioMute, setAudioMute] = useState(false);



  const dispatch = useDispatch();




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





  const getUserMedia = async () => {

    try {



      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })

      dispatch(addStream({ prop: "localStream", value: { stream: stream } }));

      const { remoteStream, peerConnection }: any = await createPeerConnection("addIceCandidates")

      dispatch(addStream({ prop: "remoteStream", value: { stream: remoteStream } }));

      dispatch(addPeerConnection(peerConnection));



    } catch (err) {

      console.log(err, 'err');

    }

  }


  useEffect(() => {

    getUserMedia();

  }, []);


  useEffect(() => {

    if (peerConnection) {

      peerConnection.addEventListener("negotiationneeded", (e: any) => {

        console.log('negotiationisworking');

      });
    }

  }, [peerConnection]);







  const addStreamToPeer = async (e: any) => {

    const localStream = streams.localStream.stream

    try {


      localStream.getTracks().forEach((track: any) => {

        peerConnection.addTrack(track, streams.localStream.stream);

      });


    } catch (err) {

      console.log(err, 'err');

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