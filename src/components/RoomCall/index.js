import { useCallback, useEffect, useState } from "react";
import { useSocket } from "~/Context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "~/service/peer";

function RoomCall() {
    const socket = useSocket()
    const [remoteSocketId, setRemoteSocketId] = useState(null)
    const [myStream, setMyStream] = useState(null)

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined`);
        setRemoteSocketId(id)
    }, [])

    const handleCall = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })

        const offer = await peer.getOffer()
        socket.emit('user:call', { to: remoteSocketId, offer })
        setMyStream(stream)
    }, [remoteSocketId, socket])

    const handleIncommingCall = useCallback(({ from, offer }) => {
        console.log(`Incomming Call`, from, offer);
    }, [])

    useEffect(() => {
        socket.on('user:joined', handleUserJoined)
        socket.on('incomming:call', handleIncommingCall)

        return () => {
            socket.off('user:joined', handleUserJoined)
            socket.off('incomming:call', handleIncommingCall)
        }
    }, [socket, handleUserJoined, handleIncommingCall])

    return <div>
        <h1>Room Call</h1>
        <h1>{remoteSocketId ? 'Connected' : 'Noone'}</h1>
        {remoteSocketId && <button className="border-2 border-solid border-black py-2 px-4" onClick={handleCall}>Call</button>}
        {myStream &&
            <>
                <h1 className="font-semibold">Stream</h1>
                <ReactPlayer playing muted height={'300px'} width={'500px'} url={myStream} />
            </>
        }
    </div>;
}

export default RoomCall;