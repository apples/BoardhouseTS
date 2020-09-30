import { last } from "./helpers";
import { Engine } from "./engine";

export function setEventListeners(engine: Engine) {
    // call first to scale to current window dimensions
    scaleToWindow(engine.renderer.domElement);

    if (engine.globalErrorHandling)
        window.onerror = function(message, source, lineno, colno, error) { 
            alert(error);
        };

    window.addEventListener("resize", function () {
        scaleToWindow(engine.renderer.domElement);
    });

    // No event handling needed for touchstart since we are using pointerdown instead.
    engine.renderer.domElement.addEventListener("touchstart", function (e: TouchEvent) {
        // This prevents the small vibration or "haptic feedback" from triggering after a long press.
        // We don't want this since it's not useful feedback for users.
        e.preventDefault();
    });

    engine.renderer.domElement.addEventListener("mousedown", function (e: MouseEvent) {
        last(engine.stateStack).handleEvent(e);
    });

    engine.renderer.domElement.addEventListener("mouseup", function (e: MouseEvent) {
        last(engine.stateStack).handleEvent(e);
    });

    engine.renderer.domElement.addEventListener("pointerdown", function (e: PointerEvent) {
        e.preventDefault(); // Prevents MouseEvent from also firing.

        last(engine.stateStack).handleEvent(e);
    });

    engine.renderer.domElement.addEventListener("pointerup", function (e: PointerEvent) {
        e.preventDefault(); // Prevents MouseEvent from also firing.
        last(engine.stateStack).handleEvent(e);
    });

    window.onkeydown = function(e: KeyboardEvent) {
        last(engine.stateStack).handleEvent(e);
    }

    window.onkeyup = function(e: KeyboardEvent) {
        last(engine.stateStack).handleEvent(e);
    }
}

/**
 * kittykatattack is the author of this scaling function.
 * Source can be found here:
 * https://github.com/kittykatattack/scaleToWindow
 * @param canvas HTMLCanvasElement
 */
function scaleToWindow(canvas: HTMLCanvasElement): number {
    var scaleX: number;
    var scaleY: number;
    var scale: number;
    var center: string;

    //1. Scale the canvas to the correct size
    //Figure out the scale amount on each axis
    scaleX = window.innerWidth / canvas.offsetWidth;
    scaleY = window.innerHeight / canvas.offsetHeight;

    //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
    scale = Math.min(scaleX, scaleY);
    canvas.style.transformOrigin = "0 0";
    canvas.style.transform = "scale(" + scale + ")";

    //2. Center the canvas.
    //Decide whether to center the canvas vertically or horizontally.
    //Wide canvases should be centered vertically, and 
    //square or tall canvases should be centered horizontally
    if (canvas.offsetWidth > canvas.offsetHeight) {
        if (canvas.offsetWidth * scale < window.innerWidth) {
            center = "horizontally";
        } else {
            center = "vertically";
        }
    } else {
        if (canvas.offsetHeight * scale < window.innerHeight) {
            center = "vertically";
        } else {
            center = "horizontally";
        }
    }

    //Center horizontally (for square or tall canvases)
    var margin;
    if (center === "horizontally") {
        margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
        canvas.style.marginTop = 0 + "px";
        canvas.style.marginBottom = 0 + "px";
        canvas.style.marginLeft = margin + "px";
        canvas.style.marginRight = margin + "px";
    }

    //Center vertically (for wide canvases) 
    if (center === "vertically") {
        margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
        canvas.style.marginTop = margin + "px";
        canvas.style.marginBottom = margin + "px";
        canvas.style.marginLeft = 0 + "px";
        canvas.style.marginRight = 0 + "px";
    }

    //3. Remove any padding from the canvas  and body and set the canvas
    //display style to "block"
    canvas.style.paddingLeft = 0 + "px";
    canvas.style.paddingRight = 0 + "px";
    canvas.style.paddingTop = 0 + "px";
    canvas.style.paddingBottom = 0 + "px";
    canvas.style.display = "block";

    //4. Set the color of the HTML body background
    document.body.style.backgroundColor = "black";

    //Fix some quirkiness in scaling for Safari
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
        if (ua.indexOf("chrome") > -1) {
            // Chrome
        } else {
            // Safari
            //canvas.style.maxHeight = "100%";
            //canvas.style.minHeight = "100%";
        }
    }

    //5. Return the `scale` value. This is important, because you'll nee this value 
    //for correct hit testing between the pointer and sprites
    return scale;
}