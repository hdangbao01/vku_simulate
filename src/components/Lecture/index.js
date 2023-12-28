import { useFrame, useLoader } from '@react-three/fiber'
import { useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const Lecture = ({ rotation, onClick }) => {
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
        <mesh ref={sphereRef} castShadow onClick={(e) => onClick(e)}>
            <primitive object={gltf.scene} />
        </mesh>
    )
}

export default Lecture;