function main()
{
  var scene = new THREE.Scene();    // Create main scene
  var stats = initStats();          // To show FPS information
  var renderer = initRenderer();    // View function in util/utils
    renderer.setClearColor("rgb(30, 30, 42)");
  // Camera
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.position.set(2.18, 1.62, 3.31);
    camera.up.set( 0, 0, 1 );

  // Light
  var lightPosition = new THREE.Vector3(1.7, 0.8, 1.1);
  var light = initDefaultLighting(scene, lightPosition); // Use default light

  // Enable mouse rotation, pan, zoom etc.
  var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

  // Listen window size changes
  window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

  // Controls objects
  var objectArray = new Array();
  var activeObject = 0;
  
  //----------------------------------------------------------------------------
  //-- Use TextureLoader to load texture files
  var textureLoader = new THREE.TextureLoader();
  var cylinderCapTexture  = textureLoader.load('../assets/textures/woodtop.png');
  var cylinderTexture = textureLoader.load('../assets/textures/wood.png');
  var face = textureLoader.load('../assets/textures/marble.png');

  //-- Scene Objects -----------------------------------------------------------
  // Cube object
  let top = createFace(1.0, 1.0, face); // width, height and texture
  objectArray.push(top);
  scene.add(top);

  let sides = [];
  for( i = 0; i < 5; i++){
    sides[i] = createFace(1.0, 1.0, face);
    top.add(sides[i]);
  }
  sides[0].rotateX(degreesToRadians(90)).translateZ(0.5).translateY(-0.5);
  sides[1].rotateX(degreesToRadians(90)).translateZ(-0.5).translateY(-0.5);
  sides[2].rotateY(degreesToRadians(90)).translateZ(0.5).translateX(0.5);
  sides[3].rotateY(degreesToRadians(90)).translateZ(-0.5).translateX(0.5);

  function createFace(width, height, face){

    let planeGeometry = new THREE.PlaneGeometry(width, height, 10, 10);
    let planeMaterial = new THREE.MeshPhongMaterial({map: face, side:THREE.DoubleSide});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    
    return plane;
    
  }
  
  // Cylinder objects
  // Cilindro
  const cy_geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 30, 0,true);
  const cy_material = new THREE.MeshPhongMaterial({map: cylinderTexture, side:THREE.DoubleSide});
  const cylinder_obj = new THREE.Mesh(cy_geometry, cy_material);
  scene.add(cylinder_obj);
  cylinder_obj.visible = false;
  objectArray.push(cylinder_obj);

  // Topo e base
  const circle_geometry = new THREE.CircleGeometry(0.5,30);
  const circle_material = new THREE.MeshBasicMaterial({map:cylinderCapTexture, side:THREE.DoubleSide});
  const bottom_circle = new THREE.Mesh(circle_geometry, circle_material);
  const top_circle = new THREE.Mesh(circle_geometry, circle_material);
  cylinder_obj.add(bottom_circle);
  bottom_circle.translateY(-1).rotateX(degreesToRadians(90));
  cylinder_obj.add(top_circle);
  top_circle.translateY(1).rotateX(degreesToRadians(90));

  buildInterface();
  render();

  function buildInterface(){
    // Interface
    var controls = new function (){
      this.type = "Object0";

      this.onChooseObject = function(){
        objectArray[activeObject].visible = false;
        // Get number of the object by parsing the string (Object'number')
        activeObject = this.type[6];
        objectArray[activeObject].visible = true;
      };
      
    };

    // GUI interface
    var gui = new dat.GUI();
    gui.add(controls, 'type',
      ['Object0', 'Object1'])
      .name("Muda Objeto")
      .onChange(function(e) { controls.onChooseObject(); });    
  }

  function render(){
    stats.update();
    trackballControls.update();
    lightFollowingCamera(light, camera);
    requestAnimationFrame(render);
    renderer.render(scene, camera)
  }
}