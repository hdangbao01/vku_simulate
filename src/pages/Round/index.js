import Header from "~/components/Header";
import { Suspense, memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Load from "~/components/Load";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DirectionalLightHelper, VideoTexture } from "three";

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
    //             }
    //         };
    //     }
    // }, [scene]);

    return (
        <>
            <directionalLight ref={lightRef} color="white" intensity={2} position={[0, 25, 0]} castShadow />
            {/* <spotLight ref={lightRef} color="red" intensity={5} position={[0, 16, -10]} castShadow /> */}
        </>
    );
}

const PlaneVideo = memo(() => {
    const model = useMemo(() => {
        const video = document.createElement("video")
        video.muted = false
        video.loop = true
        video.controls = true
        video.playsInline = true
        video.autoplay = true
        video.src = process.env.PUBLIC_URL + 'videos/mv.mp4'
        return { video }
    }, [])

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
        <mesh position={[0.15, 17, -46.3]}
            onClick={handleClickScreen}
        >
            <planeGeometry args={[25, 20]} />
            <meshBasicMaterial
                map={texture}
                toneMapped={false} />
        </mesh>
    </Suspense>
})

function Round() {
    const room = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/round_hall.glb')

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
                        position={[0, 20, -4]}
                    />
                    <OrbitControls
                        target={[0, 10, -6]}
                        maxPolarAngle={Math.PI * 0.5}
                        minPolarAngle={Math.PI * 0.5}
                        enableZoom={true}
                    />
                    <mesh>
                        <primitive object={room.scene} />
                        <meshBasicMaterial />
                    </mesh>
                    <PlaneVideo />
                </Suspense>

                <ambientLight intensity={0.5} />
                <LightWithHelper />
            </Canvas>
        </div>
    )
}

export default Round;