function main()
{
  var stats = initStats();          // To show FPS information
  var scene = new THREE.Scene();    // Create main scene
  var renderer = initRenderer();    // View function in util/utils
  var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position

  // Enable mouse rotation, pan, zoom etc.
  var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

  // Show axes (parameter is size of each axis)
  var axesHelper = new THREE.AxesHelper( 12 );
  scene.add( axesHelper );

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

  // create a cube
  var cubeGeometry1 = new THREE.BoxGeometry(4, 4, 4);
  var cubeMaterial = new THREE.MeshNormalMaterial();
  var cube1 = new THREE.Mesh(cubeGeometry1, cubeMaterial);

  // cria a esfera
  const geometria_esfera = new THREE.SphereBufferGeometry( 2, 32, 32 );
  const material_esfera = new THREE.MeshNormalMaterial();
  const esfera = new THREE.Mesh( geometria_esfera, material_esfera );

  // cria o cilindro
  const geometria_cilindro = new THREE.CylinderBufferGeometry( 2, 2, 6, 32 );
  const material_cilindro = new THREE.MeshNormalMaterial();
  const cilindro = new THREE.Mesh( geometria_cilindro, material_cilindro );

  // posições do cubo, esfera e cilindo
  cube1.position.set(0.0, 0.0, 2.0);
  esfera.position.set(-8.0,-8.0,2.0);
  cilindro.position.set(6.0,6.0,2.0);

  // adiciona cubo, esfera e cilindro na cena
  scene.add(cube1,esfera,cilindro);

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
  window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

  render();
  function render()
  {
    stats.update(); // Update FPS
    trackballControls.update(); // Enable mouse movements
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
  }
}
