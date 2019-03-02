import {
    Scene,
    Camera,
    WebGLRenderer,
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
// import { BoardhouseUI } from "./boardhouseui";


/**
 * GameState that handles updating of all game-related systems.
 */
export class GameState extends BaseState {
    constructor(scene: Scene, stateStack: BaseState[]) {
        super(scene, stateStack);

        // Register systems.
        this.registerSystem(controlSystem, "control");
        this.registerSystem(velocitySystem);
        this.registerSystem(collisionSystem);
        this.registerSystem(animationSystem);
        this.registerSystem(animationSystem);
        this.registerSystem(positionSystem);

        //playAudio("./data/audio/Pale_Blue.mp3", 0.3, true);

        // Set up player entity.
        let player = new Entity();
        player.pos = initializePosition(100, -100, 5);
        player.sprite = initializeSprite("./data/textures/msknight.png", scene, 4);
        player.control = initializeControls();
        player.vel = initializeVelocity(1);
        player.vel.friction = 0.9;
        player.anim = initializeAnimation(SequenceTypes.walk, playerAnim);
        player.hurtBox = initializeHurtBox(player.sprite, HurtBoxTypes.test, 50, 50, -300, -100);
        player.timer = initializeTimer(250, () => { this.removeEntity(player, scene); });
        setHurtBoxGraphic(player.sprite, player.hurtBox);
        this.registerEntity(player, "control");

        // Set up enemy entity.
        let enemy = new Entity();
        enemy.pos = initializePosition(-300, -100, 4);
        enemy.sprite = initializeSprite("./data/textures/cottage.png", scene, 4);
        enemy.hitBox = initializeHitBox(enemy.sprite, [HurtBoxTypes.test], 50, 50, 100, 200);
        setHitBoxGraphic(enemy.sprite, enemy.hitBox);
        enemy.hitBox.onHit = function() {
            console.log("ouch!");
        }

        this.registerEntity(enemy);
    }

    public update() : void {
        // pull in all system free functions and call each in the proper order
        this.runSystems();
        // controlSystem(this.getControllableEnts());
        // velocitySystem(this.getGlobalEnts());
        // collisionSystem(this.getGlobalEnts());
        // animationSystem(this.getGlobalEnts());
        // timerSystem(this.getGlobalEnts());
    }

    public render(renderer: WebGLRenderer, camera: Camera, scene: Scene) : void {
        // positionSystem(this.getGlobalEnts());

        renderer.render(scene, camera);
        // check if children needs to be reconciled, then do so
        // BoardhouseUI.ReconcilePixiDom(this.rootWidget, stage);
    }
}