import { AppContext } from "~/Context/AppProvider";
import { AuthContext } from "~/Context/AuthProvider";
import Modal from "../Modal";
import { signOut } from 'firebase/auth'
import { auth, db } from "~/firebase/config";
import { Fragment, Suspense, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { RiDropdownList } from "react-icons/ri";
import { IoClose, IoSend } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import { TfiControlBackward } from "react-icons/tfi";
import useFirestore from "~/hook/useFirestore";
import { formatRelative } from "date-fns";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { MeshStandardMaterial, Vector3, VideoTexture } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Load from "../Load";
import { Dialog, Transition } from "@headlessui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function LightWithHelper() {
    const lightRef = useRef();

    return (
        <>
            <directionalLight ref={lightRef} color="white" intensity={5} position={[0, 5, 0]} castShadow />
        </>
    );
}

function MeetingRoom() {
    const { data } = useContext(AuthContext)
    const { selectedRoomId, setSelectedRoomId, selectedRoom, setOpenModal, members, allRoom, dataUser } = useContext(AppContext)
    const [input, setInput] = useState('')
    const [openSelectChair, setOpenSelectChair] = useState(false)
    const [cameraPOV, setCameraPOV] = useState([0, 0, 4])
    const [orbitCamera, setOrbitCamera] = useState([0, 3, 0])
    const [selectedChair, setSelectedChair] = useState([])
    const [outChair, setOutChair] = useState(false)
    const cancelButtonRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate();

    // console.log(database._repoInternal);
    // const handleRef = () => {
    //     set(ref(database, 'meets'), {
    //         audio: true,
    //         video: false,
    //         screen: false,
    //     })
    //         .then(() => {
    //             console.log("Success");
    //         })
    //         .catch((error) => {
    //             console.log("Failed");
    //         });
    // }

    // handle Website
    const handleSignOut = async () => {
        await signOut(auth).then(() => {
            console.log("Sign-out successful");
        }).catch((error) => {
            console.log(error.message);
        });
    }
    const handleSelectedRoom = async (roomId) => {
        // Out Room
        if (selectedRoom.members !== undefined) {
            const arr = selectedRoom.members.filter((item) => {
                return item.indexOf(data.uid) === -1
            })

            const selectRoomOut = allRoom.find(room => room.id === selectedRoom.id)
            if (selectRoomOut.members.includes(data.uid)) {
                const docRef = doc(db, "rooms", selectRoomOut.id);
                await setDoc(docRef, { ...selectRoomOut, members: [...arr] });
            }
        }

        // Join Room
        setSelectedRoomId(roomId)
        const selectRoom = allRoom.find(room => room.id === roomId)

        if (!selectRoom.members.includes(data.uid)) {
            const docRef = doc(db, "rooms", roomId);

            await setDoc(docRef, { ...selectRoom, members: [...selectRoom.members, data.uid] });
        }
    }

    const handleOutRoom = async () => {
        if (selectedRoom.members !== undefined) {
            const arr = selectedRoom.members.filter((item) => {
                return item.indexOf(data.uid) === -1
            })

            const selectRoomOut = allRoom.find(room => room.id === selectedRoom.id)
            if (selectRoomOut.members.includes(data.uid)) {
                const docRef = doc(db, "rooms", selectRoomOut.id);
                await setDoc(docRef, { ...selectRoomOut, members: [...arr] });
            }
        }
        navigate('/meeting')
        setSelectedRoomId(null)
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
    }, [allMess.length]);

    // handle 3D
    const materialWall = new MeshStandardMaterial({ color: "#E7CBA9" });

    const room = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/room_model.glb')
    const chair = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/chair_room.glb')
    const wall_room = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/wall_room.glb')
    const floor = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/floor_room.glb')

    useEffect(() => {
        if (!room) return;
        if (!wall_room) return;
        if (!floor) return;
        if (!chair) return;

        room.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        wall_room.scene.traverse((child) => {
            if (child.isMesh) {
                child.receiveShadow = true;
                child.material = materialWall;
            }
        });

        floor.scene.traverse((child) => {
            if (child.isMesh) {
                child.receiveShadow = true;
            }
        });

        chair.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

    }, [room, chair, wall_room, floor]);

    const Room = () => {
        return <mesh>
            <primitive object={room.scene} />
        </mesh>
    }

    const handlSelectChair = () => {
        setCameraPOV(selectedChair)
        // camera.position.lerp(selectedChair, 0.25);
        setOrbitCamera([0.15, 3.25, -6.04])
        setOpenSelectChair(false)
        setOutChair(true)
    }

    const handeOutChair = () => {
        setCameraPOV([0, 0, 4])
        setOrbitCamera([0, 3, 0])
        setOutChair(false)
    }

    const Chair = () => {
        const { camera, pointer, raycaster } = useThree()
        const [selectedMesh, setSelectedMesh] = useState(null);

        useFrame(() => {
            raycaster.setFromCamera(pointer, camera)
            const intersects = raycaster.intersectObjects(chair.scene.children);

            if (intersects.length > 0) {
                const mesh = intersects[0].object;
                if (mesh !== selectedMesh) {
                    setSelectedMesh(mesh);
                }
            } else {
                if (selectedMesh) {
                    setSelectedMesh(null);
                }
            }
        });
        const handleClick = (e) => {
            if (selectedMesh) {
                const worldPosition = new Vector3();
                selectedMesh.getWorldPosition(worldPosition);
                console.log('Selected mesh:', worldPosition);
                setSelectedChair(worldPosition)
            }
            setOpenSelectChair(true)
        };

        return <mesh
            onClick={(e) => handleClick(e)}
        >
            <primitive object={chair.scene} />
        </mesh>
    }

    const Wall = () => {
        return <mesh materialWall={materialWall} >
            <primitive object={wall_room.scene} />
            <meshBasicMaterial />
        </mesh>
    }

    const Floor = () => {
        return <mesh>
            <primitive object={floor.scene} />
            <meshBasicMaterial />
        </mesh>
    }

    // const link = process.env.PUBLIC_URL + 'videos/mv.mp4'
    // const [link, setLink] = useState(process.env.PUBLIC_URL + 'videos/mv.mp4')

    const PlaneVideo = memo(({ url }) => {
        // const texture = useVideoTexture(process .env.PUBLIC_URL + 'videos/sunflower.3gp')

        const model = useMemo(() => {
            const video = document.createElement("video")
            video.muted = false
            video.loop = true
            video.controls = true
            video.playsInline = true
            video.autoplay = false
            video.src = url
            return { video }
        }, [url])

        // let model = {}
        // model.video = document.createElement("video")
        // model.video.muted = false
        // model.video.loop = true
        // model.video.controls = true
        // model.video.playsInline = true
        // model.video.autoplay = false
        // model.video.src = url
        // process.env.PUBLIC_URL + 'videos/mv.mp4'

        const handleClickScreen = useCallback(() => {
            if (model.video.paused) {
                model.video.play()
            } else {
                model.video.pause()
            }
        }, [model])

        const texture = useMemo(() => {
            const a = new VideoTexture(model.video)
            return a
        }, [model])


        return <Suspense fallback={null}>
            <mesh position={[0.15, 3.25, -6.04]} onClick={handleClickScreen}>
                <planeGeometry args={[3.3, 2.5]} />
                <meshBasicMaterial map={texture} toneMapped={false} />
            </mesh>
        </Suspense>
    })

    return <div className="w-screen h-screen">
        <div className="fixed w-1/5 bg-white right-0 top-0 bottom-0">
            <div className="h-10 flex justify-between mx-4 my-4">
                <div className="flex justify-center items-center">
                    <img className="w-10 h-10 rounded-full object-cover" src={data?.photoURL} alt="Avatar" />
                    <p className="ml-2 font-medium">{data?.displayName}</p>
                </div>
                <button onClick={handleSignOut} className="flex justify-center items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700 font-medium rounded-xl text-sm px-5 py-2.5 text-center">
                    Đăng xuất
                </button>
            </div>
            <div className="border-t border-b-gray-950 border-solid px-4 py-4">
                {dataUser[0]?.role === "TEACHER" &&
                    <div className="flex items-center pb-4">
                        <button onClick={() => setOpenModal(true)} className="mr-2 flex justify-center items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700 font-medium rounded-lg text-sm p-2 text-center">
                            <FaPlus className="text-base" />
                        </button>
                        <div className="cursor-pointer hover:text-blue-600 font-medium" onClick={() => setOpenModal(true)}>Tạo phòng</div>
                    </div>
                }
                <div className="flex items-center pb-2">
                    <button className="mr-2 flex justify-center items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700 font-medium rounded-lg text-sm p-2 text-center">
                        <RiDropdownList className="text-base" />
                    </button>
                    <div className="font-medium">Danh sách phòng</div>
                </div>
                <ul className="font-medium">
                    {allRoom && allRoom.map(room => <Link key={room.id} to={`/meeting?room=${room.id}`}>
                        <li
                            onClick={() => handleSelectedRoom(room.id)}
                            className={`flex items-center ml-6 py-1 hover:text-blue-600 hover:font-medium cursor-pointer ${room?.id === selectedRoomId && `text-blue-600 font-medium`}`}
                        >
                            <BsDot /> Phòng: {room?.name} {room?.id === selectedRoomId && <TfiControlBackward className="ml-1 font-semibold" />}
                        </li></Link>)}
                </ul>
            </div>
        </div>
        <div className="fixed w-4/5 h-screen left-0 top-0 bottom-0">
            <div className="z-10 fixed w-96 h-96 left-6 bottom-6 bg-white rounded-3xl text-black">
                <p className="mx-5 my-3 font-medium">Phòng {selectedRoom?.name}</p>
                <div className="flex items-center border-t border-b-gray-950 border-solid px-4 py-4 font-medium">
                    Thành viên: {!!location.search === true && members.map(member => <img key={member?.uid} className="w-9 h-9 rounded-full object-cover ml-2" src={member?.photoURL} alt="Avatar" />)}
                </div>
                <div className="overflow-auto h-52 flex flex-col">
                    {allMess.map(mess => <div ref={refMess} key={mess?.id} className="flex items-center mb-2">
                        <img className="w-9 h-9 rounded-full object-cover mx-2" src={mess?.photoURL} alt="Avatar" />
                        <div>
                            <div className="flex items-center">
                                <p className="mr-2 font-medium">{mess?.displayName}</p>
                                <p className="font-light">{formatDate(mess?.createdAt?.seconds)}</p>
                            </div>
                            <p className="font-light">{mess?.text}</p>
                        </div>
                    </div>)}
                </div>
                <div className="w-full flex items-center absolute bottom-2 px-2">
                    <input className="w-full font-light border border-bborder-b-gray-950 rounded-3xl px-4 py-2" type="text" placeholder="Nhập gì đó..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <IoSend onClick={handleSubmit} className="w-10 text-xl cursor-pointer text-blue-600" />
                </div>
            </div>
            <div className="z-10 absolute right-6 bottom-6 font-medium text-sm text-white">
                {outChair && <button onClick={handeOutChair} className="mr-6 rounded-xl px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700">
                    Rời ghế
                </button>}
                {selectedRoomId && <button onClick={handleOutRoom} className="rounded-xl px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700">
                    Rời phòng
                </button>}
            </div>
            <Canvas shadows>
                <Suspense fallback={<Load />}>
                    <Environment
                        // preset='park' blur={0}
                        background={"only"} files={process.env.PUBLIC_URL + 'textures/rotes_rathaus_8k.hdr'} />
                    <PerspectiveCamera makeDefault fov={70}
                        position={cameraPOV}
                    />
                    <OrbitControls
                        target={orbitCamera}
                        // target={[0.15, 3.25, -6.04]}
                        maxPolarAngle={Math.PI * 0.5}
                        minPolarAngle={Math.PI * 0.5}
                        enableZoom={false}
                    />
                    <Room />
                    <Chair />
                    <Wall />
                    <Floor />
                    <PlaneVideo url={process.env.PUBLIC_URL + 'videos/mv.mp4'} />
                </Suspense>
                <ambientLight intensity={0.5} />
                {/* <axesHelper args={[100]} /> */}
                <LightWithHelper />
            </Canvas>
            {!selectedRoomId &&
                <div className="z-20 absolute right-0 left-0 top-0 bottom-0 bg-black opacity-60">
                    <div className="flex flex-col items-center justify-center h-full text-white font-semibold text-xl">
                        Vui lòng chọn 1 phòng để vào
                    </div>
                </div>
            }
        </div>
        <Modal />
        <Transition.Root show={openSelectChair} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenSelectChair}>
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-4">
                                    <div className="flex items-start justify-between text-lg">
                                        <div className="font-medium">Ngồi vào nghế</div>
                                        <button onClick={() => setOpenSelectChair(false)}><IoClose /></button>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
                                        onClick={handlSelectChair}
                                    >
                                        Xác nhận
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setOpenSelectChair(false)}
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
    </div>
}

export default MeetingRoom;