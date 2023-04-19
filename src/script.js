// Model Control
const rotateX = document.getElementById("rotateX");
const rotateY = document.getElementById("rotateY");
const rotateZ = document.getElementById("rotateZ");
const translateX = document.getElementById("translateX");
const translateY = document.getElementById("translateY");
const translateZ = document.getElementById("translateZ");
const scaleX = document.getElementById("scaleX");
const scaleY = document.getElementById("scaleY");
const scaleZ = document.getElementById("scaleZ");

// Subtree Control
const rotateXsubtree = document.getElementById("rotateXsubtree");
const rotateYsubtree = document.getElementById("rotateYsubtree");
const rotateZsubtree = document.getElementById("rotateZsubtree");
const translateXsubtree = document.getElementById("translateXsubtree");
const translateYsubtree = document.getElementById("translateYsubtree");
const translateZsubtree = document.getElementById("translateZsubtree");
const scaleXsubtree = document.getElementById("scaleXsubtree");
const scaleYsubtree = document.getElementById("scaleYsubtree");
const scaleZsubtree = document.getElementById("scaleZsubtree");

// Single Control
const rotateXsingle = document.getElementById("rotateXsingle");
const rotateYsingle = document.getElementById("rotateYsingle");
const rotateZsingle = document.getElementById("rotateZsingle");
const translateXsingle = document.getElementById("translateXsingle");
const translateYsingle = document.getElementById("translateYsingle");
const translateZsingle = document.getElementById("translateZsingle");
const scaleXsingle = document.getElementById("scaleXsingle");
const scaleYsingle = document.getElementById("scaleYsingle");
const scaleZsingle = document.getElementById("scaleZsingle");

// Model View
const selectedProjection = document.getElementById("selectedProjection");
const cameraAngle = document.getElementById("cameraAngle");
const cameraRadius = document.getElementById("cameraRadius");
const lightPositionX = document.getElementById("lightPositionX");
const lightPositionY = document.getElementById("lightPositionY");
const lightPositionZ = document.getElementById("lightPositionZ");
const lightCheckbox = document.getElementById("lightCheckbox");
const resetViewbtn = document.getElementById("reset-view-btn");

// Single / Subtree View
const selectedProjectionSs = document.getElementById("selectedProjectionSs");
const selectedViewSs = document.getElementById("selectedViewSs");
const cameraAngleSs = document.getElementById("cameraAngleSs");
const cameraRadiusSs = document.getElementById("cameraRadiusSs");
const lightPositionXSs = document.getElementById("lightPositionXSs");
const lightPositionYSs = document.getElementById("lightPositionYSs");
const lightPositionZSs = document.getElementById("lightPositionZSs");
const lightCheckboxSs = document.getElementById("lightCheckboxSs");
const resetViewbtnSs = document.getElementById("reset-view-btnSs");

