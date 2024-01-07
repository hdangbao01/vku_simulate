import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { Suspense, useEffect, useState } from 'react'
import Land from '../Land'
import Lecture from '../Lecture'
// import Car from '../Car'

const SceneContainer = ({ posPerspectiveCamera, autoRotate }) => {
    const [thirdPerson, setThirdPerson] = useState(false);
    const [cameraPosition, setCameraPosition] = useState(posPerspectiveCamera);

    useEffect(() => {
        function keydownHandler(e) {
            if (e.key == "k") {
                if (thirdPerson) setCameraPosition([posPerspectiveCamera[0], posPerspectiveCamera[1], posPerspectiveCamera[2] + Math.random() * 0.01]);
                setThirdPerson(!thirdPerson);
            }
        }

        window.addEventListener("keydown", keydownHandler);
        return () => window.removeEventListener("keydown", keydownHandler);
    }, [posPerspectiveCamera, thirdPerson]);

    return (
        <Suspense fallback={null}>
            <Environment preset='lobby' background={"only"} blur={1}
            // files={process.env.PUBLIC_URL + "textures/bg.hdr"}
            />
            <PerspectiveCamera makeDefault fov={70}
                position={cameraPosition}
            />
            {!thirdPerson && (
                <OrbitControls
                    target={[0, 0, 0]}
                    maxPolarAngle={Math.PI * 0.5}
                    autoRotate={autoRotate} autoRotateSpeed={-1.5}
                />
            )}
            <group position={[-70, 0, -50]}>
                <Land />
                <Lecture />
                {/* <Car thirdPerson={thirdPerson} /> */}
            </group>
        </Suspense>
    )
}

export default SceneContainer;