
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HiDotsVertical } from "react-icons/hi";
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import { MdFlipCameraIos } from "react-icons/md";
import { VscUnmute } from "react-icons/vsc";
import { VscMute } from "react-icons/vsc";
import "../styles/componentStyles/meetingoptions.css"




const MeetingOptions: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [micMute, setMicMute] = useState(false);


    const [audioMute, setAudioMute] = useState(false);



    const muteUnMuteAudio = () => {

        try {

            if (audioMute) {

                setAudioMute(false);


            } else {

                setAudioMute(true);


            }

        } catch (err) {

            console.log(err);

        }

    }




    const muteUnMuteMic = () => {

        try {

            if (micMute) {

                setMicMute(false);


            } else {

                setMicMute(true);


            }

        } catch (err) {

            console.log(err);

        }

    }


    return (
        <>

            <div className='meetingOptionsMainDiv'>

                <div className='meetiongOptionMobileHeader'>

                    {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

                    <MdFlipCameraIos className="cameraIcon clickableIcon "/>

                    <h1>HaveVideoCall</h1>

                    {false
                        ?
                        <button style={{ height: "1.5rem", width: "4.5rem", fontWeight: "bold", fontSize: "1rem" }}>Leave</button>
                        :
                        <button style={{ height: "1.5rem", width: "4rem", fontWeight: "bold", fontSize: "1rem" }}>End</button>
                    }


                </div>


                <div className='meetingOptionsMainDivChildOne'>
                    {children}
                </div>

                <div className='meetingOptionsMainDivChildTwo'>

                    <HiDotsVertical className='otherOptionIcon clickableIcon' />

                    {true
                        ?
                        <button style={{ height: "3rem", width: "5rem", fontWeight: "bold", fontSize: "1.2rem" }}>Leave</button>
                        :
                        <button style={{ height: "3rem", width: "5rem", fontWeight: "bold", fontSize: "1.2rem" }}>End</button>
                    }

                    {micMute ? <IoMdMicOff className="micIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <IoMdMic className="micIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

                </div>


                <div className='meetingOptionsMainDivChildThree'>

                    <HiDotsVertical className='otherOptionIcon clickableIcon' />

                    {true
                        ?
                        <button style={{ height: "3rem", width: "5rem", fontWeight: "bold", fontSize: "1.2rem" }}>Leave</button>
                        :
                        <button style={{ height: "3rem", width: "5rem", fontWeight: "bold", fontSize: "1.2rem" }}>End</button>
                    }

                    {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}


                </div>



            </div>




            {/*below this all logic is for responsive mobile design*/}









            {/*

            /// check before using
        
        <div style={{ height: "100vh", width: "100vw", alignItems: "center", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        
        <div style={{ width: "100%", height: "100%" }} >
        
        {children}
                
        </div>
        
        
        <div style={{
            
                width: "100%",
                height: '10%',
                display: "flex",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "space-around",
                
            }}>
            
                <HiDotsVertical className='otherOptionIcon  clickableIcon ' />
                
                {true
                    ?
                    <button style={{ height: "3rem", width: "5rem", fontWeight: "bold", fontSize: "1.2rem" }}>Leave</button>
                    :
                    <button style={{ height: "3rem", width: "5rem", fontWeight: "bold", fontSize: "1.2rem" }}>End</button>
                }
                
                {audioMute ? <VscMute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} /> : <VscUnmute className="audioIcon clickableIcon " onClick={() => muteUnMuteAudio()} />}

                </div>
                
                </div>
                
            */}

        </>

    )

}





export default MeetingOptions




