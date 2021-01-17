function main()
{
  var stats = initStats();          // To show FPS information
  var scene = new THREE.Scene();    // Create main scene
  var renderer = initRenderer();    // View function in util/utils
  var camera = initCamera(new THREE.Vector3(20, 0, 30)); // Init camera in this position
  camera.up.set(0,0,1);
  var light  = initDefaultLighting(scene, new THREE.Vector3(0, 0, 15));
  var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );
  
  
  // Set position sphere
  var x = 1;
  var y = 1;
  var z = 0.8;
  var animationOn = true; // control if animation is on or off
  var initialPosition = new THREE.Vector3(x,y,z);

  // Show world axes
  var axesHelper = new THREE.AxesHelper( 12 );
  scene.add( axesHelper );

  var planeGeometry = new THREE.PlaneGeometry(25, 25);
  planeGeometry.translate(12.5, 12.5, -0.02); // To avoid conflict with the axeshelper
  var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgb(150, 150, 150)",
    side: THREE.DoubleSide
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // add the plane to the scene
  scene.add(plane);

  var sphereGeometry = new THREE.SphereGeometry(1,25,25)
  sphereGeometry.translate(initialPosition.x,initialPosition.y,initialPosition.z);
  var sphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(0,0,150)'} );
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  // Listen window size changes
  window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
  var pos= new THREE.Vector3(initialPosition.x, initialPosition.y, initialPosition.z);

  buildInterface();
  render();

  function moveSphere()
  {
    // More info:
    // https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
    sphere.matrixAutoUpdate = false;

    if(animationOn == true && (pos.x != x || pos.y != y || pos.z != z))
    {
      speed=0.1;
      var mat4 = new THREE.Matrix4();
      sphere.matrix.identity();  // reset matrix

      if(pos.x != x){
        if(pos.x<x)
          pos.x+=speed;
        else
          pos.x-=speed;
      }
      
      if(pos.y != y){
        if(pos.y<y)
          pos.y+=speed;
        else
          pos.y-=speed;
      }
      
      if(pos.z != z){
        if(pos.z<z)
          pos.z+=speed;
        else
          pos.z-=speed;
      }
      
      sphere.matrix.multiply(mat4.makeTranslation(pos.x, pos.y, pos.z)); // T1
    }
  }

  function buildInterface()
  {
    var controls = new function ()
    {
      this.onChangeAnimation = function(){
        animationOn = !animationOn;
      };
      this.xaux=x;
      this.yaux=y;
      this.zaux=z;
      
      this.setX = function(){
        x = this.xaux;
      };
      this.setY = function(){
        y = this.yaux;
      };
      this.setZ = function(){
        z = this.zaux;
      };
    };

    // GUI interface
    var gui = new dat.GUI();
    gui.add(controls, 'onChangeAnimation',true).name("Mover");
    gui.add(controls, 'xaux', 0, 24)
      .onChange(function(e) { controls.setX() })
      .name("X");
    gui.add(controls, 'yaux', 0, 24)
      .onChange(function(e) { controls.setY() })
      .name("Y");
    gui.add(controls, 'zaux', -10, 10)
      .onChange(function(e) { controls.setZ() })
      .name("Z");
  }

  function render()
  {
    stats.update(); // Update FPS
    trackballControls.update();
    moveSphere();
    lightFollowingCamera(light, camera);
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
  }
}