import { Physics } from '@react-three/cannon';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react';
import { DirectionalLightHelper } from 'three';
import Car from '~/components/Car';
import Header from '~/components/Header';
import Land from '~/components/Land';
import Lecture from '~/components/Lecture';
import Load from '~/components/Load';

function LightWithHelper() {
    const lightRef = useRef();
    const { scene } = useThree();

    useEffect(() => {
        if (lightRef.current) {
            const helper = new DirectionalLightHelper(lightRef.current, 5);
            scene.add(helper);

            return () => {
                if (helper) {
                    scene.remove(helper);
                }
            };
        }
    }, [scene]);

    return (
        <directionalLight ref={lightRef} color="white" position={[50, 50, 100]}
        />
    );
}

function Room() {
    const [thirdPerson, setThirdPerson] = useState(false);
    const [cameraPosition, setCameraPosition] = useState([-10, 50, 110]);

    function seenHandle() {
        if (thirdPerson) setCameraPosition([-10, 50, 110 + Math.random() * 0.01]);
        setThirdPerson(!thirdPerson);
    }

    // useEffect(() => {
    //     function seenHandle() {
    //         if (thirdPerson) setCameraPosition([-10, 50, 110 + Math.random() * 0.01]);
    //     }

    //     function outHandle() {
    //         setThirdPerson(!thirdPerson);
    //     }
    // }, [thirdPerson]);

    return (
        <div className='w-full h-full relative'>
            <Header />
            <Canvas>
                <Physics broadphase="SAP" gravity={[0, -2.6, 0]}>
                    {/* <SceneContainer posPerspectiveCamera={[-10, 50, 110]} autoRotate={false} /> */}

                    <Suspense fallback={<Load />}>
                        <Environment preset='lobby' background={"only"} blur={1} />
                        <PerspectiveCamera makeDefault fov={70} position={cameraPosition} />
                        {!thirdPerson && (
                            <OrbitControls
                                target={[0, 0, 0]}
                                maxPolarAngle={Math.PI * 0.5}
                                autoRotate={false} autoRotateSpeed={-1.5}
                            />
                        )}
                        <Land rotation={false} />
                        {/* <Lecture rotation={false} /> */}
                        <Car thirdPerson={thirdPerson} />
                    </Suspense>
                </Physics>
                <ambientLight intensity={0.25} />
                <axesHelper args={[100]} />
                <LightWithHelper />
            </Canvas>
            <img className='w-1/4 fixed top-6 left-6 shadow-bx' src={require('~/assets/images/mapp.jpg')} alt='Map-VKU' />
            {thirdPerson ?
                <div className='fixed top-6 right-6 shadow-bx px-8 py-4 bg-white rounded-3xl'>
                    <p>Điều khiển</p>
                    <p>w: tiến</p> 
                    <p>w + a: quay trái</p>
                    <p>w + d: quay phải</p>
                    <p>s: lùi</p>
                </div> : <></>}
            <button className='w-36 h-12 text-xl rounded-full fixed bottom-6 right-6 shadow-bx bg-white'
                onClick={seenHandle}
            >
                {thirdPerson ? 'Thoát' : 'Xem'}
            </button>
        </div>
    )
}

export default Room;