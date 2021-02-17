function main() {
    var stats = initStats();          // To show FPS information
    var scene = new THREE.Scene();    // Create main scene
    var renderer = initRenderer();    // View function in util/utils
    var camera = initCamera(new THREE.Vector3(0, -60, 30)); // Init camera in this position 
    var light = initDefaultLighting(scene, new THREE.Vector3(0, 0, 15));
    scene.background = new THREE.Color('rgb(102, 153, 255)');

    // Mostra orientações na tela
    showInformation();

    // Para usar o teclado
    var keyboard = new KeyboardState();

    // Enable mouse rotation, pan, zoom etc.
    var trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

    // Show axes (parameter is size of each axis)
    var axesHelper = new THREE.AxesHelper(12);
    scene.add(axesHelper);

    // Criação do plano
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

    // ** Início da criação do kart **

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
    chassiInterno.position.set(3, 0, 0);
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

    var GeometriaCalota = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 10, 12, false, 0);
    var MaterialCalota = new THREE.MeshPhongMaterial({ color: 'rgb(100,100,100)' });

    var calota1 = new THREE.Mesh(GeometriaCalota, MaterialCalota);
    calota1.position.set(0, -0.3, 0);
    pneu1.add(calota1);

    var calota2 = new THREE.Mesh(GeometriaCalota, MaterialCalota);
    calota2.position.set(0, 0.3, 0);
    pneu2.add(calota2);

    var calota3 = new THREE.Mesh(GeometriaCalota, MaterialCalota);
    calota3.position.set(0, 0.3, 0);
    pneu3.add(calota3);

    var calota4 = new THREE.Mesh(GeometriaCalota, MaterialCalota);
    calota4.position.set(0, -0.3, 0);
    pneu4.add(calota4);

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

    // Funções necessárias para a criações de várias formas geométricas que integram o kart
    function criarBicoFrontal() {
        var GeometriaBico = new THREE.BoxGeometry(2, 10, 1, 5, 5, 5);
        var BicoMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(0,0,100)' });
        var bico = new THREE.Mesh(GeometriaBico, BicoMaterial);
        return bico;
    }

    function criarPneu() {
        var GeometriaPneu = new THREE.CylinderGeometry(2, 2, 2, 35, 7, false, 0);
        var MaterialPneu = new THREE.MeshPhongMaterial({ color: 'rgb(20,20,20)' });
        var pneu = new THREE.Mesh(GeometriaPneu, MaterialPneu);
        return pneu;
    }

    function criarEixo() {
        var GeometriaEixo = new THREE.CylinderGeometry(0.5, 0.5, 11.5, 10, 12, false, 0);
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

    // Essa função cria um furo na cabine. Isso é necessário para que o kart tenha uma aparência semelhante ao que foi indicado nas orientações do trabalho
    function criarCabine() {
        var frame = new THREE.Shape();
        frame.moveTo(-1.5, -4);
        frame.lineTo(7.5, -4);
        frame.lineTo(7.5, 4);
        frame.lineTo(-1.5, 4);

        var hole = new THREE.Path();
        hole.moveTo(-0.5, -3);
        hole.lineTo(6.5, -3);
        hole.lineTo(6.5, 3);
        hole.lineTo(-0.5, 3);
        frame.holes.push(hole);

        var extrudeSettings = {
            steps: 1,
            depth: 2,
            bevelEnabled: false,
        };
        var geom = new THREE.ExtrudeGeometry(frame, extrudeSettings);
        var mesh = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({ color: 'rgb(0,0,200)' }));
        return mesh;
    }

    // ** Fim da criação do kart **

    var objectVisibility = true;
    var castShadow = true;
    var montanhas_cor = "rgb(100, 70, 20)";
    var montanhasMaterial = new THREE.MeshPhongMaterial({
        color: montanhas_cor,
        transparent: false
    });
    var pontos_montanha1_parte1 = [];
    var montanha1_parte2_dimensoes = new THREE.Vector3(130, 200, 130);
    pontos_montanha1_parte1.push(new THREE.Vector3(montanha1_parte2_dimensoes.x, 0, montanha1_parte2_dimensoes.z));
    pontos_montanha1_parte1.push(new THREE.Vector3(- montanha1_parte2_dimensoes.x, 0, montanha1_parte2_dimensoes.z));
    pontos_montanha1_parte1.push(new THREE.Vector3(montanha1_parte2_dimensoes.x, 0, - montanha1_parte2_dimensoes.z));
    pontos_montanha1_parte1.push(new THREE.Vector3(- montanha1_parte2_dimensoes.x, 0, - montanha1_parte2_dimensoes.z));
    pontos_montanha1_parte1.push(new THREE.Vector3(-montanha1_parte2_dimensoes.x + 30, 0, montanha1_parte2_dimensoes.z + 30));
    pontos_montanha1_parte1.push(new THREE.Vector3(- montanha1_parte2_dimensoes.x + 20, 20, montanha1_parte2_dimensoes.z + 10));
    for (var i = 0; i < 6; i++) {
        pontos_montanha1_parte1.push(new THREE.Vector3(-montanha1_parte2_dimensoes.x - i * 2, i, montanha1_parte2_dimensoes.z - 10 * 2));
        pontos_montanha1_parte1.push(new THREE.Vector3(montanha1_parte2_dimensoes.x + i * 2, i, -montanha1_parte2_dimensoes.z + 20 * 2));
    }
    pontos_montanha1_parte1.push(new THREE.Vector3(0, montanha1_parte2_dimensoes.y, 0));
    pontos_montanha1_parte1.push(new THREE.Vector3(20, montanha1_parte2_dimensoes.y-5, 0));

    var convexGeometry_m1p1 = new THREE.ConvexBufferGeometry(pontos_montanha1_parte1);
    var Montanha1_parte1 = new THREE.Mesh(convexGeometry_m1p1, montanhasMaterial);
    Montanha1_parte1.castShadow = castShadow;
    Montanha1_parte1.visible = objectVisibility;
    Montanha1_parte1.position.set(0, 300, 0);
    Montanha1_parte1.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
    scene.add(Montanha1_parte1);

    var pontos_montanha1_parte2 = [];
    var montanha1_parte2_dimensoes = new THREE.Vector3(100, 130, 130);
    pontos_montanha1_parte2.push(new THREE.Vector3(montanha1_parte2_dimensoes.x, 0, montanha1_parte2_dimensoes.z));
    pontos_montanha1_parte2.push(new THREE.Vector3(- montanha1_parte2_dimensoes.x, 0, montanha1_parte2_dimensoes.z));
    pontos_montanha1_parte2.push(new THREE.Vector3(montanha1_parte2_dimensoes.x, 0, - montanha1_parte2_dimensoes.z));
    pontos_montanha1_parte2.push(new THREE.Vector3(- montanha1_parte2_dimensoes.x, 0, - montanha1_parte2_dimensoes.z));
    pontos_montanha1_parte2.push(new THREE.Vector3(-montanha1_parte2_dimensoes.x + 30, 0, montanha1_parte2_dimensoes.z + 30));
    pontos_montanha1_parte2.push(new THREE.Vector3(- montanha1_parte2_dimensoes.x + 20, 20, montanha1_parte2_dimensoes.z + 10));
    for (var i = 0; i < 6; i++) {
        pontos_montanha1_parte2.push(new THREE.Vector3(montanha1_parte2_dimensoes.x - i * 10, 2 * i, -montanha1_parte2_dimensoes.z - 10 * 3));
        pontos_montanha1_parte2.push(new THREE.Vector3(-montanha1_parte2_dimensoes.x + i * 10, 2 * i, montanha1_parte2_dimensoes.z + 20 * 3));
    }
    pontos_montanha1_parte2.push(new THREE.Vector3(-10, montanha1_parte2_dimensoes.y, 20));

    var convexGeometry_m1_p2 = new THREE.ConvexBufferGeometry(pontos_montanha1_parte2);
    var Montanha1_parte2 = new THREE.Mesh(convexGeometry_m1_p2, montanhasMaterial);
    Montanha1_parte2.castShadow = castShadow;
    Montanha1_parte2.visible = objectVisibility;
    Montanha1_parte2.position.set(150, 300, 0);
    Montanha1_parte2.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
    scene.add(Montanha1_parte2);

    var pontos_montanha1_parte3 = [];
    var montanha1_parte2_dimensoes = new THREE.Vector3(90, 100, 80);
    pontos_montanha1_parte3.push(new THREE.Vector3(montanha1_parte2_dimensoes.x, 0, montanha1_parte2_dimensoes.z));
    pontos_montanha1_parte3.push(new THREE.Vector3(- montanha1_parte2_dimensoes.x, 0, montanha1_parte2_dimensoes.z));
    pontos_montanha1_parte3.push(new THREE.Vector3(montanha1_parte2_dimensoes.x, 0, - montanha1_parte2_dimensoes.z));
    pontos_montanha1_parte3.push(new THREE.Vector3(- montanha1_parte2_dimensoes.x, 0, - montanha1_parte2_dimensoes.z));
    pontos_montanha1_parte3.push(new THREE.Vector3(-montanha1_parte2_dimensoes.x + 30, 0, montanha1_parte2_dimensoes.z + 30));
    pontos_montanha1_parte3.push(new THREE.Vector3(- montanha1_parte2_dimensoes.x + 20, 20, montanha1_parte2_dimensoes.z + 10));
    for (var i = 0; i < 6; i++) {
        pontos_montanha1_parte3.push(new THREE.Vector3(montanha1_parte2_dimensoes.x - i * 10, 2 * i, -montanha1_parte2_dimensoes.z - 10 * 3));
        pontos_montanha1_parte3.push(new THREE.Vector3(-montanha1_parte2_dimensoes.x + i * 10, 2 * i, montanha1_parte2_dimensoes.z + 20 * 3));
    }
    pontos_montanha1_parte3.push(new THREE.Vector3(-10, montanha1_parte2_dimensoes.y, 20));
    

    var convexGeometry_m1_p3 = new THREE.ConvexBufferGeometry(pontos_montanha1_parte3);
    var Montanha1_parte3 = new THREE.Mesh(convexGeometry_m1_p3, montanhasMaterial);
    Montanha1_parte3.castShadow = castShadow;
    Montanha1_parte3.visible = objectVisibility;
    Montanha1_parte3.position.set(100, 150, 0);
    Montanha1_parte3.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
    scene.add(Montanha1_parte3);



    // Listen window size changes
    window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);
    var projectionMessage = new SecondaryBox("Modo Jogo");

    // Declaração das variáveis necessárias para o controle da velocidade do kart
    var velocidade = 0;
    var aceleracao = 0.02;
    var velocidade_maxima = 4;
    var solta_setaparacima = false;
    var solta_setaparabaixo = false;
    var angulo_pneu = 0;

    render();

    function keyboardUpdate() {

        keyboard.update();

        var rotacao_pneus = degreesToRadians(20);
        var angulo_pneu_aux = degreesToRadians(3);

        if (modoInspecao == false) {

            if (keyboard.pressed("up")) {
                // Configura a rotação dos pneus durante a movimentação
                pneu3.rotateY(rotacao_pneus);
                pneu4.rotateY(rotacao_pneus);
                solta_setaparacima = false;
                solta_setaparabaixo = false;
                if (velocidade < velocidade_maxima) {
                    velocidade = velocidade + aceleracao;
                }
                chassi.translateX(-velocidade);
                voltaPneus();
            }

            if (keyboard.pressed("down")) {
                solta_setaparabaixo = false;
                if (velocidade > 0) {
                    solta_setaparacima = false;
                    velocidade = velocidade - aceleracao * 3;
                    chassi.translateX(-velocidade);
                }
            }
            if (keyboard.up("down")) solta_setaparabaixo = true;
            if (keyboard.up("up")) solta_setaparacima = true;

            // Configura câmera para seguir o kart
            camera.up.set(0, 0, 1);

            var camera_posicao = new THREE.Vector3(80, 0, 40);

            var camera_segue_kart = camera_posicao.applyMatrix4(chassi.matrixWorld);

            camera.position.x = camera_segue_kart.x;
            camera.position.y = camera_segue_kart.y;
            camera.position.z = camera_segue_kart.z;

            camera.lookAt(chassi.position);
        }

        if (keyboard.pressed("left")) {
            /* Condição para verificar se o kart está em uma velocidade muito baixa para fazer uma curva para a esquerda. Dessa forma, o kart precisa ter uma velocidade superior
            a 0.3 para fazer uma curva */
            if (modoInspecao == false && velocidade > 0.3) {
                chassi.rotateZ(degreesToRadians(2));
            }

            // Rotação das rodas para o lado esquerdo
            angulo_pneu += angulo_pneu_aux;
            if (angulo_pneu > degreesToRadians(30)) {
                resto = angulo_pneu - degreesToRadians(30);
                pneu1.rotateZ(angulo_pneu_aux - resto);
                pneu2.rotateZ(angulo_pneu_aux - resto);
                angulo_pneu = degreesToRadians(30);
            }
            else {
                pneu1.rotateZ(angulo_pneu_aux);
                pneu2.rotateZ(angulo_pneu_aux);
            }
        }

        if (keyboard.pressed("right")) {
            /* Condição para verificar se o kart está em uma velocidade muito baixa para fazer uma curva para a esquerda. Dessa forma, o kart precisa ter uma velocidade superior
            a 0.3 para fazer uma curva */
            if (modoInspecao == false && velocidade > 0.3) {
                chassi.rotateZ(degreesToRadians(-2));
            }

            // Rotação das rodas para o lado direito
            angulo_pneu -= angulo_pneu_aux;
            if (angulo_pneu < degreesToRadians(-30)) {
                resto = angulo_pneu - degreesToRadians(-30);
                pneu1.rotateZ(-angulo_pneu_aux - resto);
                pneu2.rotateZ(-angulo_pneu_aux - resto);
                angulo_pneu = degreesToRadians(-30);
            }
            else {
                pneu1.rotateZ(-angulo_pneu_aux);
                pneu2.rotateZ(-angulo_pneu_aux);
            }
        }
        if (keyboard.down("space")) changeProjection();
    }

    // Função para voltar os pneus para o angulo inicial
    function voltaPneus() {
        if (angulo_pneu != 0) {
            parte_angulo = angulo_pneu / 10;
            pneu1.rotateZ(-parte_angulo);
            pneu2.rotateZ(-parte_angulo);
            angulo_pneu -= parte_angulo;
        }
    }

    // Variável necessária para verificar qual modo de câmera está ativo
    var modoInspecao = false;

    // Função para alternar entre os modos de câmera
    function changeProjection() {

        var pos = new THREE.Vector3().copy(new THREE.Vector3(0, -60, 30));

        /* Se o modo de inspeção estiver ativo, então o usuário deseja voltar para o modo de jogo. Nesse caso, é preciso adicionar o plano e as linhas, além das
        configurações da câmera*/
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
            velocidade = 0;
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

    //Funções com a definição das orientações da tela
    function showInformation() {
        controls = new InfoBox();
        controls.add("T1 - Kart Game");
        controls.addParagraph();
        controls.add("- Use as setas do teclado para mover o kart.");
        controls.add("- Pressione a seta para cima para acelerar ou a seta para baixo para frear");
        controls.add("- Pressione as setas para esquerda ou para movimentar nas respectivas direções");
        controls.add("- Tecle espaço para alterar o modo");
        controls.show();
    }

    function render() {
        stats.update(); // Update FPS
        trackballControls.update(); // Enable mouse movements
        keyboardUpdate();
        lightFollowingCamera(light, camera);
        requestAnimationFrame(render);
        if (velocidade > 0 && (solta_setaparacima == true || solta_setaparabaixo == true)) {
            velocidade = velocidade - aceleracao;
            chassi.translateX(-velocidade);
            voltaPneus();
        } else {
            solta_setaparacima = false;
            solta_setaparabaixo = false;
        }
        renderer.render(scene, camera) // Render scene
    }
}