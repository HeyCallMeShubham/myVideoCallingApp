import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import "../styles/pageStyles/GroupVideoCallPage.css"

import RemoteStream from '../components/RemoteStream'
import LocalStream from '../components/LocalStream'
import { RxCross2 } from "react-icons/rx";

import { VscUnmute } from "react-icons/vsc";
import { HiDotsVertical } from "react-icons/hi";
import { types as mediasoupTypes } from "mediasoup-client"
import * as mediasoupClient from "mediasoup-client"

import { VscMute } from "react-icons/vsc";
import MeetingOptions from '../components/MeetingOptions';
import { useDispatch, useSelector } from 'react-redux';
import createPeerConnection from '../utils/createPeerConnection';
import { addStream } from '../features/streamsSlice';
import { addPeerConnection } from '../features/peerConnectionSlice';
import axios from 'axios';
import { socketConnection } from '../utils/socketConnection';
import { setVideoCallState } from '../features/VideoCallSlice';
import { Socket } from 'socket.io-client';


const GroupVideoCallPage = () => {

  const streams = useSelector((state: any) => state.streams)

  const groupVideoCallState = useSelector((state: any) => state.groupVideoCallSlice)

  const peerConnection = useSelector((state: any) => state.peerConnection.peerConnection)

  const [audioMute, setAudioMute] = useState(false);


  const remoteStreamVideo: any = useRef<HTMLVideoElement | null>(null);


  const socketIo: Socket | undefined = useMemo(() => socketConnection(), [])



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


  /// sockets login


  interface ItransportOptions {

    params: {

      id: string,
      iceParameters: mediasoupTypes.IceParameters,
      iceCandidates: mediasoupTypes.IceCandidate,
      dtlsParameters: mediasoupTypes.DtlsParameters,
      sctpParameters?: mediasoupTypes.SctpParameters

    }


  }




  const getUserMedia = async () => {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

      dispatch(addStream({ prop: "localStream", value: { stream: stream } }));

      const track = stream.getVideoTracks()[0];

      dispatch(setVideoCallState({ prop: "params", value: { track, ...groupVideoCallState.params } }));


      getRtpCapabilities();

    } catch (err) {

      console.log(err);

    }

  }






  useEffect(() => {

    getUserMedia();


  }, []);





  useEffect(() => {

    if (groupVideoCallState.rtpCapabilities !== undefined && groupVideoCallState.device === undefined) {

      createDevice();

    }

  }, [groupVideoCallState.rtpCapabilities]);





  useEffect(() => {

    if (groupVideoCallState?.producerTransport !== undefined) {

      connectSendTransport();

    }


  }, [groupVideoCallState.producerTransport]);







  useEffect(() => {

    if (groupVideoCallState?.consumerTransport !== undefined) {

      /// connectRecvTransport();

    }


  }, [groupVideoCallState.consumerTransport, socketIo]);






  useEffect(() => {


    if (groupVideoCallState.device !== undefined) {

      createSendTransport();

      createRecvTransport();

    }

  }, [groupVideoCallState.device]);






  const getRtpCapabilities = () => {

    try {


      interface GetRtpCapabilitiesParams {

        rtpCapabilities: mediasoupTypes.RtpCapabilities

      }



      socketIo?.emit("getRtpCapabilities", ({ rtpCapabilities }: GetRtpCapabilitiesParams) => {

        try {

          dispatch(setVideoCallState({ prop: "rtpCapabilities", value: rtpCapabilities }))

        } catch (err) {

          console.log(err);

        }

      });


    } catch (err) {

      console.log(err);

    }

  }






  const createDevice = useCallback(async () => {

    try {


      const device = new mediasoupClient.Device();


      const routerRtpCapabilities: mediasoupTypes.RtpCapabilities = groupVideoCallState.rtpCapabilities


      await device.load({ routerRtpCapabilities })


      dispatch(setVideoCallState({ prop: "device", value: device }))


    } catch (err) {

      console.log(err)

    }

  }, [groupVideoCallState.rtpCapabilities])






  const createSendTransport = useCallback(async () => {

    try {


      socketIo?.emit("createWebRtcTransport", { sender: true }, async ({ params }: ItransportOptions) => {

        console.log(params, 'params');

        const producerTransport: mediasoupTypes.Transport = groupVideoCallState?.device?.createSendTransport(params);

        console.log(producerTransport, 'producerTransport');

        dispatch(setVideoCallState({ prop: "producerTransport", value: producerTransport }));

        producerTransport?.on("connect", async ({ dtlsParameters }: mediasoupTypes.DtlsParameters | any, callback: Function, errback: Function) => {

          await socketIo?.emit("transport-connect", { dtlsParameters });


          callback();


        });



        interface ITransportProduceParameters {

          kind: mediasoupTypes.MediaKind,
          rtpParameters: mediasoupTypes.RtpParameters,


        }



        producerTransport?.on("produce", async (parameters: ITransportProduceParameters, callback: Function, errback: Function) => {

          await socketIo?.emit("transport-produce", {

            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,

          }, ({ id }: string | any) => {

            callback({ id });

          });

        });




      })



    } catch (err) {

      console.log(err);

    }


  }, [groupVideoCallState.device])





  const connectSendTransport = useCallback(async () => {

    try {

      const producer = await groupVideoCallState.producerTransport.produce(groupVideoCallState.params)

    } catch (err) {

      console.log(err);

    }

  }, [groupVideoCallState.producerTransport])




  const createRecvTransport = useCallback(async () => {

    try {

      socketIo?.emit("createWebRtcTransport", { sender: false }, async ({ params }: ItransportOptions) => {

        const consumerTransport: mediasoupTypes.Transport = groupVideoCallState?.device?.createRecvTransport(params)

        dispatch(setVideoCallState({ prop: "consumerTransport", value: consumerTransport }));

        consumerTransport?.on("connect", async ({ dtlsParameters }: mediasoupTypes.DtlsParameters | any, callback: Function, errback: Function) => {

          console.log("recv tranport connect event is working");

          await socketIo?.emit("transport-recv-connect", { dtlsParameters });

          callback();


        });


      })



    } catch (err) {

      console.log(err);

    }

  }, [groupVideoCallState?.device]);







  const connectRecvTransport = async () => {

    try {

      socketIo?.emit("consume", { rtpCapabilities: groupVideoCallState?.device?.rtpCapabilities }, async (data: any) => {

        const consumer = await groupVideoCallState?.consumerTransport?.consume(data);

        const { track } = consumer

        console.log(track, 'track');

        remoteStreamVideo.current.srcObject = new MediaStream([track]);

        socketIo.emit("consumer-resume")

      });


    } catch (err) {

      console.log(err);

    }

  }





  return (

    <MeetingOptions>


      <button onClick={connectRecvTransport}>connectRecvTransport</button>


      <div className='group-video-call-main-page'>


        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}


          <p className='videoSharerName'>shubham</p>


          <div className='options-container'>


            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />


            <RxCross2 className='crossRemoveUserIcon clickableIcon' />


            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}


          </div>


          <LocalStream />


        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}






        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}


          <p className='videoSharerName'>shubham</p>


          <div className='options-container'>


            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />


            <RxCross2 className='crossRemoveUserIcon clickableIcon' />


            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

          </div>



          <video ref={remoteStreamVideo} playsInline autoPlay style={{ width: "100%", height: "100%", background: "green", objectFit: "fill" }} />



        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}


      </div>


    </MeetingOptions>


  )
}

export default GroupVideoCallPage