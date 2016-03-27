///<reference path="./threejs/three.d.ts"/>
///<reference path="./threejs/three-orbitcontrols.d.ts"/>

class Renderer {
    private renderer: THREE.WebGLRenderer;
    private _scene: THREE.Scene;
    private _camera: THREE.Camera;
    private _light: THREE.DirectionalLight;
    private _controls: THREE.OrbitControls;

    constructor(){
        this.renderer = new THREE.WebGLRenderer({ alpha: true });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000,0);
        this.renderer.sortObjects = true;

        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1.1, 400);
        //this._controls = new THREE.OrbitControls( this._camera );

        this._camera.position.x = 0;
        this._camera.position.y = -15;
        this._camera.position.z = -35;
        this._camera.lookAt(new THREE.Vector3(0,-7,0));

        this._light = new THREE.DirectionalLight( 0xffeeee, 0.85 );
        this._light.position.set( 1, 0.3, 0 );
        this._scene.add( this._light );

        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 250, 250, -250 );
        this._scene.add( spotLight );

        var ambientLight = new THREE.AmbientLight( 0x707070 ); // soft white light
        this.scene.add( ambientLight );

        var container = document.getElementById( 'content' );
        container.appendChild( this.renderer.domElement );

        window.addEventListener( 'resize', this.onWindowResize, false );
    }

    render() {
        this.renderer.render(this._scene,this._camera);
    }

    start() {
        this.render();
    }

    onWindowResize = () => {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    get scene():THREE.Scene {
        return this._scene;
    }

    set scene(value:THREE.Scene) {
        this._scene = value;
    }

    get camera():THREE.Camera {
        return this._camera;
    }

    set camera(value:THREE.Camera) {
        this._camera = value;
    }
}