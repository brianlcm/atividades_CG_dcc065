function main() {
    var stats = initStats();          // To show FPS information
    var scene = new THREE.Scene();    // Create main scene
    var renderer = initRenderer();    // View function in util/utils
    var camera = initCamera(new THREE.Vector3(0, -160, 40)); // Init camera in this position 
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
    pneu1.position.set(0, -95.00, 2.0);
    pneu1.translateX(-2);
    //pneu1.rotateOnAxis(new THREE.Vector3( 0,0,1),degreesToRadians(90));
    scene.add(pneu1);

    var pneu2 = criarPneu();
    pneu2.position.set(0.0, 10.0, 0.0);
    pneu1.add(pneu2);

    var eixo1 = criarEixo();
    eixo1.position.set(0.0, 5.0, 0.0);
    pneu1.add(eixo1);

    var pneu3 = criarPneu();
    pneu3.position.set(15.0, 0.0, 0.0);
    pneu1.add(pneu3);

    var pneu4 = criarPneu();
    pneu4.position.set(15.0, 10.0, 0.0);
    pneu1.add(pneu4);

    var eixo2 = criarEixo();
    eixo2.position.set(15.0, 5.0, 0.0);
    pneu1.add(eixo2);

    var GeometriaChassi = new THREE.BoxGeometry(25, 3, 2.5, 5, 5, 5);
    var MaterialChassi = new THREE.MeshPhongMaterial({ color: 'rgb(255,160,122)' });  
    var chassi = new THREE.Mesh(GeometriaChassi, MaterialChassi);
    chassi.position.set(7.5, 0.0, 0.0);
    eixo1.add(chassi);

    var Geometriabase_aerofolio = new THREE.BoxGeometry(8, 3, 2.5, 5, 5, 5);
    var Materialbase_aerofolio = new THREE.MeshPhongMaterial({ color: 'rgb(255,160,122)' });
    var base_aerofolio = new THREE.Mesh(Geometriabase_aerofolio, Materialbase_aerofolio);
    base_aerofolio.position.set(11.0, 0.0, 0.0);
    base_aerofolio.rotateOnAxis(new THREE.Vector3(0, 0, 1),degreesToRadians(90));
    chassi.add(base_aerofolio);

    var Geometria_aerofolio_lado = new THREE.BoxGeometry(0.2, 3, 2.5, 5, 5, 5);
    var Material_aerofolio = new THREE.MeshPhongMaterial({ color: 'rgb(220,20,60)' });
    var lado1_aerofolio = new THREE.Mesh(Geometria_aerofolio_lado, Material_aerofolio);
    lado1_aerofolio.position.set(1.0, 0.0, 2.5);

    var lado2_aerofolio = new THREE.Mesh(Geometria_aerofolio_lado, Material_aerofolio);
    lado2_aerofolio.position.set(-1.0, 0.0, 2.5);

    var Geometria_aerofolio = new THREE.BoxGeometry(0.2, 3, 5.5, 5, 5, 5);
    var aerofolio_superior = new THREE.Mesh(Geometria_aerofolio, Material_aerofolio);
    aerofolio_superior.position.set(0.0, 0.0, 3.8);
    aerofolio_superior.rotateOnAxis(new THREE.Vector3( 0,1,0),degreesToRadians(90));
    base_aerofolio.add(aerofolio_superior);

    base_aerofolio.add(lado1_aerofolio);
    base_aerofolio.add(lado2_aerofolio);

    function criarPneu() {
        var GeometriaPneu = new THREE.CylinderGeometry(2, 2, 0.8, 27, 7, false, 0);
        var MaterialPneu = new THREE.MeshPhongMaterial({ color: 'rgb(0,0,0)' });
        var pneu = new THREE.Mesh(GeometriaPneu, MaterialPneu);
        return pneu;
    }

    function criarEixo() {
        var GeometriaPneu = new THREE.CylinderGeometry(0.5, 0.5, 10, 10, 12, false, 0);
        var MaterialPneu = new THREE.MeshPhongMaterial({ color: 'rgb(128,128,128)' });
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
