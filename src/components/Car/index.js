import { useEffect, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber'
import { useBox, useRaycastVehicle } from '@react-three/cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useWheels } from '~/hook/useWheels';
import { WheelDebug } from '../WheelDebug';
import { useControls } from '~/hook/useControls';
import { Quaternion, Vector3 } from 'three';

const Car = ({ thirdPerson }) => {
    const gltf = useLoader(GLTFLoader, process.env.PUBLIC_URL + 'models/car.glb').scene

    const position = [29, 10, 105];
    const width = 1.6;
    const height = 0.6;
    const front = 2.2;
    const wheelRadius = 0.4;

    const chassisBodyArgs = [width, height, front * 2];
    const [chassisBody, chassisApi] = useBox(
        () => ({
            allowSleep: false,
            args: chassisBodyArgs,
            mass: 150,
            position,
        }),
        useRef(null),
    );

    const [wheels, wheelInfos] = useWheels(width, height, front, wheelRadius);

    const [vehicle, vehicleApi] = useRaycastVehicle(
        () => ({
            chassisBody,
            wheelInfos,
            wheels,
        }),
        useRef(null),
    );

    useControls(vehicleApi, chassisApi)

    useFrame((state) => {
        if (!thirdPerson) return;

        let position = new Vector3(0, 0, 0);
        position.setFromMatrixPosition(chassisBody.current.matrixWorld);

        let quaternion = new Quaternion(0, 0, 0, 0);
        quaternion.setFromRotationMatrix(chassisBody.current.matrixWorld);

        let wDir = new Vector3(0, 0, -1);
        wDir.applyQuaternion(quaternion);
        wDir.normalize();

        let cameraPosition = position.clone().add(wDir.clone().multiplyScalar(-2).add(new Vector3(0, 0.3, 1)));

        // wDir.add(new Vector3(10, 10, 10));

        state.camera.position.copy(cameraPosition);
        state.camera.lookAt(position);
    });

    useEffect(() => {
        // if (!gltf) return;

        let mesh = gltf;
        mesh.scale.set(1 / 50, 1 / 50, 1 / 50);
        // mesh.children[0].position.set(-1800, 0, -5000);
    }, [gltf]);

    return (
        <group ref={vehicle} name="vehicle">
            {/* <mesh ref={chassisBody} name="chassisBody"
                // scale={[1/50, 1/50, 1/50]} 
                // position={[37, 0, 100]}
            >
                <primitive object={gltf} rotation={[0, Math.PI / 1, 0]} />
            </mesh> */}
            <mesh ref={chassisBody}>
                <meshBasicMaterial transparent={true} opacity={0} />
                <boxGeometry args={chassisBodyArgs} />
            </mesh>

            <WheelDebug wheelRef={wheels[0]} radius={wheelRadius} />
            <WheelDebug wheelRef={wheels[1]} radius={wheelRadius} />
            <WheelDebug wheelRef={wheels[2]} radius={wheelRadius} />
            <WheelDebug wheelRef={wheels[3]} radius={wheelRadius} />
        </group>

    )
}

export default Car;