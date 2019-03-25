import { PlaneGeometry, MeshBasicMaterial, Scene, NearestFilter, Mesh } from "three";
import { Widget } from "./classes";
import { Element } from "./interfaces";
import { Resources } from "../resourcemanager";

/**
 * React-like render method for widgets.
 * @param element 
 * @param parentWidget 
 * @param scene 
 */
export function renderWidget(element: Element, parentWidget: Widget, scene: Scene): void {
    const { type, props } = element;
    const widget = createWidget(type, scene);

    // Add event listeners.
    const isListener = name => name.startsWith("on");
    Object.keys(props).filter(isListener).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        widget.setEventListener(eventType, props[name]);
    });

    // Add attributes.
    const isAttribute = name => !isListener(name);
    Object.keys(props).filter(isAttribute).forEach(name => {
        widget.setAttr(name, props[name]);
    });

    // Render child widgets.
    const childElement = element.children || [];
    childElement.forEach(childElement => renderWidget(childElement, widget, scene));

    // Layout widget.
    layoutWidget(widget);

    // Append widget to parent widget.
    parentWidget.appendChild(widget);
}

/**
 * Returns new Widget and add it's mesh to the scene.
 * @param type 
 * @param scene 
 */
function createWidget(type: string, scene: Scene): Widget {
    let widget = new Widget(type);
    scene.add(widget);
    return widget;
}

/**
 * Layout widget by updating Mesh properties for any relevant attribute.
 * Gets called when Widget is create or setState is called.
 * @param widget 
 */
function layoutWidget(widget: Widget): void {
    // Update plane geometry with height and width attributes.
    if (widget.attr("height") && widget.attr("width")) {
        widget.geometry = new PlaneGeometry(Number(widget.attr("width")), Number(widget.attr("height")));
    }

    // Update mesh's material with color attribute.
    if (widget.attr("color")) {
        widget.material = new MeshBasicMaterial({color: widget.attr("color")});
    }

    // Update mesh's material and geometry based on img attribute.
    if (widget.attr("img")) {
        // Get scaleFactor if exists.
        const scaleFactor: number = widget.attr("scale-factor") ? Number(widget.attr("scale-factor")) : 1;
        const hasColor: boolean = widget.attr("color") ? true : false;
        // Get texture from cached resources.
        let imgMap = Resources.instance.getTexture(widget.attr("img"));
        // Set magFilter to nearest for crisp looking pixels.
        imgMap.magFilter = NearestFilter;

        // If color attr exists, add img mesh to widget.
        if (hasColor) {
            var geometry = new PlaneGeometry(imgMap.image.width*scaleFactor, imgMap.image.height*scaleFactor);
            var material = new MeshBasicMaterial( { map: imgMap, transparent: true });
            var img = new Mesh(geometry, material);
            widget.add(img);
        }
        // Otherwise, set widget's geometry and material to img mesh.
        else {
            widget.geometry = new PlaneGeometry(imgMap.image.width*scaleFactor, imgMap.image.height*scaleFactor);
            widget.material = new MeshBasicMaterial( { map: imgMap, transparent: true });
        }
    }
}