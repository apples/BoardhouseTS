import { PositionComponent, VelocityComponent, AnimationComponent, HitBoxComponent, HurtBoxComponent, TimerComponent } from "./corecomponents";
import { ControlComponent } from "./controlcomponent";
import { Mesh } from "three";
import { HitBoxTypes } from "./enums";

/**
 * Class to represent an entity in the game. No constructor as an entity can
 * comprise of as many or as little of the properties listed here. Each component
 * should have a corresponding system that handles the game logic needed to update
 * the properties within the component.
 */
export class Entity {
     public HitBoxTypes: HitBoxTypes;
     public pos: PositionComponent;
     public vel: VelocityComponent;
     public sprite: Mesh;
     public anim: AnimationComponent;
     public control: ControlComponent;
     public hitBox: HitBoxComponent;
     public hurtBox: HurtBoxComponent;
     public timer: TimerComponent;
}