import Header from "~/components/Header";
import { Suspense, useEffect, useRef } from "react";
import { Canvas, useLoader } from '@react-three/fiber'
import { MeshStandardMaterial } from 'three';
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Load from "~/components/Load";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function LightWithHelper() {
    const lightRef = useRef();

    return (
        <>
            <directionalLight ref={lightRef} color="white" intensity={5} position={[0, 5, 0]} castShadow />
        </>
    );
}

function Room() {
    const room = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/room_model.glb')
    const wall_room = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/wall_room.glb')
    const floor = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/floor_room.glb')

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const materialWall = new MeshStandardMaterial({ color: "#E7CBA9" });

    useEffect(() => {
        if (!room) return;
        if (!wall_room) return;
        if (!floor) return;

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

    }, [room, wall_room, floor, materialWall]);

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
                        enableZoom={false}
                    />
                    <mesh>
                        <primitive object={room.scene} />
                        <meshBasicMaterial />
                    </mesh>
                    <mesh material={materialWall}>
                        <primitive object={wall_room.scene} />
                        <meshBasicMaterial />
                    </mesh>
                    <mesh>
                        <primitive object={floor.scene} />
                        <meshBasicMaterial />
                    </mesh>
                </Suspense>

                <ambientLight intensity={0.5} />
                <LightWithHelper />
            </Canvas>
        </div>
    )
}

export default Room;