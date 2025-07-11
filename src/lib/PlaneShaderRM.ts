import { Color, DirectionalLight, MathUtils, Mesh, PerspectiveCamera, PlaneGeometry, ShaderMaterial, Vector2, Vector3 } from "three";

export class PlaneShaderRM extends Mesh {
    private _camera: PerspectiveCamera;
    private _light: DirectionalLight;
    private _time: number;
    private _cameraForwardPos: Vector3;
    private _vectorZero: Vector3;

    constructor(vertex: string, fragment: string, camera: PerspectiveCamera, light: DirectionalLight) {
        const geometry = new PlaneGeometry();
        const material = new ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                u_eps: { value: 0.001 },
                u_maxDis: { value: 1000 },
                u_maxSteps: { value: 100 },

                u_clearColor: { value: new Color(0x000000) },
                u_camPos: { value: camera.position },
                u_camToWorldMat: { value: camera.matrixWorld },
                u_camInvProjMat: { value: camera.projectionMatrixInverse },

                u_lightDir: { value: light.position },
                u_lightColor: { value: light.color },

                u_diffIntensity: { value: 0.5 },
                u_specIntensity: { value: 3 },
                u_ambientIntensity: { value: 0.15 },
                u_shininess: { value: 16 },

                u_time: { value: 0 },
                u_mouse: { value: new Vector2(0.5, 0.5) }
            }
        })
        super(geometry, material);

        this._camera = camera;
        this._light = light;

        this._time = Date.now();
        this._cameraForwardPos = new Vector3(0, 0, -1);
        this._vectorZero = new Vector3(0,0,0)

        const nearPlaneWidth = camera.near * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.aspect * 2;
        const nearPlaneHeight = nearPlaneWidth / camera.aspect;
        this.scale.set(nearPlaneWidth, nearPlaneHeight, 1);

        this._addCallbacks();
    }

    private _addCallbacks() {
        window.addEventListener('mousemove', this._onMouseMove);
    }

    private _onMouseMove = (e: MouseEvent) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / innerHeight;
        if ((this.material as ShaderMaterial).uniforms) {
            (this.material as ShaderMaterial).uniforms.u_mouse.value.set(x, y);
        }
    }

    public onResize() {
        const nearPlaneWidth = this._camera.near * Math.tan(MathUtils.degToRad(this._camera.fov / 2)) * this._camera.aspect * 2;
        const nearPlaneHeight = nearPlaneWidth / this._camera.aspect;
        this.scale.set(nearPlaneWidth, nearPlaneHeight, 1);
    }

    public animate() {
        this._cameraForwardPos = this._camera.position.clone().add(this._camera.getWorldDirection(this._vectorZero).multiplyScalar(this._camera.near));
        this.position.copy(this._cameraForwardPos);
        this.rotation.copy(this._camera.rotation);

        if ((this.material as ShaderMaterial).uniforms) {
            (this.material as ShaderMaterial).uniforms.u_time.value = (Date.now() - this._time) / 1000;
        }
    }

    public setBackgroundColor(color: Color) {
        if ((this.material as ShaderMaterial).uniforms) {
            (this.material as ShaderMaterial).uniforms.u_clearColor.value = color;
        }
    }
}