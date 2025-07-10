import { Scene, PerspectiveCamera, WebGLRenderer } from "three";

export class World {
    private _canvas: HTMLCanvasElement;
    private _scene: Scene;
    private _camera: PerspectiveCamera;
    private _renderer: WebGLRenderer;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._scene = new Scene();
        this._renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
        this._init_renderer();
        this._camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._init_camera();

        this._addCallBack();
    }

    private _init_renderer() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setPixelRatio(2);
        this._renderer.setClearColor(0xB6D7F5, 1);
    }

    private _init_camera() {
        this._camera.position.z = 2.5;
    }

    private _addCallBack() {
        window.addEventListener('resize', () => {
            this._camera.aspect = window.innerWidth / window.innerHeight;
            this._camera.updateProjectionMatrix();
            this._renderer.setSize(window.innerWidth, window.innerHeight);
          });
    }

    public animate = () => {
        requestAnimationFrame(this.animate);

        this._renderer.render(this._scene, this._camera);
    }

    public get getCanvas() { return this._canvas; }
    public get getScene() { return this._scene; }
    public get getCamera() { return this._camera; }
    public get getRenderer() { return this._renderer; }

}