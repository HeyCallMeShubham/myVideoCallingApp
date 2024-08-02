import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import peerConnectionSlice from '../features/peerConnectionSlice';
import streamsSlice from '../features/streamsSlice';
import groupVideoConversationSlice from '../features/GroupVideoConversationSlice';

export const store = configureStore({
  reducer: {

    peerConnection: peerConnectionSlice,
    streams: streamsSlice,
    groupVideoConversation: groupVideoConversationSlice

  },

  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  })


});



export type RootState = ReturnType<typeof store.getState>


export type AppDispatch = typeof store.dispatch




