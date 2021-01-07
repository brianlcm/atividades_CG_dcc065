function main() {
    var stats = initStats();          // To show FPS information
    var scene = new THREE.Scene();    // Create main scene
    var renderer = initRenderer();    // View function in util/utils
    var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position

    // Enable mouse rotation, pan, zoom etc.
    var trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

    // Show axes (parameter is size of each axis)
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

    // cria geometria e material do cubo
    var cubo_Geometria = new THREE.BoxGeometry(2, 2, 2);
    var cubo_Material = new THREE.MeshNormalMaterial();
    
    let cont = 0, posicao_x = -9.0, posicao_y = -9.0;

    while (cont < 9) {
        let cubo = new THREE.Mesh(cubo_Geometria, cubo_Material);
        cubo.position.set(posicao_x, posicao_y, 1.0);

        // adiciona cubo na cena
        scene.add(cubo);

        // atualiza posições dos cubos
        posicao_x = posicao_x + 2.2;
        posicao_y = posicao_y + 2.2;

        // atualiza contador
        cont = cont + 1;
    }

    // Use this to show information onscreen
    controls = new InfoBox();
    controls.add("Basic Scene");
    controls.addParagraph();
    controls.add("Use mouse to interact:");
    controls.add("* Left button to rotate");
    controls.add("* Right button to translate (pan)");
    controls.add("* Scroll to zoom in/out.");
    controls.show();

    // Listen window size changes
    window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

    render();
    function render() {
        stats.update(); // Update FPS
        trackballControls.update(); // Enable mouse movements
        requestAnimationFrame(render);
        renderer.render(scene, camera) // Render scene
    }
}
