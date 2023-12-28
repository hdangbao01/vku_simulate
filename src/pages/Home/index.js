import { Suspense, useRef } from "react";
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Physics } from "@react-three/cannon";

import Header from "~/components/Header";
// import Lecture from "~/components/Lecture";
import Land from "~/components/Land";
import Load from "~/components/Load";

import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'
import { Link } from "react-router-dom";
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
    //             }
    //         };
    //     }
    // }, [scene]);

    return (
        <directionalLight ref={lightRef} color="white" intensity={1.5} position={[-70, 100, -100]} castShadow shadow-mapSize={[1024, 1024]}>
            <orthographicCamera attach={"shadow-camera"} args={[-150, 150, 150, -150]} />
        </directionalLight>
    );
}

const Lecture = ({ rotation }) => {
    const gltf = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/vku_object.glb')
    // const gltf = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/lecture_name.glb')

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

function Home() {
    return (
        <div className='w-full h-full relative'>
            <Header />
            <Canvas shadows>
                <Physics broadphase="SAP" gravity={[0, -2.6, 0]}>
                    {/* <SceneContainer posPerspectiveCamera={[-70, 50, 110]} autoRotate={false} /> */}

                    <Suspense fallback={<Load />}>
                        <Environment preset='lobby' background={"only"} blur={1} />
                        <PerspectiveCamera makeDefault fov={70}
                            position={[-70, 50, 90]}
                        />
                        <OrbitControls
                            target={[0, 0, 0]}
                            maxPolarAngle={Math.PI * 0.5}
                            autoRotate={false} autoRotateSpeed={-1.5}
                            enableRotate={false}
                            enableZoom={false}
                        />
                        <group position={[-40, 0, -50]} scale={[0.75, 0.75, 0.75]}>
                            <Land rotation={true} />
                            <Lecture rotation={true} />
                        </group>
                    </Suspense>
                </Physics>
                <ambientLight intensity={0.25} />
                {/* <directionalLight color="white" position={[50, 50, 100]} /> */}
                {/* <axesHelper args={[100]} /> */}
                <LightWithHelper />
            </Canvas>
            <div className='z-10 min-w-278 max-w-md w-40 fixed top-1/2 right-0 mr-28 -translate-y-1/2'>
                <p style={{ textShadow: '2px 2px 3px #fff' }} className='text-xl font-semibold'>Mô phỏng VKU</p>
                <p style={{ textShadow: '3px 3px 6px #fff' }} className='text-6xl font-semibold mt-3'>Vài nét chính về
                    VKU</p>
                <p style={{ textShadow: '2px 2px 3px #fff' }} className='text-xl font-medium my-8'>Trường Đại học Công nghệ Thông tin và Truyền thông Việt – Hàn là cơ sở đào tạo,
                    nghiên cứu khoa học, chuyển giao công nghệ, đổi mới sáng tạo, khởi nghiệp, phục vụ
                    cộng đồng lớn và uy tín của cả nước về các lĩnh vực công nghệ thông tin, truyền thông
                    và các lĩnh vực liên quan theo mô hình đại học định hướng ứng dụng...</p>
                <Link to={'/campus'}>
                    <p style={{ textShadow: '2px 2px 3px #fff' }} className='flex items-center text-2xl font-semibold text-black hover:underline'>
                        Khám phá ngay <MdOutlineKeyboardDoubleArrowRight className='text-3xl' />
                    </p>
                </Link>
            </div>
        </div>
    )
}

export default Home;