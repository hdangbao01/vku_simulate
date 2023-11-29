import Header from "~/components/Header";
import { useEffect, useRef } from "react";

import { Canvas, useThree } from '@react-three/fiber'
import SceneContainer from '~/components/SceneContainer'
import { DirectionalLightHelper } from 'three';
import { Physics } from "@react-three/cannon";

function Home() {
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

    return <div className='w-full h-full relative'>
        <Header />
        <Canvas>
            <Physics broadphase="SAP" gravity={[0, -2.6, 0]}>
                <SceneContainer />
            </Physics>
            <ambientLight intensity={0.25} />
            <axesHelper args={[100]} />
            <LightWithHelper />
        </Canvas>
    </div>
}

export default Home;