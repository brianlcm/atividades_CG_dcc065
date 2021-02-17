function main() {
    var stats = initStats();          // To show FPS information
    var scene = new THREE.Scene();    // Create main scene
    var renderer = initRenderer();    // View function in util/utils
    var camera = initCamera(new THREE.Vector3(0, -60, 30)); // Init camera in this position 
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
    var planeGeometry = new THREE.PlaneGeometry(1400, 1100, 40, 40);
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
    chassi.position.set(150.0, -450.0, 2.0);
    chassiInterno.castShadow = true;
    chassi.castShadow = true;
    scene.add(chassi);
    chassiInterno.position.set(3, 0, 0)
    chassi.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(180));
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
    calota1.castShadow = true;
    pneu1.add(calota1);

    var calota2 = new THREE.Mesh(GeometriaCalota, MaterialCalota);
    calota2.position.set(0, 0.3, 0);
    calota2.castShadow = true;
    pneu2.add(calota2);

    var calota3 = new THREE.Mesh(GeometriaCalota, MaterialCalota);
    calota3.position.set(0, 0.3, 0);
    calota3.castShadow = true;
    pneu3.add(calota3);

    var calota4 = new THREE.Mesh(GeometriaCalota, MaterialCalota);
    calota4.position.set(0, -0.3, 0);
    calota4.castShadow = true;
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

    aerofolio_superior.castShadow = true;
    lado1_aerofolio.castShadow = true;
    lado2_aerofolio.castShadow = true;

    chassi.add(aerofolio_superior);
    chassi.add(lado1_aerofolio);
    chassi.add(lado2_aerofolio);

    var bicoFrontal = criarBicoFrontal();
    bicoFrontal.position.set(-10, 0, 0);
    chassi.add(bicoFrontal);

    var cabine = criarCabine();
    cabine.position.set(0.0, 0.0, 0.0);
    cabine.castShadow = true;
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
        bico.castShadow = true;
        return bico;
    }

    function criarPneu() {
        var GeometriaPneu = new THREE.CylinderGeometry(2, 2, 2, 35, 7, false, 0);
        var MaterialPneu = new THREE.MeshPhongMaterial({ color: 'rgb(20,20,20)' });
        var pneu = new THREE.Mesh(GeometriaPneu, MaterialPneu);
        pneu.castShadow = true;
        return pneu;
    }

    function criarEixo() {
        var GeometriaEixo = new THREE.CylinderGeometry(0.5, 0.5, 11.5, 10, 12, false, 0);
        var MaterialEixo = new THREE.MeshPhongMaterial({ color: 'rgb(100,100,100)' });
        var eixo = new THREE.Mesh(GeometriaEixo, MaterialEixo);
        eixo.castShadow = true;
        return eixo;
    }

    function criarBancoEncosto() {
        var GeometriaEncosto = new THREE.BoxGeometry(1, 2.5, 4, 20, 20, 20)
        var MaterialBanco = new THREE.MeshPhongMaterial({ color: 'rgb(30,30,30)' });
        var encosto = new THREE.Mesh(GeometriaEncosto, MaterialBanco);
        encosto.castShadow = true;
        return encosto;
    }

    function criarBancoAssento() {
        var GeometriaAssento = new THREE.BoxGeometry(3, 2.5, 1, 20, 20)
        var MaterialBanco = new THREE.MeshPhongMaterial({ color: 'rgb(30,30,30)' });
        var Assento = new THREE.Mesh(GeometriaAssento, MaterialBanco);
        Assento.castShadow = true;
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

    var obj = null;

    // Importação Estatua
    criaEstatua();
    function criaEstatua() {
        loadOBJFile('./assets/', 'estatuaCristo', true, 35);
        function loadOBJFile(modelPath, modelName, visibility, desiredScale) {
            var manager = new THREE.LoadingManager();

            var mtlLoader = new THREE.MTLLoader(manager);
            mtlLoader.setPath(modelPath);
            mtlLoader.load(modelName + '.mtl', function (materials) {
                materials.preload();

                var objLoader = new THREE.OBJLoader(manager);
                objLoader.setMaterials(materials);
                objLoader.setPath(modelPath);
                objLoader.load(modelName + ".obj", function (obj) {
                    obj.name = modelName;

                    obj.visible = visibility;

                    // Set 'castShadow' property for each children of the group
                    obj.traverse(function (child) {
                        child.castShadow = true;
                    });

                    obj.traverse(function (node) {
                        if (node.material) node.material.side = THREE.DoubleSide;
                    });

                    var obj = normalizeAndRescale(obj, desiredScale);
                    var obj = fixPosition(obj);

                    scene.add(obj);
                    obj.position.set(-350, 300, 0);
                    obj.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(90));
                }, onProgress, onError);
            });
        }

        function onError() { };

        function onProgress(xhr, model) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
            }
        }

        // Normalize scale and multiple by the newScale
        function normalizeAndRescale(obj, newScale) {
            var scale = getMaxSize(obj); // Available in 'utils.js'
            obj.scale.set(newScale * (1.0 / scale),
                newScale * (1.0 / scale),
                newScale * (1.0 / scale));
            return obj;
        }

        function fixPosition(obj) {
            // Fix position of the object over the ground plane
            var box = new THREE.Box3().setFromObject(obj);
            if (box.min.y > 0)
                obj.translateY(-box.min.y);
            else
                obj.translateY(-1 * box.min.y);
            return obj;
        }
    }

    // ** Fim Importação da Estatua  **

    //  Criação das luzes

    var lightColor = "rgb(255,255,255)";
    criaLuzSol();

    criaPostesLuz(lightColor);

    var spotLight = new THREE.SpotLight(lightColor);
    var spotLightPosition = new THREE.Vector3(80, 0, 40);
    var luz_segue_kart = spotLightPosition.applyMatrix4(chassi.matrixWorld);
    setSpotLight(luz_segue_kart);

    function criaPostesLuz(lightColor) {

        // Poste 1
        poste1 = criaPoste();
        poste1.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste1.position.set(-10, -500, 15);
        scene.add(poste1);

        lampada1 = criaLampada();
        poste1.add(lampada1);
        lampada1.position.set(0, 16, 0);

        pointLight1 = setPointLight(lightColor);
        lampada1.add(pointLight1);
        //lightArray.push( pointLight1 );

        // Poste 2
        poste2 = criaPoste();
        poste2.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste2.position.set(130, -500, 15);
        scene.add(poste2);

        lampada2 = criaLampada();
        poste2.add(lampada2);
        lampada2.position.set(0, 16, 0);

        pointLight2 = setPointLight(lightColor);
        lampada2.add(pointLight2);
        //lightArray.push( pointLight2 );

        // Poste 3 
        poste3 = criaPoste();
        poste3.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste3.position.set(260, -500, 15);
        scene.add(poste3);

        lampada3 = criaLampada();
        poste3.add(lampada3);
        lampada3.position.set(0, 16, 0);

        pointLight3 = setPointLight(lightColor);
        lampada3.add(pointLight3);
        //lightArray.push( pointLight3 );

        // Poste 4
        poste4 = criaPoste();
        poste4.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste4.position.set(400, -500, 15);
        scene.add(poste4);

        lampada4 = criaLampada();
        poste4.add(lampada4);
        lampada4.position.set(0, 16, 0);

        pointLight4 = setPointLight(lightColor);
        lampada4.add(pointLight4);
        //lightArray.push( pointLight4 );   

        // Poste 5
        poste5 = criaPoste();
        poste5.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste5.position.set(-600, 400, 15);
        scene.add(poste5);

        lampada5 = criaLampada();
        poste5.add(lampada5);
        lampada5.position.set(0, 16, 0);

        pointLight5 = setPointLight(lightColor);
        lampada5.add(pointLight5);
        //lightArray.push( pointLight5 );  

        // Poste 6
        poste6 = criaPoste();
        poste6.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste6.position.set(-200, -50, 15);
        scene.add(poste6);

        lampada6 = criaLampada();
        poste6.add(lampada6);
        lampada6.position.set(0, 16, 0);

        pointLight6 = setPointLight(lightColor);
        lampada6.add(pointLight6);
        //lightArray.push( pointLight6 );  

        // Poste 7
        poste7 = criaPoste();
        poste7.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste7.position.set(300, 400, 15);
        scene.add(poste7);

        lampada7 = criaLampada();
        poste7.add(lampada7);
        lampada7.position.set(0, 16, 0);

        pointLight7 = setPointLight(lightColor);
        lampada7.add(pointLight7);
        //lightArray.push( pointLight7 ); 

        // Poste 8
        poste8 = criaPoste();
        poste8.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste8.position.set(450, 550, 15);
        scene.add(poste8);

        lampada8 = criaLampada();
        poste8.add(lampada8);
        lampada8.position.set(0, 16, 0);

        pointLight8 = setPointLight(lightColor);
        lampada8.add(pointLight8);
        //lightArray.push( pointLight8 ); 

    }

    function criaPoste() {
        var geometriaPoste = new THREE.CylinderGeometry(1, 2, 30, 10);
        var materialPoste = new THREE.MeshPhongMaterial({ color: 'rgb(80,80,80)' });
        var poste = new THREE.Mesh(geometriaPoste, materialPoste);
        poste.castShadow = true;
        return poste;
    }

    function criaLampada() {
        var geometriaLampada = new THREE.SphereGeometry(2, 10, 10);
        var materialLampada = new THREE.MeshPhongMaterial({ color: 'rgb(255,255,255)' });
        var lampada = new THREE.Mesh(geometriaLampada, materialLampada);
        lampada.castShadow = true;
        return lampada;
    }

    function setPointLight(lightColor) {
        pointLight = new THREE.PointLight(lightColor, 0.5);
        pointLight.name = "Point Light"
        pointLight.castShadow = true;
        pointLight.visible = true;
        return pointLight;
    }

    function criaLuzSol() {
        sol = new THREE.DirectionalLight(lightColor);
        sol.position.set(0, 0, 100);
        sol.target.position.set(0, 0, 0);
        sol.shadow.mapSize.width = 2048;
        sol.shadow.mapSize.height = 2048;
        sol.castShadow = true;

        sol.shadow.camera.left = -200;
        sol.shadow.camera.right = 200;
        sol.shadow.camera.top = 200;
        sol.shadow.camera.bottom = -200;
        sol.name = "Luz Sol";
        sol.visible = true;

        scene.add(sol);
        scene.add(sol.target);
    }

    function setSpotLight(position) {
        spotLight.position.copy(position);
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.camera.fov = degreesToRadians(20);
        spotLight.castShadow = true;
        spotLight.decay = 2;
        spotLight.penumbra = 0.05;
        spotLight.name = "Spot Light";
        spotLight.target = chassi;
        scene.add(spotLight);
        scene.add(spotLight.target);

        spotLight.visible = true;
    }

    // Chama a função para criar as montanhas

    var Montanha1_parte1 = null;
    var Montanha1_parte2 = null;
    var Montanha1_parte3 = null;
    var Montanha2_parte1 = null;
    var Montanha2_parte2 = null;
    criaMontanhas();

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
    var salva_posicao_x, salva_posicao_y, salva_posicao_z;

    buildInterface();
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

            var camera_posicao = new THREE.Vector3(80, 0, 20);

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
        if (keyboard.down("space")) {
            changeProjection();
        };
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

            poste1.visible = true;
            poste2.visible = true;
            poste3.visible = true;
            poste4.visible = true;
            poste5.visible = true;
            poste6.visible = true;
            poste7.visible = true;
            poste8.visible = true;
            Montanha1_parte1.visible = true;
            Montanha1_parte1.visible = true;
            Montanha1_parte1.visible = true;
            Montanha2_parte1.visible = true;
            Montanha2_parte2.visible = true;

            // As variáveis que armazenam a posição do kart antes da mudança para o modo inspeção são usadas para atualizar 
            // a posição do kart ao ir para o modo jogo
            chassi.position.set(salva_posicao_x, salva_posicao_y, salva_posicao_z);

        } else {
            // Armazena a posição do kart antes de mudar para o modo inspeção
            salva_posicao_x = chassi.position.x;
            salva_posicao_y = chassi.position.y;
            salva_posicao_z = chassi.position.z;
            // Altera a posição do kart para a origem do plano 
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

            poste1.visible = false;
            poste2.visible = false;
            poste3.visible = false;
            poste4.visible = false;
            poste5.visible = false;
            poste6.visible = false;
            poste7.visible = false;
            poste8.visible = false;
            Montanha1_parte1.visible = false;
            Montanha1_parte1.visible = false;
            Montanha1_parte1.visible = false;
            Montanha2_parte1.visible = false;
            Montanha2_parte2.visible = false;
        }
        camera.position.copy(pos);
        camera.lookAt(scene.position);
        trackballControls = initTrackballControls(camera, renderer);
        lightFollowingCamera(spotLight, camera); // Makes light follow the camera
    }


    function buildInterface() {
        //------------------------------------------------------------
        // Interface
        var controls = new function () {
            this.viewAxes = false;
            this.viewPointLight = true;
            this.viewDirectionalLight = true;
            this.viewSpotLight = true;

            this.onViewAxes = function () {
                axesHelper.visible = this.viewAxes;
            };
            this.onEnablePointLights = function () {
                pointLight1.visible = this.viewPointLight;
                pointLight2.visible = this.viewPointLight;
                pointLight3.visible = this.viewPointLight;
                pointLight4.visible = this.viewPointLight;
                pointLight5.visible = this.viewPointLight;
                pointLight6.visible = this.viewPointLight;
                pointLight7.visible = this.viewPointLight;
                pointLight8.visible = this.viewPointLight;
            };
            this.onEnableDirectionalLight = function () {
                sol.visible = this.viewDirectionalLight;
            };
            this.onEnableSpotLight = function () {
                spotLight.visible = this.viewSpotLight;
            };
        };

        var gui = new dat.GUI();
        gui.add(controls, 'viewAxes', false)
            .name("View Axes")
            .onChange(function (e) { controls.onViewAxes() });

        gui.add(controls, 'viewPointLight', true)
            .name("PointLights")
            .onChange(function (e) { controls.onEnablePointLights() });

        gui.add(controls, 'viewDirectionalLight', true)
            .name("DirectionalLight (Sol)")
            .onChange(function (e) { controls.onEnableDirectionalLight() });

        gui.add(controls, 'viewSpotLight', true)
            .name("SpotLight")
            .onChange(function (e) { controls.onEnableSpotLight() });
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
        lightFollowingCamera(spotLight, camera);
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

    function criaMontanhas() {
        var objectVisibility = true;
        var castShadow = true;
        var montanhas_cor = "rgb(100, 70, 20)";
        var montanhasMaterial = new THREE.MeshLambertMaterial({
            color: montanhas_cor,
            transparent: false
        });
        var pontos_montanha1_parte1 = [];
        var montanha1_parte1_dimensoes = new THREE.Vector3(60, 120, 60);
        montanha_tipo1(pontos_montanha1_parte1, montanha1_parte1_dimensoes);

        // Criando Montanha 1

        var convexGeometry_m1p1 = new THREE.ConvexBufferGeometry(pontos_montanha1_parte1);
        Montanha1_parte1 = new THREE.Mesh(convexGeometry_m1p1, montanhasMaterial);
        Montanha1_parte1.castShadow = castShadow;
        Montanha1_parte1.visible = objectVisibility;
        Montanha1_parte1.position.set(0, 200, 0);
        Montanha1_parte1.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        scene.add(Montanha1_parte1);

        var pontos_montanha1_parte2 = [];
        var montanha1_parte2_dimensoes = new THREE.Vector3(60, 100, 60);
        montanha_tipo2(pontos_montanha1_parte2, montanha1_parte2_dimensoes);

        var convexGeometry_m1_p2 = new THREE.ConvexBufferGeometry(pontos_montanha1_parte2);
        Montanha1_parte2 = new THREE.Mesh(convexGeometry_m1_p2, montanhasMaterial);
        Montanha1_parte2.castShadow = castShadow;
        Montanha1_parte2.visible = objectVisibility;
        Montanha1_parte2.position.set(130, 0, 0);
        Montanha1_parte1.add(Montanha1_parte2);

        var pontos_montanha1_parte3 = [];
        var montanha1_parte3_dimensoes = new THREE.Vector3(40, 70, 40);
        montanha_tipo1(pontos_montanha1_parte3, montanha1_parte3_dimensoes);

        var convexGeometry_m1_p3 = new THREE.ConvexBufferGeometry(pontos_montanha1_parte3);
        Montanha1_parte3 = new THREE.Mesh(convexGeometry_m1_p3, montanhasMaterial);
        Montanha1_parte3.castShadow = castShadow;
        Montanha1_parte3.visible = objectVisibility;
        Montanha1_parte3.position.set(250, 0, 0);
        Montanha1_parte1.add(Montanha1_parte3);

        // Criando Montanha 2

        var pontos_montanha2_parte1 = [];
        var montanha2_parte1_dimensoes = new THREE.Vector3(40, 40, 40);
        montanha_tipo1(pontos_montanha2_parte1, montanha2_parte1_dimensoes);

        var convexGeometry_m2_p1 = new THREE.ConvexBufferGeometry(pontos_montanha2_parte1);
        Montanha2_parte1 = new THREE.Mesh(convexGeometry_m2_p1, montanhasMaterial);
        Montanha2_parte1.castShadow = castShadow;
        Montanha2_parte1.visible = objectVisibility;
        Montanha2_parte1.position.set(700, 200, 0);
        Montanha2_parte1.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        scene.add(Montanha2_parte1);


        var pontos_montanha2_parte2 = [];
        var montanha2_parte2_dimensoes = new THREE.Vector3(40, 70, 40);
        montanha_tipo2(pontos_montanha2_parte2, montanha2_parte2_dimensoes);

        var convexGeometry_m2_p2 = new THREE.ConvexBufferGeometry(pontos_montanha2_parte2);
        Montanha2_parte2 = new THREE.Mesh(convexGeometry_m2_p2, montanhasMaterial);
        Montanha2_parte2.castShadow = castShadow;
        Montanha2_parte2.visible = objectVisibility;
        Montanha2_parte2.position.set(700, 290, 0);
        Montanha2_parte2.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        scene.add(Montanha2_parte2);

    }

    function montanha_tipo1(pontos, dimensoes) {
        pontos.push(new THREE.Vector3(dimensoes.x, 0, dimensoes.z));
        pontos.push(new THREE.Vector3(- dimensoes.x, 0, dimensoes.z));
        pontos.push(new THREE.Vector3(- dimensoes.x - 50, 0, dimensoes.z / 2));
        pontos.push(new THREE.Vector3(- dimensoes.x + 30, 0, dimensoes.z / 2));
        pontos.push(new THREE.Vector3(dimensoes.x, 0, - dimensoes.z));
        pontos.push(new THREE.Vector3(dimensoes.x, 0, - dimensoes.z / 2));
        pontos.push(new THREE.Vector3(dimensoes.x, 0, - dimensoes.z / 3));
        pontos.push(new THREE.Vector3(dimensoes.x / 2, 0, - dimensoes.z + 10));
        pontos.push(new THREE.Vector3(dimensoes.x / 2, 0, - dimensoes.z + 30));
        pontos.push(new THREE.Vector3(- dimensoes.x, 0, - dimensoes.z));
        pontos.push(new THREE.Vector3(0, dimensoes.y, 0));
        pontos.push(new THREE.Vector3(0, dimensoes.y, 20));
        pontos.push(new THREE.Vector3(0, dimensoes.y + 40, -20));
        pontos.push(new THREE.Vector3(50, dimensoes.y, -10));
        pontos.push(new THREE.Vector3(20, dimensoes.y - 5, 0));
        pontos.push(new THREE.Vector3(20, dimensoes.y / 2, 0));
        pontos.push(new THREE.Vector3(dimensoes.x + 20, 0, dimensoes.z + 10));
        pontos.push(new THREE.Vector3(- dimensoes.x - 20, 0, dimensoes.z + 10));
        pontos.push(new THREE.Vector3(dimensoes.x + 20, 0, - dimensoes.z - 10));
        pontos.push(new THREE.Vector3(dimensoes.x + 20, 0, - dimensoes.z - 10));
        return pontos;
    }

    function montanha_tipo2(pontos, dimensoes) {
        pontos.push(new THREE.Vector3(dimensoes.x, 0, dimensoes.z));
        pontos.push(new THREE.Vector3(- dimensoes.x, 0, dimensoes.z));
        pontos.push(new THREE.Vector3(dimensoes.x, 0, - dimensoes.z));
        pontos.push(new THREE.Vector3(- dimensoes.x, 0, - dimensoes.z));
        pontos.push(new THREE.Vector3(-dimensoes.x + 30, 0, dimensoes.z + 30));
        pontos.push(new THREE.Vector3(- dimensoes.x + 20, 20, dimensoes.z + 10));
        pontos.push(new THREE.Vector3(-10, dimensoes.y, 20));
        pontos.push(new THREE.Vector3(0, dimensoes.y, 0));
        pontos.push(new THREE.Vector3(0, dimensoes.y, 20));
        pontos.push(new THREE.Vector3(-20, dimensoes.y, 0));
        pontos.push(new THREE.Vector3(0, 0, dimensoes.z));
        pontos.push(new THREE.Vector3(dimensoes.x, 0, 20));
        pontos.push(new THREE.Vector3(dimensoes.x + 10, 0, dimensoes.z));
        pontos.push(new THREE.Vector3(- dimensoes.x + 10, 0, dimensoes.z));
        pontos.push(new THREE.Vector3(dimensoes.x + 10, 0, - dimensoes.z));
        pontos.push(new THREE.Vector3(- dimensoes.x + 10, 0, - dimensoes.z));
        pontos.push(new THREE.Vector3(dimensoes.x, 0, dimensoes.z + 20));
        pontos.push(new THREE.Vector3(- dimensoes.x, 0, dimensoes.z + 20));
        pontos.push(new THREE.Vector3(dimensoes.x, 0, - dimensoes.z - 20));
        pontos.push(new THREE.Vector3(- dimensoes.x, 0, - dimensoes.z - 20));

    }
}