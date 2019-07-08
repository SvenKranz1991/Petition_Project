var sigField = document.getElementById("SignatureCanvas");
const ctx = sigField.getContext("2d");
const input = document.getElementsByName("input")[0];

const field = sigField.getBoundingClientRect();

var x = 0;
var y = 0;

var painting = false;

sigField.addEventListener("mousedown", startSigning);
sigField.addEventListener("mouseup", endSigning);
sigField.addEventListener("mousemove", drawing);
sigField.addEventListener("mouseleave", stopSign);

function startSigning(e) {
    x = e.clientX - field.left;
    y = e.clientY - field.top;
    painting = true;
}

function endSigning() {
    input.value = sigField.toDataURL();
    console.log(input);
    painting = false;
}

function draw(ctx, xS, yS, xE, yE) {
    if (painting === false) return;
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(xS, yS);
    ctx.lineTo(xE, yE);
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

function stopSign() {
    ctx.closePath();
    painting = false;
}
