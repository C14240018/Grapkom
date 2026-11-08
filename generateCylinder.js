export function eyeoutline1(a, b, c, stack, step) {
    var vertices = [];
    var faces = [];

    for (var i = 0; i <= stack; i++) {
        var z = -c / 2 + i / stack * c;
        for (var j = 0; j <= step; j++) {
            var angle = j / step * 2 * Math.PI;
            var x = a * Math.cos(angle);
            var y = b * Math.sin(angle);
            vertices.push(x, y, z);
            vertices.push(...[69/255, 14/255, 14/255]);
        }
    }

    for (var i = 0; i < stack; i++) {
        for (var j = 0; j < step; j++) {
            var first = i * (step + 1) + j;
            var second = first + 1;
            var third = first + (step + 1);
            var fourth = third + 1;
            faces.push(first, second, fourth);
            faces.push(first, fourth, third);
        }
    }

    var bottomCenter = vertices.length / 6;
    vertices.push(0, 0, -c / 2, 163/255, 131/255, 106/255);
    var topCenter = vertices.length / 6;
    vertices.push(0, 0, c / 2, 163/255, 131/255, 106/255);
    var topRingStart = stack * (step + 1);

    for (var j = 0; j < step; j++) {
        var next = j + 1;
        faces.push(bottomCenter, next, j);
        faces.push(topCenter, topRingStart + j, topRingStart + next);
    }

    return { vertices, faces };
}
export function eye1(a, b, c, stack, step) {
    var vertices = [];
    var faces = [];

    for (var i = 0; i <= stack; i++) {
        var z = -c / 2 + i / stack * c;
        for (var j = 0; j <= step; j++) {
            var angle = j / step * 2 * Math.PI;
            var x = a * Math.cos(angle);
            var y = b * Math.sin(angle);
            vertices.push(x, y, z);
            vertices.push(...[77/255, 8/255, 110/255]);
        }
    }

    for (var i = 0; i < stack; i++) {
        for (var j = 0; j < step; j++) {
            var first = i * (step + 1) + j;
            var second = first + 1;
            var third = first + (step + 1);
            var fourth = third + 1;
            faces.push(first, second, fourth);
            faces.push(first, fourth, third);
        }
    }

    var bottomCenter = vertices.length / 6;
    vertices.push(0, 0, -c / 2, 41/255, 4/255, 64/255);
    var topCenter = vertices.length / 6;
    vertices.push(0, 0, c / 2, 41/255, 4/255, 64/255);
    var topRingStart = stack * (step + 1);

    for (var j = 0; j < step; j++) {
        var next = j + 1;
        faces.push(bottomCenter, next, j);
        faces.push(topCenter, topRingStart + j, topRingStart + next);
    }

    return { vertices, faces };
}
export function eyeoutline2(a, b, c, stack, step) {
    var vertices = [];
    var faces = [];

    for (var i = 0; i <= stack; i++) {
        var z = -c / 2 + i / stack * c;
        for (var j = 0; j <= step; j++) {
            var angle = j / step * 2 * Math.PI;
            var x = a * Math.cos(angle);
            var y = b * Math.sin(angle);
            vertices.push(x, y, z);
            vertices.push(...[62/255, 71/255, 49/255]);
        }
    }

    for (var i = 0; i < stack; i++) {
        for (var j = 0; j < step; j++) {
            var first = i * (step + 1) + j;
            var second = first + 1;
            var third = first + (step + 1);
            var fourth = third + 1;
            faces.push(first, second, fourth);
            faces.push(first, fourth, third);
        }
    }

    var bottomCenter = vertices.length / 6;
    vertices.push(0, 0, -c / 2, 62/255, 71/255, 49/255);
    var topCenter = vertices.length / 6;
    vertices.push(0, 0, c / 2, 62/255, 71/255, 49/255);
    var topRingStart = stack * (step + 1);

    for (var j = 0; j < step; j++) {
        var next = j + 1;
        faces.push(bottomCenter, next, j);
        faces.push(topCenter, topRingStart + j, topRingStart + next);
    }

    return { vertices, faces };
}
export function eye2(a, b, c, stack, step) {
    var vertices = [];
    var faces = [];

    for (var i = 0; i <= stack; i++) {
        var z = -c / 2 + i / stack * c;
        for (var j = 0; j <= step; j++) {
            var angle = j / step * 2 * Math.PI;
            var x = a * Math.cos(angle);
            var y = b * Math.sin(angle);
            vertices.push(x, y, z);
            vertices.push(...[44/255, 46/255, 41/255]);
        }
    }

    for (var i = 0; i < stack; i++) {
        for (var j = 0; j < step; j++) {
            var first = i * (step + 1) + j;
            var second = first + 1;
            var third = first + (step + 1);
            var fourth = third + 1;
            faces.push(first, second, fourth);
            faces.push(first, fourth, third);
        }
    }

    var bottomCenter = vertices.length / 6;
    vertices.push(0, 0, -c / 2, 179/255, 194/255, 157/255);
    var topCenter = vertices.length / 6;
    vertices.push(0, 0, c / 2, 179/255, 194/255, 157/255);
    var topRingStart = stack * (step + 1);

    for (var j = 0; j < step; j++) {
        var next = j + 1;
        faces.push(bottomCenter, next, j);
        faces.push(topCenter, topRingStart + j, topRingStart + next);
    }

    return { vertices, faces };
}
export function keyhole1(a, b, c, stack, step) {
    var vertices = [];
    var faces = [];

    for (var i = 0; i <= stack; i++) {
        var z = -c / 2 + i / stack * c;
        for (var j = 0; j <= step; j++) {
            var angle = j / step * 2 * Math.PI;
            var x = a * Math.cos(angle);
            var y = b * Math.sin(angle);
            vertices.push(x, y, z);
            vertices.push(...[0/255, 0/255, 0/255]);
        }
    }

    for (var i = 0; i < stack; i++) {
        for (var j = 0; j < step; j++) {
            var first = i * (step + 1) + j;
            var second = first + 1;
            var third = first + (step + 1);
            var fourth = third + 1;
            faces.push(first, second, fourth);
            faces.push(first, fourth, third);
        }
    }

    var bottomCenter = vertices.length / 6;
    vertices.push(0, 0, -c / 2, 0/255, 0/255, 0/255);
    var topCenter = vertices.length / 6;
    vertices.push(0, 0, c / 2, 0/255, 0/255, 0/255);
    var topRingStart = stack * (step + 1);

    for (var j = 0; j < step; j++) {
        var next = j + 1;
        faces.push(bottomCenter, next, j);
        faces.push(topCenter, topRingStart + j, topRingStart + next);
    }

    return { vertices, faces };
}
export function buzzer(a, b, c, stack, step) {
    var vertices = [];
    var faces = [];

    for (var i = 0; i <= stack; i++) {
        var z = -c / 2 + i / stack * c;
        for (var j = 0; j <= step; j++) {
            var angle = j / step * 2 * Math.PI;
            var x = a * Math.cos(angle);
            var y = b * Math.sin(angle);
            vertices.push(x, y, z);
            if (j % 5 === 0) {
                vertices.push(...[190/255, 10/255, 10/255]);
            } else if (j % 5 === 2) {
                vertices.push(...[255/255, 255/255, 255/255]);
            }
            else if (j % 5 === 3) {
                vertices.push(...[255/255, 255/255, 255/255]);
            }
            else {
                vertices.push(...[10/255, 10/255, 10/255]);
            }
        }
    }

    for (var i = 0; i < stack; i++) {
        for (var j = 0; j < step; j++) {
            var first = i * (step + 1) + j;
            var second = first + 1;
            var third = first + (step + 1);
            var fourth = third + 1;
            faces.push(first, second, fourth);
            faces.push(first, fourth, third);
        }
    }

    var bottomCenter = vertices.length / 6;
    vertices.push(0, 0, -c / 2, 0/255, 0/255, 0/255);
    var topCenter = vertices.length / 6;
    vertices.push(0, 0, c / 2, 0/255, 0/255, 0/255);
    var topRingStart = stack * (step + 1);

    for (var j = 0; j < step; j++) {
        var next = j + 1;
        faces.push(bottomCenter, next, j);
        faces.push(topCenter, topRingStart + j, topRingStart + next);
    }

    return { vertices, faces };
}