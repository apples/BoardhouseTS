import { scaleToWindow } from "./scaletowindow";
import { BaseState } from "./basestate";
import { Widget } from "../ui/widget";
import { Entity } from "./../states/gameplay/entity";
import { last } from "./helpers";
import { Vector3 } from "three";
import { Engine } from "./engine";

export function setEventListeners(engine: Engine) {
    let hoveredWidgets: Widget[] = [];
    // call first to scale to current window dimensions
    scaleToWindow(engine.renderer.domElement);

    window.addEventListener("resize", function () {
        scaleToWindow(engine.renderer.domElement);
    });

    engine.renderer.domElement.addEventListener("mousedown", function (e: MouseEvent) {
        last(engine.stateStack).handleEvent(e);
        // canvas.setAttribute("class", "default");
    });

    engine.renderer.domElement.addEventListener("mousemove", function (e: MouseEvent) {
        last(engine.stateStack).handleEvent(e);
    });

    // keyboard controls
    // visit https://keycode.info/ for other key codes.
    window.onkeydown = function(e: KeyboardEvent) {
        switch(e.keyCode) {
            case 37: // left
            case 65: // a
                last(engine.stateStack).getEntitiesByKey<Entity>("control").forEach(ent=> {
                    if (ent.control) {
                        ent.control.left = true;
                    }
                });
                break;

            case 39: // right
            case 68: // d
                last(engine.stateStack).getEntitiesByKey<Entity>("control").forEach(ent=> {
                    if (ent.control) {
                        ent.control.right = true;
                    }
                });
                break;

            case 38: // up
            case 87: // w
                last(engine.stateStack).getEntitiesByKey<Entity>("control").forEach(ent=> {
                    if (ent.control) {
                        ent.control.up = true;
                    }
                });
                break;
            
            case 40: // down
            case 83: // s
                last(engine.stateStack).getEntitiesByKey<Entity>("control").forEach(ent=> {
                    if (ent.control) {
                        ent.control.down = true;
                    }
                });
                break;

            case 32: // spacebar
            case 90: // z
                last(engine.stateStack).getEntitiesByKey<Entity>("control").forEach(ent=> {
                    if (ent.control) {
                        ent.control.attack = true;
                    }
                });
                break;
        }
    }

    window.onkeyup = function(e: KeyboardEvent) {
        switch(e.keyCode) {
            case 37: // left
            case 65: // a
                last(engine.stateStack).getEntitiesByKey<Entity>("control").forEach(ent=> {
                    if (ent.control) {
                        ent.control.left = false;
                    }
                });
                break;

            case 39: // right
            case 68: // d
                last(engine.stateStack).getEntitiesByKey<Entity>("control").forEach(ent=> {
                    if (ent.control) {
                        ent.control.right = false;
                    }
                });
                break;

            case 38: // up
            case 87: // w
                last(engine.stateStack).getEntitiesByKey<Entity>("control").forEach(ent=> {
                    if (ent.control) {
                        ent.control.up = false;
                    }
                });
                break;
            
            case 40: // down
            case 83: // s
                last(engine.stateStack).getEntitiesByKey<Entity>("control").forEach(ent=> {
                    if (ent.control) {
                        ent.control.down = false;
                    }
                });
                break;

            case 32: // spacebar
            case 90: // z
                last(engine.stateStack).getEntitiesByKey<Entity>("control").forEach(ent=> {
                    if (ent.control) {
                        ent.control.attack = false;
                    }
                });
                break;
        }
    }
}

function traverseTreeForOnClick(widget: Widget, e: MouseEvent) {
    if (widget.event("click") && widget.attr("height") && widget.attr("width")) {
        const halfWidth = Number(widget.attr("width"))/2;
        const halfHeight = Number(widget.attr("height"))/2;

        const position = new Vector3();
        widget.getWorldPosition(position);

        if (e.offsetY > -position.y - halfHeight
            && e.offsetY - halfHeight < -position.y
            && e.offsetX > position.x - halfWidth
            && e.offsetX - halfWidth < position.x)
        {
            // TODO: Make sure only top most widget's click event is triggered.
            // Right now it's triggering all widgets' click events if they are stacked.
            widget.trigger("click", e);
        }
    }

    widget.childNodes.forEach(child => {
        traverseTreeForOnClick(child, e);
    });
}

function traverseTreeForHover(widget: Widget, hoveredWidgets: Widget[], canvas: HTMLCanvasElement, e: MouseEvent) {
    if (widget.event("hover") && widget.event("plunge") && widget.attr("height") && widget.attr("width")) {
        const halfWidth: number = Number(widget.attr("width"))/2;
        const halfHeight: number = Number(widget.attr("height"))/2;
        let widgetIndex: number = hoveredWidgets.indexOf(widget);

        const position = new Vector3();
        widget.getWorldPosition(position);

        if (e.offsetY > -position.y - halfHeight
            && e.offsetY - halfHeight < -position.y
            && e.offsetX > position.x - halfWidth
            && e.offsetX - halfWidth < position.x)
        {
            if (widgetIndex === -1) {
                hoveredWidgets.push(widget);
                widget.trigger("hover", e);

                // TODO: Remove this eventually...
                // canvas.setAttribute("class", "pointer"); // pointer cursor
            }
        }
        else {
            if (widgetIndex > -1) {
                widget.trigger("plunge", e);
                hoveredWidgets.splice(widgetIndex);
                // canvas.setAttribute("class", "default"); // arrow cursor
            }
        }
    }

    if (widget.childNodes.length > 0) {
        widget.childNodes.forEach(child => {
            traverseTreeForHover(child, hoveredWidgets, canvas, e);
        });
    }
}