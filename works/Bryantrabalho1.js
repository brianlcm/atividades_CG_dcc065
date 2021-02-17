/*
AUTORES:
BRYAN CAROLINO MUNIZ BARBOSA
MARINA NUNES SILVA
 */

function main() {
  var stats = initStats();          // To show FPS information
  var scene = new THREE.Scene();    // Create main scene
  var renderer = initRenderer();    // View function in util/utils
  var camera = initCamera(new THREE.Vector3(0, 10, -24)); // Init camera in this position
  var light = initDefaultLighting(scene, new THREE.Vector3(7, 7, 7));
  var lightColor = 0x008000;
  var gameMode = true;
  var axisRotation = 0.0;
  var kartRotation = 0.0;
  var velocity = 0.0;
  var time = 0.0;

  var trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

  showInformation();
  // To use the keyboard
  var keyboard = new KeyboardState();

  var axesHelper = new THREE.AxesHelper(12);
  scene.add(axesHelper)

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

  var boxChassi = createCube(3, 0.85, 4, 0xFF0000);
  scene.add(boxChassi);
  boxChassi.position.set(0.0, 0.6, 0.0);
  camera.lookAt(boxChassi.position);
  boxChassi.add(camera);

  var boxTraseiroCockpit = createCube(3, 0.4, 2.2, 0xFF9B00);
  boxChassi.add(boxTraseiroCockpit);

  var boxLateralDirCockpit = createCube(1, 0.4, 1.8, 0xFF9B00);
  boxChassi.add(boxLateralDirCockpit);

  var boxLateralEsqCockpit = createCube(1, 0.4, 1.8, 0xFF9B00);
  boxChassi.add(boxLateralEsqCockpit);

  var boxFrontalCockpit = createCube(1, 0.4, 0.4, 0xFF9B00);
  boxChassi.add(boxFrontalCockpit);

  var boxBicoFrontal = createCube(1, 0.85, 2, 0xFF0000);
  boxChassi.add(boxBicoFrontal);

  var recostoBanco = createCube(0.7, 0.1, 1.2, 0x181818);
  boxChassi.add(recostoBanco);

  var assentoBanco = createCube(0.7, 0.1, 0.7, 0x181818);
  boxChassi.add(assentoBanco);

  var boxBicoTraseiro = createCube(1, 0.85, 2, 0xFF9B00);
  boxChassi.add(boxBicoTraseiro);

  var boxParaChoqueFrontal = createCube(3, 0.85, 0.8, 0xFF9B00);
  boxBicoFrontal.add(boxParaChoqueFrontal);

  var boxParaChoqueTraseiro = createCube(3, 0.85, 0.8, 0xFF9B00);
  boxBicoTraseiro.add(boxParaChoqueTraseiro);

  var aerofolio = createCube(3.0, 0.1, 0.4, 0xFF0000)
  boxParaChoqueTraseiro.add(aerofolio);

  var apoioEsqAerofolio = createCube(0.1, 0.85, 0.6, 0xFF0000);
  aerofolio.add(apoioEsqAerofolio);

  var apoioDirAerofolio = createCube(0.1, 0.85, 0.6, 0xFF0000);
  aerofolio.add(apoioDirAerofolio);

  var eixoRodasFrontal = createCylinder(0.2, 0.2, 3);
  boxBicoFrontal.add(eixoRodasFrontal);

  var eixoRodasTraseiro = createCylinder(0.2, 0.2, 3);
  boxBicoTraseiro.add(eixoRodasTraseiro);

  var pneuFrontalEsq = createCylinder(0.6, 0.6, 0.6, 25, 0x181818);
  eixoRodasFrontal.add(pneuFrontalEsq);

  var pneuFrontalDir = createCylinder(0.6, 0.6, 0.6, 25, 0x181818);
  eixoRodasFrontal.add(pneuFrontalDir);

  var pneuTraseiroEsq = createCylinder(0.6, 0.6, 0.6, 25, 0x181818);
  eixoRodasTraseiro.add(pneuTraseiroEsq);

  var pneuTraseiroDir = createCylinder(0.6, 0.6, 0.6, 25, 0x181818);
  eixoRodasTraseiro.add(pneuTraseiroDir);

  //COLOCANDO OS PEDAÇOS DO CARRINHO NO LUGAR CERTO
  plane.matrixAutoUpdate = false;
  line.matrixAutoUpdate = false;

  boxTraseiroCockpit.matrixAutoUpdate = false;
  boxLateralDirCockpit.matrixAutoUpdate = false;
  boxLateralEsqCockpit.matrixAutoUpdate = false;
  boxFrontalCockpit.matrixAutoUpdate = false;

  recostoBanco.matrixAutoUpdate = false;
  assentoBanco.matrixAutoUpdate = false;

  boxBicoFrontal.matrixAutoUpdate = false;
  boxBicoTraseiro.matrixAutoUpdate = false;

  boxParaChoqueFrontal.matrixAutoUpdate = false;
  boxParaChoqueTraseiro.matrixAutoUpdate = false;

  aerofolio.matrixAutoUpdate = false;
  apoioEsqAerofolio.matrixAutoUpdate = false;
  apoioDirAerofolio.matrixAutoUpdate = false;

  eixoRodasFrontal.matrixAutoUpdate = false;
  eixoRodasTraseiro.matrixAutoUpdate = false;

  pneuFrontalEsq.matrixAutoUpdate = false;
  pneuFrontalDir.matrixAutoUpdate = false;

  pneuTraseiroEsq.matrixAutoUpdate = false;
  pneuTraseiroDir.matrixAutoUpdate = false;

  var mat4 = new THREE.Matrix4();

  plane.matrix.multiply(mat4.makeRotationX(-1.5708));
  line.matrix.multiply(mat4.makeRotationX(-1.5708));

  boxTraseiroCockpit.matrix.multiply(mat4.makeTranslation(0, 0.6, -0.9));
  boxLateralDirCockpit.matrix.multiply(mat4.makeTranslation(-1.0, 0.6, 1.1));
  boxLateralEsqCockpit.matrix.multiply(mat4.makeTranslation(1.0, 0.6, 1.1));
  boxFrontalCockpit.matrix.multiply(mat4.makeTranslation(0, 0.6, 1.8));

  recostoBanco.matrix.multiply(mat4.makeTranslation(0, 0.6, 0.4));
  recostoBanco.matrix.multiply(mat4.makeRotationX(1.1));

  assentoBanco.matrix.multiply(mat4.makeTranslation(0, 0.55, 0.7));

  boxBicoFrontal.matrix.multiply(mat4.makeTranslation(0.0, 0.0, 3));
  boxBicoTraseiro.matrix.multiply(mat4.makeTranslation(0.0, 0.0, -3));

  boxParaChoqueFrontal.matrix.multiply(mat4.makeRotationX(1.5708));
  boxParaChoqueFrontal.matrix.multiply(mat4.makeTranslation(0.0, 1.4, 0.0));
  boxParaChoqueTraseiro.matrix.multiply(mat4.makeRotationX(1.5708));
  boxParaChoqueTraseiro.matrix.multiply(mat4.makeTranslation(0.0, -1.4, 0.0));

  aerofolio.matrix.multiply(mat4.makeTranslation(0.0, 0.0, -0.85));
  aerofolio.matrix.multiply(mat4.makeRotationX(1.5708));
  apoioEsqAerofolio.matrix.multiply(mat4.makeTranslation(1.25, 0.425, 0.0));
  apoioDirAerofolio.matrix.multiply(mat4.makeTranslation(-1.25, 0.425, 0.0));

  eixoRodasFrontal.matrix.multiply(mat4.makeRotationZ(1.5708));
  eixoRodasTraseiro.matrix.multiply(mat4.makeRotationZ(1.5708));

  pneuFrontalEsq.matrix.multiply(mat4.makeTranslation(0.0, -1.4, 0.0));
  pneuFrontalDir.matrix.multiply(mat4.makeTranslation(0.0, 1.4, 0.0));

  pneuTraseiroEsq.matrix.multiply(mat4.makeTranslation(0.0, -1.4, 0.0));
  pneuTraseiroDir.matrix.multiply(mat4.makeTranslation(0.0, 1.4, 0.0));

  window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false)

  render();


  function createCube(l, a, p, c = 0x979797) {
    var geometry = new THREE.BoxGeometry(l, a, p);
    var material = new THREE.MeshPhongMaterial({ color: c });
    var cube = new THREE.Mesh(geometry, material);
    return cube;
  }

  function createCylinder(rT, rB, h, rS = 25, c = 0x979797) {
    var cylinderGeometry = new THREE.CylinderGeometry(rT, rB, h, rS);
    var cylinderMaterial = new THREE.MeshPhongMaterial({ color: c });
    var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    return cylinder;
  }

  function createSphere(r, w, h) {
    var sphereGeometry = new THREE.SphereGeometry(r, w, h);
    var sphereMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(255,255,0)' });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    return sphere;
  }

  function createLight() {
    var l = new THREE.PointLight(lightColor, 1, 100);
    l.castShadow = true;
    l.decay = 2;
    l.penumbra = 0.05;
    return l;
  }

  function createPole(x, y, z) {
    c = createCylinder(0.2, 0.2, 4);

    s = createSphere(0.3, 32, 32);
    c.add(s);

    l = createLight();
    s.add(l);

    c.matrixAutoUpdate = false;
    s.matrixAutoUpdate = false;

    var matr4 = new THREE.Matrix4();

    c.matrix.identity();
    s.matrix.identity();

    s.matrix.multiply(matr4.makeTranslation(0.0, 2.15, 0.0));
    c.matrix.multiply(matr4.makeTranslation(x, y, z));

    return c;
  }

  p1 = createPole(320, 2, 320);
  scene.add(p1);
  p2 = createPole(-310, 2, 360);
  scene.add(p2);
  p3 = createPole(-20, 2.0, 175);
  scene.add(p3);
  p4 = createPole(80, 2.0, 5);
  scene.add(p4);
  p5 = createPole(262, 2, -300);
  scene.add(p5);
  p6 = createPole(87, 2, -300);
  scene.add(p6);
  p7 = createPole(-87, 2, -300);
  scene.add(p7);
  p8 = createPole(-262, 2, -300);
  scene.add(p8);

  //::::::::::::::::::::::::::::::::::::::::::::::
  //luz que acompanha a camera
  var spotLight = new THREE.SpotLight(0xffffff, 1, 100);
  spotLight.position.set(updateCamera());
  //spotLight.castShadow = true;
  scene.add(spotLight);

  //::::::::::::::::::::::::::::::::::::::::::::::
  //luz do sol

  var objectVisibility = true;
  var castShadow = true;
  var montanhas_cor = "rgb(100, 70, 20)";
  var montanhasMaterial = new THREE.MeshLambertMaterial({
    color: montanhas_cor,
    transparent: false
  });
  var pontos_montanha1_parte1 = [];
  var montanha1_parte1_dimensoes = new THREE.Vector3(60, 120, 60);

  pontos_montanha1_parte1.push(new THREE.Vector3(montanha1_parte1_dimensoes.x, 0, montanha1_parte1_dimensoes.z)); 
  pontos_montanha1_parte1.push(new THREE.Vector3(- montanha1_parte1_dimensoes.x, 0, montanha1_parte1_dimensoes.z));
  pontos_montanha1_parte1.push(new THREE.Vector3(- montanha1_parte1_dimensoes.x - 50, 0, montanha1_parte1_dimensoes.z / 2));
  pontos_montanha1_parte1.push(new THREE.Vector3(- montanha1_parte1_dimensoes.x + 30, 0, montanha1_parte1_dimensoes.z / 2));
  pontos_montanha1_parte1.push(new THREE.Vector3(montanha1_parte1_dimensoes.x, 0, - montanha1_parte1_dimensoes.z));
  pontos_montanha1_parte1.push(new THREE.Vector3(0, montanha1_parte1_dimensoes.y, 0));

  var convexGeometry_m1p1 = new THREE.ConvexBufferGeometry(pontos_montanha1_parte1);
  var Montanha1_parte1 = new THREE.Mesh(convexGeometry_m1p1, montanhasMaterial);
  Montanha1_parte1.castShadow = castShadow;
  Montanha1_parte1.visible = objectVisibility;
  Montanha1_parte1.position.set(0, 0, 0);
  //Montanha1_parte1.rotateOnAxis(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
  scene.add(Montanha1_parte1);

  //---------------------------------------------------------
  // Load external objects

  var objectArray = new Array();
  var activeObject = 0;

  loadGLTFFile('../assets/objects/', 'scene', false, 2.0);

  buildInterface();
  render();

  function loadGLTFFile(modelPath, modelName, visibility, desiredScale) {
    var loader = new THREE.GLTFLoader();
    loader.load(modelPath + modelName + '.gltf', function (gltf) {
      var obj = gltf.scene;
      obj.name = modelName;
      obj.visible = visibility;
      obj.traverse(function (child) {
        if (child) {
          child.castShadow = true;
        }
      });
      obj.traverse(function (node) {
        if (node.material) node.material.side = THREE.DoubleSide;
      });

      var obj = normalizeAndRescale(obj, desiredScale);
      var obj = fixPosition(obj);

      scene.add(obj);
      objectArray.push(obj);
    });
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

  objectArray[activeObject].visible = true;

  function updateCamera() {
    camera.lookAt(boxChassi.position);
  }

  function changeCamera() {
    if (gameMode) {
      camera.position.x = 0;
      camera.position.y = 10;
      camera.position.z = -24;
      camera.up.x = 0;
      camera.up.y = 1;
      camera.up.z = 0;
      camera.lookAt(boxChassi.position);
      boxChassi.add(camera);
      plane.visible = true;
      line.visible = true;
    }
    else {
      velocity = 0.0;
      boxChassi.rotateY(-kartRotation);
      boxChassi.position.set(0.0, 0.6, 0.0);
      line.visible = false;
      plane.visible = false;
    }
  }

  function getFrontalDirection() {
    return boxChassi.up.cross(eixoRodasFrontal.up);
  }

  function moveKart() {
    if (gameMode) {
      boxChassi.translateZ(velocity);
      updateCamera();
    }
  }

  function brake(unXLR8 = 0.005) {
    if (gameMode) {
      keyboard.update();

      if (!keyboard.pressed("up") && (velocity >= 0.0) && gameMode) {
        velocity -= unXLR8;
      }
      if (velocity < 0.0) {
        velocity = 0.0;
        time = 0.0;
      }
    }
  }

  function keyboardUpdate() {
    keyboard.update();

    if (keyboard.pressed("left") && gameMode && velocity > 0.0) {
      boxChassi.translateX(0.01);
      turnAxis("left");
      boxChassi.rotateY(0.01);
      kartRotation += 0.01;
    }
    if (keyboard.pressed("right") && gameMode && velocity > 0.0) {
      boxChassi.translateX(-0.1);
      turnAxis("right");
      boxChassi.rotateY(-0.01);
      kartRotation -= 0.01;
    }
    if (keyboard.pressed("left") && !gameMode) {
      turnAxis("left");
    }
    if (keyboard.pressed("right") && !gameMode) {
      turnAxis("right");
    }
    if (!keyboard.pressed("right") && !keyboard.pressed("left")) {
      turnAxis("none");
    }
    if (keyboard.pressed("up") && gameMode) {
      time += 0.02;
      velocity = 1 / (1 + 40 * Math.exp(-time));
      boxChassi.translateZ(velocity);
    }
    if (keyboard.pressed("down") && gameMode) {
      brake(0.0175);
    }
    if (keyboard.down("space")) {
      gameMode = !gameMode;
      changeCamera();
    }
  }

  function turnAxis(side) {
    eixoRodasFrontal.matrixAutoUpdate = false;
    var mat4 = new THREE.Matrix4();

    if (side == "left") {
      if (axisRotation <= 0.2) {
        axisRotation += 0.01;
        eixoRodasFrontal.matrix.multiply(mat4.makeRotationX(0.01));
      }
    }
    else if (side == "right") {
      if (axisRotation >= -0.2) {
        axisRotation -= 0.01;
        eixoRodasFrontal.matrix.multiply(mat4.makeRotationX(-0.01));
      }
    }
    else if (side == "none") {
      eixoRodasFrontal.matrix.multiply(mat4.makeRotationX(-axisRotation));
      axisRotation = 0.0;
    }
  }

  function showInformation() {
    controls2 = new InfoBox();
    controls2.add("KART");
    controls2.addParagraph();
    controls2.add("Use o teclado para mover o kart.");
    controls2.add("Para movimentar para a direita utilize a seta para a direita.");
    controls2.add("Para movimentar para a esquerda utilize a seta para a esquerda.");
    controls2.add("Para acelerar utilize a seta para cima.");
    controls2.add("Para freiar utilize a seta para baixo.");
    controls2.add("Para entrar no modo de inspeção, pressione espaço.");

    controls2.show();
  }

  function render() {
    stats.update(); // Update FPS
    trackballControls.update();
    lightFollowingCamera(light, camera);
    keyboardUpdate();
    moveKart();
    brake();
    requestAnimationFrame(render); // Show events
    renderer.render(scene, camera) // Render scene
  }
}