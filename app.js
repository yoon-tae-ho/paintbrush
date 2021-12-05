// Canvas

const canvas = document.querySelector("#jsCanvas");
const ctx = canvas.getContext('2d');

const INITIAL_COLOR = "#2c2c2c";

// Default Canvas Background Color for Image Saving
clearCanvas();

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;
let erasing = false;
let currentBackgroundColor = "white";

let currentPath = new Path2D();
let pathObjArr = [];

function eraseLine(x, y) {
    let count = 0;

    pathObjArr.forEach(pathObj => {
        if(ctx.isPointInStroke(pathObj.path, x, y)) {
            pathObj.visible = false;
            ++count;
        }
    });
    
    if (count > 0) {
        clearCanvas(undefined, currentBackgroundColor);
        const currentStrokeStyle = ctx.strokeStyle;
        pathObjArr.forEach(pathObj => {
            if(pathObj.visible === true) {
                ctx.strokeStyle = pathObj.color;
                ctx.stroke(pathObj.path);
            }
        });
        ctx.strokeStyle = currentStrokeStyle;
    }
}

function storeCurrentPath() {
    const newPathObj = {
        path: currentPath,
        visible: true,
        color: ctx.strokeStyle
    };
    pathObjArr.push(newPathObj);
}

function stopPainting() {
    if (erasing) {
        painting = false;
        return;
    }
    
    if (painting) {
        storeCurrentPath();
        currentPath = new Path2D();
    }
    painting = false;
}

function startPainting() {
    painting = true;
}

function paintDot(x, y) {
    const lineWidth = ctx.lineWidth;
    ctx.lineWidth = lineWidth / 2;
    currentPath.arc(x, y, lineWidth / 4, 0, 2 * Math.PI);
    ctx.lineWidth = lineWidth;
    ctx.stroke(currentPath);
}

function handleMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting) {
        // ctx.beginPath();
        currentPath.moveTo(x, y);
    } else {
        if (erasing) {
            eraseLine(x, y);
        } else{
            currentPath.lineTo(x, y);
            ctx.stroke(currentPath);
        }
    }
}

function handleMouseDown(event) {
    const x = event.offsetX;
    const y = event.offsetY;

    if (erasing) {
        startPainting();
        eraseLine(x, y);
    }
    else if (filling) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        currentBackgroundColor = ctx.fillStyle;
    } else {
        startPainting();
        paintDot(x, y);
    }
}

if (canvas) {
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
}

// Change Color

const colorArr = document.querySelectorAll(".controls__color");

function changeColor(event) {
    const newColor = event.target.style.backgroundColor;
    ctx.strokeStyle = newColor;
    ctx.fillStyle = newColor;
}

if (colorArr) {
    colorArr.forEach(color => color.addEventListener("click", changeColor));
}

// Brush Size

const range = document.querySelector("#jsRange");

function changeBrushSize() {
    const newBrushSize = range.value;
    ctx.lineWidth = newBrushSize;
}

if (range) {
    range.addEventListener("change", changeBrushSize);
}

// Fill Mode

const modeBtn = document.querySelector("#jsMode");

function changeMode() {
    if (filling) {
        filling = false;
        modeBtn.innerText = "FILL";
    } else {
        filling = true;
        modeBtn.innerText = "PAINT";
    }
}

if (modeBtn) {
    modeBtn.addEventListener("click", changeMode);
}

// Save as Image

const saveBtn = document.querySelector("#jsSave")

function handleContextMenu(event) {
    event.preventDefault();
}

function saveImage(event) {
    const imageUrl = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "myPainting.png";
    link.click();
}

if (saveBtn) {
    saveBtn.addEventListener("click", saveImage);
    canvas.addEventListener("contextmenu", handleContextMenu);
}

// Clear Canvas

const clearBtn = document.querySelector("#jsClear");

function clearCanvas(event, color = "white") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentFillStyle = ctx.fillStyle;
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = currentFillStyle;
}

clearBtn.addEventListener("click", clearCanvas);

// Eraser

const eraseBtn = document.querySelector("#jsErase");

const CLICKED_CN = "clicked";

function handleEraseClick() {
    if (erasing) {
        erasing = false;
        eraseBtn.classList.remove(CLICKED_CN);
    } else {
        erasing = true;
        eraseBtn.classList.add(CLICKED_CN);
    }
}

eraseBtn.addEventListener("click", handleEraseClick);