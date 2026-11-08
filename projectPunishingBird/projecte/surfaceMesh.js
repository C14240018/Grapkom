export function createGridMesh(rows, columns, pointAt) {
    var vertices = [];
    var faces = [];

    for (var i = 0; i <= rows; i++) {
        var u = i / rows;
        for (var j = 0; j <= columns; j++) {
            var v = j / columns;
            var point = pointAt(u, v);

            vertices.push(
                point.x, point.y, point.z,
                u, v, 1 - u
            );
        }
    }

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var first = i * (columns + 1) + j;
            var second = first + 1;
            var third = first + columns + 1;
            var fourth = third + 1;

            faces.push(first, third, fourth);
            faces.push(first, fourth, second);
        }
    }

    return { vertices: vertices, faces: faces };
}
