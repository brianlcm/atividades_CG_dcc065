function main() {
    var stats = initStats();          // To show FPS information
    var scene = new THREE.Scene();    // Create main scene
    var renderer = initRenderer();    // View function in util/utils
    var camera = customInitCamera(new THREE.Vector3(0, -60, 30)); // Init camera in this position 
    scene.background = new THREE.Color('rgb(102, 153, 255)');
    camera.far=10000;
    var textureLoader = new THREE.TextureLoader();
    // Mostra orientações na tela
    showInformation();
    const skyboxloader = new THREE.CubeTextureLoader();
    
    //scene.background = texture;
    // Para usar o teclado
    var keyboard = new KeyboardState();

    // Enable mouse rotation, pan, zoom etc.
    var trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

    // Show axes (parameter is size of each axis)
    var axesHelper = new THREE.AxesHelper(12);
    scene.add(axesHelper);

    // Criação do plano da pista
    var pista = textureLoader.load('./assets/pista.jpg');
    var planeGeometry1 = new THREE.PlaneGeometry(1600, 1600, 100, 100);
    planeGeometry1.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
    var planeMaterial1 = new THREE.MeshStandardMaterial({
        color: "rgba(100, 100, 100)",
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 1, // positive value pushes polygon further away
        polygonOffsetUnits: 1
    });
    var planePista = new THREE.Mesh(planeGeometry1, planeMaterial1);
    planePista.material.map = pista;
    scene.add(planePista);
    planePista.castShadow=false;
    planePista.receiveShadow= true;
    planePista.material.map.minFilter = THREE.LinearFilter;
    planePista.material.map.magFilter = THREE.LinearFilter;
    
    // Criação do plano da areia
    var areia = textureLoader.load('./assets/sand.jpg');
    var planeGeometry2 = new THREE.PlaneGeometry(3200, 3200, 100, 100);
    planeGeometry2.translate(0.0, 0.0, -0.1);
    var planeMaterial2 = new THREE.MeshStandardMaterial({
        color: "rgba(100, 100, 100)",
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 1, // positive value pushes polygon further away
        polygonOffsetUnits: 1
    });
    var planeAreia = new THREE.Mesh(planeGeometry2, planeMaterial2);
    scene.add(planeAreia);
    planeAreia.castShadow=false;
    planeAreia.receiveShadow= true;

    planeAreia.material.map = areia;
    planeAreia.material.map.repeat.set(1.8,1.8);
    planeAreia.material.map.wrapS = THREE.RepeatWrapping;
    planeAreia.material.map.wrapT = THREE.RepeatWrapping;
    planeAreia.material.map.minFilter = THREE.LinearFilter;
    planeAreia.material.map.magFilter = THREE.LinearFilter;
    //planeAreia.material.map.needsUpdate = true;
    // ** Início da criação do kart **

    // Chassi
    var GeometriaChassi = new THREE.BoxGeometry(24, 2.5, 2.5, 5, 5, 5);
    var MaterialChassi = new THREE.MeshLambertMaterial({color:"rgb(150,150,150)",side:THREE.DoubleSide});
    var GeometriaChassiInterno = new THREE.BoxGeometry(10, 7, 2.5, 5, 5, 5);

    var chassi = new THREE.Mesh(GeometriaChassi, MaterialChassi);
    var chassiInterno = new THREE.Mesh(GeometriaChassiInterno, MaterialChassi);
    chassi.position.set(150.0, -450.0, 2.0);
    chassiInterno.castShadow = true;
    chassi.castShadow = true;
    var neon = textureLoader.load('./assets/txt3.jpg');
    chassi.material.map=neon;
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
    var Material_aerofolio = new THREE.MeshLambertMaterial({color:"rgb(50,50,50)",side:THREE.DoubleSide});
    var lado1_aerofolio = new THREE.Mesh(Geometria_aerofolio_lado, Material_aerofolio);
    lado1_aerofolio.position.set(10.0, 1.0, 2.5);
    lado1_aerofolio.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(90));
    var metal = textureLoader.load('./assets/textura-metal.jpg');
    

    var lado2_aerofolio = new THREE.Mesh(Geometria_aerofolio_lado, Material_aerofolio);
    lado2_aerofolio.position.set(10.0, -1.0, 2.5);
    lado2_aerofolio.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(90));
    

    var Geometria_aerofolio = new THREE.BoxGeometry(0.5, 3, 8, 5, 5, 5);
    var aerofolio_superior = new THREE.Mesh(Geometria_aerofolio, Material_aerofolio);
    aerofolio_superior.position.set(10.0, 0.0, 3.8);
    aerofolio_superior.rotateOnAxis(new THREE.Vector3(0, 1, 0), degreesToRadians(90));
    aerofolio_superior.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));

    aerofolio_superior.material.map=metal;
    aerofolio_superior.castShadow = true;
    lado1_aerofolio.castShadow = true;
    lado2_aerofolio.castShadow = true;

    chassi.add(aerofolio_superior);
    chassi.add(lado1_aerofolio);
    chassi.add(lado2_aerofolio);

    var bicoFrontal = criarBicoFrontal();
    bicoFrontal.position.set(-10, 0, 0);
    var carbono = textureLoader.load('./assets/carbono.jpg');
    bicoFrontal.material.map=carbono;
    chassi.add(bicoFrontal);

    var cabine = criarCabine();
    cabine.position.set(0.0, 0.0, 0.0);
    cabine.castShadow = true;
    
    chassi.add(cabine);

    var couro = textureLoader.load('./assets/couro.jpg');
    var bancoEncosto = criarBancoEncosto();
    bancoEncosto.position.set(4, 0, 1.5);
    bancoEncosto.material.map=couro;
    chassi.add(bancoEncosto);

    var bancoAssento = criarBancoAssento();
    bancoAssento.position.set(-1, 0, 0);
    bancoAssento.material.map=couro;
    bancoEncosto.add(bancoAssento);

    // Funções necessárias para a criações de várias formas geométricas que integram o kart
    function criarBicoFrontal() {
        var GeometriaBico = new THREE.BoxGeometry(2, 10, 1, 5, 5, 5);
        var BicoMaterial = new THREE.MeshLambertMaterial({color:"rgb(100,100,100)",side:THREE.DoubleSide});
        var bico = new THREE.Mesh(GeometriaBico, BicoMaterial);
        bico.castShadow = true;
        return bico;
    }

    function criarPneu() {
        var GeometriaPneu = new THREE.CylinderGeometry(2, 2, 2, 35, 7, false, 0);
        var MaterialPneu = new THREE.MeshLambertMaterial({color:"rgb(20,20,20)",side:THREE.DoubleSide});
        var pneu = new THREE.Mesh(GeometriaPneu, MaterialPneu);
        var borracha=textureLoader.load('./assets/borracha.jpg');
        pneu.material.map=borracha;
        pneu.castShadow = true;
        return pneu;
    }

    function criarEixo() {
        var GeometriaEixo = new THREE.CylinderGeometry(0.5, 0.5, 11.5, 10, 12, false, 0);
        var MaterialEixo = new THREE.MeshPhongMaterial({ color: 'rgb(100,100,100)' });
        var eixo = new THREE.Mesh(GeometriaEixo, MaterialEixo);
        eixo.castShadow = true;
        var iron = textureLoader.load('./assets/iron.jpg');
        eixo.material.map=iron;
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
        var mesh = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({ color: 'rgb(20,20,20)' }));
        return mesh;
    }

    // ** Fim da criação do kart **

    // Importação Estatua
    var estatua = null;
    criaEstatua();
    function criaEstatua() {
        // Carrega o objeto (.obj) da Estatua presente na pasta assets
        loadOBJFile('./assets/', 'estatuaCristo', true, 80);
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

                    // Ativa 'castShadow' para os filhos do objeto
                    obj.traverse(function (child) {
                        child.castShadow = true;
                    });

                    obj.traverse(function (node) {
                        if (node.material) node.material.side = THREE.DoubleSide;
                    });

                    var obj = normalizeAndRescale(obj, desiredScale);
                    var obj = fixPosition(obj);
                    
                    estatua=obj;

                    scene.add(estatua);
                    estatua.position.set(-350, 300, 0);
                    estatua.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(90));
                    estatua.castShadow=true;
                }, onProgress, onError);
            });
        }

        function onError() { };

        function onProgress(xhr, model) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
            }
        }

        // Função que altera a escala do objeto
        function normalizeAndRescale(obj, newScale) {
            var scale = getMaxSize(obj); // 'utils.js'
            obj.scale.set(newScale * (1.0 / scale),
                newScale * (1.0 / scale),
                newScale * (1.0 / scale));
            return obj;
        }

        // Função que corrige a posição do objeto acima do plano
        function fixPosition(obj) {
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

    criaPostesLuz();

    var spotLightKart = new THREE.SpotLight(lightColor);
    var spotLightPositionKart = new THREE.Vector3(80, 0, 40);

    // Posição da spot light (luz que segue a camera) com base na posição do chassi
    var luz_segue_kart = spotLightPositionKart.applyMatrix4(chassi.matrixWorld);
    setSpotLightKart(luz_segue_kart);

    // Criação dos 8 postes de luz, com suas respectivas lampadas e luzes (point lights)
    function criaPostesLuz() {

        // Poste 1
        poste1 = criaPoste();
        poste1.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste1.position.set(-480, -700, 15);
        scene.add(poste1);

        lampada1 = criaLampada();
        poste1.add(lampada1);
        lampada1.position.set(0, 16, 0);

        spotLightPoste1 = setSpotLightPoste(poste1.position.x - 20, poste1.position.y + 100, poste1.position.z);
        lampada1.add(spotLightPoste1);
        scene.add(spotLightPoste1.target);

        // Poste 2
        poste2 = criaPoste();
        poste2.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste2.position.set(-160, -700, 15);
        scene.add(poste2);

        lampada2 = criaLampada();
        poste2.add(lampada2);
        lampada2.position.set(0, 16, 0);

        spotLightPoste2 = setSpotLightPoste(poste2.position.x, poste2.position.y + 100, poste2.position.z);
        lampada2.add(spotLightPoste2);
        scene.add(spotLightPoste2.target);

        // Poste 3 
        poste3 = criaPoste();
        poste3.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste3.position.set(160, -700, 15);
        scene.add(poste3);

        lampada3 = criaLampada();
        poste3.add(lampada3);
        lampada3.position.set(0, 16, 0);

        spotLightPoste3 = setSpotLightPoste(poste3.position.x, poste3.position.y + 100, poste3.position.z);
        lampada3.add(spotLightPoste3);
        scene.add(spotLightPoste3.target);

        // Poste 4
        poste4 = criaPoste();
        poste4.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste4.position.set(480, -700, 15);
        scene.add(poste4);

        lampada4 = criaLampada();
        poste4.add(lampada4);
        lampada4.position.set(0, 16, 0);

        spotLightPoste4 = setSpotLightPoste(poste4.position.x + 20, poste4.position.y + 100, poste4.position.z);
        lampada4.add(spotLightPoste4); 
        scene.add(spotLightPoste4.target);

        // Poste 5
        poste5 = criaPoste();
        poste5.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste5.position.set(-850, 400, 15);
        scene.add(poste5);
        
        lampada5 = criaLampada();
        poste5.add(lampada5);
        lampada5.position.set(0, 16, 0);

        spotLightPoste5 = setSpotLightPoste(poste5.position.x + 100, poste5.position.y, poste4.position.z);
        lampada5.add(spotLightPoste5);
        scene.add(spotLightPoste5.target);
        
        // Poste 6
        poste6 = criaPoste();
        poste6.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste6.position.set(-450, -50, 15);
        scene.add(poste6);

        lampada6 = criaLampada();
        poste6.add(lampada6);
        lampada6.position.set(0, 16, 0);

        spotLightPoste6 = setSpotLightPoste(poste6.position.x + 100, poste6.position.y, poste6.position.z);
        lampada6.add(spotLightPoste6);
        scene.add(spotLightPoste6.target);

        // Poste 7
        poste7 = criaPoste();
        poste7.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste7.position.set(30, 400, 15);
        scene.add(poste7);

        lampada7 = criaLampada();
        poste7.add(lampada7);
        lampada7.position.set(0, 16, 0);

        spotLightPoste7 = setSpotLightPoste(poste7.position.x + 100, poste7.position.y, poste7.position.z);
        lampada7.add(spotLightPoste7);
        scene.add(spotLightPoste7.target);

        // Poste 8
        poste8 = criaPoste();
        poste8.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        poste8.position.set(600, 830, 15);
        scene.add(poste8);

        lampada8 = criaLampada();
        poste8.add(lampada8);
        lampada8.position.set(0, 16, 0);

        spotLightPoste8 = setSpotLightPoste(poste8.position.x, poste8.position.y - 100, poste8.position.z);
        lampada8.add(spotLightPoste8); 
        scene.add(spotLightPoste8.target);
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
        lampada.castShadow = false;
        lampada.receiveShadow = false;
        return lampada;
    }

    function criaLuzSol() {
        sol = new THREE.DirectionalLight(lightColor);
        sol.position.set(0, 0, 100);
        sol.target.position.set(0, 0, 0);
        sol.shadow.mapSize.width = 800; // default
        sol.shadow.mapSize.height = 800; // default
        sol.shadow.camera.near = 1; // default
        sol.shadow.camera.far = 3500; // default
        sol.castShadow = true;

        sol.shadow.camera.left = -1000;
        sol.shadow.camera.right = +1000;
        sol.shadow.camera.top = 1000;
        sol.shadow.camera.bottom = -1000;
        sol.name = "Luz Sol";
        sol.visible = true;

        scene.add(sol);
        scene.add(sol.target);
    }

    function setSpotLightPoste(tgtx, tgty, tgtz) {
        spotLightPoste = new THREE.SpotLight(lightColor);
        //spotLightPoste.position.copy(position);
        spotLightPoste.shadow.mapSize.width = 600; // default
        spotLightPoste.shadow.mapSize.height = 600; // default
        spotLightPoste.shadow.camera.near = 0.3; // default
        spotLightPoste.shadow.camera.far = 1500; // default
        spotLightPoste.distance=800;
        spotLightPoste.penumbra=0.1;
        spotLightPoste.intesity=10;
        spotLightPoste.angle= degreesToRadians(70);
        spotLightPoste.shadow.camera.fov = radiansToDegrees(spotLightPoste.angle);
        spotLightPoste.name = "Spot Light Poste";
        spotLightPoste.target.position.set(tgtx,tgty,tgtz);
    
        spotLightPoste.visible = true;
        spotLightPoste.castShadow=true;
        spotLightPoste.receiveShadow=false;

        return spotLightPoste;
    }

    function setSpotLightKart(position) {
        spotLightKart.position.copy(position);
        spotLightKart.shadow.mapSize.width = 512; // default
        spotLightKart.shadow.mapSize.height = 512; // default
        spotLightKart.shadow.camera.near = 1; // default
        spotLightKart.shadow.camera.far = 500; // default
        spotLightKart.distance=300;
        spotLightKart.penumbra=0.5;
        spotLightKart.intensity=2;
        spotLightKart.angle= degreesToRadians(45);
        spotLightKart.shadow.camera.fov = radiansToDegrees(spotLightKart.angle);
        spotLightKart.name = "Spot Light Kart";
        spotLightKart.target = chassi;
        scene.add(spotLightKart);
        scene.add(spotLightKart.target);

        spotLightKart.visible = true;
        spotLightKart.castShadow=true;
        spotLightKart.receiveShadow=true;
    }
    // ** Fim criação das luzes **

    // Chama a função para criar as montanhas

    // Declaração das varíaveis que serão usadas para a criação das montanhas
    var Montanha1_parte1 = null;
    var Montanha1_parte2 = null;
    var Montanha1_parte3 = null;
    var Montanha2_parte1 = null;
    var Montanha2_parte2 = null;
    // Chamada da função responsável pela criação das montanhas
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

    // Variável necessária para verificar qual modo de câmera está ativo
    var modo = 'jogo';
    

    buildInterface();
    render();

    function keyboardUpdate() {

        keyboard.update();

        var rotacao_pneus = degreesToRadians(20);
        var angulo_pneu_aux = degreesToRadians(3);
        
        if (modo != 'inspecao') {

            if (keyboard.pressed("up")) {
                // Configura a rotação dos pneus durante a movimentação
                solta_setaparacima = false;
                if (velocidade < 0) {
                    solta_setaparabaixo = false;
                    velocidade = velocidade + aceleracao * 3;
                    chassi.translateX(-velocidade);
                }
                else{
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
        }

            if (keyboard.pressed("down")) {
                solta_setaparabaixo = false;
                if (velocidade > 0) {
                    solta_setaparacima = false;
                    velocidade = velocidade - aceleracao * 3;
                    chassi.translateX(-velocidade);
                }
                else{
                    solta_setaparacima = false;
                    solta_setaparabaixo = false;
                    if (velocidade > -velocidade_maxima) {
                        velocidade = velocidade - aceleracao;
                    }
                    chassi.translateX(-velocidade);
                    voltaPneus();
                }
            }
            if (keyboard.up("down")) solta_setaparabaixo = true;
            if (keyboard.up("up")) solta_setaparacima = true;

            // Configura câmera para seguir o kart
            camera.up.set(0, 0, 1);

            if(modo == 'jogo'){
                var camera_posicao = new THREE.Vector3(80, 0, 20);
                var camera_segue_kart = camera_posicao.applyMatrix4(chassi.matrixWorld);
                camera.position.x = camera_segue_kart.x;
                camera.position.y = camera_segue_kart.y;
                camera.position.z = camera_segue_kart.z;

                camera.lookAt(chassi.position);
            }

            else if(modo == 'cockpit'){
                
                var camera_posicao = new THREE.Vector3(8, 0, 1);
                var camera_segue_kart = camera_posicao.applyMatrix4(chassi.matrixWorld);
                camera.position.x = camera_segue_kart.x;
                camera.position.y = camera_segue_kart.y;
                camera.position.z = camera_segue_kart.z + 5;

                camera.lookAt(chassi.position.x, chassi.position.y, chassi.position.z + 5);
            }
            //var camera_segue_kart = camera_posicao.applyMatrix4(chassi.matrixWorld);

        }

        if (keyboard.pressed("left")) {
            /* Condição para verificar se o kart está em uma velocidade muito baixa para fazer uma curva para a esquerda. Dessa forma, o kart precisa ter uma velocidade superior
            a 0.3 para fazer uma curva */
            if (modo != 'inspecao' && velocidade > 0.3) {
                chassi.rotateZ(degreesToRadians(2));
            }

            else if (modo != 'inspecao' && velocidade < -0.3) {
                chassi.rotateZ(degreesToRadians(-2));
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
            if (modo != 'inspecao' && velocidade > 0.3) {
                chassi.rotateZ(degreesToRadians(-2));
            }
            else if (modo != 'inspecao' && velocidade < -0.3) {
                chassi.rotateZ(degreesToRadians(2));
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

    // Função para alternar entre os modos de câmera
    function changeProjection() {

        var pos = new THREE.Vector3().copy(new THREE.Vector3(0, -60, 30));

        /* Se o modo de inspeção estiver ativo, então o usuário deseja voltar para o modo de jogo. Nesse caso, é preciso adicionar o plano e as linhas, além das
        configurações da câmera*/
        if (modo == 'inspecao') {

            scene.add(planeAreia);
            scene.add(planePista)
            chassi.rotateOnAxis(new THREE.Vector3(0, 0, 1), degreesToRadians(-90));
            projectionMessage.changeMessage("Modo Jogo");
            modo = 'jogo';

            // Deixando alguns objetos visíveis no modo de jogo, pois no modo de inspeção eles foram deixados como invisíveis
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
            estatua.visible = true;

            // As variáveis que armazenam a posição do kart antes da mudança para o modo inspeção são usadas para atualizar 
            // a posição do kart ao ir para o modo jogo
            chassi.position.set(salva_posicao_x, salva_posicao_y, salva_posicao_z);

        } 
        // Se o modo jogo esta ativo, então o modo a ser ativado é o modo cockpit
        else if(modo == 'jogo'){
            
            projectionMessage.changeMessage("Modo Cockpit");
            modo = 'cockpit';
        }
        else {
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
            scene.remove(planePista);
            scene.remove(planeAreia);
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            projectionMessage.changeMessage("Modo Inspeção");
            modo = 'inspecao';

            // Deixando alguns objetos invisíveis durante o modo de inspeção
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
            estatua.visible = false;
        }
        camera.position.copy(pos);
        camera.lookAt(scene.position);
        trackballControls = initTrackballControls(camera, renderer);
        lightFollowingCamera(spotLightKart, camera); // Makes light follow the camera
    }

    // Desenvolvimento das caixas de seleção na interface para ajustar as luzes
    function buildInterface() {
        //------------------------------------------------------------
        // Interface
        var controls = new function () {
            this.viewAxes = true;
            this.viewSpotLightPoste = true;
            this.viewDirectionalLight = true;
            this.viewSpotLightKart = true;

            this.onViewAxes = function () {
                axesHelper.visible = this.viewAxes;
            };
            this.onEnableSpotLightPoste = function () {
                spotLightPoste1.visible = this.viewSpotLightPoste;
                spotLightPoste2.visible = this.viewSpotLightPoste;
                spotLightPoste3.visible = this.viewSpotLightPoste;
                spotLightPoste4.visible = this.viewSpotLightPoste;
                spotLightPoste5.visible = this.viewSpotLightPoste;
                spotLightPoste6.visible = this.viewSpotLightPoste;
                spotLightPoste7.visible = this.viewSpotLightPoste;
                spotLightPoste8.visible = this.viewSpotLightPoste;
            };
            this.onEnableDirectionalLight = function () {
                sol.visible = this.viewDirectionalLight;
            };
            this.onEnableSpotLightKart = function () {
                spotLightKart.visible = this.viewSpotLightKart;
            };
        };

        var gui = new dat.GUI();
        gui.add(controls, 'viewAxes', true)
            .name("View Axes")
            .onChange(function (e) { controls.onViewAxes() });

        gui.add(controls, 'viewSpotLightPoste', true)
            .name("SpotLights Postes")
            .onChange(function (e) { controls.onEnableSpotLightPoste() });

        gui.add(controls, 'viewDirectionalLight', true)
            .name("DirectionalLight (Sol)")
            .onChange(function (e) { controls.onEnableDirectionalLight() });

        gui.add(controls, 'viewSpotLightKart', true)
            .name("SpotLight Kart")
            .onChange(function (e) { controls.onEnableSpotLightKart() });
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
        controls.add("- Utilize as caixas de seleção no menu do canto direito superior para alterar a iluminação");
        controls.show();
    }

    function render() {
        stats.update(); // Update FPS
        trackballControls.update(); // Enable mouse movements
        keyboardUpdate();
        lightFollowingCamera(spotLightKart, camera);
        requestAnimationFrame(render);
        if (velocidade > 0 && (solta_setaparacima == true || solta_setaparabaixo == true)) {
            velocidade = velocidade - aceleracao;
            chassi.translateX(-velocidade);
            voltaPneus();
        }
        else if(velocidade < 0 && (solta_setaparacima == true || solta_setaparabaixo == true)){
            velocidade = velocidade + aceleracao;
            chassi.translateX(-velocidade);
            voltaPneus();
        }
        else {
            solta_setaparacima = false;
            solta_setaparabaixo = false;
        }
        renderer.render(scene, camera) // Render scene
    }

    // Função responsável pela criação das montanhas
    function criaMontanhas() {
        // Visibilidade da montanha como true
        var objectVisibility = true;
        // Sombras como true
        var castShadow = true;
        // Definindo as cores da montanha de acordo com as orientações do trabalho
        var montanhas_cor = "rgb(100, 70, 20)";
        // Criação do material que será usado nas montanhas
        var montanhasMaterial = new THREE.MeshLambertMaterial({
            color: montanhas_cor,
            transparent: false
        });
        // ** Montanha 1 - Parte 1**
        // Criação do array de pontos para a primeira parte da primeira montanha
        var pontos_montanha1_parte1 = [];
        // Criação da varíavel que define as dimensões da primeira parte da primeira montanha
        var montanha1_parte1_dimensoes = new THREE.Vector3(60, 120, 60);
        // Chamada da função de preenchimento dos pontos da montanha. Enviamos como parâmetros o array de pontos e as dimensões da montanha
        montanha_tipo1(pontos_montanha1_parte1, montanha1_parte1_dimensoes);

        // Aqui criamos a geometria do tipo ConvexBufferGeometry e passamos os pontos preenchidos como parâmetro
        var convexGeometry_m1p1 = new THREE.ConvexBufferGeometry(pontos_montanha1_parte1);
        // Cria a montanha 1 (parte 1) enviando a geometria e o material
        Montanha1_parte1 = new THREE.Mesh(convexGeometry_m1p1, montanhasMaterial);
        Montanha1_parte1.castShadow = castShadow;
        Montanha1_parte1.visible = objectVisibility;
        // Define a posição da montanha no plano
        Montanha1_parte1.position.set(-100, 20, 0);
        // Foi necessário fazer uma rotação na montanha para ajustar ao nosso plano
        Montanha1_parte1.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
        scene.add(Montanha1_parte1);

        // ** Fim da criação da Montanha 1 - Parte 1**

        // ** Montanha 1 - Parte 2**
        var pontos_montanha1_parte2 = [];
        var montanha1_parte2_dimensoes = new THREE.Vector3(60, 100, 60);
        montanha_tipo2(pontos_montanha1_parte2, montanha1_parte2_dimensoes);

        var convexGeometry_m1_p2 = new THREE.ConvexBufferGeometry(pontos_montanha1_parte2);
        Montanha1_parte2 = new THREE.Mesh(convexGeometry_m1_p2, montanhasMaterial);
        Montanha1_parte2.castShadow = castShadow;
        Montanha1_parte2.visible = objectVisibility;
        Montanha1_parte2.position.set(130, 0, 0);
        Montanha1_parte1.add(Montanha1_parte2);
        // ** Fim da criação da Montanha 1 - Parte 2**

        // ** Montanha 1 - Parte 3**
        var pontos_montanha1_parte3 = [];
        var montanha1_parte3_dimensoes = new THREE.Vector3(40, 70, 40);
        montanha_tipo1(pontos_montanha1_parte3, montanha1_parte3_dimensoes);

        var convexGeometry_m1_p3 = new THREE.ConvexBufferGeometry(pontos_montanha1_parte3);
        Montanha1_parte3 = new THREE.Mesh(convexGeometry_m1_p3, montanhasMaterial);
        Montanha1_parte3.castShadow = castShadow;
        Montanha1_parte3.visible = objectVisibility;
        Montanha1_parte3.position.set(200, 0, 0);
        // Apenas uma rotação para mostrar um lado diferente da montanha 1 parte 3
        Montanha1_parte3.rotateOnAxis(new THREE.Vector3(0, 1, 0), degreesToRadians(180));
        Montanha1_parte1.add(Montanha1_parte3);
        // ** Fim da criação da Montanha 1 - Parte 3**

        // Criando Montanha 2

        // ** Montanha 2 - Parte 1**
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
        // ** Fim da criação da Montanha 2 - Parte 1**

        // ** Montanha 2 - Parte 2**
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
        // ** Fim da criação da Montanha 2 - Parte 2**
    }

    // Adicionando os pontos no primeiro estilo da montanha. Nesse caso, a função recebe o array de pontos que será preenchido
    // e um parâmetro contendo as dimensões da montanha que está sendo criada
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

    // Adicionando os pontos no segundo estilo da montanha. Nesse caso, a função recebe o array de pontos que será preenchido
    // e um parâmetro contendo as dimensões da montanha que está sendo criada
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
    function customInitCamera(initialPosition) {
        var position = (initialPosition !== undefined) ? initialPosition : new THREE.Vector3(-30, 40, 30);
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3200);
        camera.position.copy(position);
        camera.lookAt(new THREE.Vector3(0, 0, 0)); // or camera.lookAt(0, 0, 0);
        //camera.up.set(0, 1, 0); // That's the default value
        return camera;
    }
}