function main() {
    var scene = new THREE.Scene();    // Create main scene
    var stats = initStats();          // To show FPS information

    var renderer = initRenderer();    // View function in util/utils
    renderer.setClearColor("rgb(30, 30, 42)");
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.position.set(2.18, 1.62, 3.31);
    camera.up.set(0, 1, 0);
    var objColor = "rgb(255,225,255)";
    var objShininess = 200;

    // To use the keyboard
    var keyboard = new KeyboardState();

    // Enable mouse rotation, pan, zoom etc.
    var trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

    // Listen window size changes
    window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

    var groundPlane = createGroundPlane(3.0, 3.0); // width and height
    groundPlane.rotateX(degreesToRadians(-90));
    scene.add(groundPlane);

    var cylinderGeometry = new THREE.CylinderGeometry(0.01, 0.01, 3);
    var cylinderMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(255,255,255)' });
    var barra3 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    barra3.rotateX(degreesToRadians(-90));
    barra3.position.set(1.5, 1.3, 0)
    scene.add(barra3);

    var barra3 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    barra3.rotateZ(degreesToRadians(90));
    barra3.position.set(0, 1.3, -1.5)
    scene.add(barra3);

    var barra3 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    barra3.rotateZ(degreesToRadians(90));
    barra3.position.set(0, 1.3, 1.5)
    scene.add(barra3);

    // Show axes (parameter is size of each axis)
    var axesHelper = new THREE.AxesHelper(1.5);
    axesHelper.visible = false;
    scene.add(axesHelper);

    // Show text information onscreen
    showInformation();

    var infoBox = new SecondaryBox("");

    // Teapot
    var geometry = new THREE.TeapotBufferGeometry(0.5);
    var material = new THREE.MeshPhongMaterial({ color: objColor, shininess: "200" });
    material.side = THREE.DoubleSide;
    var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;
    obj.position.set(0.0, 0.5, 0.0);
    scene.add(obj);

    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    // Control available light and set the active light
    var lightArray = new Array();
    var activeLight = 0; // View first Light

    //---------------------------------------------------------
    // Default light position, color, ambient color and intensity
    var lightPosition = new THREE.Vector3(1.5, 1.3, 1.1);
    var lightPosition_2 = new THREE.Vector3(0, 1.3, 1.5);
    var lightPosition_3 = new THREE.Vector3(0, 1.3, -1.5);
    var lightColor = "rgb(255,255,255)";
    var ambientColor = "rgb(50,50,50)";

    // Sphere to represent the light
    var lightSphere = createLightSphere(scene, 0.05, 10, 10, lightPosition);
    var lightSphere_2 = createLightSphere(scene, 0.05, 10, 10, lightPosition_2);
    var lightSphere_3 = createLightSphere(scene, 0.05, 10, 10, lightPosition_3);

    //---------------------------------------------------------
    // Create and set all lights. Only Spot and ambient will be visible at first
    var spotLight = new THREE.SpotLight(lightColor);
    setSpotLight(lightPosition);

    // More info here: https://threejs.org/docs/#api/en/lights/AmbientLight
    var ambientLight = new THREE.AmbientLight(ambientColor);
    scene.add(ambientLight);

    var spotLight2 = new THREE.SpotLight(lightColor);
    setSpotLight2(lightPosition_2);

    var spotLight3 = new THREE.SpotLight(lightColor);
    setSpotLight3(lightPosition_3);


    buildInterface();
    render();

    // Set Spotlight
    // More info here: https://threejs.org/docs/#api/en/lights/SpotLight
    function setSpotLight(position) {
        spotLight.position.copy(position);
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.camera.fov = degreesToRadians(20);
        spotLight.castShadow = true;
        spotLight.decay = 2;
        spotLight.penumbra = 0.05;
        spotLight.name = "Spot Light"

        scene.add(spotLight);
        lightArray.push(spotLight);
    }

    // Update light position of the current light
    function updateLightPosition() {
        lightArray[activeLight].position.copy(lightPosition);
        lightSphere.position.copy(lightPosition);
    }

    function setSpotLight2(position) {
        spotLight2.position.copy(position);
        spotLight2.shadow.mapSize.width = 2048;
        spotLight2.shadow.mapSize.height = 2048;
        spotLight2.shadow.camera.fov = degreesToRadians(20);
        spotLight2.castShadow = true;
        spotLight2.decay = 2;
        spotLight2.penumbra = 0.05;
        spotLight2.name = "Spot Light"

        scene.add(spotLight2);
        lightArray.push(spotLight2);
    }

    // Update light position of the current light
    function updateLightPosition2() {
        lightArray[activeLight].position.copy(lightPosition_2);
        lightSphere_2.position.copy(lightPosition_2);
    }

    function setSpotLight3(position) {
        spotLight3.position.copy(position);
        spotLight3.shadow.mapSize.width = 2048;
        spotLight3.shadow.mapSize.height = 2048;
        spotLight3.shadow.camera.fov = degreesToRadians(20);
        spotLight3.castShadow = true;
        spotLight3.decay = 2;
        spotLight3.penumbra = 0.05;
        spotLight3.name = "Spot Light"

        scene.add(spotLight3);
        lightArray.push(spotLight3);
    }

    // Update light position of the current light
    function updateLightPosition3() {
        lightArray[activeLight].position.copy(lightPosition_3);
        lightSphere_3.position.copy(lightPosition_3);
    }

    // Update light intensity of the current light

    function buildInterface() {
        //------------------------------------------------------------
        // Interface
        var controls = new function () {
            this.viewAxes = false;
            this.viewAxes2 = false;
            this.color = objColor;
            this.ambientLight = true;

            this.onViewAxes = function () {
                axesHelper.visible = this.viewAxes;
            };
            this.onViewSphere1 = function () {
                spotLight.visible = this.viewAxes2;
            };
            this.onViewSphere2 = function () {
                lightSphere_2.visible = this.viewAxes;
            };
            this.onViewSphere3 = function () {
                lightSphere_3.visible = this.viewAxes;
            };
            this.onEnableAmbientLight = function () {
                ambientLight.visible = this.ambientLight;
            };
        };

        var gui = new dat.GUI();
        gui.add(controls, 'viewAxes', false)
            .name("View Axes")
            .onChange(function (e) { controls.onViewAxes() });
        gui.add(controls, 'viewAxes2', false)
            .name("View Axes 2")
            .onChange(function (e) { controls.onViewSphere1() });
        gui.add(controls, 'viewAxes', false)
            .name("View Axes")
            .onChange(function (e) { controls.onViewSphere2() });
        gui.add(controls, 'viewAxes', false)
            .name("View Axes")
            .onChange(function (e) { controls.onViewSphere3() });
            gui.add(controls, 'ambientLight', true)
                .name("Ambient Light")
                .onChange(function (e) { controls.onEnableAmbientLight() });
    }

    function keyboardUpdate() {
        keyboard.update();
        if (keyboard.pressed("D")) {
            if (lightPosition_3.x < 1.5) {
                lightPosition_3.x += 0.05;
                updateLightPosition3();
            }
        }
        if (keyboard.pressed("A")) {
            if (lightPosition_3.x >= -1.5) {
                lightPosition_3.x -= 0.05;
                updateLightPosition3();
            }
        }
        if (keyboard.pressed("W")) {
            if (lightPosition_2.x < 1.5) {
                lightPosition_2.x += 0.05;
                updateLightPosition2();
            }

        }
        if (keyboard.pressed("S")) {
            if (lightPosition_2.x >= -1.5) {
                lightPosition_2.x -= 0.05;
                updateLightPosition2();
            }
        }
        if (keyboard.pressed("E")) {
            if (lightPosition.z >= -1.5) {
                lightPosition.z -= 0.05;
                updateLightPosition();
            }
        }
        if (keyboard.pressed("Q")) {
            if (lightPosition.z < 1.5) {
                lightPosition.z += 0.05;
                updateLightPosition();
            }
        }
    }

    function showInformation() {
        // Use this to show information onscreen
        controls = new InfoBox();
        controls.add("Lighting - Types of Lights");
        controls.addParagraph();
        controls.add("Use the WASD-QE keys to move the light");
        controls.show();
    }

    function render() {
        stats.update();
        trackballControls.update();
        keyboardUpdate();
        requestAnimationFrame(render);
        renderer.render(scene, camera)
    }
}
