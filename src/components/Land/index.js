import { usePlane } from '@react-three/cannon';
import { useFrame, useLoader } from '@react-three/fiber'
import { useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const Land = ({ rotation }) => {
    const [ref] = usePlane(
        () => ({
            type: 'Static',
            rotation: [-Math.PI / 2, 0, 0]
        }
        ),
        useRef(null)
    );

    const gltf = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/land.glb')

    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.receiveShadow = true;
        }
    });

    const sphereRef = useRef();

    useFrame(() => {
        if (rotation) {
            sphereRef.current.rotation.y -= 0.002;
        }
    });


    return (
        <mesh ref={sphereRef} receiveShadow>
            <primitive object={gltf.scene} />
        </mesh>
    )
}

export default Land;