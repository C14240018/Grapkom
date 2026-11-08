export function createMesh() {
    return { vertices: [], faces: [] };
}

export function validateMesh(mesh) {
    if (!mesh || !Array.isArray(mesh.vertices) || !Array.isArray(mesh.faces)) {
        throw new TypeError("A mesh must contain vertices and faces arrays.");
    }
    if (mesh.vertices.length % 6 !== 0 || mesh.faces.length % 3 !== 0) {
        throw new Error("Mesh data must contain position/color vertices and complete triangles.");
    }
    if (!mesh.vertices.every(Number.isFinite)) {
        throw new TypeError("Mesh vertices must contain only finite numbers.");
    }

    const vertexCount = mesh.vertices.length / 6;
    if (vertexCount > 65536) {
        throw new RangeError("Mesh contains too many vertices for 16-bit element indices.");
    }
    for (const index of mesh.faces) {
        if (!Number.isInteger(index) || index < 0 || index >= vertexCount) {
            throw new RangeError("Mesh faces must reference existing vertices.");
        }
    }
    return mesh;
}

export function createLitVertices(mesh) {
    validateMesh(mesh);
    const vertexCount = mesh.vertices.length / 6;
    const normals = new Float32Array(vertexCount * 3);

    for (let i = 0; i < mesh.faces.length; i += 3) {
        const a = mesh.faces[i] * 6;
        const b = mesh.faces[i + 1] * 6;
        const c = mesh.faces[i + 2] * 6;
        const abX = mesh.vertices[b] - mesh.vertices[a];
        const abY = mesh.vertices[b + 1] - mesh.vertices[a + 1];
        const abZ = mesh.vertices[b + 2] - mesh.vertices[a + 2];
        const acX = mesh.vertices[c] - mesh.vertices[a];
        const acY = mesh.vertices[c + 1] - mesh.vertices[a + 1];
        const acZ = mesh.vertices[c + 2] - mesh.vertices[a + 2];
        const normal = [
            abY * acZ - abZ * acY,
            abZ * acX - abX * acZ,
            abX * acY - abY * acX
        ];

        for (const index of [mesh.faces[i], mesh.faces[i + 1], mesh.faces[i + 2]]) {
            normals[index * 3] += normal[0];
            normals[index * 3 + 1] += normal[1];
            normals[index * 3 + 2] += normal[2];
        }
    }

    const vertices = new Float32Array(vertexCount * 9);
    for (let i = 0; i < vertexCount; i++) {
        const source = i * 6;
        const target = i * 9;
        const length = Math.hypot(normals[i * 3], normals[i * 3 + 1], normals[i * 3 + 2]);
        vertices[target] = mesh.vertices[source];
        vertices[target + 1] = mesh.vertices[source + 1];
        vertices[target + 2] = mesh.vertices[source + 2];
        vertices[target + 3] = mesh.vertices[source + 3];
        vertices[target + 4] = mesh.vertices[source + 4];
        vertices[target + 5] = mesh.vertices[source + 5];
        vertices[target + 6] = length > 0 ? normals[i * 3] / length : 0;
        vertices[target + 7] = length > 0 ? normals[i * 3 + 1] / length : 0;
        vertices[target + 8] = length > 0 ? normals[i * 3 + 2] / length : -1;
    }
    return vertices;
}

function addVertex(mesh, point, color) {
    mesh.vertices.push(
        point[0], point[1], point[2],
        color[0], color[1], color[2]
    );
    return mesh.vertices.length / 6 - 1;
}

function addTriangle(mesh, a, b, c) {
    mesh.faces.push(a, b, c);
}

export function addEllipsoid(mesh, center, radii, color, slices = 32, stacks = 20) {
    const firstRing = mesh.vertices.length / 6;
    for (let stack = 0; stack <= stacks; stack++) {
        const latitude = -Math.PI / 2 + stack / stacks * Math.PI;
        const ringRadius = Math.cos(latitude);
        const y = Math.sin(latitude);
        for (let slice = 0; slice <= slices; slice++) {
            const longitude = slice / slices * Math.PI * 2;
            const light = 0.76 + 0.24 * Math.max(0, Math.cos(longitude) * 0.5 + y * 0.5);
            addVertex(mesh, [
                center[0] + radii[0] * ringRadius * Math.cos(longitude),
                center[1] + radii[1] * y,
                center[2] + radii[2] * ringRadius * Math.sin(longitude)
            ], color.map(channel => channel * light));
        }
    }

    for (let stack = 0; stack < stacks; stack++) {
        for (let slice = 0; slice < slices; slice++) {
            const first = firstRing + stack * (slices + 1) + slice;
            const second = first + slices + 1;
            addTriangle(mesh, first, second, first + 1);
            addTriangle(mesh, second, second + 1, first + 1);
        }
    }
}

