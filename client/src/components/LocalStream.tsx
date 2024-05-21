import React, { useEffect, useRef } from 'react'

const LocalStream = () => {

  const localStreamVideo = useRef<HTMLVideoElement | null>(null);



  const getUserMedia = async () => {

    try {

      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

      if (localStreamVideo.current) {

        localStreamVideo.current.srcObject = mediaStream
      }


    } catch (err) {

      console.log(err);

    }

  }



  useEffect(() => {

    getUserMedia();

  }, []);


  return (

    <div style={{ width: "100%", height: "100%" }}>

      <video ref={localStreamVideo} playsInline autoPlay style={{ width: "100%", height: "100%", background: "green", objectFit: "fill" }} />

    </div>

  )
}

export default LocalStream