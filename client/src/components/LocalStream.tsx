import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';

const LocalStream = () => {


  const streams = useSelector((state: any) => state.streams)




  const localStreamVideo: any = useRef<HTMLVideoElement | null>(null);

  const playStream = () => {



    try {

      localStreamVideo.current.srcObject = streams.localStream.stream

    } catch (err) {

      console.log(err);

    }

  }

  
  
  useEffect(() => {

    if (streams.localStream !== null || streams.localStream?.stream) {

      playStream()

    }

  }, [streams]);





  return (

    <div style={{ width: "100%", height: "100%" }}>

      <video ref={localStreamVideo} playsInline autoPlay style={{ width: "100%", height: "100%", background: "green", objectFit: "fill" }} />

    </div>

  )
}

export default LocalStream