export function addCylinder(mesh, start, end, radius, color, slices = 20) {
    const axis = [end[0] - start[0], end[1] - start[1], end[2] - start[2]];
    const length = Math.hypot(...axis);
    if (length === 0) {
        throw new Error("A cylinder needs two different endpoints.");
    }
    const direction = axis.map(value => value / length);
    const reference = Math.abs(direction[2]) < 0.9 ? [0, 0, 1] : [0, 1, 0];
    const u = [
        direction[1] * reference[2] - direction[2] * reference[1],
        direction[2] * reference[0] - direction[0] * reference[2],
        direction[0] * reference[1] - direction[1] * reference[0]
    ];
    const uLength = Math.hypot(...u);
    u.forEach((value, index) => { u[index] = value / uLength; });
    const v = [
        direction[1] * u[2] - direction[2] * u[1],
        direction[2] * u[0] - direction[0] * u[2],
        direction[0] * u[1] - direction[1] * u[0]
    ];

    const startCenter = addVertex(mesh, start, color);
    const startRing = mesh.vertices.length / 6;
    for (let slice = 0; slice < slices; slice++) {
        const angle = slice / slices * Math.PI * 2;
        const offset = [
            radius * (u[0] * Math.cos(angle) + v[0] * Math.sin(angle)),
            radius * (u[1] * Math.cos(angle) + v[1] * Math.sin(angle)),
            radius * (u[2] * Math.cos(angle) + v[2] * Math.sin(angle))
        ];
        addVertex(mesh, [
            start[0] + offset[0], start[1] + offset[1], start[2] + offset[2]
        ], color);
    }

    const endCenter = addVertex(mesh, end, color);
    for (let slice = 0; slice < slices; slice++) {
        const angle = slice / slices * Math.PI * 2;
        const offset = [
            radius * (u[0] * Math.cos(angle) + v[0] * Math.sin(angle)),
            radius * (u[1] * Math.cos(angle) + v[1] * Math.sin(angle)),
            radius * (u[2] * Math.cos(angle) + v[2] * Math.sin(angle))
        ];
        addVertex(mesh, [
            end[0] + offset[0], end[1] + offset[1], end[2] + offset[2]
        ], color);
    }

    for (let slice = 0; slice < slices; slice++) {
        const next = (slice + 1) % slices;
        addTriangle(mesh, startCenter, startRing + next, startRing + slice);
        addTriangle(mesh, endCenter, endCenter + 1 + slice, endCenter + 1 + next);
        addTriangle(mesh, startRing + slice, startRing + next, endCenter + 1 + next);
        addTriangle(mesh, startRing + slice, endCenter + 1 + next, endCenter + 1 + slice);
    }
}

export function addCone(mesh, base, tip, radius, color, slices = 24) {
    const axis = [tip[0] - base[0], tip[1] - base[1], tip[2] - base[2]];
    const length = Math.hypot(...axis);
    if (length === 0) {
        throw new Error("A cone needs a base and a different tip.");
    }
    const direction = axis.map(value => value / length);
    const reference = Math.abs(direction[2]) < 0.9 ? [0, 0, 1] : [0, 1, 0];
    const u = [
        direction[1] * reference[2] - direction[2] * reference[1],
        direction[2] * reference[0] - direction[0] * reference[2],
        direction[0] * reference[1] - direction[1] * reference[0]
    ];
    const uLength = Math.hypot(...u);
    u.forEach((value, index) => { u[index] = value / uLength; });
    const v = [
        direction[1] * u[2] - direction[2] * u[1],
        direction[2] * u[0] - direction[0] * u[2],
        direction[0] * u[1] - direction[1] * u[0]
    ];
    const baseCenter = addVertex(mesh, base, color);
    const ringStart = mesh.vertices.length / 6;
    for (let slice = 0; slice < slices; slice++) {
        const angle = slice / slices * Math.PI * 2;
        addVertex(mesh, [
            base[0] + radius * (u[0] * Math.cos(angle) + v[0] * Math.sin(angle)),
            base[1] + radius * (u[1] * Math.cos(angle) + v[1] * Math.sin(angle)),
            base[2] + radius * (u[2] * Math.cos(angle) + v[2] * Math.sin(angle))
        ], color);
    }
    const tipIndex = addVertex(mesh, tip, color);
    for (let slice = 0; slice < slices; slice++) {
        const next = (slice + 1) % slices;
        addTriangle(mesh, baseCenter, ringStart + next, ringStart + slice);
        addTriangle(mesh, ringStart + slice, ringStart + next, tipIndex);
    }
}

