import { addCone, addCurve, addCurveSheet, addEllipsoid, addCylinder, createMesh } from "./PartGeometry.js";

const white = [0.99, 0.99, 0.99];
const black = [0.0, 0.0, 0.0];
const gray = [0.5, 0.5, 0.5];

export function createTop() {
    const mesh = createMesh();
    const forwardZ = 0.1;
    const forward = points => points.map(([x, y, z]) => [x, y, z + forwardZ]);

    // 2 ellipsoid for the head.
    addEllipsoid(mesh, [0.0, 0.4, -0.05 + forwardZ], [0.2, 0.19, 0.15], white);   // cranium
    addEllipsoid(mesh, [-0.02, 0.27, -0.05 + forwardZ], [0.12, 0.14, 0.1], white); // jaw

    // a cylider for the neck.
    addCylinder(mesh, [-0.01, 0.2, -0.05 + forwardZ], [-0.01, 0.1, -0.05 + forwardZ], 0.07, black, 32);
    
    // A cone for the nose.
    addCone(mesh, [-0.1, 0.3, -0.05 + forwardZ], [-0.3, 0.3, -0.05 + forwardZ], 0.045, white);

    // Two curves for the hair.
    addCurve(mesh, forward([
        [-0.1, 0.575, -0.05], [0.05, 0.61, -0.05], [0.06, 0.67, -0.05], [0.03, 0.71, -0.05],
        [-0.05, 0.69, -0.05], [-0.03, 0.63, -0.05]
    ]), 0.01, black);
    addCurve(mesh, forward([
        [-0.1, 0.575, -0.05], [0.1, 0.61, -0.05], [0.15, 0.67, -0.05], [0.13, 0.71, -0.05]
    ]), 0.01, black);

    // Two curves for the lips.
    addCurve(mesh, forward([
        [0.05, 0.23, 0.005], [-0.065, 0.21, 0.05], [-0.13, 0.18, -0.05], [-0.065, 0.21, -0.15], [0.05, 0.23, -0.105]
    ]), 0.015, black);
    addCurve(mesh, forward([
        [0.05, 0.23, 0.005], [-0.065, 0.24, 0.05], [-0.15, 0.2, -0.05], [-0.065, 0.24, -0.15], [0.05, 0.23, -0.105]
    ]), 0.015, black);
    
    // Neck accessory left side 3 black note beads (ellipsoids) joined by 4 curves (curves) and a sheet for the curves.
    addEllipsoid(mesh, [0.14, 0.53, -0.131 + forwardZ], [0.035, 0.032, 0.03], black, 16, 12); // ball 3
    addEllipsoid(mesh, [0.066, 0.475, -0.229 + forwardZ], [0.035, 0.032, 0.03], black, 16, 12); // ball 2
    addEllipsoid(mesh, [-0.096, 0.362, -0.228 + forwardZ], [0.035, 0.032, 0.03], black, 16, 12); // ball 1

    addCurve(mesh, forward([[-0.096, 0.362, -0.228], [0.011, 0.262, -0.25], [0.085, 0.341, -0.233]]), 0.015, black); // curve from ball 1 specail
    addCurve(mesh, forward([[0.15, 0.54, -0.132], [0.187, 0.47, -0.148], [0.198, 0.298, -0.042], [0.06, 0.16, -0.05]]), 0.01, black); // curve from ball 3 to the top of the coat
    addCurve(mesh, forward([[0.07, 0.46, -0.224], [0.13, 0.39, -0.206], [0.16, 0.28, -0.136], [0.045, 0.16, -0.104]]), 0.01, black); // curve from ball 2 to the top of the coat
    addCurve(mesh, forward([[-0.096, 0.362, -0.22], [0.02, 0.31, -0.215], [0.05, 0.24, -0.158], [-0.02, 0.16, -0.124]]), 0.01, black); // curve from ball 1 to the top of the coat

    addCurveSheet(mesh, forward([[0.15, 0.54, -0.132], [0.187, 0.47, -0.148], [0.198, 0.298, -0.042], [0.06, 0.16, -0.05]]), 
                        forward([[0.07, 0.46, -0.224], [0.13, 0.39, -0.206], [0.16, 0.28, -0.136], [0.045, 0.16, -0.104]]), white);
    addCurveSheet(mesh, forward([[0.07, 0.46, -0.224], [0.13, 0.39, -0.206], [0.16, 0.28, -0.136], [0.045, 0.16, -0.104]]), 
                        forward([[-0.096, 0.362, -0.22], [0.02, 0.31, -0.215], [0.05, 0.24, -0.158], [-0.02, 0.16, -0.124]]), white);

    // Neck accessory right side 3 black note beads (ellipsoids) joined by 5 curves (curves).
    addEllipsoid(mesh, [0.14, 0.53, 0.031 + forwardZ], [0.035, 0.032, 0.03], black, 16, 12);   // ball 3
    addEllipsoid(mesh, [0.066, 0.475, 0.129 + forwardZ], [0.035, 0.032, 0.03], black, 16, 12);  // ball 2
    addEllipsoid(mesh, [-0.096, 0.362, 0.128 + forwardZ], [0.035, 0.032, 0.03], black, 16, 12); // ball 1

    addCurve(mesh, forward([[-0.096, 0.362, 0.128], [0.011, 0.262, 0.15], [0.085, 0.341, 0.133]]), 0.015, black);   // curve from ball 1 specail
    addCurve(mesh, forward([[0.15, 0.54, 0.032], [0.187, 0.47, 0.048], [0.198, 0.298, -0.042], [0.06, 0.16, -0.05]]), 0.01, black); // curve from ball 3 to the top of the coat
    addCurve(mesh, forward([[0.07, 0.46, 0.124], [0.13, 0.39, 0.106], [0.16, 0.28, 0.036], [0.045, 0.16, 0.004]]), 0.01, black); // curve from ball 2 to the top of the coat
    addCurve(mesh, forward([[-0.096, 0.362, 0.12], [0.02, 0.31, 0.115], [0.05, 0.24, 0.058], [-0.02, 0.16, 0.024]]), 0.01, black); // curve from ball 1 to the top of the coat
        
    addCurveSheet(mesh, forward([[0.15, 0.54, 0.032], [0.187, 0.47, 0.048], [0.198, 0.298, -0.042], [0.06, 0.16, -0.05]]), 
                        forward([[0.07, 0.46, 0.124], [0.13, 0.39, 0.106], [0.16, 0.28, 0.036], [0.045, 0.16, 0.004]]), white);
    addCurveSheet(mesh, forward([[0.07, 0.46, 0.124], [0.13, 0.39, 0.106], [0.16, 0.28, 0.036], [0.045, 0.16, 0.004]]), 
                        forward([[-0.096, 0.362, 0.12], [0.02, 0.31, 0.115], [0.05, 0.24, 0.058], [-0.02, 0.16, 0.024]]), white);

   
    
    return mesh;
}
