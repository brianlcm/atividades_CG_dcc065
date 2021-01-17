function main() {
    var stats = initStats();          // To show FPS information
    var scene = new THREE.Scene();    // Create main scene
    var renderer = initRenderer();    // View function in util/utils
    var camera = initCamera(new THREE.Vector3(0, -180, 40)); // Init camera in this position 
    var light = initDefaultLighting(scene, new THREE.Vector3(0, 0, 15));

    // Show text information onscreen
    showInformation();

    // To use the keyboard
    var keyboard = new KeyboardState();

    // Enable mouse rotation, pan, zoom etc.
    var trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

    /*// Show axes (parameter is size of each axis)
    var axesHelper = new THREE.AxesHelper( 12 );
    scene.add( axesHelper );*/

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(200, 200);
    planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
    var planeMaterial = new THREE.MeshBasicMaterial({
        color: "rgba(150, 150, 150)",
        side: THREE.DoubleSide,
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // add the plane to the scene
    scene.add(plane);

    var pneu1 = criarPneu();
    pneu1.position.set(0, -90.00, 2.0);
    pneu1.rotateOnAxis(new THREE.Vector3( 0,0,1),degreesToRadians(90));
    scene.add(pneu1);

    var pneu2 = criarPneu();
    pneu2.position.set(0.0, 8.0, 0.0);
    pneu1.add(pneu2);

    var eixo1 = criarEixo();
    eixo1.position.set(0.0, 4.0, 0.0);
    pneu1.add(eixo1);

    var pneu3 = criarPneu();
    pneu3.position.set(15.0, 0.0, 0.0);
    pneu1.add(pneu3);

    var pneu4 = criarPneu();
    pneu4.position.set(15.0, 8.0, 0.0);
    pneu1.add(pneu4);

    var eixo2 = criarEixo();
    eixo2.position.set(15.0, 4.0, 0.0);
    pneu1.add(eixo2);

    var GeometriaChassi = new THREE.BoxGeometry(25, 3, 3, 5, 5, 5);
    var MaterialChassi = new THREE.MeshNormalMaterial();
    var chassi = new THREE.Mesh(GeometriaChassi, MaterialChassi);
    chassi.position.set(7.5, 0.0, 0.0);
    eixo1.add(chassi);

    function criarPneu() {
        var GeometriaPneu = new THREE.CylinderGeometry(2, 2, 0.8, 27, 7, false, 0);
        var MaterialPneu = new THREE.MeshPhongMaterial({ color: 'rgb(0,0,0)' });
        var pneu = new THREE.Mesh(GeometriaPneu, MaterialPneu);
        return pneu;
    }

    function criarEixo() {
        var GeometriaPneu = new THREE.CylinderGeometry(0.5, 0.5, 8, 10, 12, false, 0);
        var MaterialPneu = new THREE.MeshNormalMaterial();
        var eixo = new THREE.Mesh(GeometriaPneu, MaterialPneu);
        return eixo;
    }

    // Listen window size changes
    window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

    render();

    function keyboardUpdate() {

        keyboard.update();

        var angle = degreesToRadians(10);
        var rotAxis = new THREE.Vector3(0, 0, 1); // Set Z axis

        if (keyboard.pressed("left")) pneu1.translateY(1);
        if (keyboard.pressed("right")) pneu1.translateY(-1);
        if (keyboard.pressed("up")) pneu1.translateX(1);
        if (keyboard.pressed("down")) pneu1.translateX(-1);

        if (keyboard.pressed("A")) pneu1.rotateOnAxis(rotAxis, angle);
        if (keyboard.pressed("D")) pneu1.rotateOnAxis(rotAxis, -angle);
    }

    function showInformation() {
        // Use this to show information onscreen
        controls = new InfoBox();
        controls.add("T1 - Kart Game");
        controls.addParagraph();
        controls.add("Use as setas do teclado para mover o kart.");
        controls.add("Press Page Up or Page down to move the cube over the Z axis");
        controls.add("Press 'A' and 'D' to rotate.");
        controls.add("Press 'W' and 'S' to change scale");
        controls.show();
    }

    function render() {
        stats.update(); // Update FPS
        trackballControls.update(); // Enable mouse movements
        keyboardUpdate();
        lightFollowingCamera(light, camera);
        requestAnimationFrame(render);
        renderer.render(scene, camera) // Render scene
    }
}
