import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Html } from '@react-three/drei';

function ClassRoom() {
    const gltf = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/floor_room.glb')

    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
        }
    });

    return (
        <group>
            <mesh castShadow>
                <primitive object={gltf.scene} />
            </mesh>
            <mesh position={[0, 2, 0]}>
                {/* <sphereGeometry args={[1.25, 32, 32]} />
                <meshBasicMaterial color="white" /> */}
                <Html>
                    <div
                        style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            padding: '10px',
                            background: 'rgba(255, 255, 255, 0.8)', // Set the background color with alpha transparency
                            borderRadius: '0px', // Optional: Add border-radius for a rounded look
                        }}
                    >
                        Hello, I'm an HTML element in 3D space with a background!
                    </div>
                </Html>
            </mesh>
        </group>
    )
}

export default ClassRoom;