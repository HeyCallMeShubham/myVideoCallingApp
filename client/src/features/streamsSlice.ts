
import { createSlice } from "@reduxjs/toolkit";


interface IAction {

    payload: {
        value: any,
        prop: string
    }


}


const initialState = {

    localStream: null,
    remoteStream: null

}



const streamsSlice = createSlice({

    name: "streamsSlice",
    initialState,
    reducers: {

        addStream(state: any, action: IAction) {

            const { prop, value } = action.payload

            state[prop] = value

        }

    }

});



export const { addStream } = streamsSlice.actions


export default streamsSlice.reducer



