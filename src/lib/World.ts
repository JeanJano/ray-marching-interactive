import { Scene, PerspectiveCamera, WebGLRenderer } from "three";

export class World {
    private _canvas: HTMLCanvasElement;
    private _scene: Scene;
    private _camera: PerspectiveCamera;
    private _renderer: WebGLRenderer;
    private _aspect: number;
    private _onResizeCallback?: () => void;
    private _onAnimateCallback?: () => void;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._scene = new Scene();
        this._renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
        this._init_renderer();
        this._aspect = window.innerWidth / window.innerHeight;
        this._camera = new PerspectiveCamera(75, this._aspect, 0.1, 1000);
        this._init_camera();

        this._addCallBack();
    }

    private _init_renderer() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setClearColor(0xB6D7F5, 1);
    }

    private _init_camera() {
        this._camera.position.z = 5;
    }

    private _addCallBack() {
        window.addEventListener('resize', this.onResize);
    }

    public onResize = () => {
        this._aspect = window.innerWidth / window.innerHeight;
        this._camera.aspect = this._aspect;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    
        if (this._onResizeCallback) {
            this._onResizeCallback();
        }
    }

    public setOnResize(callback: () => void) {
        this._onResizeCallback = callback;
    }

    public setOnAnimate(callback: () => void) {
        this._onAnimateCallback = callback;
    }

    public animate = () => {
        if (this._onAnimateCallback) {
            this._onAnimateCallback();
        }
        requestAnimationFrame(this.animate);
        this._aspect = window.innerWidth / window.innerHeight;
        this._camera.aspect = this._aspect;
        this._camera.updateProjectionMatrix();
        this._renderer.render(this._scene, this._camera);

        
    }

    public get getCanvas() { return this._canvas; }
    public get getScene() { return this._scene; }
    public get getCamera() { return this._camera; }
    public get getRenderer() { return this._renderer; }
    public get getAspect() { return this._aspect; }

}