export function addEllipticParaboloid(mesh, center, radii, depth, color, slices = 40, rings = 12) {
    const rotateAroundX = point => [
        point[0],
        center[1] - (point[2] - center[2]),
        center[2] + (point[1] - center[1])
    ];
    const centerIndex = addVertex(mesh, rotateAroundX([
        center[0], center[1], center[2] + depth
    ]), color);
    const firstRing = mesh.vertices.length / 6;

    for (let ring = 1; ring <= rings; ring++) {
        const radius = ring / rings;
        const z = center[2] + depth * (1 - radius * radius);
        for (let slice = 0; slice < slices; slice++) {
            const angle = slice / slices * Math.PI * 2;
            const light = 0.78 + 0.22 * (1 - radius * 0.35);
            addVertex(mesh, rotateAroundX([
                center[0] + radii[0] * radius * Math.cos(angle),
                center[1] + radii[1] * radius * Math.sin(angle),
                z
            ]), color.map(channel => channel * light));
        }
    }

    for (let slice = 0; slice < slices; slice++) {
        const next = (slice + 1) % slices;
        addTriangle(mesh, centerIndex, firstRing + slice, firstRing + next);
    }
    for (let ring = 0; ring < rings - 1; ring++) {
        const inner = firstRing + ring * slices;
        const outer = inner + slices;
        for (let slice = 0; slice < slices; slice++) {
            const next = (slice + 1) % slices;
            addTriangle(mesh, inner + slice, outer + slice, outer + next);
            addTriangle(mesh, inner + slice, outer + next, inner + next);
        }
    }
}
export function addEllipticParaboloidNormalA(mesh, center, radii, depth, color, slices = 40, rings = 12) {
    const rotationY = Math.PI / 7;
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const rotateAroundY = point => {
        const x = point[0] - center[0];
        const z = point[2] - center[2];
        return [
            center[0] + x * cosY + z * sinY,
            point[1],
            center[2] - x * sinY + z * cosY
        ];
    };
    const centerIndex = addVertex(mesh, rotateAroundY([
        center[0], center[1], center[2] + depth
    ]), color);
    const firstRing = mesh.vertices.length / 6;

    for (let ring = 1; ring <= rings; ring++) {
        const radius = ring / rings;
        const z = center[2] + depth * (1 - radius * radius);
        for (let slice = 0; slice < slices; slice++) {
            const angle = slice / slices * Math.PI * 2;
            const light = 0.78 + 0.22 * (1 - radius * 0.35);
            addVertex(mesh, rotateAroundY([
                center[0] + radii[0] * radius * Math.cos(angle),
                center[1] + radii[1] * radius * Math.sin(angle),
                z
            ]), color.map(channel => channel * light));
        }
    }

    for (let slice = 0; slice < slices; slice++) {
        const next = (slice + 1) % slices;
        addTriangle(mesh, centerIndex, firstRing + slice, firstRing + next);
    }
    for (let ring = 0; ring < rings - 1; ring++) {
        const inner = firstRing + ring * slices;
        const outer = inner + slices;
        for (let slice = 0; slice < slices; slice++) {
            const next = (slice + 1) % slices;
            addTriangle(mesh, inner + slice, outer + slice, outer + next);
            addTriangle(mesh, inner + slice, outer + next, inner + next);
        }
    }
}
export function addEllipticParaboloidNormalB(mesh, center, radii, depth, color, slices = 40, rings = 12) {
    const rotationY = Math.PI / -7;
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const rotateAroundY = point => {
        const x = point[0] - center[0];
        const z = point[2] - center[2];
        return [
            center[0] + x * cosY + z * sinY,
            point[1],
            center[2] - x * sinY + z * cosY
        ];
    };
    const centerIndex = addVertex(mesh, rotateAroundY([
        center[0], center[1], center[2] + depth
    ]), color);
    const firstRing = mesh.vertices.length / 6;

    for (let ring = 1; ring <= rings; ring++) {
        const radius = ring / rings;
        const z = center[2] + depth * (1 - radius * radius);
        for (let slice = 0; slice < slices; slice++) {
            const angle = slice / slices * Math.PI * 2;
            const light = 0.78 + 0.22 * (1 - radius * 0.35);
            addVertex(mesh, rotateAroundY([
                center[0] + radii[0] * radius * Math.cos(angle),
                center[1] + radii[1] * radius * Math.sin(angle),
                z
            ]), color.map(channel => channel * light));
        }
    }

    for (let slice = 0; slice < slices; slice++) {
        const next = (slice + 1) % slices;
        addTriangle(mesh, centerIndex, firstRing + slice, firstRing + next);
    }
    for (let ring = 0; ring < rings - 1; ring++) {
        const inner = firstRing + ring * slices;
        const outer = inner + slices;
        for (let slice = 0; slice < slices; slice++) {
            const next = (slice + 1) % slices;
            addTriangle(mesh, inner + slice, outer + slice, outer + next);
            addTriangle(mesh, inner + slice, outer + next, inner + next);
        }
    }
}



