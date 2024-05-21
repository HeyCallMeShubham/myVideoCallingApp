
import { createSlice } from "@reduxjs/toolkit";
import { createElement } from "react";


//type iceCandidateType = any


interface ICallInfoIntitalState {

  fromCall: string,
  haveICalled: boolean,
  iceCandidates:any[]

}




const initialState: ICallInfoIntitalState = {

  fromCall: "",
  haveICalled: false,
  iceCandidates: [],

}




export const callInfoSlice = createSlice({

  name: "callInfoSlice",
  initialState,
  reducers: {
 
    

  }


});




export const {} = callInfoSlice.actions


export default callInfoSlice.reducer




