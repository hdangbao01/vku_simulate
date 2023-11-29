import { usePlane } from '@react-three/cannon';
import { useLoader } from '@react-three/fiber'
import { useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const Land = () => {
    const [ref] = usePlane(
        () => ({
            type: 'Static',
            rotation: [-Math.PI / 2, 0, 0]
        }
        ),
        useRef(null)
    );

    const gltf = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/land.glb').scene

    return (
        <mesh onClick={(e) => console.log(e.target)}>
            <primitive object={gltf} />
        </mesh>
    )
}

export default Land;