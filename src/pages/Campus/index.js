import { Dialog, Transition } from '@headlessui/react';
import { Physics } from '@react-three/cannon';
import { Environment, OrbitControls, PerspectiveCamera, useAnimations } from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Fragment, Suspense, useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { AnimationMixer, Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Header from '~/components/Header';
import Land from '~/components/Land';
import Lecture from '~/components/Lecture';
import Load from '~/components/Load';

function LightWithHelper() {
    const lightRef = useRef();

    return (
        <directionalLight ref={lightRef} color="white" intensity={1.5} position={[-70, 100, -100]} castShadow shadow-mapSize={[1024, 1024]}>
            <orthographicCamera attach={"shadow-camera"} args={[-150, 150, 150, -150]} />
        </directionalLight>
    );
}

const Tree = ({ rotation }) => {
    const gltf = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/tree_name.glb')

    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
        }
    });

    const sphereRef = useRef();

    useFrame(() => {
        if (rotation) {
            sphereRef.current.rotation.y -= 0.002;
        }
    });

    return (
        <mesh ref={sphereRef} castShadow>
            <primitive object={gltf.scene} />
        </mesh>
    )
}

const Player = ({ thirdPerson }) => {
    const playerRef = useRef();
    const { camera } = useThree();

    const [move, setMove] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
    });
    const handleKeyDown = (event) => {
        switch (event.key) {
            case 'w':
                setMove((prev) => ({ ...prev, forward: true }));
                break;
            case 's':
                setMove((prev) => ({ ...prev, backward: true }));
                break;
            case 'a':
                setMove((prev) => ({ ...prev, left: true }));
                break;
            case 'd':
                setMove((prev) => ({ ...prev, right: true }));
                break;
            default:
                break;
        }
    };
    const handleKeyUp = (event) => {
        switch (event.key) {
            case 'w':
                setMove((prev) => ({ ...prev, forward: false }));
                break;
            case 's':
                setMove((prev) => ({ ...prev, backward: false }));
                break;
            case 'a':
                setMove((prev) => ({ ...prev, left: false }));
                break;
            case 'd':
                setMove((prev) => ({ ...prev, right: false }));
                break;
            default:
                break;
        }
    };
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    useFrame(() => {
        if (move.forward) playerRef.current.position.z -= 0.1;
        if (move.backward) playerRef.current.position.z += 0.1;
        if (move.left) playerRef.current.position.x -= 0.1;
        if (move.right) playerRef.current.position.x += 0.1;
    });

    useEffect(() => {
        camera.position.set(0, 2, 5); // Thiết lập vị trí ban đầu của camera
    }, [camera]);

    useFrame(() => {
        if (!thirdPerson) return;
        // Theo dõi vị trí của player
        const [x, y, z] = playerRef.current.position.toArray();
        camera.position.set(x, y + 2, z + 5); // Đặt vị trí của camera sau player
        // camera.lookAt(x, y, z); // Đặt hướng nhìn của camera về player

        const direction = new Vector3(0, 0, -1);
        playerRef.current.getWorldDirection(direction);
        camera.lookAt(x + direction.x, y + direction.y, z + direction.z);
    });

    return (
        <mesh ref={playerRef}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="blue" />
        </mesh>
    );
};