window.onload = function main() {
    // Model Control
    rotateX.addEventListener("input", function() {
        rootShapeNode.pivotRotate[0] = rotateX.value;
        refresh();
    });
    rotateY.addEventListener("input", function() {
        rootShapeNode.pivotRotate[1] = rotateY.value;
        refresh();
    });
    rotateZ.addEventListener("input", function() {
        rootShapeNode.pivotRotate[2] = rotateZ.value;
        refresh();
    });

    translateX.addEventListener("input", e => {
        rootShapeNode.pivotTranslate[0] = translateX.value;
        refresh();
    });
    translateY.addEventListener("input", e => {
        rootShapeNode.pivotTranslate[1] = translateY.value;
        refresh();
    });
    translateZ.addEventListener("input", e => {
        rootShapeNode.pivotTranslate[2] = translateZ.value;
        refresh();
    });

    scaleX.addEventListener("input", e => {
        rootShapeNode.pivotScale[0] = scaleX.value;
        refresh();
    });
    scaleY.addEventListener("input", e => {
        rootShapeNode.pivotScale[1] = scaleY.value;
        refresh();
    });
    scaleZ.addEventListener("input", e => {
        rootShapeNode.pivotScale[2] = scaleZ.value;
        refresh();
    });

    // Subtree Control
    rotateXsubtree.addEventListener("input", function() {
        selectedShapeNode.pivotRotate[0] = rotateXsubtree.value;
        refresh();
    });
    rotateYsubtree.addEventListener("input", function() {
        selectedShapeNode.pivotRotate[1] = rotateYsubtree.value;
        refresh();
    });
    rotateZsubtree.addEventListener("input", function() {
        selectedShapeNode.pivotRotate[2] = rotateZsubtree.value;
        refresh();
    });

    translateXsubtree.addEventListener("input", e => {
        selectedShapeNode.pivotTranslate[0] = translateXsubtree.value;
        refresh();
    });
    translateYsubtree.addEventListener("input", e => {
        selectedShapeNode.pivotTranslate[1] = translateYsubtree.value;
        refresh();
    });
    translateZsubtree.addEventListener("input", e => {
        selectedShapeNode.pivotTranslate[2] = translateZsubtree.value;
        refresh();
    });

    scaleXsubtree.addEventListener("input", e => {
        selectedShapeNode.pivotScale[0] = scaleXsubtree.value;
        refresh();
    });
    scaleYsubtree.addEventListener("input", e => {
        selectedShapeNode.pivotScale[1] = scaleYsubtree.value;
        refresh();
    });
    scaleZsubtree.addEventListener("input", e => {
        selectedShapeNode.pivotScale[2] = scaleZsubtree.value;
        refresh();
    });

    // Single Control
    rotateXsingle.addEventListener("input", function() {
        selectedShapeNode.objectRotate[0] = rotateXsingle.value;
        refresh();
    });
    rotateYsingle.addEventListener("input", function() {
        selectedShapeNode.objectRotate[1] = rotateYsingle.value;
        refresh();
    });
    rotateZsingle.addEventListener("input", function() {
        selectedShapeNode.objectRotate[2] = rotateZsingle.value;
        refresh();
    });

    translateXsingle.addEventListener("input", e => {
        selectedShapeNode.objectTranslate[0] = translateXsingle.value;
        refresh();
    });
    translateYsingle.addEventListener("input", e => {
        selectedShapeNode.objectTranslate[1] = translateYsingle.value;
        refresh();
    });
    translateZsingle.addEventListener("input", e => {
        selectedShapeNode.objectTranslate[2] = translateZsingle.value;
        refresh();
    });

    scaleXsingle.addEventListener("input", e => {
        selectedShapeNode.objectScale[0] = scaleXsingle.value;
        refresh();
    });
    scaleYsingle.addEventListener("input", e => {
        selectedShapeNode.objectScale[1] = scaleYsingle.value;
        refresh();
    });
    scaleZsingle.addEventListener("input", e => {
        selectedShapeNode.objectScale[2] = scaleZsingle.value;
        refresh();
    });

    // Model View
    cameraAngle.addEventListener("input",  () => {
        globalState.cameraRotate = cameraAngle.value;
        refresh();
    });
    
    cameraRadius.addEventListener("input", () => {
        globalState.cameraRadius = cameraRadius.value;
        refresh();
    });

    lightPositionX.addEventListener("input", () => {
        globalState.lightPosition[0] = lightPositionX.value;
        refresh();
    });

    lightPositionY.addEventListener("input", () => {
        globalState.lightPosition[1] = lightPositionY.value;
        refresh();
    });

    lightPositionZ.addEventListener("input", () => {
        globalState.lightPosition[2] = lightPositionZ.value;
        refresh();
    });

    lightCheckbox.addEventListener("change", () => {
        if (lightCheckbox.checked) {
            gl.clearColor(0.0, 0.0, 0.0, 0.8);
            globalState.isLight = 1;
        } else {       
            gl.clearColor(0.75, 0.85, 0.8, 1.0);
            globalState.isLight = 0;
        }
        refresh();
    });

    const resetViewbtn = document.getElementById("reset-view-btn");
    resetViewbtn.addEventListener("click", function() {
        resetView();
    });

    // Single / Subtree View
    cameraAngleSs.addEventListener("input",  () => {
        ssGlobalState.cameraRotate = cameraAngleSs.value;
        refresh();
    });
    
    cameraRadiusSs.addEventListener("input", () => {
        ssGlobalState.cameraRadius = cameraRadiusSs.value;
        refresh();
    });

    lightPositionXSs.addEventListener("input", () => {
        ssGlobalState.lightPosition[0] = lightPositionXSs.value;
        refresh();
    });

    lightPositionYSs.addEventListener("input", () => {
        ssGlobalState.lightPosition[1] = lightPositionYSs.value;
        refresh();
    });

    lightPositionZSs.addEventListener("input", () => {
        ssGlobalState.lightPosition[2] = lightPositionZSs.value;
        refresh();
    });

    lightCheckboxSs.addEventListener("change", () => {
        if (lightCheckboxSs.checked) {
            gl.clearColor(0.0, 0.0, 0.0, 0.8);
            ssGlobalState.isLight = 1;
        } else {       
            gl.clearColor(0.75, 0.85, 0.8, 1.0);
            ssGlobalState.isLight = 0;
        }
        refresh();
    });

    resetViewbtnSs.addEventListener("click", function() {
        resetView();
    });

    // Export
    const exportbtn = document.getElementById("export-btn");
    exportbtn.addEventListener("click", function() {
        exportShape();
    });

    // Import
    const importbtn = document.getElementById("import-btn");
    importbtn.addEventListener("click", function() {
        importShape();
    });
}

function refresh() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    rootShapeNode.draw();
}

function exportShape() {
    // const data = JSON.stringify(transformedShapes);
    // const blob = new Blob([data], { type: "application/json" });
    // const url = URL.createObjectURL(blob);

    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "test.json";
    // document.body.appendChild(link);
    // link.click();
}

