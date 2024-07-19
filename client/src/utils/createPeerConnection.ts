import { FunctionComponentElement } from "react";

const createPeerConnection = async (addIceCandidates: any) => {

    return new Promise(async (resolve, reject) => {

        const peerConnection = await new RTCPeerConnection({

            iceServers: [{

                urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']

            }]

        });


        const remoteStream: any = new MediaStream();



        peerConnection.addEventListener('signalingstatechange', (e) => {

            console.log('signaling state change');

            console.log(e);

        });



        peerConnection.addEventListener("icecandidate", (e) => {

            console.log("Found Ice Candidate", e.candidate);

            if (e.candidate) {

                // emit to socket server

                addIceCandidates(e.candidate);

            }

        });



        peerConnection.addEventListener("track", (e) => {

            e.streams[0].getTracks().forEach((track: any) => {

                remoteStream.addTrack(track, remoteStream)
                

            });

        });



        resolve({

            peerConnection,
            remoteStream

        });

    });

}




export default createPeerConnection





