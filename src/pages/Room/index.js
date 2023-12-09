import Header from "~/components/Header";
import { Suspense, useEffect, useRef } from "react";
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { DirectionalLightHelper, MeshStandardMaterial } from 'three';
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Load from "~/components/Load";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useControls } from "leva";

function LightWithHelper() {
    const { x, y, z } = useControls({
        x: { value: 0, min: 0, max: 50, step: 1 },
        y: { value: 5, min: 0, max: 50, step: 1 },
        z: { value: 0, min: 0, max: 50, step: 1 }
    })

    const lightRef = useRef();
    const { scene } = useThree();

    useEffect(() => {
        if (lightRef.current) {
            const helper = new DirectionalLightHelper(lightRef.current, 1);
            scene.add(helper);

            return () => {
                if (helper) {
                    scene.remove(helper);
                }
            };
        }
    }, [scene]);

    return (
        <>
            <directionalLight ref={lightRef} color="white" intensity={5} position={[0, 5, 0]} castShadow />
        </>
    );
}

function Room() {
    const typh = useControls({
        color: "#E7CBA9"
    })

    const room = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/object_room.glb')
    const wall_room = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/wall_room.glb')
    const floor = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/floor_room.glb')

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const materialWall = new MeshStandardMaterial({ ...typh });

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

    // const [hovered, setHover] = useState(false)
    // const [active, setActive] = useState(false)

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
                    </mesh>

                    {/* <mesh position={[0, 2, 0]} castShadow
                    // onClick={() => setActive(!active)}
                    // onPointerOver={() => setHover(true)}
                    // onPointerOut={() => setHover(false)}
                    >
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial
                        // color={hovered ? 'hotpink' : 'orange'} 
                        />
                    </mesh> */}
                </Suspense>

                <ambientLight intensity={0.5} />
                <axesHelper args={[100]} />
                <LightWithHelper />
            </Canvas>
        </div>
    )
}

export default Room;