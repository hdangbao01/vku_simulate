import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "~/Context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "~/service/peer";
import Peer from "simple-peer";
import { io } from 'socket.io-client'

function RoomCall() {
    // const socket = useSocket()
    // const [remoteSocketId, setRemoteSocketId] = useState(null)
    // const [myStream, setMyStream] = useState(null)
    // const [remoteStream, setRemoteStream] = useState(null)

    // const handleUserJoined = useCallback(({ email, id }) => {
    //     console.log(`Email ${email} joined`);
    //     setRemoteSocketId(id)
    // }, [])

    // const handleCall = useCallback(async () => {
    //     const stream = await navigator.mediaDevices.getUserMedia({
    //         audio: true,
    //         video: true
    //     })

    //     const offer = await peer.getOffer()
    //     socket.emit('user:call', { to: remoteSocketId, offer })
    //     setMyStream(stream)
    // }, [remoteSocketId, socket])

    // const handleIncommingCall = useCallback(async ({ from, offer }) => {
    //     setRemoteSocketId(from)
    //     const stream = await navigator.mediaDevices.getUserMedia({
    //         audio: true,
    //         video: true
    //     })
    //     setMyStream(stream)

    //     console.log(`Incomming Call`, from, offer);

    //     const ans = await peer.getAnswer(offer)
    //     socket.emit('call:accepted', { to: from, ans })
    // }, [socket])

    // const sendStreams = useCallback(() => {
    //     for (const track of myStream.getTracks()) {
    //         peer.peer.addTrack(track, myStream)
    //     }
    // }, [myStream])

    // const handleCallAccepted = useCallback(({ from, ans }) => {
    //     peer.setLocalDescription(ans)
    //     console.log('Call Accepted');
    //     sendStreams()
    // }, [sendStreams])

    // const handleNegoNeeded = useCallback(async () => {
    //     const offer = await peer.getOffer()
    //     socket.emit('peer:nego:needed', { offer, to: remoteSocketId })
    // }, [remoteSocketId, socket])

    // useEffect(() => {
    //     peer.peer.addEventListener('negotiationneeded', handleNegoNeeded)
    //     return () => {
    //         peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded)
    //     }
    // }, [handleNegoNeeded])

    // useEffect(() => {
    //     peer.peer.addEventListener('track', async ev => {
    //         const remoteStream = ev.streams
    //         console.log('GOT TRACK!!!');
    //         setRemoteStream(remoteStream[0])
    //     })
    // })

    // const handleNegoNeedIncomming = useCallback(async ({ from, offer }) => {
    //     const ans = await peer.getAnswer(offer)
    //     socket.emit('peer:nego:done', { to: from, ans })
    // }, [socket])

    // const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    //     await peer.setLocalDescription(ans)
    // }, [])

    // useEffect(() => {
    //     socket.on('user:joined', handleUserJoined)
    //     socket.on('incomming:call', handleIncommingCall)
    //     socket.on('call:accepted', handleCallAccepted)
    //     socket.on('peer:nego:needed', handleNegoNeedIncomming)
    //     socket.on('peer:nego:final', handleNegoNeedFinal)

    //     return () => {
    //         socket.off('user:joined', handleUserJoined)
    //         socket.off('incomming:call', handleIncommingCall)
    //         socket.off('call:accepted', handleCallAccepted)
    //         socket.off('peer:nego:needed', handleNegoNeedIncomming)
    //         socket.off('peer:nego:final', handleNegoNeedFinal)
    //     }
    // }, [socket, handleUserJoined, handleIncommingCall, handleCallAccepted, handleNegoNeedIncomming, handleNegoNeedFinal])

    const socketRef = useRef();
    const [peers, setPeers] = useState([]);
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = '123abc'

    useEffect(() => {
        socketRef.current = io.connect("localhost:1111");
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    const Video = (props) => {
        const ref = useRef();

        useEffect(() => {
            props.peer.on("stream", stream => {
                console.log(stream);
                ref.current.srcObject = stream
            })
        }, []);

        return <div className="w-96">
            <h1>Peer Stream</h1>
            <video muted ref={ref} playsInline autoPlay />
        </div>
    }

    return <>
        <h1>Room Chat</h1>
        <div className="flex flex-wrap items-center">
            <div className="w-96">
                <h1>User Stream</h1>
                <video muted ref={userVideo} playsInline autoPlay />
            </div>
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
            {/* <h1>Room Call</h1>
        <h1>{remoteSocketId ? 'Connected' : 'Noone'}</h1>
        {myStream && <button onClick={sendStreams}>Send Stream</button>}
        {remoteSocketId && <button className="border-2 border-solid border-black py-2 px-4" onClick={handleCall}>Call</button>}
        {myStream && (
            <>
                <h1 className="font-semibold">Stream</h1>
                <ReactPlayer
                    playing
                    muted
                    height={'200px'} width={'300px'} url={myStream} />
            </>
        )
        }
        {remoteStream &&
            <>
                <h1 className="font-semibold">Remote Stream</h1>
                <ReactPlayer
                    playing
                    muted
                    height={'200px'} width={'300px'} url={myStream} />
            </>
        } */}
        </div>
    </>
}

export default RoomCall;