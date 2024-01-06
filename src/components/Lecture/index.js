import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
// import { Scene } from 'three';

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

    // const scene = new Scene();
    // const { scene } = useThree()

    // const moonDiv = document.createElement('div');
    // moonDiv.className = 'label';
    // moonDiv.textContent = 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHello';
    // moonDiv.style.backgroundColor = 'black';

    // const moonLabel = new CSS2DObject(moonDiv);
    // moonLabel.position.set(0, 10, 0);
    // moonLabel.center.set(0, 1);
    // scene.add(moonLabel);
    // moonLabel.layers.set(0);

    // const p = document.createElement('p')
    // p.textContent = 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHello'
    // const cP = new CSS2DObject(p)
    // scene.add(cP)
    // cP.position.set(0, 20, 0)

    return (
        <mesh ref={sphereRef} castShadow onClick={(e) => onClick(e)}>
            <primitive object={gltf.scene} />
        </mesh>
    )
}

export default Lecture;