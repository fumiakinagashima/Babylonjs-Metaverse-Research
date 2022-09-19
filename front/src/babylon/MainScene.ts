import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  SceneLoader,
  AbstractMesh,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { AdvancedDynamicTexture, Rectangle, TextBlock } from "@babylonjs/gui";

interface Character {
  meshes: AbstractMesh[];
  ui: Rectangle;
}

export class MainScene {
  // Properties
  engine: Engine;
  scene: Scene;
  camera!: FreeCamera;
  characters: Map<string, Character>;
  
  constructor(
    private canvas: HTMLCanvasElement,
    private position: number[],
    private rotation: number[],
    private sendMessage: Function | null,
  ) {
    this.engine = new Engine(this.canvas);
    this.scene = this.GenScene(this.position, this.rotation);    
    this.LoadMeshObjectAsync("stage.glb");
    this.characters = new Map<string, Character>();
    
    // this.ShowWebCam();

    this.engine.runRenderLoop(() => {
      const position = this.camera.position;
      const rotation = this.camera.rotation;
      const param = {
        event: "moving",
        data: {
          position: [position.x, position.y - 1.7, position.z],
          rotation: [-rotation.x, rotation.y - Math.PI, rotation.z]
        }
      }
      if (this.sendMessage) this.sendMessage(param);
      this.scene.render();
    });
  }

  private GenScene(position: number[], rotation: number[]): Scene {
    // Create Scene.
    const scene = new Scene(this.engine);
    const fps = 60;
    const gravity = -9.81;
    scene.gravity = new Vector3(0, gravity / fps, 0);
    scene.collisionsEnabled = true;
    
    // Create Camera.
    const cameraPosition = new Vector3(position[0], 2.2, position[2]);
    const cameraRotaion = new Vector3(rotation[0], rotation[1] + Math.PI, rotation[2]);
    this.camera = new FreeCamera("camera", cameraPosition, this.scene);
    this.camera.rotation = cameraRotaion;
    this.camera.attachControl();
    this.camera.applyGravity = true;
    this.camera.checkCollisions = true;
    this.camera.ellipsoid = new Vector3(1, 1, 1);
    this.camera.minZ = 0.45;
    this.camera.speed = 0.25;
    this.camera.angularSensibility = 4000;

    //Create Light.
    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 3, 0),
      this.scene
    );
    hemiLight.intensity = 1.0;
 
    return scene;
  }

  private async LoadMeshObjectAsync(filename: string, addCollision: boolean = true): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "/assets/",
      filename,
      this.scene
    );

    if (addCollision) {
      meshes.forEach((mesh) => mesh.checkCollisions = true);
    }
  }

  public Resize() {
    this.engine.resize();
  }

  public async LoadCharacterAsync(id: string, name: string, type: string, position: number[], rotation: number[]): Promise<void> {
    // Load Character model.
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "/assets/",
      `chara_${type}.glb`,
      this.scene
    );

    let rect = new Rectangle();;
    meshes.forEach((mesh) => {
      mesh.checkCollisions = true
      if (mesh.name === '__root__') {
        mesh.position = new Vector3(position[0], position[1], position[2]);
        mesh.rotation = new Vector3(rotation[0], rotation[1], rotation[2]);
      } else if (mesh.name === 'geo1_primitive1') {
        // make GUI for character"s name
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        rect.width = "120px";
        rect.height = "32px";
        rect.cornerRadius = 6;
        rect.color = "#666";
        rect.thickness = 2;
        rect.background = "#ddd";
        advancedTexture.addControl(rect);

        const label = new TextBlock();
        label.text = name;
        rect.addControl(label);
        rect.linkWithMesh(mesh);
        rect.linkOffsetYInPixels = -50;
      }
    });

    this.characters.set(id, { meshes: meshes, ui: rect });
  }

  public MovingCharacter(id: string, position: number[], rotation: number[]) {
    const meshes = this.characters.get(id)?.meshes;
    meshes?.forEach((mesh) => {
      if (mesh.name === '__root__') {
        mesh.position = new Vector3(position[0], position[1], position[2]);
        mesh.rotation = new Vector3(rotation[0], rotation[1], rotation[2]);
      }
    })
  }

  public RemoveCharacter(id: string) {
    const character = this.characters.get(id);
    character?.meshes?.forEach((mesh) => {
      mesh.dispose();
    })
    character?.ui?.dispose();
    this.characters.delete(id);
  }

}
