import { AppContext } from "~/Context/AppProvider";
import { AuthContext } from "~/Context/AuthProvider";
import Modal from "../Modal";
import { signOut } from 'firebase/auth'
import { auth, db } from "~/firebase/config";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { RiDropdownList } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import { TfiControlBackward } from "react-icons/tfi";
import useFirestore from "~/hook/useFirestore";
import { formatRelative } from "date-fns";

function MeetingRoom() {
    const { data } = useContext(AuthContext)
    const { selectedRoomId, setSelectedRoomId, selectedRoom, setOpenModal, members, allRoom } = useContext(AppContext)
    const [input, setInput] = useState('')

    const handleSignOut = async () => {
        await signOut(auth).then(() => {
            console.log("Sign-out successful");
        }).catch((error) => {
            console.log(error.message);
        });
    }
    const handleSelectedRoom = async (roomId) => {
        setSelectedRoomId(roomId)

        const selectRoom = allRoom.find(room => room.id === roomId)

        if (!selectRoom.members.includes(data.uid)) {
            const docRef = doc(db, "rooms", roomId);

            await setDoc(docRef, { ...selectRoom, members: [...selectRoom.members, data.uid] });
        }
    }

    const handleSubmit = () => {
        try {
            const docRef = addDoc(collection(db, "message"), {
                text: input,
                uid: data.uid,
                photoURL: data.photoURL,
                roomId: selectedRoomId,
                displayName: data.displayName,
                createdAt: serverTimestamp()
            })
            console.log("Document written with ID: ", docRef);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        setInput('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    const roomCond = useMemo(() => {
        return {
            fieldName: 'roomId',
            operator: '==',
            compareValue: selectedRoom?.id
        }
    }, [selectedRoom?.id])

    const allMess = useFirestore('message', roomCond)

    const formatDate = (seconds) => {
        let formattedDate = ''

        if (seconds) {
            formattedDate = formatRelative(new Date(seconds * 1000), new Date())

            formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
        }

        return formattedDate
    }

    const refMess = useRef();
    useEffect(() => {
        if (allMess.length) {
            refMess.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
        console.log(allMess.length);
    }, [allMess.length]);


    return <div className="w-screen h-screen">
        <div className="fixed w-1/5 bg-white right-0 top-0 bottom-0">
            <div className="h-10 flex justify-between mx-4 my-4">
                <div className="flex justify-center items-center">
                    <img className="w-10 h-10 rounded-full object-cover" src={data?.photoURL} alt="Avatar" />
                    <p className="ml-2">{data?.displayName}</p>
                </div>
                <button onClick={handleSignOut} className="flex justify-center items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Sign out
                </button>
            </div>
            <div className="border-t border-b-gray-950 border-solid px-4 py-4">
                <div className="flex items-center">
                    <button onClick={() => setOpenModal(true)} className="mr-2 flex justify-center items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700 font-medium rounded-lg text-sm p-2 text-center">
                        <FaPlus className="text-base" />
                    </button>
                    <div className="cursor-pointer hover:text-blue-500" onClick={() => setOpenModal(true)}>Add Room</div>
                </div>
                <div className="flex items-center pt-4 pb-2">
                    {/* <RiDropdownList /> <p className="ml-2">Danh sách phòng</p> */}
                    <button className="mr-2 flex justify-center items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700 font-medium rounded-lg text-sm p-2 text-center">
                        <RiDropdownList className="text-base" />
                    </button>
                    <div>List Room</div>
                </div>
                <ul className="font-light">
                    {allRoom && allRoom.map(room => <li key={room.id}
                        onClick={() => handleSelectedRoom(room.id)}
                        className={`flex items-center ml-6 py-1 hover:text-blue-500 hover:font-normal cursor-pointer ${room?.id === selectedRoomId && `text-blue-500 font-normal`}`}
                    >
                        <BsDot /> {room?.name} {room?.id === selectedRoomId && <TfiControlBackward className="ml-1 font-semibold" />}
                    </li>)}
                </ul>
            </div>
        </div>
        <div className="fixed w-4/5 bg-black left-0 top-0 bottom-0 text-white overflow-hidden">
            <div className="fixed w-96 h-96 left-6 bottom-6 bg-white rounded-3xl text-black">
                <p className="mx-5 my-3">Room Chat {selectedRoom?.name}</p>
                <div className="flex items-center border-t border-b-gray-950 border-solid px-4 py-4">
                    Member: {members.map(member => <img key={member?.uid} className="w-9 h-9 rounded-full object-cover ml-2" src={member?.photoURL} alt="Avatar" />)}
                </div>
                <div className="overflow-auto h-52 flex flex-col">
                    {allMess.map(mess => <div ref={refMess} key={mess?.id} className="flex items-center mb-2">
                        <img className="w-9 h-9 rounded-full object-cover mx-2" src={mess?.photoURL} alt="Avatar" />
                        <div>
                            <div className="flex items-center">
                                <p className="mr-2">{mess?.displayName}</p>
                                <p className="font-light">{formatDate(mess?.createdAt?.seconds)}</p>
                            </div>
                            <p className="font-light">{mess?.text}</p>
                        </div>
                    </div>)}
                </div>
                <div className="w-full flex items-center absolute bottom-2 px-2">
                    <input className="w-full font-light border border-bborder-b-gray-950 rounded-3xl px-4 py-2" type="text" placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <IoSend onClick={handleSubmit} className="w-10 text-xl cursor-pointer text-blue-600" />
                </div>
            </div>
        </div>
        <Modal />
    </div>
}

export default MeetingRoom;