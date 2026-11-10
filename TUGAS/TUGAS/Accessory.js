import { addCone, addCurve, addCurveSheet, addEllipsoid, addCylinder, createMesh } from "./PartGeometry.js";


const black = [0.0, 0.0, 0.0];


export function createAccessory() {
    const mesh = createMesh();
    const forwardZ = 0.1;
    const forward = points => points.map(([x, y, z]) => [x, y, z + forwardZ]);

    // south note
    addEllipsoid(mesh, [0.4, 0.6, -0.05 + forwardZ], [0.05, 0.08, 0.1], black);   
    addCurve(mesh, forward([[0.4, 0.6, -0.1], [0.4, 0.9, -0.1]]), 0.015 ,black);

    // north note
    addEllipsoid(mesh, [-0.4, 0.6, 0.05 + forwardZ], [0.05, 0.08, 0.1], black);   
    addCurve(mesh, forward([[-0.4, 0.6, 0.1], [-0.4, 0.9, 0.1]]), 0.015 ,black); 

    // east note
    addEllipsoid(mesh, [0.06, 0.6, 0.4 + forwardZ], [0.1, 0.08, 0.05], black);
    addCurve(mesh, forward([[0.1, 0.6, 0.4], [0.1, 0.9, 0.4]]), 0.015, black);

    // west note
    addEllipsoid(mesh, [-0.05, 0.6, -0.4 + forwardZ], [0.1, 0.08, 0.05], black);
    addCurve(mesh, forward([[-0.1, 0.6, -0.4], [-0.1, 0.9, -0.4]]), 0.015, black);
    
    return mesh;
}