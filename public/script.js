var sigField = document.getElementById("SignatureCanvas");
const ctx = sigField.getContext("2d");

const field = sigField.getBoundingClientRect();

var x = 0;
var y = 0;

var painting = false;

sigField.addEventListener("mousedown", startSigning);
sigField.addEventListener("mouseup", endSigning);
sigField.addEventListener("mousemove", drawing);

function startSigning(e) {
    x = e.clientX - field.left;
    y = e.clientY - field.top;
    painting = true;
}

function endSigning() {
    painting = false;
}

function draw(ctx, x1, y1, x2, y2) {
    if (painting === false) return;
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function drawing(e) {
    if (painting == true) {
        draw(ctx, x, y, e.clientX - field.left, e.clientY - field.top);
        x = e.clientX - field.left;
        y = e.clientY - field.top;
    }
}
