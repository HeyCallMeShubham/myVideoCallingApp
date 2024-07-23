
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"

import { types as mediasoupTypes } from "mediasoup-client"

import type { RootState } from "../app/store"
import { LuUnderline } from "react-icons/lu"


interface IVideoCallStates {

    from: string | undefined,
    streamTracks: any | undefined,
    consumerTransport: any | undefined,
    consumerTransports: any | undefined,
    consumingTransports: any | undefined,
    producerIds: any | undefined,
    producerTransport: mediasoupTypes.Transport | undefined,
    rtpCapabilities: mediasoupTypes.RtpCapabilities | undefined,
    device: mediasoupTypes.Device | undefined,
    consumer: mediasoupTypes.Consumer | undefined,
    audioParams: any,
    videoParams: any,
    audioProducer: any,
    videoProducer: any,
    isProducer: boolean,

}

const initialState: IVideoCallStates = {

    from: undefined,
    streamTracks: [],
    consumerTransport: undefined,
    consumerTransports: [],
    consumingTransports: [],
    producerIds: [],
    producerTransport: undefined,
    rtpCapabilities: undefined,
    device: undefined,
    audioProducer: undefined,
    videoProducer: undefined,
    isProducer: false,
    consumer: undefined,
    audioParams: undefined,
    videoParams: {

        encodings:
            [
                { maxBitrate: 100000 },
                { maxBitrate: 300000 },
                { maxBitrate: 900000 }
            ],
        codecOptions:
        {
            videoGoogleStartBitrate: 1000
        }

    },





}






const VideoCallSlice = createSlice({

    name: "videoCallSlice",
    initialState,
    reducers: {

        setVideoCallState: (state, action: PayloadAction<{ prop: keyof IVideoCallStates; value: any }>) => {


            const { prop, value } = action.payload;



            if (prop === "consumingTransports" || prop === "consumerTransports" || prop === "producerIds" || prop === "streamTracks") {

                state[prop].push(value);

            } else {

                state[prop] = value

            }


        }

    }

});





export const { setVideoCallState } = VideoCallSlice.actions;



export default VideoCallSlice.reducer




