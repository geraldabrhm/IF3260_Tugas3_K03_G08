function perspectiveMatrix() {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 1,
        0, 0, 0, 1
    ];
}

function orthographicMatrix() {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
}

function obliqueMatrix() {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        Math.cos(45/180*Math.PI)/2, Math.sin(45/180*Math.PI)/2, 1, 0,
        0, 0, 0, 1
    ];
}