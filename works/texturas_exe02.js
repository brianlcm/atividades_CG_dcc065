function main() {
    var scene = new THREE.Scene();    // Create main scene
    var stats = initStats();          // To show FPS information
    var renderer = initRenderer();    // View function in util/utils
    renderer.setClearColor("rgb(30, 30, 42)");

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.position.set(2.0, -10.0, 15.0);
    camera.up.set(0, 1, 0);

    var lightPosition = new THREE.Vector3(0.0, -10.0, 5.0);
    var light = initDefaultLighting(scene, lightPosition); // Use default light

    // Enable mouse rotation, pan, zoom etc.
    var trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

    // Listen window size changes
    window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

    //----------------------------------------------------------------------------
    //-- Scene Objects -----------------------------------------------------------

    /*var planeGeometry = new THREE.PlaneGeometry(10.0, 10.0, 10, 10);
    var planeMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255,255,255)", side: THREE.DoubleSide });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);*/

    var cylinderGeometry = new THREE.CylinderGeometry(1.0, 1.0, 4, 32, 1, true);
    var cylinderMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255,255,255)", side: THREE.DoubleSide });
    var cilindro = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cilindro.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(-90));
    cilindro.position.set(0,0,2);
    scene.add(cilindro);

    var circulo1 = retornaCirculo();
    circulo1.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(-90));
    circulo1.position.set(0,2,0);
    cilindro.add(circulo1);

    var circulo2 = retornaCirculo();
    circulo2.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(-90));
    circulo2.position.set(0,-2,0);
    cilindro.add(circulo2);

    function retornaCirculo() {
        var circleGeometry = new THREE.CircleGeometry(1.0, 32.0);
        var circleMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255,255,255)", side: THREE.DoubleSide });
        var circulo = new THREE.Mesh(circleGeometry, circleMaterial);
        return circulo;
    }

    //----------------------------------------------------------------------------
    //-- Use TextureLoader to load texture files
    var textureLoader = new THREE.TextureLoader();
    var wood = textureLoader.load('../assets/textures/wood.png');
    var woodtop = textureLoader.load('../assets/textures/woodtop.png');

    // Apply texture to the 'map' property of the plane
    cilindro.material.map = wood;
    circulo1.material.map = woodtop;
    circulo2.material.map = woodtop;

    // Set defaults
    var repeatFactor = 1;
    var wrapModeS = THREE.RepeatWrapping;
    var wrapModeT = THREE.RepeatWrapping;
    var minFilter = THREE.LinearFilter;
    var magFilter = THREE.LinearFilter;
    updateTexture();

    //buildInterface();
    render();

    function updateTexture() {
        cilindro.material.map.repeat.set(repeatFactor, repeatFactor);
        cilindro.material.map.wrapS = wrapModeS;
        cilindro.material.map.wrapT = wrapModeT;
        cilindro.material.map.minFilter = minFilter;
        cilindro.material.map.magFilter = magFilter;

        circulo1.material.map.repeat.set(repeatFactor, repeatFactor);
        circulo1.material.map.wrapS = wrapModeS;
        circulo1.material.map.wrapT = wrapModeT;
        circulo1.material.map.minFilter = minFilter;
        circulo1.material.map.magFilter = magFilter;

        circulo2.material.map.repeat.set(repeatFactor, repeatFactor);
        circulo2.material.map.wrapS = wrapModeS;
        circulo2.material.map.wrapT = wrapModeT;
        circulo2.material.map.minFilter = minFilter;
        circulo2.material.map.magFilter = magFilter;
    }

    /*function buildInterface() {
        //------------------------------------------------------------
        // Interface
        var controls = new function () {
            this.wrapS = 'Repeat';
            this.wrapT = 'Repeat';
            this.repeat = repeatFactor;
            this.mag = 'Linear';
            this.min = 'Linear';

            this.onChangeRepeatFactor = function () {
                repeatFactor = this.repeat;
                updateTexture();
            };
            this.onChangingWrappingMode_S = function () {
                switch (this.wrapS) {
                    case 'Clamp':
                        wrapModeS = THREE.ClampToEdgeWrapping;
                        break;
                    case 'Repeat':
                        wrapModeS = THREE.RepeatWrapping;
                        break;
                }
                cubo1.material.map.needsUpdate = true;
                updateTexture();
            };
            this.onChangingWrappingMode_T = function () {
                switch (this.wrapT) {
                    case 'Clamp':
                        wrapModeT = THREE.ClampToEdgeWrapping;
                        break;
                    case 'Repeat':
                        wrapModeT = THREE.RepeatWrapping;
                        break;
                }
                cubo1.material.map.needsUpdate = true;
                updateTexture();
            };
            // Best to see if the object is far
            this.onChangingMinification = function () {
                switch (this.min) {
                    case 'Linear':
                        minFilter = THREE.LinearFilter;
                        break;
                    case 'Nearest':
                        minFilter = THREE.NearestFilter;
                        break;
                }
                cubo1.material.map.needsUpdate = true;
                updateTexture();
            };
            // Best to see if the object is near
            this.onChangingMagnification = function () {
                switch (this.mag) {
                    case 'Linear':
                        magFilter = THREE.LinearFilter;
                        break;
                    case 'Nearest':
                        magFilter = THREE.NearestFilter;
                        break;
                }
                cubo1.material.map.needsUpdate = true;
                updateTexture();
            };
        };

        var gui = new dat.GUI();

        gui.add(controls, 'repeat', 1, 10)
            .name("Repeat Factor")
            .onChange(function (e) { controls.onChangeRepeatFactor() });
        gui.add(controls, 'wrapS', ['Clamp', 'Repeat'])
            .name("Wrapping Mode S")
            .onChange(function (e) { controls.onChangingWrappingMode_S(); });
        gui.add(controls, 'wrapT', ['Clamp', 'Repeat'])
            .name("Wrapping Mode T")
            .onChange(function (e) { controls.onChangingWrappingMode_T(); });
        gui.add(controls, 'mag', ['Linear', 'Nearest'])
            .name("Magnification")
            .onChange(function (e) { controls.onChangingMagnification(); });
        gui.add(controls, 'min', ['Linear', 'Nearest'])
            .name("Minification")
            .onChange(function (e) { controls.onChangingMinification(); });
    }*/

    function render() {
        stats.update();
        trackballControls.update();
        requestAnimationFrame(render);
        lightFollowingCamera(light, camera);
        renderer.render(scene, camera)
    }
}