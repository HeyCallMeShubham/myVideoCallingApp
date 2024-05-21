import React, { useState } from 'react';

import "../styles/componentStyles/incomingcall.css";

import { MdCallEnd } from "react-icons/md";

import { IoCall } from "react-icons/io5";

import { PiPhoneCallFill } from "react-icons/pi";

import { TbMessage } from "react-icons/tb";

import { LuAlarmClock } from "react-icons/lu";




const InComingCall: React.FC = () => {

  let incomingcallStyle = {

    backgroundColor: "blue",
    height: "100vh",

  }


  const handleDragOver = (e: React.DragEvent) => {

    e.preventDefault()

  }





  const handleMouseMove = () => {



  }






  return (

    <div className='incomingCallMainContainer'>

      <div className='childDivOfincomingcallContainer'>

        <div className='callByUserInfo'>

          <img className='callerProfileImage' src='https://th.bing.com/th?id=OIP.dJ2gr5HhBFC-kV17H1MOxQHaHa&w=80&h=80&c=1&vt=10&bgcl=72523d&r=0&o=6&pid=5.1' alt='https://th.bing.com/th?id=OIP.dJ2gr5HhBFC-kV17H1MOxQHaHa&w=80&h=80&c=1&vt=10&bgcl=72523d&r=0&o=6&pid=5.1' />

          <p className='callerName'>shubham</p>

        </div>



        {/*

   adjust according to mobile
   
   <div
     style={{
       height: "100%",
       padding: "0",
       width: "100%",
       display: "flex",
       justifyContent: "space-around",
       alignItems: "center",
       marginBottom: "40px",
       flexDirection: "row",
       background:"green"
     }}

   >
   
   */}

        <div
          style={{
            height: "100%",
            padding: "0",
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "column",
            
          }}

        >


          <div className='remindMeLaterAndMessageiconsContainer'>

            <LuAlarmClock className='remindMeLaterClockIcon ' />

            <TbMessage className='messageIcon ' />

          </div>



          <div className="acceptOrRejectCallContainer" >

            <div onClick={()=>""}>

              <MdCallEnd className='endCallIcon callIcon' />

            </div>

       

            <div onClick={() => ""} >

              <IoCall className='acceptCallIcon callIcon' />

            </div>


          </div>


          <div className="acceptOrRejectCallContainerMobile" >

            <div onDrop={() => console.log("reject call")} onDragOver={handleDragOver}>

              <MdCallEnd className='endCallIcon callIcon' />

            </div>

            <div draggable="true" className='resizable' onMouseMove={handleMouseMove}>

              <PiPhoneCallFill className='swipeCallIcon callIcon' onDragStart={() => console.log("gggg")} />

            </div>

            <div onDrop={() => console.log("accept-call")} onDragOver={handleDragOver} >

              <IoCall className='acceptCallIcon callIcon' />

            </div>


          </div>





        </div>

      </div>

    </div>

  )
}

export default InComingCall