function Room() {
    const [thirdPerson, setThirdPerson] = useState(false);
    const [cameraPosition, setCameraPosition] = useState([-10, 50, 110]);
    const [nameObject, setNameObject] = useState('');
    const [togleZoom, setTogleZoom] = useState(false);
    const camRef = useRef()
    const controlsRef = useRef();
    const cancelButtonRef = useRef(null)
    const canvasRef = useRef()

    function seenHandle() {
        if (thirdPerson) setCameraPosition([-10, 50, 110 + Math.random() * 0.01]);
        setThirdPerson(!thirdPerson);
    }

    function Character() {
        // const { camera, scene } = useThree();
        // const chaRef = useRef()
        const chaRef = useRef()

        const gltf = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/Soldier.glb')
        const gltfAnimations = gltf.animations
        const mixer = new AnimationMixer(gltf.scene)
        const animationsMap = new Map()
        gltfAnimations.filter(a => a.name != 'TPose').forEach((a) => {
            animationsMap.set(a.name, mixer.clipAction(a))
        })
        const { actions } = useAnimations(gltfAnimations, chaRef)
        useEffect(() => {
            if (!gltf) return;

            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });
        }, [gltf]);
        // CONTROL KEYS
        const [keysPressed, setKeysPressed] = useState({});
        const speed = 0.1
        const handleKeyDown = (event) => {
            setKeysPressed((prevKeys) => ({
                ...prevKeys,
                [event.key.toLowerCase()]: true,
            }));
        };
        const handleKeyUp = (event) => {
            setKeysPressed((prevKeys) => ({
                ...prevKeys,
                [event.key.toLowerCase()]: false,
            }));
        };
        useEffect(() => {
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('keyup', handleKeyUp);
            };
        }, []);
        useFrame(() => {
            if (keysPressed['w']) {
                actions.Walk.play()
                chaRef.current.position.z -= speed;
            }
            if (keysPressed['s']) {
                actions.Walk.play()
                chaRef.current.position.z += speed;
            }
            if (keysPressed['a']) {
                actions.Walk.play()
                chaRef.current.position.x -= speed;
            }
            if (keysPressed['d']) {
                actions.Walk.play()
                chaRef.current.position.x += speed;
            }
            if (!keysPressed['w'] && !keysPressed['s'] && !keysPressed['a'] && !keysPressed['d']) {
                actions.Walk.stop()
                actions.Idle.play()
            }
        });
        var directionOffset = (keysPressed) => {
            var directionOffset = 0 // w

            if (keysPressed['w']) {
                if (keysPressed['a']) {
                    directionOffset = Math.PI / 4 // w+a
                } else if (keysPressed['d']) {
                    directionOffset = - Math.PI / 4 // w+d
                }
            } else if (keysPressed['s']) {
                if (keysPressed['a']) {
                    directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
                } else if (keysPressed['d']) {
                    directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
                } else {
                    directionOffset = Math.PI // s
                }
            } else if (keysPressed['a']) {
                directionOffset = Math.PI / 2 // a
            } else if (keysPressed['d']) {
                directionOffset = - Math.PI / 2 // d
            }

            return directionOffset
        }
        // CAMERA
        useFrame((state) => {
            if (!thirdPerson) return;

            let rotateAngle = new Vector3(0, 1, 0)
            let rotateQuarternion = new Quaternion()
            let walkDirection = new Vector3(0, 0, -1)
            let cameraTarget = new Vector3(0, 0, 0)

            var angleYCameraDirection = Math.atan2(
                (camRef.current.position.x - chaRef.current.position.x),
                (camRef.current.position.z - chaRef.current.position.z))

            var directionOffsetValue = directionOffset(keysPressed)

            rotateQuarternion.setFromAxisAngle(rotateAngle, angleYCameraDirection + directionOffsetValue)
            chaRef.current.quaternion.rotateTowards(rotateQuarternion, 0.2)

            camRef.current.getWorldDirection(walkDirection)
            // walkDirection.y = 0
            walkDirection.normalize()
            walkDirection.applyAxisAngle(rotateAngle, directionOffsetValue)

            // camera.position.lerp(
            //     newPosition.add(new Vector3(0, 2, 4).clone().applyQuaternion(rotateQuarternion)),
            //     0.25
            // );

            // Theo dõi vị trí của player
            // const [x, y, z] = chaRef.current.position.toArray();
            // camRef.current.position.set(chaRef.current.position.x, chaRef.current.position.y + 1, chaRef.current.position.z + 4); // Đặt vị trí của camera sau player
            // camRef.current.lookAt(x, y, z); // Đặt hướng nhìn của camera về playerw

            camRef.current.position.x = chaRef.current.position.x
            camRef.current.position.y = chaRef.current.position.y + 2
            camRef.current.position.z = chaRef.current.position.z + 4

            cameraTarget.x = camRef.current.position.x
            cameraTarget.y = camRef.current.position.y
            cameraTarget.z = camRef.current.position.z
            controlsRef.current.target = cameraTarget

            // const direction = new Vector3(0, 0, -1);
            // chaRef.current.getWorldDirection(direction);
            // state.camera.lookAt(chaRef.current.position.x + direction.x, chaRef.current.position.y + direction.y, chaRef.current.position.z + direction.z);
        });

        return (
            <mesh ref={chaRef} position={[0, 0, 20]}>
                <primitive object={gltf.scene} />
            </mesh>
        );
    }

    const [opeModal, setOpenModal] = useState(false)

    // const textFollow = useRef(null)

    const handlOpenModal = (e) => {
        console.log(e?.object?.name);
        if (e?.object?.name) {
            setNameObject(e?.object?.name)
            // setOpenModal(true)
        }

        // const followText = textFollow.current
        // const boxPos = new Vector3()

        // const boxPosOff = new Vector3()
        // const Y_AXIS = new Vector3(0, 1, 0)

        // boxPosOff.copy(e?.object?.position)
        // boxPosOff.sub(camRef.current.position)
        // boxPosOff.normalize()
        // boxPosOff.applyAxisAngle(Y_AXIS, -Math.PI / 2)
        // boxPosOff.multiplyScalar(0.5)
        // boxPosOff.y = 1.5

        // boxPos.setFromMatrixPosition(e?.object?.matrixWorld)
        // // boxPos.add(boxPosOff)
        // boxPos.project(camRef.current)
        // const widthHafl = canvasRef.current.width / 2
        // const heightHafl = canvasRef.current.height / 2
        // const rect = canvasRef.current.getBoundingClientRect()
        // boxPos.x = rect.left + (boxPos.x * widthHafl) + widthHafl
        // boxPos.y = rect.top + (boxPos.y * heightHafl) + heightHafl
        // followText.style.top = `${boxPos.y}px`
        // followText.style.left = `${boxPos.x}px`
        // console.log(canvasRef.current);
    }

    const handlClickCanvas = (e) => {
        console.log(e);
    }

    return (
        <div className='w-full h-full relative'>
            <Header />
            <Canvas ref={canvasRef} onClick={handlClickCanvas} shadows>
                <Physics broadphase="SAP" gravity={[0, -2.6, 0]}>
                    <Suspense fallback={<Load />}>
                        <Environment preset='lobby' background={"only"} blur={1} />
                        <PerspectiveCamera ref={camRef} makeDefault fov={70} position={cameraPosition} />
                        {/* {!thirdPerson && (
                            <OrbitControls
                                ref={controlsRef}
                                target={[0, 0, 0]}
                                maxPolarAngle={Math.PI * 0.5}
                                autoRotate={false} autoRotateSpeed={-1.5}
                            // enableZoom={false}
                            />
                        )} */}
                        <OrbitControls
                            ref={controlsRef}
                            target={[0, 0, 0]}
                            maxPolarAngle={Math.PI * 0.5}
                            autoRotate={false} autoRotateSpeed={-1.5}
                        />
                        <Land rotation={false} />
                        <Lecture rotation={false} onClick={handlOpenModal} />
                        <Tree />
                        {/* <Car thirdPerson={thirdPerson} /> */}
                        {/* <Player thirdPerson={thirdPerson} /> */}
                        <Character />
                    </Suspense>
                </Physics>
                <ambientLight intensity={0.25} />
                <LightWithHelper />
                {/* <Stats /> */}
            </Canvas>
            {/* <div ref={textFollow} className='fixed top-40 left-10 z-20 m-6 w-60 h-96 bg-white p-4'>
                <img className='w-60 h-44 rounded-md object-cover' src='https://lh5.googleusercontent.com/p/AF1QipM8_V4zD9m2JKUFXDjtKh_Adso1MxNYpz9IN9BE=s435-k-no' alt='object 3D' />
                <div>
                    <p className='font-semibold text-lg my-4'>
                        Trung tâm sinh viên
                    </p>
                    <p className='text-sm'>Thông tin: Nơi diễn ra các hoạt động dành cho sinh viên
                        (Các sự kiện, cuộc thi, tiết học thể dục)</p>
                </div>
            </div> */}
            {nameObject.includes("887") && <div className='fixed bottom-6 left-6 z-20 m-6 w-60 h-96 bg-white p-4'>
                <img className='w-60 h-44 rounded-md object-cover' src='https://xdcs.cdnchinhphu.vn/446259493575335936/2023/8/22/vku-1692719013676637353630.jpg' alt='object 3D' />
                <div>
                    <p className='font-semibold text-lg my-4'>
                        Trung tâm hành chính
                    </p>
                    <p className='text-sm'>Thông tin: Toà nhà trung tâm của nhà trường</p>
                    <button className='absolute right-4 bottom-2' onClick={() => setNameObject('')}>Tắt</button>
                </div>
            </div>}
            {nameObject.includes("038") && <div className='fixed bottom-6 left-6 z-20 m-6 w-60 h-96 bg-white p-4'>
                <img className='w-60 h-44 rounded-md object-cover' src='https://lh5.googleusercontent.com/p/AF1QipM8_V4zD9m2JKUFXDjtKh_Adso1MxNYpz9IN9BE=s435-k-no' alt='object 3D' />
                <div>
                    <p className='font-semibold text-lg my-4'>
                        Trung tâm sinh viên
                    </p>
                    <p className='text-sm'>Thông tin: Nơi diễn ra các hoạt động dành cho sinh viên
                        (Các sự kiện, cuộc thi, tiết học thể dục)</p>
                    <Link to={'/center'}>
                        <p className='text-blue-600'>
                            Xem phòng
                        </p>
                    </Link>
                    <button className='absolute right-4 bottom-2' onClick={() => setNameObject('')}>Tắt</button>
                </div>
            </div>}
            {nameObject.includes("1298") && <div className='fixed bottom-6 left-6 z-20 m-6 w-60 h-96 bg-white p-4'>
                <img className='w-60 h-44 rounded-md object-cover' src='https://lh5.googleusercontent.com/p/AF1QipNAtTx4CzUzdBdoJBx6xK9ZsWviZeTyAmkW__cK=w203-h135-k-no' alt='object 3D' />
                <div>
                    <p className='font-semibold text-lg my-4'>
                        Viện eSTI & Thư viện
                    </p>
                    <p className='text-sm'>Thông tin: Thư viện và học tập, nghiên cứu dành cho sinh viên</p>
                    <button className='absolute right-4 bottom-2' onClick={() => setNameObject('')}>Tắt</button>
                </div>
            </div>}
            {nameObject.includes("082") && <div className='fixed bottom-6 left-6 z-20 m-6 w-60 h-96 bg-white p-4'>
                <img className='w-60 h-44 rounded-md object-cover' src='https://lh5.googleusercontent.com/p/AF1QipPPL_oBUCsY6HP_Os33FbRbNafCru5-WyOGZ9lx=s452-k-no' alt='object 3D' />
                <div>
                    <p className='font-semibold text-lg my-4'>
                        Giảng đường khu A
                    </p>
                    <p className='text-sm'>Thông tin: Dãy phòng học lý thuyết và phòng thực hành</p>
                    <p className='text-sm'>Gồm 3 tầng và 2 dãy phòng</p>
                    <Link to={'/room'}>
                        <p className='text-blue-600'>
                            Xem phòng học
                        </p>
                    </Link>
                    <button className='absolute right-4 bottom-2' onClick={() => setNameObject('')}>Tắt</button>
                </div>
            </div>}
            {nameObject.includes("053") && <div className='fixed bottom-6 left-6 z-20 m-6 w-60 h-96 bg-white p-4'>
                <img className='w-60 h-44 rounded-md object-cover' src='https://lh5.googleusercontent.com/p/AF1QipPPL_oBUCsY6HP_Os33FbRbNafCru5-WyOGZ9lx=s452-k-no' alt='object 3D' />
                <div>
                    <p className='font-semibold text-lg my-4'>
                        Giảng đường khu B
                    </p>
                    <p className='text-sm'>Thông tin: Dãy phòng học lý thuyết và phòng thực hành</p>
                    <p className='text-sm'>Gồm 3 tầng và 2 dãy phòng</p>
                    <Link to={'/room'}>
                        <p className='text-blue-600'>
                            Xem phòng học
                        </p>
                    </Link>
                    <button className='absolute right-4 bottom-2' onClick={() => setNameObject('')}>Tắt</button>
                </div>
            </div>}
            {nameObject.includes("1203") && <div className='fixed bottom-6 left-6 z-20 m-6 w-60 h-96 bg-white p-4'>
                <img className='w-60 h-44 rounded-md object-cover' src='https://lh5.googleusercontent.com/p/AF1QipPPL_oBUCsY6HP_Os33FbRbNafCru5-WyOGZ9lx=s452-k-no' alt='object 3D' />
                <div>
                    <p className='font-semibold text-lg my-4'>
                        Trung tâm, Văn phòng, Giàng đường khu E
                    </p>
                    <p className='text-sm'>Thông tin: Gồm 3 tầng và 2 dãy phòng</p>
                    <button className='absolute right-4 bottom-2' onClick={() => setNameObject('')}>Tắt</button>
                </div>
            </div>}
            {nameObject.includes("1089") && <div className='fixed bottom-6 left-6 z-20 m-6 w-60 h-96 bg-white p-4'>
                <img className='w-60 h-44 rounded-md object-cover' src='https://lh5.googleusercontent.com/p/AF1QipPPL_oBUCsY6HP_Os33FbRbNafCru5-WyOGZ9lx=s452-k-no' alt='object 3D' />
                <div>
                    <p className='font-semibold text-lg my-4'>
                        Phòng Khoa khu D
                    </p>
                    <p className='text-sm'>Thông tin: Gồm 3 tầng và 2 dãy phòng</p>
                    <button className='absolute right-4 bottom-2' onClick={() => setNameObject('')}>Tắt</button>
                </div>
            </div>}
            {nameObject.includes("1293") && <div className='fixed bottom-6 left-6 z-20 m-6 w-60 h-96 bg-white p-4'>
                <img className='w-60 h-44 rounded-md object-cover' src='https://lh5.googleusercontent.com/p/AF1QipPPL_oBUCsY6HP_Os33FbRbNafCru5-WyOGZ9lx=s452-k-no' alt='object 3D' />
                <div>
                    <p className='font-semibold text-lg my-4'>
                        Giảng đường khu C
                    </p>
                    <p className='text-sm'>Thông tin: Gồm 2 tầng và dãy phòng lớn</p>
                    <button className='absolute right-4 bottom-2' onClick={() => setNameObject('')}>Tắt</button>
                </div>
            </div>}
            {nameObject.includes("Cylinder") && <div className='fixed bottom-6 left-6 z-20 m-6 w-60 h-96 bg-white p-4'>
                <img className='w-60 h-44 rounded-md object-cover' src='https://lh5.googleusercontent.com/p/AF1QipNhBLUk9BnkgvTTHbLUCp1784X-yYclF6zMTdB4=s508-k-no' alt='object 3D' />
                <div>
                    <p className='font-semibold text-lg my-4'>
                        Hội trường tròn
                    </p>
                    <p className='text-sm'>Thông tin: Nơi diễn ra các buổi ngoại khoá, Seminar</p>
                    <Link to={'/round'}>
                        <p className='text-blue-600'>
                            Xem hội trường
                        </p>
                    </Link>
                    <button className='absolute right-4 bottom-2' onClick={() => setNameObject('')}>Tắt</button>
                </div>
            </div>}
            {nameObject.includes("Circle") && <div className='fixed bottom-6 left-6 z-20 m-6 w-60 h-96 bg-white p-4'>
                <img className='w-60 h-44 rounded-md object-cover' src='https://lh5.googleusercontent.com/p/AF1QipPfwOYotPeycLeLjOECs5Dp8RQDXw4moytGFCi1=s438-k-no' alt='object 3D' />
                <div>
                    <p className='font-semibold text-lg my-4'>
                        Đài phun nước
                    </p>
                    <p className='text-sm'>Thông tin: Nằm ở trung tâm khuôn viên trường</p>
                    <button className='absolute right-4 bottom-2' onClick={() => setNameObject('')}>Tắt</button>
                </div>
            </div>}
            {nameObject.includes("039") && <div className='fixed bottom-6 left-6 z-20 m-6 w-60 h-96 bg-white p-4'>
                <img className='w-60 h-44 rounded-md object-cover' src='https://lh5.googleusercontent.com/p/AF1QipPPL_oBUCsY6HP_Os33FbRbNafCru5-WyOGZ9lx=s452-k-no' alt='object 3D' />
                <div>
                    <p className='font-semibold text-lg my-4'>
                        Khu Ký túc xá
                    </p>
                    <p className='text-sm'>Thông tin: Gồm 3 tầng và 1 dãy phòng</p>
                    <button className='absolute right-4 bottom-2' onClick={() => setNameObject('')}>Tắt</button>
                </div>
            </div>}
            <div className='w-1/4 fixed top-6 left-6 shadow-bx bg-white'>
                <img className='w-full' src={require('~/assets/images/mapp.jpg')} alt='Map-VKU'
                    onClick={() => setTogleZoom(true)}
                />
            </div>
            {togleZoom && <div className='z-30 fixed top-0 bottom-0 right-0 left-0 bg-black' onClick={() => setTogleZoom(false)}>
                <img className='w-11/12 h-11/12' src={require('~/assets/images/mapp.jpg')} alt='Map-VKU'
                    onClick={() => setTogleZoom(false)}
                />
            </div>}
            {thirdPerson ?
                <div className='fixed top-6 right-6 shadow-bx px-8 py-4 bg-white rounded-3xl font-medium'>
                    <p className='text-xl font-semibold'>Điều khiển</p>
                    <p>w : tiến</p>
                    <p>a : đi sang trái</p>
                    <p>d : đi sang phải</p>
                    <p>s : lùi</p>
                </div> : <></>}
            <button className='h-12 text-xl font-medium rounded-full fixed bottom-6 right-6 shadow-bx bg-white px-6'
                onClick={seenHandle}
            >
                {thirdPerson ? 'Thoát' : 'Xem thực tế'}
            </button>
            <Transition.Root show={opeModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpenModal}>
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
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8">
                                    <div className="bg-white px-4 pb-4 pt-4">
                                        <div className="flex items-start justify-between text-lg">
                                            <div className="font-medium">Thông tin</div>
                                            <button onClick={() => setOpenModal(false)}><IoClose /></button>
                                        </div>
                                    </div>
                                    {nameObject.includes("887") &&
                                        <div className='m-6 flex w-header'>
                                            <img className='w-72 h-52 rounded-md object-cover mr-2' src='https://xdcs.cdnchinhphu.vn/446259493575335936/2023/8/22/vku-1692719013676637353630.jpg' alt='object 3D' />
                                            <div>
                                                <p className='font-semibold'>
                                                    Trung tâm hành chính
                                                </p>
                                                <p>Thông tin: </p>
                                            </div>
                                        </div>
                                    }
                                    {nameObject.includes("038") &&
                                        <div className='m-6 flex w-header'>
                                            <img className='w-72 h-52 rounded-md object-cover mr-4' src='https://lh5.googleusercontent.com/p/AF1QipM8_V4zD9m2JKUFXDjtKh_Adso1MxNYpz9IN9BE=s435-k-no' alt='object 3D' />
                                            <div>
                                                <p className='font-semibold'>
                                                    Trung tâm sinh viên
                                                </p>
                                                <p>Thông tin: Nơi diễn ra các hoạt động dành cho sinh viên
                                                    (Các sự kiện, cuộc thi, tiết học thể dục)</p>
                                            </div>
                                        </div>
                                    }
                                    {nameObject.includes("1298") &&
                                        <div className='m-6 flex w-header'>
                                            <img className='w-72 h-52 rounded-md object-cover mr-2' src='https://lh5.googleusercontent.com/p/AF1QipNAtTx4CzUzdBdoJBx6xK9ZsWviZeTyAmkW__cK=w203-h135-k-no' alt='object 3D' />
                                            <div>
                                                <p className='font-semibold'>
                                                    Viện eSTI & Thư viện
                                                </p>
                                                <p>Thông tin: Thư viện và học tập, nghiên cứu dành cho sinh viên</p>
                                            </div>
                                        </div>
                                    }
                                    {nameObject.includes("082") &&
                                        <div className='m-6 flex w-header'>
                                            <img className='w-72 h-52 rounded-md object-cover mr-2' src='https://lh5.googleusercontent.com/p/AF1QipPPL_oBUCsY6HP_Os33FbRbNafCru5-WyOGZ9lx=s452-k-no' alt='object 3D' />
                                            <div>
                                                <p className='font-semibold'>
                                                    Giảng đường khu A
                                                </p>
                                                <p>Thông tin: Dãy phòng học lý thuyết và phòng thực hành</p>
                                                <p>Gồm 3 tầng và 2 dãy phòng</p>
                                            </div>
                                        </div>
                                    }
                                    {nameObject.includes("053") &&
                                        <div className='m-6 flex w-header'>
                                            <img className='w-72 h-52 rounded-md object-cover mr-2' src='https://lh5.googleusercontent.com/p/AF1QipPPL_oBUCsY6HP_Os33FbRbNafCru5-WyOGZ9lx=s452-k-no' alt='object 3D' />
                                            <div>
                                                <p className='font-semibold'>
                                                    Giảng đường khu B
                                                </p>
                                                <p>Thông tin: Dãy phòng học lý thuyết và phòng thực hành</p>
                                                <p>Gồm 3 tầng và 2 dãy phòng</p>
                                            </div>
                                        </div>
                                    }
                                    {nameObject.includes("1293") &&
                                        <div className='m-6 flex w-header'>
                                            <img className='w-72 h-52 rounded-md object-cover mr-2' src='https://lh5.googleusercontent.com/p/AF1QipPPL_oBUCsY6HP_Os33FbRbNafCru5-WyOGZ9lx=s452-k-no' alt='object 3D' />
                                            <div>
                                                <p className='font-semibold'>
                                                    Giảng đường khu C
                                                </p>
                                                <p>Thông tin: Gồm 2 tầng và dãy phòng lớn</p>
                                            </div>
                                        </div>
                                    }
                                    {nameObject.includes("1089") &&
                                        <div className='m-6 flex w-header'>
                                            <img className='w-72 h-52 rounded-md object-cover mr-2' src='https://lh5.googleusercontent.com/p/AF1QipPPL_oBUCsY6HP_Os33FbRbNafCru5-WyOGZ9lx=s452-k-no' alt='object 3D' />
                                            <div>
                                                <p className='font-semibold'>
                                                    Phòng Khoa khu D
                                                </p>
                                                <p>Thông tin: Gồm 3 tầng và 2 dãy phòng</p>
                                            </div>
                                        </div>
                                    }
                                    {nameObject.includes("1203") &&
                                        <div className='m-6 flex w-header'>
                                            <img className='w-72 h-52 rounded-md object-cover mr-2' src='https://lh5.googleusercontent.com/p/AF1QipPPL_oBUCsY6HP_Os33FbRbNafCru5-WyOGZ9lx=s452-k-no' alt='object 3D' />
                                            <div>
                                                <p className='font-semibold'>
                                                    Trung tâm, Văn phòng, Giàng đường khu E
                                                </p>
                                                <p>Thông tin: Gồm 3 tầng và 2 dãy phòng</p>
                                            </div>
                                        </div>
                                    }
                                    {nameObject.includes("Cylinder") &&
                                        <div className='m-6 flex w-header'>
                                            <img className='w-72 h-52 rounded-md object-cover mr-2' src='https://lh5.googleusercontent.com/p/AF1QipNhBLUk9BnkgvTTHbLUCp1784X-yYclF6zMTdB4=s508-k-no' alt='object 3D' />
                                            <div>
                                                <p className='font-semibold'>
                                                    Hội trường tròn
                                                </p>
                                                <p>Thông tin: Nơi diễn ra các buổi ngoại khoá, Serminar</p>
                                            </div>
                                        </div>
                                    }
                                    {nameObject.includes("Circle") &&
                                        <div className='m-6 flex w-header'>
                                            <img className='w-72 h-52 rounded-md object-cover mr-2' src='https://lh5.googleusercontent.com/p/AF1QipPfwOYotPeycLeLjOECs5Dp8RQDXw4moytGFCi1=s438-k-no' alt='object 3D' />
                                            <div>
                                                <p className='font-semibold'>
                                                    Đài phun nước
                                                </p>
                                                <p>Thông tin: Nằm ở trung tâm khuôn viên trường</p>
                                            </div>
                                        </div>
                                    }
                                    {nameObject.includes("039") &&
                                        <div className='m-6 flex w-header'>
                                            <img className='w-72 h-52 rounded-md object-cover mr-2' src='https://lh5.googleusercontent.com/p/AF1QipPPL_oBUCsY6HP_Os33FbRbNafCru5-WyOGZ9lx=s452-k-no' alt='object 3D' />
                                            <div>
                                                <p className='font-semibold'>
                                                    Khu Ký túc xá
                                                </p>
                                                <p>Thông tin: Gồm 3 tầng và 1 dãy phòng</p>
                                            </div>
                                        </div>
                                    }
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

export default Room;