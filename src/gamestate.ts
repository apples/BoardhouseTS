import {
    Scene,
    Camera,
    Color,
    WebGLRenderer,
    OrthographicCamera,
} from "three";
import { 
    positionSystem, 
    collisionSystem, 
    timerSystem, 
    animationSystem, 
    velocitySystem 
} from "./coresystems";
import { 
    initializeAnimation,
    initializeControls,
    initializeHitBox,
    initializeHurtBox,
    initializeSprite,
    initializePosition,
    initializeVelocity,
    initializeTimer,
} from "./initializers";
import {
    setHurtBoxGraphic,
    playAudio,
    setHitBoxGraphic
} from "./helpers";
import {
    HurtBoxTypes,
    SequenceTypes,
} from "./enums";
import { controlSystem } from "./controlsystem";
import { Entity } from "./entity";
import { playerAnim } from "../data/animations/player";
import { BaseState } from "./basestate";
// import { createWidget, ReconcileThreeDom, Widget } from "./widget";
import { JSX } from "./ui/interfaces";
import { Widget } from "./ui/widget";
import { renderWidget } from "./ui/renderwidget";
// import { createElement } from "./ui/createelement";
import { createGameUi } from "./gameui";
// import { BoardhouseUI } from "./boardhouseui";


/**
 * GameState that handles updating of all game-related systems.
 */
export class GameState extends BaseState {
    public gameScene: Scene;
    public gameCamera: Camera;
    public uiScene: Scene;
    public uiCamera: Camera;
    public rootWidget: Widget;
    constructor(stateStack: BaseState[]) {
        super(stateStack);
        // Set up game scene.
        this.gameScene = new Scene();
        this.gameScene.background = new Color("#FFFFFF");

        // Set up game camera.
        this.gameCamera = new OrthographicCamera(0, 1280, 720, 0, -1000, 1000);

        // Set up ui scene.
        this.uiScene = new Scene();

        // Set up ui camera.
        this.uiCamera = new OrthographicCamera(0, 1280, 0, -720, -1000, 1000);

        // Register systems.
        this.registerSystem(controlSystem, "control");
        this.registerSystem(velocitySystem);
        this.registerSystem(collisionSystem);
        this.registerSystem(animationSystem);
        this.registerSystem(timerSystem);
        this.registerSystem(positionSystem);

        //playAudio("./data/audio/Pale_Blue.mp3", 0.3, true);

        // Set up player entity.
        let player = new Entity();
        player.pos = initializePosition(150, 150, 5);
        player.sprite = initializeSprite("./data/textures/msknight.png", this.gameScene, 4);
        player.control = initializeControls();
        player.vel = initializeVelocity(1);
        player.vel.friction = 0.9;
        player.anim = initializeAnimation(SequenceTypes.walk, playerAnim);
        player.hurtBox = initializeHurtBox(player.sprite, HurtBoxTypes.test, 50, 50, -300, -100);
        player.timer = initializeTimer(250, () => { 
            // this.removeEntity(player);
            // Remove player sprite from scene.
            // this.gameScene.remove(player.sprite);
        });
        setHurtBoxGraphic(player.sprite, player.hurtBox);
        this.registerEntity(player);

        // Set up enemy entity.
        let enemy = new Entity();
        enemy.pos = initializePosition(300, 100, 4);
        enemy.sprite = initializeSprite("./data/textures/cottage.png", this.gameScene, 4);
        enemy.hitBox = initializeHitBox(enemy.sprite, [HurtBoxTypes.test], 50, 50, 100, 200);
        setHitBoxGraphic(enemy.sprite, enemy.hitBox);
        enemy.hitBox.onHit = function() {
            console.log("ouch!");
        }

        this.registerEntity(enemy);

        // vvv test ui vvv
        const uiElement: JSX.Element = createGameUi();

        // let rootWidget = new Widget("div");
        // this.uiScene.add(rootWidget);
        // this.rootWidget = null;

        renderWidget(uiElement, null, this.uiScene);
        // console.log(this.rootWidget);
        // this.rootWidget.childNodes[0].trigger('click');
        // console.log(this.rootWidget.childNodes[0].attr('height'));
        // ^^^ end test ui ^^^
    }

    public update() : void {
        this.runSystems();
    }

    public render(renderer: WebGLRenderer) : void {
        renderer.clear();
        renderer.render(this.gameScene, this.gameCamera);
        renderer.clearDepth();
        renderer.render(this.uiScene, this.uiCamera);

        // check if children needs to be reconciled, then do so
        // ReconcileThreeDom(this.rootWidget, this.uiScene);
        // BoardhouseUI.ReconcilePixiDom(this.rootWidget, stage);
    }
}