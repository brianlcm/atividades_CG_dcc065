function main() {
    var stats = initStats();          // To show FPS information
    var scene = new THREE.Scene();    // Create main scene
    var renderer = initRenderer();    // View function in util/utils
    var camera = initCamera(new THREE.Vector3(0, -10, 5)); // Init camera in this position
    var light = initDefaultLighting(scene, new THREE.Vector3(0, 0, 15));
    var trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

    var objColor = "rgb(255, 255, 255)";
    // Set angles of rotation
    var angle = 0;
    var angle2 = 0;
    var speed = 0.05;
    var animationOn = true; // control if animation is on or of

    // Show world axes
    var axesHelper = new THREE.AxesHelper(12);
    scene.add(axesHelper);

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(20, 20);
    planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
    var planeMaterial = new THREE.MeshBasicMaterial({
        color: "rgba(150, 150, 150)",
        side: THREE.DoubleSide,
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // add the plane to the scene
    scene.add(plane);

    var cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.8, 8.0, 19, 2);
    var cylinderMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(255,255,255)' });
    var torreTurbina = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    torreTurbina.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
    torreTurbina.position.set(0, 0, 4)
    scene.add(torreTurbina);

    // Object Material
    var objectMaterial = new THREE.MeshPhongMaterial({ color: objColor });
    objectMaterial.side = THREE.DoubleSide; // Show front and back polygons


    const length = 8, width = 4;

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(length, width);
    shape.lineTo(length, 0);
    shape.lineTo(0, 0);

    const extrudeSettings_suporte = {
        steps: 1,
        depth: 3,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: -2,
        bevelSegments: 1
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings_suporte);
    var mesh = new THREE.Mesh(geometry, objectMaterial);
    mesh.castShadow = true;
    torreTurbina.add(mesh);

    // Listen window size changes
    window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

    //buildInterface();
    render();

    /*function rotateCylinder() {
        // More info:
        // https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
        

        // Set angle's animation speed
        if (animationOn) {
            //angle += speed;
            //angle2 += speed * 2;

        }
    }

    function buildInterface() {
        var controls = new function () {
            this.onChangeAnimation = function () {
                animationOn = !animationOn;
            };
            this.speed = 0.05;
            // this.joint2 = 0;
            //
            this.changeSpeed = function () {
                speed = this.speed;
            };
        };

        // GUI interface
        var gui = new dat.GUI();
        gui.add(controls, 'onChangeAnimation', true).name("Animation On/Off");
        gui.add(controls, 'speed', 0.05, 0.5)
            .onChange(function (e) { controls.changeSpeed() })
            .name("Change Speed");
    }*/

    function render() {
        stats.update(); // Update FPS
        trackballControls.update();
        //rotateCylinder();
        lightFollowingCamera(light, camera);
        requestAnimationFrame(render);
        renderer.render(scene, camera) // Render scene
    }
}
