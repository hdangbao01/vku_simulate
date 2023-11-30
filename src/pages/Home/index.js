import Header from "~/components/Header";
import { Suspense, useEffect, useRef } from "react";

import { Canvas, useThree } from '@react-three/fiber'
import { DirectionalLightHelper } from 'three';
import { Physics } from "@react-three/cannon";
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Land from "~/components/Land";
import Lecture from "~/components/Lecture";
import Load from "~/components/Load";

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

function Home() {
    return (
        <div className='w-full h-full relative'>
            <Header />
            <Canvas>
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
                            <Land rotation={false} />
                            <Lecture rotation={false} />
                        </group>
                    </Suspense>
                </Physics>
                <ambientLight intensity={0.25} />
                <axesHelper args={[100]} />
                <LightWithHelper />
            </Canvas>
            <div className='z-10 min-w-278 max-w-md w-40 fixed top-1/2 right-0 mr-28 -translate-y-1/2'>
                <p className='text-xl font-normal'>Mô phỏng VKU</p>
                <p style={{ textShadow: '2px 2px 6px #000' }} className='text-5xl font-semibold mt-3'>Vài nét chính về
                    trường đại học VKU</p>
                <p className='text-2xl font-normal my-8'>Trường Đại học Công nghệ Thông tin và Truyền thông Việt – Hàn là cơ sở đào tạo,
                    nghiên cứu khoa học, chuyển giao công nghệ, đổi mới sáng tạo, khởi nghiệp, phục vụ
                    cộng đồng lớn và uy tín của cả nước về các lĩnh vực công nghệ thông tin, truyền thông
                    và các lĩnh vực liên quan theo mô hình đại học định hướng ứng dụng.</p>
                <p className='uppercase text-xl font-normal'>Xem thêm</p>
            </div>
        </div>
        // <Load />
    )
}

export default Home;