import { useFrame, useLoader } from '@react-three/fiber'
import { useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Html } from '@react-three/drei';

const Lecture = ({ rotation, onClick, posObject, nameObject, setNameObject, objectShow }) => {
    // const gltf = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/vku_object.glb')
    const gltf = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/lecture_name.glb')

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
        <group>
            <mesh ref={sphereRef} castShadow onClick={(e) => onClick(e)}>
                <primitive object={gltf.scene} />
            </mesh>
            {nameObject &&
                <mesh position={posObject}>
                    <Html>
                        <div className='fixed bottom-6 left-6 z-20 m-6 w-60 bg-white p-4'>
                            <img className='w-60 h-44 rounded-md object-cover'
                                src={objectShow?.image}
                                alt='object 3D' />
                            <div>
                                <p className='font-semibold text-lg mt-3 mb-2'>
                                    {objectShow?.name}
                                </p>
                                <p className='text-sm'>Thông tin: {objectShow?.description}</p>
                                <div className='flex flex-row-reverse'>
                                    <button className='mt-2' onClick={() => setNameObject('')}>Tắt</button>
                                </div>
                            </div>
                        </div>
                    </Html>
                </mesh>
            }
        </group>
    )
}

export default Lecture;