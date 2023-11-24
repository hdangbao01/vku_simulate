import { Canvas } from '@react-three/fiber'
import SceneContainer from '~/components/SceneContainer'

function Room() {
    return <Canvas>
        <SceneContainer />
        <ambientLight intensity={0.5} />
        <directionalLight color="white" position={[20, 20, 20]} />
    </Canvas>
}

export default Room;