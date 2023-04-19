function defaultGlobalState() {
    return {
        projectionType: "perspective", // orthographic, oblique, perspective
        cameraRadius: 0,
        cameraRotation: 0,
        lightPosition: [1, 1, -1],
        isLight: 0,
        viewType: "subtree"
    }
}

function defaultTransformationState() {
    return {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
    };
}

var rootShapeNode = null;
var selectedShapeNode = null;

var globalState = defaultGlobalState();
var ssGlobalState = defaultGlobalState();

var cameraMatrix = null;




