function main() {
    var stats = initStats();          // To show FPS information
    var scene = new THREE.Scene();    // Create main scene
    var renderer = initRenderer();    // View function in util/utils
    var camera = initCamera(new THREE.Vector3(0, -60, 30)); // Init camera in this position 
    var light = initDefaultLighting(scene, new THREE.Vector3(0, 0, 15));

    // Show text information onscreen
    showInformation();

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

    // Chassi
    var GeometriaChassi = new THREE.BoxGeometry(24, 2.5, 2.5, 5, 5, 5);
    var MaterialChassi = new THREE.MeshPhongMaterial({ color: 'rgb(255,100,0)' });
    var GeometriaChassiInterno = new THREE.BoxGeometry(10, 7, 2.5, 5, 5, 5);

    var chassi = new THREE.Mesh(GeometriaChassi, MaterialChassi);
    var chassiInterno = new THREE.Mesh(GeometriaChassiInterno, MaterialChassi);
    var chassi = new THREE.Mesh(GeometriaChassi, MaterialChassi);
    var chassiInterno = new THREE.Mesh(GeometriaChassiInterno, MaterialChassi);
    chassi.position.set(0.0, 0.0, 2.0);
    scene.add(chassi);
    chassiInterno.position.set(3, 0, 0)
    chassi.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(-90));
    chassi.add(chassiInterno);

    var eixo1 = criarEixo();
    eixo1.position.set(-5.0, 0.0, 0.0);
    chassi.add(eixo1);

    var pneu1 = criarPneu();
    pneu1.position.set(0.0, -5.0, 0.0);
    eixo1.add(pneu1);

    var pneu2 = criarPneu();
    pneu2.position.set(0.0, 5.0, 0.0);
    eixo1.add(pneu2);

    var eixo2 = criarEixo();
    eixo2.position.set(10.3, 0.0, 0.0);
    chassi.add(eixo2);

    var pneu3 = criarPneu();
    pneu3.position.set(0.0, 5.0, 0.0);
    eixo2.add(pneu3);

    var pneu4 = criarPneu();
    pneu4.position.set(0.0, -5.0, 0.0);
    eixo2.add(pneu4);

    var Geometria_aerofolio_lado = new THREE.BoxGeometry(0.2, 2, 2.5, 5, 5, 5);
    var Material_aerofolio = new THREE.MeshPhongMaterial({ color: 'rgb(0,0,100)' });
    var lado1_aerofolio = new THREE.Mesh(Geometria_aerofolio_lado, Material_aerofolio);
    lado1_aerofolio.position.set(10.0, 1.0, 2.5);
    lado1_aerofolio.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(90));

    var lado2_aerofolio = new THREE.Mesh(Geometria_aerofolio_lado, Material_aerofolio);
    lado2_aerofolio.position.set(10.0, -1.0, 2.5);
    lado2_aerofolio.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(90));

    var Geometria_aerofolio = new THREE.BoxGeometry(0.5, 3, 8, 5, 5, 5);
    var aerofolio_superior = new THREE.Mesh(Geometria_aerofolio, Material_aerofolio);
    aerofolio_superior.position.set(10.0, 0.0, 3.8);
    aerofolio_superior.rotateOnAxis(new THREE.Vector3(0, 1, 0), degreesToRadians(90));
    aerofolio_superior.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));

    chassi.add(aerofolio_superior);

    chassi.add(lado1_aerofolio);
    chassi.add(lado2_aerofolio);

    var bicoFrontal = criarBicoFrontal();
    bicoFrontal.position.set(-10, 0, 0);
    chassi.add(bicoFrontal);

    var cabine = criarCabine();
    cabine.position.set(0.0, 0.0, 0.0);
    chassi.add(cabine);

    var bancoEncosto = criarBancoEncosto();
    bancoEncosto.position.set(4, 0, 1.5);
    chassi.add(bancoEncosto);

    var bancoAssento = criarBancoAssento();
    bancoAssento.position.set(-1, 0, 0);
    bancoEncosto.add(bancoAssento);

    function criarBicoFrontal() {
        var GeometriaBico = new THREE.BoxGeometry(2, 10, 1, 5, 5, 5);
        var BicoMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(0,0,100)' });
        var bico = new THREE.Mesh(GeometriaBico, BicoMaterial);
        return bico;
    }

    function criarPneu() {
        var GeometriaPneu = new THREE.CylinderGeometry(2, 2, 2, 10, 7, false, 0);
        var MaterialPneu = new THREE.MeshNormalMaterial();
        var pneu = new THREE.Mesh(GeometriaPneu, MaterialPneu);
        return pneu;
    }

    function criarEixo() {
        var GeometriaEixo = new THREE.CylinderGeometry(0.5, 0.5, 12.1, 10, 12, false, 0);
        var MaterialEixo = new THREE.MeshPhongMaterial({ color: 'rgb(100,100,100)' });
        var eixo = new THREE.Mesh(GeometriaEixo, MaterialEixo);
        return eixo;
    }

    function criarBancoEncosto() {
        var GeometriaEncosto = new THREE.BoxGeometry(1, 2.5, 4, 20, 20, 20)
        var MaterialBanco = new THREE.MeshPhongMaterial({ color: 'rgb(30,30,30)' });
        var encosto = new THREE.Mesh(GeometriaEncosto, MaterialBanco);
        return encosto;
    }

    function criarBancoAssento() {
        var GeometriaAssento = new THREE.BoxGeometry(3, 2.5, 1, 20, 20)
        var MaterialBanco = new THREE.MeshPhongMaterial({ color: 'rgb(30,30,30)' });
        var Assento = new THREE.Mesh(GeometriaAssento, MaterialBanco);
        return Assento;
    }

    function criarCabine() {
        var frame = new THREE.Shape();
        frame.moveTo(-1.5, -4);
        frame.lineTo(7.5, -4);
        frame.lineTo(7.5, 4);
        frame.lineTo(-1.5, 4);

        //..with a hole:
        var hole = new THREE.Path();
        hole.moveTo(-0.5, -3);
        hole.lineTo(6.5, -3);
        hole.lineTo(6.5, 3);
        hole.lineTo(-0.5, 3);
        frame.holes.push(hole);

        //Extrude the shape into a geometry, and create a mesh from it:
        var extrudeSettings = {
            steps: 1,
            depth: 2,
            bevelEnabled: false,
        };
        var geom = new THREE.ExtrudeGeometry(frame, extrudeSettings);
        var mesh = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({ color: 'rgb(0,0,200)' }));
        return mesh;
    }


    // Listen window size changes
    window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);
    var projectionMessage = new SecondaryBox("Modo Jogo");

    var velocidade = 0;
    var aceleracao = 0.01;
    var velocidade_maxima = 3;
    var solta_setaparacima = false;
    var solta_setaparabaixo = false;

    buildInterface();
    render();

    function keyboardUpdate() {

        keyboard.update();

        var rotacao_pneus = degreesToRadians(20);
        //var rotAxis = new THREE.Vector3(0, 0, 1); // Set Z axis

        if (modoInspecao == false) {
            if (keyboard.pressed("left")) {
                if(velocidade != 0){
                    chassi.rotateZ(degreesToRadians(5));
                }
            }

            if (keyboard.pressed("right")) {
                if(velocidade != 0){
                    chassi.rotateZ(degreesToRadians(-5));
                }
            }

            if (keyboard.pressed("up")) {
                pneu1.rotateY(rotacao_pneus);
                pneu2.rotateY(rotacao_pneus);
                pneu3.rotateY(rotacao_pneus);
                pneu4.rotateY(rotacao_pneus);
                solta_setaparacima = false;
                solta_setaparabaixo = false;
                if (velocidade < velocidade_maxima) {
                    velocidade = velocidade + aceleracao;
                }
                chassi.translateX(-velocidade);
            }

            if (keyboard.pressed("down")) {
                pneu1.rotateY(rotacao_pneus);
                pneu2.rotateY(rotacao_pneus);
                pneu3.rotateY(rotacao_pneus);
                pneu4.rotateY(rotacao_pneus);
                solta_setaparabaixo = false;
                if (velocidade > 0) {
                    solta_setaparacima = false;
                    velocidade = velocidade - aceleracao * 3;
                    chassi.translateX(-velocidade);
                }
            }
            if (keyboard.up("down")) solta_setaparabaixo = true;
            if (keyboard.up("up")) solta_setaparacima = true;

            if (keyboard.down("space")) changeProjection();

            camera.up.set(0, 0, 1);

            var camera_posicao = new THREE.Vector3(80, 0, 40);

            var camera_segue_carrinho = camera_posicao.applyMatrix4(chassi.matrixWorld);
        
            camera.position.x = camera_segue_carrinho.x;
            camera.position.y = camera_segue_carrinho.y;
            camera.position.z = camera_segue_carrinho.z;

            
            camera.lookAt(chassi.position);
        }
    }

    var modoInspecao = false;

    function changeProjection() {
        // Store the previous position of the camera
        var pos = new THREE.Vector3().copy(camera.position);

        if (modoInspecao == true) {
            
            scene.add(plane);
            scene.add(line);
            chassi.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(-90));
            projectionMessage.changeMessage("Modo Jogo");
            modoInspecao = false;
        } else {
            camera.position.x = 0;
            camera.position.y = -60;
            camera.position.z = 30;
            camera.up.x = 0;
            camera.up.y = 0;
            camera.up.z = 1;
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

    function showInformation() {
        // Use this to show information onscreen
        controls = new InfoBox();
        controls.add("T1 - Kart Game");
        controls.addParagraph();
        controls.add("- Use as setas do teclado para mover o kart.");
        controls.add("- Pressione a seta para cima para acelerar ou a seta para baixo para frear");
        controls.add("- Pressione as setas para esquerda ou para movimentar nas respectivas direções");
        controls.add("- Tecle espaço ou use o botão do canto superior direito para alterar o modo");
        controls.show();
    }


    function render() {
        stats.update(); // Update FPS
        trackballControls.update(); // Enable mouse movements
        keyboardUpdate();
        lightFollowingCamera(light, camera);
        requestAnimationFrame(render);
        if (velocidade > 0 && (solta_setaparacima || solta_setaparabaixo)) {
            velocidade = velocidade - aceleracao;
            chassi.translateX(-velocidade);
        } else {
            solta_setaparacima = false;
            solta_setaparabaixo = false;
        }
        renderer.render(scene, camera) // Render scene
    }
}