import Header from "~/components/Header";
import { Suspense, useEffect, useRef } from "react";
import { Canvas, useLoader } from '@react-three/fiber'
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Load from "~/components/Load";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function LightWithHelper() {
    const lightRef = useRef();
    // const { scene } = useThree();

    // useEffect(() => {
    //     if (lightRef.current) {
    //         const helper = new DirectionalLightHelper(lightRef.current, 5);
    //         scene.add(helper);

    //         return () => {
    //             if (helper) {
    //                 scene.remove(helper);
    //             }F
    //         };
    //     }
    // }, [scene]);

    return (
        <>
            <directionalLight color="white" intensity={1} position={[0, -30, 0]} castShadow />
            <directionalLight color="white" intensity={1.5} position={[0, 30, 0]} castShadow />
            <spotLight ref={lightRef} color="yellow" intensity={500} position={[-40, 20, 0]} castShadow />
        </>
    );
}

function Round() {
    const room = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/student_center.glb')

    useEffect(() => {
        if (!room) return;

        room.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [room]);

    return (
        <div className='w-full h-full relative'>
            <Header />
            <Canvas shadows>
                <Suspense fallback={<Load />}>
                    <Environment
                        // preset='park' blur={0}
                        background={"only"} files={process.env.PUBLIC_URL + 'textures/rotes_rathaus_8k.hdr'} />
                    <PerspectiveCamera makeDefault fov={70}
                        position={[0, 22, 2]}
                    />
                    <OrbitControls
                        target={[0, 22, 0]}
                        maxPolarAngle={Math.PI * 0.5}
                        minPolarAngle={Math.PI * 0.5}
                        enableZoom={true}
                    />
                    <mesh>
                        <primitive object={room.scene} />
                        <meshBasicMaterial />
                    </mesh>
                </Suspense>
                <ambientLight intensity={0.5} />
                <LightWithHelper />
            </Canvas>
        </div>
    )
}

export default Round;