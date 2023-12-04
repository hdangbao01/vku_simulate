import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const Classroom = () => {

    const gltf = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/room_model.glb')

    return (
        <mesh onClick={(e) => console.log(e.target)}>
            <primitive object={gltf.scene} />
        </mesh>
    )
}

export default Classroom;