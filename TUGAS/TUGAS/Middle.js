import {
    addEllipticParaboloid,
    addEllipticParaboloidNormalA,
    addEllipticParaboloidNormalB,
    addEllipsoid,
    addCurve,
    addOneSheetHyperboloid,
    createMesh
} from "./PartGeometry.js";

const white = [0.99, 0.99, 0.99];
const black = [0.0, 0.0, 0.0];
const gray = [0.5, 0.5, 0.5];

export function createMiddle() {
    const mesh = createMesh();

    // Two elliptic paraboloids for the torso silhouette.
    addEllipticParaboloid(mesh, [0, 0.054, -0.051], [0.3, 0.21], -0.1, black);
    addEllipticParaboloid(mesh, [0, 0.054, -0.051], [0.3, 0.21], 0.5, white);

    // A 1 sheet hyperboloid extends the torso into a coat shape.
    addOneSheetHyperboloid(mesh, [0, -0.3, -0.05], [0.20, 0.14], 0.27, 0.12, white);

    // Two elliptic paraboloids for the Back panels.
    addEllipticParaboloidNormalB(mesh, [-0.1, -0.5, 0.05], [0.13, 0.2], 0.024, white);
    addEllipticParaboloidNormalA(mesh, [0.1, -0.5, 0.05], [0.13, 0.2],  0.024, white);
    


    // Two ellipsoid for the small buttons.
    addEllipsoid(mesh, [-0.14, -0.118, -0.19], [0.018, 0.018, 0.012], gray, 12, 8);
    addEllipsoid(mesh, [0.14, -0.118, -0.19], [0.018, 0.018, 0.012], gray, 12, 8);

    // Two dark sleeve-like marks complete the chest
    
    addCurve(mesh, [[-0.005, -0.265, -0.20], [-0.12, -0.265, -0.18], [-0.20, -0.265, -0.12]], 0.018, black);
    addCurve(mesh, [[-0.005, -0.335, -0.20], [-0.12, -0.335, -0.18], [-0.20, -0.335, -0.12]], 0.018, black);

    // Multiple curves for the tie
    addCurve(mesh, [[-0.05, 0.05, -0.26], [-0.13, -0.05, -0.22], [-0.05, -0.1, -0.22], [-0.08, -0.13, -0.21], [-0.05, -0.15, -0.21], [-0.05, 0.05, -0.26]], 0.01, black);
    addCurve(mesh, [[0.05, 0.05, -0.26], [0.13, -0.05, -0.22], [0.05, -0.1, -0.22], [0.08, -0.13, -0.21], [0.05, -0.15, -0.21], [0.05, 0.05, -0.26]], 0.01, black);
    addCurve(mesh, [[-0.05, -0.15, -0.21], [-0.0, -0.2, -0.21], [0.05, -0.15, -0.21], [-0.0, -0.1, -0.225]], 0.01, black);
    addCurve(mesh, [[-0.05, 0.05, -0.26], [0.05, 0.05, -0.26]], 0.01, black);
      

    return mesh;
}
