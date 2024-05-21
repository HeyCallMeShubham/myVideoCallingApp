
import React, { MutableRefObject, useEffect, useRef } from 'react';


const RemoteStream = () => {


    const remoteStreamVideo = useRef<HTMLVideoElement | null>(null);



    const getUserMedia = async () => {

        try {

            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

            if (remoteStreamVideo.current) {

                remoteStreamVideo.current.srcObject = mediaStream
            }


        } catch (err) {

            console.log(err);

        }

    }



    useEffect(() => {

        getUserMedia();

    }, []);



    return (

        <video ref={remoteStreamVideo} playsInline autoPlay style={{ width: "100%", height: "99.6%", objectFit: "fill" }} />

    )
}




export default RemoteStream;



