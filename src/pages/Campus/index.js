import { Physics } from '@react-three/cannon';
import { Environment, OrbitControls, PerspectiveCamera, useAnimations } from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { collection, onSnapshot } from 'firebase/firestore';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimationMixer, Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Header from '~/components/Header';
import Land from '~/components/Land';
import Lecture from '~/components/Lecture';
import Load from '~/components/Load';
import { db } from '~/firebase/config';

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
    const { camera, scene } = useThree();

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
    const [allObject, setAllObject] = useState([]);
    const [nameObject, setNameObject] = useState('');
    const [objectShow, setObjectShow] = useState({});
    const [posObject, setPosObject] = useState([]);
    const [togleZoom, setTogleZoom] = useState(false);
    const camRef = useRef()
    const controlsRef = useRef();
    const canvasRef = useRef()

    useEffect(() => {
        // Add Document
        const colRef = collection(db, "models")
        // Real Time Database
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setAllObject(data)
        })

        return unsubscribe
    }, [])

    function seenHandle() {
        if (thirdPerson) setCameraPosition([-10, 50, 110 + Math.random() * 0.01]);
        setThirdPerson(!thirdPerson);
    }

    function Character() {
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

            camRef.current.position.lerp(new Vector3(0, 0, 50), 0.025)

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

            // state.camera.position.lerp(new Vector3(0, 0, 50),
            //     0.25
            // );

            // Theo dõi vị trí của player
            // const [x, y, z] = chaRef.current.position.toArray();
            // camRef.current.position.set(chaRef.current.position.x, chaRef.current.position.y + 1, chaRef.current.position.z + 4); // Đặt vị trí của camera sau player
            // camRef.current.lookAt(x, y, z); // Đặt hướng nhìn của camera về player

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
            <mesh ref={chaRef} position={[0, 0, 50]}>
                <primitive object={gltf.scene} />
            </mesh>
        );
    }

    const handlOpenModal = (e) => {
        const namename = e?.object?.name
        if (e?.object?.name) {
            const worldPosition = new Vector3();
            const a = e.object.getWorldPosition(worldPosition);
            setPosObject([a.x, a.y, a.z])
            setNameObject(e?.object?.name)
            // setOpenModal(true)

            const check = allObject.find((ob) => namename.includes(ob.cube))

            setObjectShow(check);

            console.log(check);
        }
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
                        <Lecture rotation={false}
                            onClick={handlOpenModal}
                            posObject={posObject}
                            nameObject={nameObject}
                            setNameObject={setNameObject}
                            objectShow={objectShow}
                        />
                        <Tree />
                        {/* <Car thirdPerson={thirdPerson} /> */}
                        {/* <Player thirdPerson={thirdPerson} /> */}
                        <Character />
                    </Suspense>
                </Physics>
                <ambientLight intensity={0.25} />
                <LightWithHelper />
            </Canvas>
            {nameObject && <div className='fixed bottom-6 left-6 z-20 m-6 w-60 bg-white p-4'>
                <img className='w-60 h-44 rounded-md object-cover' src={objectShow?.image} alt='object 3D' />
                <div>
                    <p className='font-semibold text-lg mt-3 mb-2'>
                        {objectShow?.name}
                    </p>
                    <p className='text-sm'>Thông tin: {objectShow?.description}</p>
                    {objectShow?.view && <Link to={'/room'}>
                        <p className='text-blue-600 underline'>
                            Xem phòng
                        </p>
                    </Link>}
                    <div className='flex flex-row-reverse'>
                        <button className='mt-2' onClick={() => setNameObject('')}>Tắt</button>
                    </div>
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
        </div>
    )
}

export default Room;