function importShape() {
    const file = document.getElementById("file-input").files[0];
    if (file === undefined) {
        alert("no file selected");
        return;
    }

    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (evt) => {
        const shapeJSONstr = evt.target.result;
        const shapeJSON = JSON.parse(shapeJSONstr);

        rootShapeNode = new ShapeNode(shapeJSON);
        setSelectedShapeNode(rootShapeNode);

        setupModelControls();
        setupSubtreeControls();
        setupSingleControls();
        refresh();

        document.getElementById("component-tree").appendChild(generateComponentTree(rootShapeNode));
    };
}

function generateComponentTree(shapeNode) {
    let liElement = document.createElement("li")

    let button = document.createElement("button");
    button.innerHTML = shapeNode.name;
    button.onclick = function() { setSelectedShapeNode(shapeNode) }

    liElement.appendChild(button);

    if (shapeNode.children.length > 0) {
        let ulElement = document.createElement("ul");
        for (let i = 0; i < shapeNode.children.length; i++) {
            ulElement.appendChild(generateComponentTree(shapeNode.children[i]))
        }
        liElement.appendChild(ulElement);
    }

    return liElement;
}

function setSelectedShapeNode(shapeNode) {
    selectedShapeNode = shapeNode;

    setupSubtreeControls();
    setupSingleControls();
}

function setupModelControls() {
    const allInput = document.querySelectorAll("#model-control > input");

    Array.from(allInput, input => input.removeAttribute("disabled"));

    rotateX.value = rootShapeNode.pivotRotate[0];
    rotateY.value = rootShapeNode.pivotRotate[1];
    rotateZ.value = rootShapeNode.pivotRotate[2];
    translateX.value = rootShapeNode.pivotTranslate[0];
    translateY.value = rootShapeNode.pivotTranslate[1];
    translateZ.value = rootShapeNode.pivotTranslate[2];
    scaleX.value = rootShapeNode.pivotScale[0];
    scaleY.value = rootShapeNode.pivotScale[1];
    scaleZ.value = rootShapeNode.pivotScale[2];
}

function setupSubtreeControls() {
    const allInput = document.querySelectorAll("#subtree-control > input");

    Array.from(allInput, input => input.removeAttribute("disabled"));

    rotateXsubtree.value = selectedShapeNode.pivotRotate[0];
    rotateYsubtree.value = selectedShapeNode.pivotRotate[1];
    rotateZsubtree.value = selectedShapeNode.pivotRotate[2];
    translateXsubtree.value = selectedShapeNode.pivotTranslate[0];
    translateYsubtree.value = selectedShapeNode.pivotTranslate[1];
    translateZsubtree.value = selectedShapeNode.pivotTranslate[2];
    scaleXsubtree.value = selectedShapeNode.pivotScale[0];
    scaleYsubtree.value = selectedShapeNode.pivotScale[1];
    scaleZsubtree.value = selectedShapeNode.pivotScale[2];
}

function setupSingleControls() {
    const allInput = document.querySelectorAll("#single-control > input");

    Array.from(allInput, input => input.removeAttribute("disabled"));

    rotateXsingle.value = selectedShapeNode.objectRotate[0];
    rotateYsingle.value = selectedShapeNode.objectRotate[1];
    rotateZsingle.value = selectedShapeNode.objectRotate[2];
    translateXsingle.value = selectedShapeNode.objectTranslate[0];
    translateYsingle.value = selectedShapeNode.objectTranslate[1];
    translateZsingle.value = selectedShapeNode.objectTranslate[2];
    scaleXsingle.value = selectedShapeNode.objectScale[0];
    scaleYsingle.value = selectedShapeNode.objectScale[1];
    scaleZsingle.value = selectedShapeNode.objectScale[2];
}

function setProjectionType() {
    globalState.projectionType = selectedProjection.value;
    refresh();
}

function setGlobalControls() {
    selectedProjection.value = globalState.projectionType;
    cameraAngle.value = globalState.cameraRotate;
    cameraRadius.value = globalState.cameraRadius;
    lightPositionX.value = globalState.lightPosition[0];
    lightPositionY.value = globalState.lightPosition[1];
    lightPositionZ.value = globalState.lightPosition[2];
    if (globalState.isLight == 0) {
        lightCheckbox.checked = false;
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
    }
    else {
        lightCheckbox.checked = true;
        gl.clearColor(0.0, 0.0, 0.0, 0.8);
    }
}

function resetView() {
    globalState = defaultGlobalState();
    setGlobalControls();
    refresh();
}

function clearCanvas() {
    shapes.splice(0, shapes.length);
    transformedShapes.splice(0, transformedShapes.length);
    transformationStates.splice(0, transformationStates.length);
    currentShapeIndex = 0;
    setupModelControls();
    refresh();
}