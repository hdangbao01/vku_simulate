import Header from "~/components/Header";
import { Fragment, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useLoader } from '@react-three/fiber'
import { MeshStandardMaterial, Vector3 } from 'three';
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Load from "~/components/Load";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { folder, useControls, } from "leva";
import { useLeva } from "~/hook/useLeva";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "~/firebase/config";
import { formatRelative } from "date-fns";
import { BsDot } from "react-icons/bs";

function LightWithHelper() {
    const lightRef = useRef();
    // const { scene } = useThree();

    // useEffect(() => {
    //     if (lightRef.current) {
    //         const helper = new DirectionalLightHelper(lightRef.current, 2);
    //         scene.add(helper);

    //         return () => {
    //             if (helper) {
    //                 scene.remove(helper);
    //             }
    //         };
    //     }
    // }, [scene]);

    return (
        <>
            <directionalLight ref={lightRef} color="white" intensity={5} position={[0, 5, 0]} castShadow />
        </>
    );
}

function Design() {
    const [chairObjs, setChairObjs] = useState([]);
    const [tableObjs, setTableObjs] = useState([]);
    const [boardObjs, setBoardObjs] = useState([]);
    const [wallObjs, setWallObjs] = useState('');
    const [listRoom, setListRoom] = useState([])
    // const [wallObjs, setWallObjs] = useState('E7CBA9');
    // const [design, setDesign] = useState([]);
    const [openModal, setOpenModal] = useState(false)
    const cancelButtonRef = useRef(null)

    const urf = window.location.href.split("=")[1]

    const room = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/empty_room.glb')
    const wall_room = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/wall_room.glb')
    const floor = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/floor_room.glb')
    const board = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/board.glb')
    const chair = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/chair.glb')
    const table = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/table.glb')

    useEffect(() => {
        if (!room) return;
        if (!floor) return;
        if (!board) return;
        if (!table) return;

        room.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        floor.scene.traverse((child) => {
            if (child.isMesh) {
                child.receiveShadow = true;
            }
        });

        board.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        chair.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        table.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

    }, [room, floor, board, chair, table]);

    useEffect(() => {
        if (urf) {
            getDoc(doc(db, "objects", urf)).then(docSnap => {
                if (docSnap.exists()) {
                    let aC = []
                    let aT = []

                    const dataJB = JSON.parse(docSnap.data().board)
                    const dataJC = JSON.parse(docSnap.data().chairs)
                    const dataJT = JSON.parse(docSnap.data().tables)
                    const dataJW = docSnap.data().color

                    for (let index = 0; index < dataJC.length; index++) {
                        const dialScene = chair.scene.clone(true);
                        const dialProps = {
                            id: index + 1,
                            object: dialScene,
                            position: { x: dataJC[index]?.position.x, y: dataJC[index]?.position.z }
                        }
                        aC = ([...aC, dialProps])
                    }

                    for (let index = 0; index < dataJT.length; index++) {
                        const dialScene = table.scene.clone(true);
                        const dialProps = {
                            id: index + 1,
                            object: dialScene,
                            position: { x: dataJT[index]?.position.x, y: dataJT[index]?.position.z }
                        }
                        aT = ([...aT, dialProps])
                    }

                    setChairObjs(aC)
                    setTableObjs(aT)
                    setBoardObjs(dataJB)
                    setWallObjs(dataJW)
                } else {
                    console.log("No such document!");
                }
            })
        }
    }, [urf])

    useEffect(() => {
        const colRef = collection(db, "objects")

        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setListRoom(data)
        })

        return unsubscribe
    }, [])

    const handleAddTable = () => {
        const dialScene = table.scene.clone(true);

        const dialProps = {
            id: tableObjs.length + 1,
            object: dialScene
        }

        setTableObjs([...tableObjs, dialProps]);
    };

    const handleAddChair = () => {
        const dialScene = chair.scene.clone(true);

        const dialProps = {
            id: chairObjs.length + 1,
            object: dialScene
        }

        setChairObjs([...chairObjs, dialProps]);
    };

    const newDesign = () => {
        window.location.href = '/design'
    }

    let arrChair = []
    const Chair = ({ dialProps }) => {
        const refff = useRef()
        const { id, object, position } = dialProps

        const design = useControls("Ghe" + id, {
            ViTri: folder({
                x: { value: 0, min: -5, max: 5, step: 0.1 },
                z: { value: 0, min: -6, max: 6, step: 0.1 }
            }),
            Xoay: folder({
                rotate: { value: 0.01, min: 0.01, max: 6.29, step: 0.01 },
            })
        })

        if (refff.current) {
            const worldPosition = new Vector3();
            refff.current.getWorldPosition(worldPosition)
            arrChair[id - 1] = { position: { x: worldPosition.x, z: worldPosition.z } }
        }

        return <group>
            <mesh rotation={[0, design.rotate, 0]} position={[position ? position?.x : design.x, 0, position ? position?.y : design.z]}>
                <primitive ref={refff} object={object} />
            </mesh>
        </group>
    }

    let arrTable = []
    const Table = ({ dialProps }) => {
        const refff = useRef()
        const { id, object, position } = dialProps

        const design = useControls("Ban" + id, {
            ViTri: folder({
                x: { value: 0, min: -5, max: 5, step: 0.1 },
                z: { value: 0, min: -6, max: 6, step: 0.1 }
            }),
            Xoay: folder({
                rotate: { value: 0.01, min: 0.01, max: 6.29, step: 0.01 },
            })
        })

        if (refff.current) {
            const worldPosition = new Vector3();
            refff.current.getWorldPosition(worldPosition)
            arrTable[id - 1] = { position: { x: worldPosition.x, z: worldPosition.z } }
        }

        return <group>
            <mesh rotation={[0, design.rotate, 0]} position={[position ? position?.x : design.x, 0, position ? position?.y : design.z]}>
                <primitive ref={refff} object={object} />
            </mesh>
        </group>
    }

    let arrBoard = ""
    const Board = ({ boardObjs }) => {
        const { position } = boardObjs;
        const refff = useRef()

        const boarDesign = useControls("Bảng", {
            ViTri: folder({
                x: { value: 0, min: -4, max: 4, step: 0.1 },
                y: { value: 0, min: -1.5, max: 1, step: 0.1 },
            })
        })

        if (refff.current) {
            const worldPosition = new Vector3();
            refff.current.getWorldPosition(worldPosition)
            arrBoard = { position: { x: worldPosition.x, z: worldPosition.y } }
        }

        return <mesh ref={refff} position={[position ? position?.x : boarDesign.x, position ? position?.z : boarDesign.y, 0]}>
            <primitive object={board.scene} />
        </mesh>
    }

    let arrWall
    const Wall = ({ wallObjs }) => {
        const colorW = `#${wallObjs}`

        const refff = useRef()
        const typh = useControls('Màu Tường', {
            color: colorW
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
        const materialWall = new MeshStandardMaterial({ ...typh });

        useEffect(() => {
            if (!wall_room) return;

            wall_room.scene.traverse((child) => {
                if (child.isMesh) {
                    child.receiveShadow = true;
                    child.material = materialWall;
                }
            });
        }, [materialWall])

        if (refff.current) {
            arrWall = refff.current.material.color.getHexString()
        }

        return <mesh ref={refff} material={materialWall}>
            <primitive object={wall_room.scene} />
            {/* <meshBasicMaterial /> */}
        </mesh>
    }

    const handleSave = async () => {
        let newDataChair = JSON.stringify(arrChair)
        let newDataTable = JSON.stringify(arrTable)
        let newDataBoard = JSON.stringify(arrBoard)
        console.log({
            color: arrWall,
            board: newDataBoard,
            chairs: newDataChair,
            tables: newDataTable
        });
        try {
            const docRef = await addDoc(collection(db, "objects"), {
                color: arrWall ? arrWall : 'E7CBA9',
                board: newDataBoard,
                chairs: newDataChair,
                tables: newDataTable,
                createdAt: serverTimestamp()
            });
            console.log("Document written with ID: ", docRef);
            alert("Lưu thành công!")
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const formatDate = (seconds) => {
        let formattedDate = ''

        if (seconds) {
            formattedDate = formatRelative(new Date(seconds * 1000), new Date())

            formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
        }

        return formattedDate
    }

    return (
        <div className='w-full h-full relative'>
            <Header />
            <Canvas shadows>
                <Suspense fallback={<Load />}>
                    <Environment
                        // preset='park' blur={0}
                        background={"only"} files={process.env.PUBLIC_URL + 'textures/rotes_rathaus_8k.hdr'} />
                    <PerspectiveCamera makeDefault fov={70}
                        position={[0, 0, 4]}
                    />
                    <OrbitControls
                        target={[0, 3, 0]}
                        maxPolarAngle={Math.PI * 0.5}
                        minPolarAngle={Math.PI * 0.5}
                        enableZoom={true}
                        maxZoom={2}
                        minZoom={1}
                    />
                    <mesh>
                        <primitive object={room.scene} />
                        <meshBasicMaterial />
                    </mesh>
                    {/* <mesh material={materialWall}>
                        <primitive object={wall_room.scene} />
                        <meshBasicMaterial />
                    </mesh> */}
                    {urf ? wallObjs && <Wall wallObjs={wallObjs} /> : <Wall wallObjs='E7CBA9' />}
                    <mesh>
                        <primitive object={floor.scene} />
                        <meshBasicMaterial />
                    </mesh>
                    {chairObjs.map((obj) => (
                        <Chair key={obj.object + obj.id} dialProps={obj} />
                    ))}
                    {tableObjs.map((obj) => (
                        <Table key={obj.object + obj.id} dialProps={obj} />
                    ))}
                    {/* <Chair position={[chair1?.x, chair1?.y, chair1?.z]} rotate={chair1?.rotate} /> */}
                    {/* <Table position={[table1?.x, table1?.y, table1?.z]} rotate={table1?.rotate} /> */}
                    <Board boardObjs={boardObjs} />

                </Suspense>

                <ambientLight intensity={0.5} />
                {/* <axesHelper args={[100]} /> */}
                <LightWithHelper />
            </Canvas>
            <div className='flex flex-col fixed top-6 left-6'>
                {urf && <button onClick={newDesign} className='text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700 font-medium rounded-xl text-base px-5 py-2.5 text-center shadow-bx mb-4'>
                    Thiết kế mới
                </button>}
                {!urf && <button onClick={handleAddTable} className='text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700 font-medium rounded-xl text-base px-5 py-2.5 text-center shadow-bx mb-4'>Thêm bàn mới</button>}
                {!urf && <button onClick={handleAddChair} className='text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700 font-medium rounded-xl text-base px-5 py-2.5 text-center shadow-bx'>Thêm ghế mới</button>}
            </div>
            <div className='flex fixed bottom-6 left-6'>
                <button onClick={() => {
                    setOpenModal(true)
                }
                } className='text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700 font-medium rounded-xl text-base px-5 py-2.5 text-center shadow-bx mr-4'>Danh sách thiết kế</button>
                {!urf && <button onClick={handleSave} className='text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700 font-medium rounded-xl text-base px-5 py-2.5 text-center shadow-bx'>Lưu thiết kế</button>}
            </div>
            <Transition.Root show={openModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenModal}>
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
                                <Dialog.Panel className="flex flex-col justify-between relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl h-96">
                                    <div className="bg-white px-4 pb-4 pt-4">
                                        <div className="flex items-start justify-between text-lg">
                                            <div className="font-medium">Tất cả phòng thiết kế</div>
                                            <button onClick={() => setOpenModal(false)}><IoClose /></button>
                                        </div>
                                        <div className="mt-4 h-60 overflow-y-scroll">
                                            {listRoom.map((iRoom, i) => {
                                                return <div key={iRoom.id} className="ml-6 mb-4">
                                                    <p className="flex items-center">
                                                        <BsDot /> Thiết kế: <a className="mx-2" href={`/design?room=${iRoom.id}`}>
                                                            {iRoom.id}
                                                        </a> - {formatDate(iRoom?.createdAt?.seconds)}
                                                    </p>
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setOpenModal(false)}
                                            ref={cancelButtonRef}
                                        >
                                            Thoát
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    )
}

export default Design;