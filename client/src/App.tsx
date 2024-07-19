import React, { useMemo, useState } from 'react';
import './App.css';
import Home from './Home';
import InComingCall from './components/InComingCall.tsx';
import TwoUserVideoCall from './pages/TwoUserVideoCall.tsx';
import GroupVideoCallPage from './pages/GroupVideoCallPage.tsx';
import MeetingOptions from './components/MeetingOptions.tsx';
import { Socket } from 'socket.io-client';
import { socketConnection } from './utils/socketConnection.ts';



function App() {


 
    return (

           <GroupVideoCallPage />

    )

}


export default App;



