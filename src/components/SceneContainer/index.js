import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { Suspense, useEffect, useState } from 'react'
import Land from '../Land'
import Lecture from '../Lecture'
import Car from '../Car'

const SceneContainer = () => {
    const [thirdPerson, setThirdPerson] = useState(false);
    const [cameraPosition, setCameraPosition] = useState([-10, 50, 110]);

    useEffect(() => {
        function keydownHandler(e) {
            if (e.key == "k") {
                if (thirdPerson) setCameraPosition([-10, 50, 110 + Math.random() * 0.01]);
                setThirdPerson(!thirdPerson);
            }
        }

        window.addEventListener("keydown", keydownHandler);
        return () => window.removeEventListener("keydown", keydownHandler);
    }, [thirdPerson]);


    return (
        <Suspense fallback={null}>
            <Environment preset='lobby' background={"only"} blur={1}
            // files={process.env.PUBLIC_URL + "textures/bg.hdr"}
            />

            <PerspectiveCamera makeDefault fov={70}
                // position={[-10, 50, 160]} 
                position={cameraPosition} />
            {!thirdPerson && (
                <OrbitControls target={[-2.64, -0.71, 0.03]} />
            )}
            <OrbitControls target={[1, 5, 0]} maxPolarAngle={Math.PI * 0.5}
            // autoRotate autoRotateSpeed={-0.5}
            />

            <Land />
            <Lecture />
            <Car thirdPerson={thirdPerson} />
        </Suspense>
    )
}

export default SceneContainer;