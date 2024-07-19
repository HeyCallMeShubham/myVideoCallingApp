
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"

import { types as mediasoupTypes } from "mediasoup-client"

import type { RootState } from "../app/store"


interface IVideoCallStates {

    from: string | undefined,
    params: mediasoupTypes.ProducerOptions | undefined,
    consumerTransport: mediasoupTypes.Transport | undefined,
    producerTransport: mediasoupTypes.Transport | undefined,
    rtpCapabilities: mediasoupTypes.RtpCapabilities | undefined,
    device: mediasoupTypes.Device | undefined

}

const initialState: IVideoCallStates = {


    from: undefined,
    params: {

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

    consumerTransport: undefined,
    producerTransport: undefined,
    rtpCapabilities: undefined,
    device: undefined,

}






const VideoCallSlice = createSlice({

    name: "videoCallSlice",
    initialState,
    reducers: {

        setVideoCallState: (state, action: PayloadAction<{ prop: keyof IVideoCallStates; value: any }>) => {

            const { prop, value } = action.payload;

            state[prop] = value

        }

    }

});





export const { setVideoCallState } = VideoCallSlice.actions;



export default VideoCallSlice.reducer




