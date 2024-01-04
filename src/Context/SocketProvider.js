import { createContext, useContext, useMemo } from "react";
import { io } from 'socket.io-client'

export const SocketContext = createContext(null)

export const useSocket = () => {
    const socket = useContext(SocketContext)
    return socket
}

export const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io('localhost:1111'), [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}