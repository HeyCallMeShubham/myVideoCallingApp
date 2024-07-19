
import { createSlice } from "@reduxjs/toolkit";



const initialState = {

    peerConnection: null,

}


const peerConnectionSlice = createSlice({

    name: "peerConnection",
    initialState,
    reducers: {

        addPeerConnection(state, action) {

            state.peerConnection = action.payload

        }

    }

});



export const { addPeerConnection } = peerConnectionSlice.actions

export default peerConnectionSlice.reducer




