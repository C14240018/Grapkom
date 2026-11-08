import {
    addCylinder,
    createMesh
} from "./PartGeometry.js";

const white = [0.99, 0.99, 0.99];
const black = [0.0, 0.0, 0.0];

export function createBottom() {
    const mesh = createMesh();

    // One white cylinder for the narrow support below the torso.
    addCylinder(mesh, [0, -0.90, -0.04], [0, -0.28, -0.04], 0.1, white, 32);

    // Two black cylinders stack for the bottom as the display base.
    addCylinder(mesh, [0, -0.90, -0.04], [0, -0.95, -0.04], 0.3, black, 32);
    addCylinder(mesh, [0, -0.95, -0.04], [0, -0.985, -0.04], 0.5, black, 32);

    return mesh;
}
