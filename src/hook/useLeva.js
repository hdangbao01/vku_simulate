import { folder, useControls } from "leva";

export const useLeva = (name) => {
    const design = useControls(name, {
        ViTri: folder({
            x: { value: 0, min: -5, max: 5, step: 0.1 },
            y: { value: 0, min: 0, max: 0, step: 0.1 },
            z: { value: 0, min: -6, max: 6, step: 0.1 }
        }),
        Xoay: folder({
            rotate: { value: 0.01, min: 0.01, max: 6.29, step: 0.01 },
        })
    })

    return design
}