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
import { setGroupConversationState } from '../features/GroupVideoConversationSlice';
import { Socket } from 'socket.io-client';
import { server } from 'typescript';


const GroupVideoCallPage = () => {

  const streams = useSelector((state: any) => state.streams)

  const groupVideoConversationState = useSelector((state: any) => state.groupVideoConversation);

  const peerConnection = useSelector((state: any) => state.peerConnection.peerConnection);

  const [audioMute, setAudioMute] = useState(false);


  const remoteStreamVideo: any = useRef<HTMLVideoElement | null>(null);

  const localStreamVideo: any = useRef<HTMLVideoElement | null>(null);


  const socketIo: Socket | undefined = useMemo(() => socketConnection(), []);


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


  useEffect(() => {

    socketIo?.on("connection-success", (socketId: string) => {

      console.log(socketId, 'socketId');



    });



    socketIo?.on("new-producer", ({ producerId }: { producerId: string }) => {

      console.log(producerId, 'producerId')

      dispatch(setGroupConversationState({ prop: "producerIds", value: producerId }));



    });



    return () => {

      socketIo?.off("connection-success");

      socketIo?.off("new-producer")

    }

  }, [socketIo]);



  const getLocalStream = async () => {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      const videoTrack = stream.getVideoTracks()[0];

      const audioTrack = stream.getAudioTracks()[0];

      dispatch(setGroupConversationState({ prop: "videoParams", value: { track: videoTrack, ...groupVideoConversationState.videoParams } }));

      dispatch(setGroupConversationState({ prop: "audioParams", value: { track: audioTrack, ...groupVideoConversationState.audioParams } }));

      localStreamVideo.current.srcObject = stream


    } catch (err) {

      console.log(err);

    }

  }





  const createDevice = useCallback(async (routerRtpCapabilities: mediasoupTypes.RtpCapabilities) => {

    try {

      const device = new mediasoupClient.Device();

      await device.load({

        routerRtpCapabilities

      });


      dispatch(setGroupConversationState({ prop: "device", value: device }))

    } catch (err) {

      console.log(err);

    }

  }, [])







  const createRoom = () => {

    getLocalStream();

    try {



      socketIo?.emit("createRoom", { roomName: "demoRoom" }, ({ routerRtpCapabilities }: { routerRtpCapabilities: mediasoupTypes.RtpCapabilities }) => {


        createDevice(routerRtpCapabilities);

      });

    } catch (err) {

      console.log(err);

    }

  };





  const joinRoom = () => {

    getLocalStream();

    try {


      socketIo?.emit("join-room", { roomName: "demoRoom" }, ({ routerRtpCapabilities }: { routerRtpCapabilities: mediasoupTypes.RtpCapabilities }) => {


        createDevice(routerRtpCapabilities);

      });


    } catch (err) {

      console.log(err);

    }

  };





  useEffect(() => {

    if (groupVideoConversationState.device !== undefined) {

      createSendTransport();

    }


  }, [groupVideoConversationState.device]);






  const getProducers = async () => {

    try {

      socketIo?.emit("getProducers", ({ producersList }: any) => {

        producersList.forEach((producerId: string) => {

          dispatch(setGroupConversationState({ prop: "producerIds", value: producerId }))

        });

      });

    } catch (err) {

      console.log(err);

    }

  }





  const createSendTransport = useCallback(async () => {

    try {

      socketIo?.emit("createWebRtcTransport", { consumer: false }, async ({ params }: any) => {


        const producerTransport: mediasoupTypes.Transport = groupVideoConversationState.device.createSendTransport(params)

        dispatch(setGroupConversationState({ prop: "producerTransport", value: producerTransport }));


        producerTransport.on("connect", async ({ dtlsParameters }: { dtlsParameters: mediasoupTypes.DtlsParameters }, callback: Function, errback: Function) => {

          try {

            socketIo.emit("transport-connect", { dtlsParameters, serverProducerTransportId: params.id });

            callback();

          } catch (err) {

            console.log(err);

          }

        });



        producerTransport.on("produce", async (parameters: any, callback: Function, errback: Function) => {

          try {

            socketIo.emit("transport-produce", { kind: parameters.kind, rtpParameters: parameters.rtpParameters, serverProducerTransportId: params.id }, ({ id, producersExist }: { id: string, producersExist: boolean }) => {

              callback({ id });

              if (producersExist) getProducers()

            });



          } catch (err) {

            console.log(err);

          }

        });



      });

    } catch (err) {

      console.log(err);

    }

  }, [groupVideoConversationState.device]);







  useEffect(() => {

    if (groupVideoConversationState.producerTransport !== undefined && groupVideoConversationState.audioParams && groupVideoConversationState.videoParams) {

      connectSendTransport();

    }

  }, [groupVideoConversationState.producerTransport, groupVideoConversationState.audioParams, groupVideoConversationState.audioParams]);






  const connectSendTransport = useCallback(async () => {

    try {

      console.log(groupVideoConversationState.producerTransport, 'producerTranprt')

      const audioProducer = await groupVideoConversationState.producerTransport?.produce(groupVideoConversationState.audioParams);

      const videoProducer = await groupVideoConversationState.producerTransport?.produce(groupVideoConversationState.videoParams);


    } catch (err) {

      console.log(err);

    }

  }, [groupVideoConversationState.producerTransport, groupVideoConversationState.audioParams, groupVideoConversationState.videoParams])






  useEffect(() => {


    if (groupVideoConversationState.producerIds.length) {

      groupVideoConversationState.producerIds.forEach((producerId: string) => {

        signalNewConsumerTransport(producerId);

      });

    }


  }, [groupVideoConversationState.producerIds]);







  const signalNewConsumerTransport = async (remoteProducerId: string) => {

    try {

      socketIo?.emit("createWebRtcTransport", { consumer: true }, async ({ params }: any) => {

        const consumerTransport: mediasoupTypes.Transport = groupVideoConversationState.device.createRecvTransport(params)

        dispatch(setGroupConversationState({ prop: "consumerTransport", value: consumerTransport }));


        consumerTransport.on("connect", async ({ dtlsParameters }: { dtlsParameters: mediasoupTypes.DtlsParameters }, callback: Function, errback: Function) => {

          try {

            socketIo.emit("transport-recv-connect", { dtlsParameters, serverConsumerTransportId: params.id });

            callback();

          } catch (err) {

            console.log(err);

          }

        });


        connectRecvTransport(consumerTransport, remoteProducerId, params.id)


      });

    } catch (err) {

      console.log(err);

    }

  }


  const connectRecvTransport = async (consumerTransport: mediasoupTypes.Transport, remoteProducerId: string, serverConsumerTransportId: string) => {

    try {

      socketIo?.emit("consume", { rtpCapabilities: groupVideoConversationState.device.rtpCapabilities, remoteProducerId, serverConsumerTransportId }, async ({ params }: any) => {

        const consumer = await consumerTransport.consume({

          kind: params.kind,
          id: params.id,
          producerId: params.producerId,
          rtpParameters: params.rtpParameters

        });


        const { track } = consumer

        dispatch(setGroupConversationState({ prop: "streamTracks", value: track }));

        socketIo.emit("consumer-resume", { consumerId: params.id })

      });

    } catch (err) {

      console.log(err);

    }

  }




  const pausetrack = () => {

    try {

      socketIo?.emit("producer-pause")

    } catch (err) {

      console.log(err);

    }

  }


  const resumetrack = () => {

    try {

      socketIo?.emit("producer-resume")

    } catch (err) {

      console.log(err);

    }

  }





  return (

    <MeetingOptions >


      <button className='' onClick={createRoom}>create Room</button>

      <button className='' onClick={joinRoom}>Join Room</button>

      <button className='' onClick={pausetrack}>pause</button>
      
      <button className='' onClick={resumetrack}>resume</button>



      <div className='group-video-call-main-page'>


        <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}


          <p className='videoSharerName'>shubham</p>


          <div className='options-container'>


            <HiDotsVertical className='otherOptionIcon  clickableIcon ' />


            <RxCross2 className='crossRemoveUserIcon clickableIcon' />


            {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}


          </div>


          <LocalStream stream={localStreamVideo} />


        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}


        <video ref={remoteStreamVideo} playsInline autoPlay style={{ width: "100%", height: "99.6%", objectFit: "fill" }} />



        {groupVideoConversationState.streamTracks.map((track: any) => (

          <div className='streamAndReportRemoveMuteUserOptsContainer'> {/*streamAndReportRemoveMuteUserOptsContainer start*/}


            <p className='videoSharerName'>shubham</p>


            <div className='options-container'>


              <HiDotsVertical className='otherOptionIcon  clickableIcon ' />


              <RxCross2 className='crossRemoveUserIcon clickableIcon' />


              {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

            </div>


            <RemoteStream track={track} />




          </div>
        ))}

        {/*streamAndReportRemoveMuteUserOptsContainer end*/}


      </div>


    </MeetingOptions>


  )
}

export default GroupVideoCallPage