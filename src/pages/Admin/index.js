import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import classNames from 'classnames/bind'
import styles from '~/components/Load/Load.module.scss'
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "~/firebase/config";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSocket } from "~/Context/SocketProvider";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles)

function Admin() {
    const admin = localStorage.getItem("admin");
    const [loading, setLoading] = useState(true)
    const [active, setActive] = useState(0)
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const cancelButtonRef = useRef(null)
    const [listUser, setListUser] = useState({})
    const [editUser, setEditUser] = useState({})
    const [role, setRole] = useState('')

    const navigate = useNavigate()

    //Call Video
    // const [email, setEmail] = useState('')
    // const [room, setRoom] = useState('')
    // const shareScreen = useRef()

    // const handleShareScreen = () => {
    //     navigator.mediaDevices.getDisplayMedia({ video: true })
    //         .then((stream) => {
    //             shareScreen.current.srcObject = stream
    //         }).catch((error) => {
    //             console.error('Unable to access the camera/webcam!', error)
    //         })
    // }

    // const socket = useSocket()

    // const handleJoin = useCallback((e) => {
    //     e.preventDefault()
    //     socket.emit('room:join', { email, room })
    // }, [email, room, socket])

    // const handleJoinRoom = useCallback((data) => {
    //     const { email, room } = data
    //     navigate(`/call/${room}`)
    // }, [navigate])

    // useEffect(() => {
    //     socket.on('room:join', handleJoinRoom)

    //     return () => {
    //         socket.off('room:join', handleJoinRoom)
    //     }
    // }, [socket, handleJoinRoom])

    // Admin
    useEffect(() => {
        if (!admin) {
            window.location = '/login?email=&password='
        } else {
            setLoading(false)
        }
    }, [admin])

    const handleLogout = () => {
        localStorage.removeItem("admin");
        window.location = '/login?email=&password='
    }

    useEffect(() => {
        // Add Document
        const colRef = collection(db, "users")
        // Real Time Database
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setListUser(data)
        })

        return unsubscribe
    }, [])

    const handleSelectEdit = (id) => {
        const eUser = listUser.find(iUser => (
            iUser.uid === id
        ))
        setEditUser(eUser);
        setOpenModalEdit(true)
    }

    const handlEdit = async (id) => {
        const userRef = doc(db, "users", id);

        await updateDoc(userRef, {
            role: role
        });
        setOpenModalEdit(false)
    }

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "users", id));
    }

    const Load = () => {
        return (
            <div className={cx('mainer')}>
                <div className={cx('loader')}>
                </div>
            </div>
        );
    };

    return (
        <div>
            {loading ? <Load /> :
                <section className="relative w-screen h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
                    <div className="flex flex-col justify-between fixed w-1/5 h-full top-0 bottom-0 left-0 bg-gray-700">
                        <div>
                            <div className="text-xl mx-4 my-4 font-semibold">VS Admin</div>
                            <div className="border-b border-gray-200 dark:border-gray-700">
                                <ul className="flex flex-col -mb-px text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <li className="" onClick={() => setActive(0)}>
                                        <p href="#" className={`w-full cursor-pointer inline-flex items-center p-4 text-lg border-b-2 rounded-t-lg dark:text-white group ${active === 0 && 'dark:text-blue-500 dark:border-blue-500 border-blue-600 text-blue-600'}`}>
                                            <svg className={`w-4 h-4 me-2 text-gray-400 dark:text-white ${active === 0 && 'text-blue-600 dark:text-blue-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                            </svg>Dashboard
                                        </p>
                                    </li>
                                    <li className="" onClick={() => setActive(1)}>
                                        <p href="#" className={`w-full cursor-pointer inline-flex items-center p-4 text-lg border-b-2 rounded-t-lg dark:text-white group ${active === 1 && 'dark:text-blue-500 dark:border-blue-500 border-blue-600 text-blue-600'}`}>
                                            <svg className={`w-4 h-4 me-2 text-gray-400 dark:text-white ${active === 1 && 'text-blue-600 dark:text-blue-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                                            </svg>User
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <button onClick={handleLogout} className="text-xl bg-red-600 py-2">Đăng xuất</button>
                    </div>

                    <div className="absolute w-4/5 right-0 overflow-x-auto">
                        {active === 0 &&
                            <div className="text-3xl mx-4 my-4">
                                <p>VKU SIMULATE</p>
                                {/* Call Video */}
                                {/* <form onSubmit={handleJoin}>
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text" id="name" className="text-black p-2"
                                        value={email} onChange={e => setEmail(e.target.value)}
                                    />
                                    <label htmlFor="room">Room</label>
                                    <input
                                        type="text" id="room" className="text-black p-2"
                                        value={room} onChange={e => setRoom(e.target.value)}
                                    />
                                    <button className="border-2 border-solid border-white p-2">Join</button>
                                </form> */}
                                {/* <video ref={shareScreen} autoPlay playsInline />
                                <button onClick={handleShareScreen}>Share</button> */}
                            </div>
                        }
                        {active === 1 && <>
                            <div className="text-3xl mx-4 my-4">Table User</div>
                            <div className="">
                                <table className="w-full text-base text-left rtl:text-right text-gray-500 dark:text-white">
                                    <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                User
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Role
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {listUser.map(iUser => (
                                            <tr key={iUser.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {iUser?.displayName}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {iUser?.email}
                                                </td>
                                                <td className="px-6 py-4 font-semibold">
                                                    {iUser?.role}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="cursor-pointer font-medium text-blue-600 dark:text-white hover:underline flex items-center" onClick={() => handleSelectEdit(iUser?.uid)}>Edit<FiEdit className="ml-2" /></p>
                                                    <p className="cursor-pointer font-medium text-blue-600 dark:text-white hover:underline flex items-center" onClick={() => handleDelete(iUser?.id)}>Delete<RiDeleteBin6Line className="ml-2" /></p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div></>}
                    </div>
                    <Transition.Root show={openModalEdit} as={Fragment}>
                        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenModalEdit}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                                            <div className="bg-white px-4 pb-4 pt-4">
                                                <div className="flex items-start justify-between text-lg">
                                                    <div className="font-medium">Thông tin</div>
                                                    <button onClick={() => setOpenModalEdit(false)}><IoClose /></button>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <img src={editUser.photoURL} alt="avatar" className="w-60 h-60 rounded-full object-cover m-6" />
                                                <div>
                                                    <div className="flex mb-2">
                                                        <h1 className="w-20 font-medium">User: </h1><p>{editUser.displayName}</p>
                                                    </div>
                                                    <div className="flex mb-2">
                                                        <h1 className="w-20 font-medium">Email: </h1><p>{editUser.email}</p>
                                                    </div>
                                                    <div className="flex mb-2">
                                                        <h1 className="w-20 font-medium">Role: </h1>
                                                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                                                            <option value="STUDENT">STUDENT</option>
                                                            <option value="TEACHER">TEACHER</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                <button
                                                    type="button"
                                                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
                                                    onClick={() => handlEdit(editUser.id)}
                                                >
                                                    Chỉnh sửa
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                    onClick={() => setOpenModalEdit(false)}
                                                    ref={cancelButtonRef}
                                                >
                                                    Huỷ
                                                </button>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>
                </section>
            }
        </div>

    )
}

export default Admin;