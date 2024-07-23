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



  useEffect(() => {

    socketIo?.on("connection-successful", ({ socketId }) => {

      console.log("socketid", socketId);

      getLocalStream()

    })


    socketIo?.on("new-producer", ({ producerId }) => {


      dispatch(setVideoCallState({ prop: "producerIds", value: producerId }))



    });






    return () => {

      socketIo?.off("connection-successful",);

      socketIo?.off("new-producer",);

    }





  }, [socketIo]);





  const getLocalStream = useCallback(async () => {

    try {

      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });



      const audioParams: MediaStreamTrack = { track: stream.getAudioTracks()[0], ...groupVideoCallState.audioParams };
      const videoParams: MediaStreamTrack = { track: stream.getVideoTracks()[0], ...groupVideoCallState.videoParams };

      dispatch(setVideoCallState({ prop: "audioParams", value: audioParams }));

      dispatch(setVideoCallState({ prop: "videoParams", value: videoParams }));


      joinRoom();

    } catch (err) {

      console.log(err);

    }

  }, [])




  const joinRoom = async () => {

    try {

      socketIo?.emit("joinRoom", { roomName: "trpleh" }, ({ rtpCapabilities }: any) => {

        createDevice(rtpCapabilities);

      });

    } catch (err) {

      console.log(err);

    }

  }







  const createDevice = async (routerRtpCapabilities: mediasoupTypes.RtpCapabilities) => {

    try {

      const device = new mediasoupClient.Device();


      await device.load({
        routerRtpCapabilities
      });


      dispatch(setVideoCallState({ prop: "device", value: device }));




    } catch (err) {

      console.log(err);

    }

  }




  useEffect(() => {

    if (groupVideoCallState.device !== undefined) {

      createSendTransport();

    }


  }, [groupVideoCallState.device])





  const createSendTransport = useCallback(async () => {

    try {

      socketIo?.emit("createWebRtcTransport", { consumer: false }, ({ params }: any) => {


        const producerTransport: mediasoupTypes.Transport = groupVideoCallState.device.createSendTransport(params);


        dispatch(setVideoCallState({ prop: "producerTransport", value: producerTransport }))


        producerTransport.on("connect", async ({ dtlsParameters }: { dtlsParameters: mediasoupTypes.DtlsParameters }, callback: Function, errback: Function) => {

          try {

            await socketIo.emit("transport-connect", ({ dtlsParameters }));

            callback();

          } catch (err) {

            console.log(err);

          }

        }); /// transport connect event end



        producerTransport.on("produce", async (parameters: any, callback: Function, errback: Function) => {

          try {

            await socketIo.emit("transport-produce", ({
              rtpParameters: parameters.rtpParameters,
              kind: parameters.kind
            }), ({ id, producersExist }: { id: string, producersExist: boolean }) => {

              callback({ id });

              console.log(producersExist, 'producersExist')

              if (producersExist) getProducers()


            });


          } catch (err) {

            console.log(err);

          }

        }); /// transport produce event end



      })

    } catch (err) {

      console.log(err);

    }

  }, [groupVideoCallState.device]);







  useEffect(() => {

    if (groupVideoCallState.producerTransport !== undefined) {

      connectSendTransport();

    }

  }, [groupVideoCallState.producerTransport]);







  const connectSendTransport = useCallback(async () => {

    try {



      const audioProducer = await groupVideoCallState.producerTransport.produce(groupVideoCallState.audioParams);

      const videoProducer = await groupVideoCallState.producerTransport.produce(groupVideoCallState.videoParams);





      audioProducer.on('trackended', () => {
        console.log('audio track ended')

        // close audio track
      });



      audioProducer.on('transportclose', () => {
        console.log('audio transport ended')

        // close audio track
      });



      videoProducer.on('trackended', () => {
        console.log('video track ended')

        // close video track
      });



      videoProducer.on('transportclose', () => {
        console.log('video transport ended')

        // close video track
      });


    } catch (err) {

      console.log(err);

    }

  }, [groupVideoCallState.producerTransport]);





  const signalNewConsumerTransport = async (remoteProducerId: any) => {

    console.log(remoteProducerId, 'remoteProdcuerId')

    try {

      if (groupVideoCallState.consumingTransports.includes(remoteProducerId)) return;

      dispatch(setVideoCallState({ prop: "consumingTransports", value: remoteProducerId }));

      socketIo?.emit("createWebRtcTransport", { consumer: true }, ({ params }: any) => {

        try {


          const consumerTransport: mediasoupTypes.Transport = groupVideoCallState?.device?.createRecvTransport(params);



          console.log(consumerTransport, 'consumerTransport');

          dispatch(setVideoCallState({ prop: "consumerTransport", value: consumerTransport }));


          consumerTransport?.on("connect", async ({ dtlsParameters }: { dtlsParameters: mediasoupTypes.DtlsParameters }, callback: Function, errback: Function) => {

            await socketIo?.emit("transport-recv-connect", {
              dtlsParameters,
              serverConsumerTransportId: params.id

            });

            callback();

          });



          connectRecvTransport(consumerTransport, remoteProducerId, params.id)

        } catch (err) {

          console.log(err);

        }

      });

    } catch (err) {

      console.log(err);

    }

  }






  const connectRecvTransport = async (consumerTransport: mediasoupTypes.Transport, remoteProducerId: string, serverConsumerTransportId: string) => {
    console.log("consumerTransport", consumerTransport)

    try {

      await socketIo?.emit("consume", {

        rtpCapabilities: groupVideoCallState?.device?.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,

      }, async ({ params }: any) => {

        const consumer = await consumerTransport.consume({

          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,

        });


        dispatch(setVideoCallState({
          prop: "consumerTransports", value: [

            ...groupVideoCallState.consumerTransports,
            {

              consumerTransport,
              serverConsumerTransportId: params.id,
              producerId: remoteProducerId,
              consumer

            }

          ]
        }))


        const { track } = consumer;


        dispatch(setVideoCallState({ prop: "streamTracks", value: track }))

        socketIo.emit("consumer-resume", { serverConsumerId: params.serverConsumerId })



        console.log(track, 'track')


      })

    } catch (err) {

      console.log(err);

    }

  }




  const getProducers = async () => {

    socketIo?.emit("getProducers", (producerIds: any) => {

      console.log(producerIds, "producerIdsArray")

      producerIds.forEach((producerId: string) => {

        dispatch(setVideoCallState({ prop: "producerIds", value: producerId }));

        ///signalNewConsumerTransport(producerId);

      });

    });

  }





  useEffect(() => {

    if (groupVideoCallState.producerIds.length) {

      groupVideoCallState.producerIds.forEach((producerId: any) => {

        signalNewConsumerTransport(producerId)

      });

    }

  }, [groupVideoCallState.producerIds])









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


          <LocalStream />


        </div> {/*streamAndReportRemoveMuteUserOptsContainer end*/}





        {groupVideoCallState.streamTracks.map((track: any) => (

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
          
          {/*streamAndReportRemoveMuteUserOptsContainer end*/ }


      </div>


    </MeetingOptions>


  )
}

export default GroupVideoCallPage