function main() {
    var stats = initStats();          // To show FPS information
    var scene = new THREE.Scene();    // Create main scene
    var renderer = initRenderer();    // View function in util/utils
    var camera = initCamera(new THREE.Vector3(0, -60, 30)); // Init camera in this position 
    var light  = initDefaultLighting(scene, new THREE.Vector3(70, 70, 70));

    //var pos = new THREE.Vector3().copy(camera.position);

    // Show text information onscreen
    //showInformation();

    // To use the keyboard
    var keyboard = new KeyboardState();

    // Enable mouse rotation, pan, zoom etc.
    var trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

    // Show axes (parameter is size of each axis)
    var axesHelper = new THREE.AxesHelper(12);
    scene.add(axesHelper);

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(700, 700, 40, 40);
    planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
    var planeMaterial = new THREE.MeshBasicMaterial({
        color: "rgba(20, 30, 110)",
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 1, // positive value pushes polygon further away
        polygonOffsetUnits: 1
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    var wireframe = new THREE.WireframeGeometry(planeGeometry);
    var line = new THREE.LineSegments(wireframe);
    line.material.color.setStyle("rgb(180, 180, 180)");
    scene.add(line);

    var GeometriaChassi = new THREE.BoxGeometry(25, 2.5, 2.5, 5, 5, 5);
    var MaterialChassi = new THREE.MeshPhongMaterial({ color: 'rgb(255,160,122)' });
    var GeometriaChassiInterno = new THREE.BoxGeometry(10, 7, 2.5, 5, 5, 5);

    var chassi = new THREE.Mesh(GeometriaChassi, MaterialChassi);
    var chassiInterno = new THREE.Mesh(GeometriaChassiInterno, MaterialChassi);
    chassi.position.set(0, 0.0, 2.0);
    scene.add(chassi);
    chassi.add(chassiInterno);
    chassi.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(-90));

    var eixo1 = criarEixo();
    eixo1.position.set(-7.5, 0, 0.0);
    chassi.add(eixo1);

    var eixo2 = criarEixo();
    eixo2.position.set(7.0, 0, 0.0);
    chassi.add(eixo2);

    var pneu1 = criarPneu();
    pneu1.position.set(0.0, -4, 0.0);
    eixo1.add(pneu1);

    var pneu2 = criarPneu();
    pneu2.position.set(0.0, 4.0, 0.0);
    eixo1.add(pneu2);

    var pneu3 = criarPneu();
    pneu3.position.set(0.0, -4.0, 0.0);
    eixo2.add(pneu3);

    var pneu4 = criarPneu();
    pneu4.position.set(0.0, 4.0, 0.0);
    eixo2.add(pneu4);

    var Geometriabase_aerofolio = new THREE.BoxGeometry(8, 3, 2.5, 5, 5, 5);
    var Materialbase_aerofolio = new THREE.MeshPhongMaterial({ color: 'rgb(255,160,122)' });
    var base_aerofolio = new THREE.Mesh(Geometriabase_aerofolio, Materialbase_aerofolio);
    base_aerofolio.position.set(11.0, 0.0, 0.0);
    base_aerofolio.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(90));
    chassi.add(base_aerofolio);

    var Geometria_aerofolio_lado = new THREE.BoxGeometry(0.2, 2, 2.5, 5, 5, 5);
    var Material_aerofolio = new THREE.MeshPhongMaterial({ color: 'rgb(220,20,60)' });
    var lado1_aerofolio = new THREE.Mesh(Geometria_aerofolio_lado, Material_aerofolio);
    lado1_aerofolio.position.set(1.0, 0.0, 2.5);

    var lado2_aerofolio = new THREE.Mesh(Geometria_aerofolio_lado, Material_aerofolio);
    lado2_aerofolio.position.set(-1.0, 0.0, 2.5);

    var Geometria_aerofolio = new THREE.BoxGeometry(0.5, 3, 8, 5, 5, 5);
    var aerofolio_superior = new THREE.Mesh(Geometria_aerofolio, Material_aerofolio);
    aerofolio_superior.position.set(0.0, 0.0, 3.8);
    aerofolio_superior.rotateOnAxis(new THREE.Vector3(0, 1, 0), degreesToRadians(90));
    base_aerofolio.add(aerofolio_superior);

    base_aerofolio.add(lado1_aerofolio);
    base_aerofolio.add(lado2_aerofolio);

    var bicoFrontal = criarBicoFrontal();
    bicoFrontal.position.set(-11.3, 0, 0);
    chassi.add(bicoFrontal);

    var cabine = criarCabine();
    cabine.position.set(0.0, 0.0, 0.0);
    chassi.add(cabine);

    var bancoEncosto = criarBancoEncosto();
    bancoEncosto.position.set(3, 0, 1.3);
    chassi.add(bancoEncosto);

    var bancoAssento = criarBancoAssento();
    bancoAssento.position.set(-1, 0, 0.5);
    bancoEncosto.add(bancoAssento);

    function criarBicoFrontal() {
        var GeometriaBico = new THREE.BoxGeometry(2, 9, 1, 5, 5, 5);
        var BicoMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(0,50,0)' });
        var bico = new THREE.Mesh(GeometriaBico, BicoMaterial);
        return bico;
    }

    function criarPneu() {
        var GeometriaPneu = new THREE.CylinderGeometry(2, 2, 2, 35, 7, false, 0);
        var MaterialPneu = new THREE.MeshPhongMaterial({ color: 'rgb(0,0,0)' });
        var pneu = new THREE.Mesh(GeometriaPneu, MaterialPneu);
        return pneu;
    }

    function criarEixo() {
        var GeometriaPneu = new THREE.CylinderGeometry(0.5, 0.5, 10, 10, 12, false, 0);
        var MaterialPneu = new THREE.MeshPhongMaterial({ color: 'rgb(100,100,100)' });
        var eixo = new THREE.Mesh(GeometriaPneu, MaterialPneu);
        return eixo;
    }

    function criarBancoEncosto() {
        var GeometriaEncosto = new THREE.BoxGeometry(1, 3, 5, 20, 20, 20)
        var MaterialEncosto = new THREE.MeshPhongMaterial({ color: 'rgb(50,50,200)' });
        var encosto = new THREE.Mesh(GeometriaEncosto, MaterialEncosto);
        return encosto;
    }

    function criarBancoAssento() {
        var GeometriaAssento = new THREE.BoxGeometry(3, 3, 1, 20, 20)
        var MaterialAssento = new THREE.MeshPhongMaterial({ color: 'rgb(50,50,200)' });
        var Assento = new THREE.Mesh(GeometriaAssento, MaterialAssento);
        return Assento;
    }

    function criarCabine() {
        var frame = new THREE.Shape();
        frame.moveTo(-5, -4);
        frame.lineTo(5, -4);
        frame.lineTo(5, 4);
        frame.lineTo(-5, 4);

        //..with a hole:
        var hole = new THREE.Path();
        hole.moveTo(-4, -2);
        hole.lineTo(4, -2);
        hole.lineTo(4, 2);
        hole.lineTo(-4, 2);
        frame.holes.push(hole);

        //Extrude the shape into a geometry, and create a mesh from it:
        var extrudeSettings = {
            steps: 1,
            depth: 2,
            bevelEnabled: false,
        };
        var geom = new THREE.ExtrudeGeometry(frame, extrudeSettings);
        var mesh = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({ color: 0xffaaaa }));
        return mesh;
    }

    // Listen window size changes
    window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

    var projectionMessage = new SecondaryBox("Modo Jogo");
    //var pos= new THREE.Vector3(initialPosition.x, initialPosition.y, initialPosition.z);

    buildInterface()
    render();

    /*function acelera(movimento) {
        chassi.matrixAutoUpdate = false;
        var mat4 = new THREE.Matrix4();
        chassi.matrix.identity();  // reset matrix
        chassi.matrix.multiply(mat4.makeTranslation(movimento, 0, 0)); // T1
    }*/

    function keyboardUpdate() {

        keyboard.update();

        var angle = degreesToRadians(15);
        var rotAxis = new THREE.Vector3(0, 0, 1); // Set Z axis

        if (modoInspecao == false) {
            if (keyboard.down("left")) {
                chassi.rotateOnAxis(rotAxis, angle);
                //pneu2.rotate(new THREE.Vector3(0, 0, 1), degreesToRadians(38));
                //chassi.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(38));
            }
            if (keyboard.down("right")) {
                chassi.rotateOnAxis(rotAxis, -angle);
            }
            if (keyboard.pressed("up")) {
                chassi.translateX(-1);
            }
            if (keyboard.pressed("down")) chassi.translateX(1);

            if (keyboard.pressed("A")) chassi.rotateOnAxis(rotAxis, angle);
            if (keyboard.pressed("D")) chassi.rotateOnAxis(rotAxis, -angle);
            camera.position.x = chassi.position.x;
            camera.position.y = chassi.position.y - 60;
            camera.position.z = chassi.position.z + 30;
            camera.lookAt(chassi.position);
        }
    }

    /*function restartCamera() {
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 60;

        camera.up.x = 1;
        camera.up.y = 0;
        camera.up.z = 0;
    }*/

    var modoInspecao = false;

    function changeProjection() {
        // Store the previous position of the camera
        var pos = new THREE.Vector3().copy(camera.position);

        if (modoInspecao == true) {
            camera.position.x = 0;
            camera.position.y = -60;
            camera.position.z = 30;
            camera.up.x = 0;
            camera.up.y = 0;
            camera.up.z = 1;
            scene.add(plane);
            scene.add(line);
            chassi.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(-90));
            projectionMessage.changeMessage("Modo Jogo");
            modoInspecao = false;
        } else {
            chassi.position.set(0, 0.0, 2.0);
            chassi.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(90));
            scene.remove(plane);
            scene.remove(line);
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            projectionMessage.changeMessage("Modo Inspeção");
            modoInspecao = true;
        }
        camera.position.copy(pos);
        camera.lookAt(scene.position);
        trackballControls = initTrackballControls(camera, renderer);
        lightFollowingCamera(light, camera) // Makes light follow the camera
    }

    function buildInterface() {
        var controls = new function () {
            this.onChangeProjection = function () {
                changeProjection();
            };
        };

        // GUI interface
        var gui = new dat.GUI();
        gui.add(controls, 'onChangeProjection').name("Alterar Câmera");
    }

    /*function showInformation() {
        // Use this to show information onscreen
        controls = new InfoBox();
        controls.add("T1 - Kart Game");
        controls.addParagraph();
        controls.add("Use as setas do teclado para mover o kart.");
        controls.add("Press Page Up or Page down to move the cube over the Z axis");
        controls.add("Press 'A' and 'D' to rotate.");
        controls.add("Press 'W' and 'S' to change scale");
        controls.show();
    }*/

    function render() {
        stats.update(); // Update FPS
        trackballControls.update(); // Enable mouse movements
        keyboardUpdate();
        lightFollowingCamera(light, camera);
        requestAnimationFrame(render);
        renderer.render(scene, camera) // Render scene
    }
}