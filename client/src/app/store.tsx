import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import peerConnectionSlice from '../features/peerConnectionSlice';
import streamsSlice from '../features/streamsSlice';
import  videoCallSlice from '../features/VideoCallSlice';

export const store = configureStore({
  reducer: {

    peerConnection: peerConnectionSlice,
    streams: streamsSlice,
    groupVideoCallSlice: videoCallSlice

  },

  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  })


});



export type RootState = ReturnType<typeof store.getState>


export type AppDispatch = typeof store.dispatch




