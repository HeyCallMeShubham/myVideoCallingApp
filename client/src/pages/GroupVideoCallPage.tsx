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

      getLocalStream()

    });



    socketIo?.on("new-producer", ({ producerId }: { producerId: string }) => {

      console.log("new producer id ", producerId)


      if (groupVideoConversationState.producerIds.includes(producerId)) {

        console.log('already exists', producerId)

      } else {

        dispatch(setGroupConversationState({ prop: "producerIds", value: producerId }));

      }



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


      joinRoom();

    } catch (err) {

      console.log(err);

    }

  }






  const joinRoom = useCallback(async () => {

    try {

      socketIo?.emit("joinRoom", { roomName: "demoRoom" }, ({ rtpCapabilities }: { rtpCapabilities: mediasoupTypes.RtpCapabilities }) => {

        createDevice(rtpCapabilities);

      });


    } catch (err) {

      console.log(err);

    }

  }, []);



  const createDevice = useCallback(async (routerRtpCapabilities: mediasoupTypes.RtpCapabilities) => {

    try {

      const device = new mediasoupClient.Device();

      await device.load({

        routerRtpCapabilities

      });


      dispatch(setGroupConversationState({ prop: "device", value: device }));


    } catch (err) {

      console.log(err);

    }

  }, []);




  useEffect(() => {

    if (groupVideoConversationState.device !== undefined) {

      createProducerTransport();

    }



  }, [groupVideoConversationState.device]);




  const createProducerTransport = useCallback(async () => {

    try {

      socketIo?.emit("createWebRtcTransport", { consumer: false }, async ({ params }: any) => {

        const producerTransport = await groupVideoConversationState.device.createSendTransport(params);

        dispatch(setGroupConversationState({ prop: "producerTransport", value: producerTransport }));

        producerTransport.on("connect", async ({ dtlsParameters }: { dtlsParameters: mediasoupTypes.DtlsParameters }, callback: Function, errback: Function) => {


          await socketIo.emit("transport-connect", { dtlsParameters });

          callback();

        });



        producerTransport.on("produce", async (parameters: any, callback: Function, errback: Function) => {


          await socketIo.emit("transport-produce", { kind: parameters.kind, rtpParameters: parameters.rtpParameters }, ({ id, producersExist }: any) => {


            callback({ id });

            if (producersExist) getProducers();

          });


        });


      });

    } catch (err) {

      console.log(err);

    }

  }, [groupVideoConversationState.device]);







  useEffect(() => {

    if (groupVideoConversationState.producerTransport !== undefined) {

      connectProducerTransport();

    }


  }, [groupVideoConversationState.producerTransport]);


  const connectProducerTransport = useCallback(async () => {

    try {

      const videoProducer = await groupVideoConversationState.producerTransport.produce(groupVideoConversationState.videoParams);
      const audioProducer = await groupVideoConversationState.producerTransport.produce(groupVideoConversationState.audioParams);


    } catch (err) {

      console.log(err);

    }

  }, [groupVideoConversationState.producerTransport]);



  const getProducers = async () => {

    try {

      socketIo?.emit("getProducers", (producerList: any) => {

        producerList.forEach((producerId: string) => {

          if (groupVideoConversationState.producerIds.includes(producerId)) {

            console.log('already exists', producerId)

          } else {

            dispatch(setGroupConversationState({ prop: "producerIds", value: producerId }));

          }

        })

      });

    } catch (err) {

      console.log(err);

    }

  }




  useEffect(() => {

    if (groupVideoConversationState.producerIds.length) {

      groupVideoConversationState.producerIds.forEach((producerId: string) => {



        signalNewConsumingTransport(producerId);

      });

    }


  }, [groupVideoConversationState.producerIds]);



  const signalNewConsumingTransport = useCallback(async (remoteProducerId: string) => {


    try {

      if (groupVideoConversationState.consumingTransports.includes(remoteProducerId)) return

      dispatch(setGroupConversationState({ prop: "consumingTransports", value: remoteProducerId }));

      await socketIo?.emit("createWebRtcTransport", { consumer: true }, async ({ params }: any) => {

        const consumerTransport = groupVideoConversationState.device.createRecvTransport(params);

        dispatch(setGroupConversationState({ prop: "consumerTransport", value: consumerTransport }));

        consumerTransport.on("connect", async ({ dtlsParameters }: { dtlsParameters: mediasoupTypes.DtlsParameters }, callback: Function, errback: Function) => {

          await socketIo.emit("transport-recv-connect", { dtlsParameters, serverConsumerTransportId: params.id });

          callback();

        });


        connectRecvTransport(consumerTransport, remoteProducerId, params.id)

      });


  

    } catch (err) {

      console.log(err);

    }

  }, [groupVideoConversationState.producerIds]);






  const connectRecvTransport = async (consumerTransport: mediasoupTypes.Transport, remoteProducerId: string, serverConsumerTransportId: string) => {

    try {

      socketIo?.emit("consume", { rtpCapabilities: groupVideoConversationState.device.rtpCapabilities, remoteProducerId, serverConsumerTransportId }, async ({ params }: any) => {

        const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters
        })

        const { track } = consumer

        socketIo.emit("consumer-resume", { serverConsumerId: params.serverConsumerId })

        dispatch(setGroupConversationState({ prop: "streamTracks", value: track }))




      });

    } catch (err) {

      console.log(err);

    }

  }



  return (

    <MeetingOptions >


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