import { Mesh, Scene } from "THREE";

export class Widget extends Mesh {
    private _type: string;
    private _parent: Widget;
    private _children: Widget[] = [];
    private _attributes: AttrKeyToAttrValueMap = {};
    private _events: EventKeyToEventMap = {};
    constructor(type: string) {
        super();
        this._type = type;
    }
    public getType(): string {
        return this._type;
    }
    public getParent(): Widget {
        return this._parent;
    }
    public get childNodes(): Widget[] {
        return this._children;
    }
    public appendChild(child: Widget): void {
        child._parent = this;
        if (this.attr("z_index")) {
            child.setAttr("z_index", this.attr("z_index"));
        }
        this._children.push(child);
    }
    public removeChild(child: Widget): void {
        if (this._children.indexOf(child) !== -1) {
            this._children.splice(this._children.indexOf(child), 1);
        }
    }
    public setAttr(name: string, value: string): void {
        this._attributes[name] = value;
    }
    public attr(name: string): string {
        return this._attributes[name];
    }
    public setEventListener(eventType: string, event: () => void): void {
        this._events[eventType] = event;
    }
    public trigger(name: string): void {
        if (this._events[name])
            this._events[name]();
    }
}

/**
 * Returns new Widget and add it's mesh to the scene.
 * @param type 
 * @param scene 
 */
export function createWidget(type: string, scene: Scene): Widget {
    let widget = new Widget(type);
    scene.add(widget);
    return widget;
}

interface AttrKeyToAttrValueMap {
    [key: string]: string;
}

interface EventKeyToEventMap {
    [key: string]: () => void;
}