export function addOneSheetHyperboloid( mesh, center, radii, verticalScale, halfHeight, color, slices = 40, rings = 24) {
    if (radii[0] <= 0 || radii[1] <= 0 || verticalScale <= 0 || halfHeight <= 0 ||
        slices < 3 || rings < 1) {
        throw new Error("A one-sheet hyperboloid needs positive dimensions and valid tessellation.");
    }

    const firstRing = mesh.vertices.length / 6;
    for (let ring = 0; ring <= rings; ring++) {
        const yOffset = -halfHeight + ring / rings * halfHeight * 2;
        const radiusScale = Math.sqrt(1 + (yOffset / verticalScale) ** 2);
        for (let slice = 0; slice < slices; slice++) {
            const angle = slice / slices * Math.PI * 2;
            addVertex(mesh, [
                center[0] + radii[0] * radiusScale * Math.cos(angle),
                center[1] + yOffset,
                center[2] + radii[1] * radiusScale * Math.sin(angle)
            ], color);
        }
    }

    for (let ring = 0; ring < rings; ring++) {
        for (let slice = 0; slice < slices; slice++) {
            const next = (slice + 1) % slices;
            const lower = firstRing + ring * slices + slice;
            const lowerNext = firstRing + ring * slices + next;
            const upper = lower + slices;
            const upperNext = lowerNext + slices;
            addTriangle(mesh, lower, upper, lowerNext);
            addTriangle(mesh, upper, upperNext, lowerNext);
        }
    }
}

export function addCurve(mesh, points, radius, color, stepsPerSegment = 8) {
    if (points.length < 2) {
        throw new Error("A curve needs at least two points.");
    }

    const curvePoints = [];
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];
        for (let step = 0; step < stepsPerSegment; step++) {
            const t = step / stepsPerSegment;
            const t2 = t * t;
            const t3 = t2 * t;
            curvePoints.push([0, 1, 2].map(axis =>
                0.5 * (
                    2 * p1[axis] +
                    (-p0[axis] + p2[axis]) * t +
                    (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * t2 +
                    (-p0[axis] + 3 * p1[axis] - 3 * p2[axis] + p3[axis]) * t3
                )
            ));
        }
    }
    curvePoints.push(points[points.length - 1]);

    for (let i = 0; i < curvePoints.length - 1; i++) {
        addCylinder(mesh, curvePoints[i], curvePoints[i + 1], radius, color, 8);
    }
}

function sampleCurve(points, stepsPerSegment) {
    const out = [];
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];
        for (let step = 0; step < stepsPerSegment; step++) {
            const t = step / stepsPerSegment;
            const t2 = t * t;
            const t3 = t2 * t;
            out.push([0, 1, 2].map(axis =>
                0.5 * (
                    2 * p1[axis] +
                    (-p0[axis] + p2[axis]) * t +
                    (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * t2 +
                    (-p0[axis] + 3 * p1[axis] - 3 * p2[axis] + p3[axis]) * t3
                )
            ));
        }
    }
    out.push(points[points.length - 1]);
    return out;
}

export function addCurveSheet(mesh, pointsA, pointsB, color, samples = 40, across = 4) {
    const pick = (list, i) => {
        const position = i / (samples - 1) * (list.length - 1);
        const low = Math.floor(position);
        const high = Math.min(low + 1, list.length - 1);
        const mix = position - low;
        return [0, 1, 2].map(axis => list[low][axis] * (1 - mix) + list[high][axis] * mix);
    };
    const curveA = sampleCurve(pointsA, 12);
    const curveB = sampleCurve(pointsB, 12);

    const firstVertex = mesh.vertices.length / 6;
    for (let i = 0; i < samples; i++) {
        const a = pick(curveA, i);
        const b = pick(curveB, i);
        for (let j = 0; j <= across; j++) {
            const mix = j / across;
            addVertex(mesh, [0, 1, 2].map(axis => a[axis] * (1 - mix) + b[axis] * mix), color);
        }
    }
    const rowLength = across + 1;
    for (let i = 0; i < samples - 1; i++) {
        for (let j = 0; j < across; j++) {
            const a = firstVertex + i * rowLength + j;
            const b = a + 1;
            const c = a + rowLength;
            const d = c + 1;
            addTriangle(mesh, a, b, c);
            addTriangle(mesh, b, d, c);
        }
    }
}