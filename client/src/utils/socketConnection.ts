
import React, { useMemo } from 'react'

import * as  io from "socket.io-client"

const socketConnection = () => {

    try {

        const socketIo:io.Socket = io.connect("https://localhost:4000")

        return socketIo;

    } catch (err) {

        console.log(err);

    }


}

export { socketConnection }

