
 // A canvas demo by Kas Thomas.
 // http://asserttrue.blogspot.com
 // Use as you will, at your own risk.

 var ctxt, canvas;
 var x, y, w, h;  
 var c = 0.1;
 
 window.onload = function(){

  canvas = document.getElementById("myCanvas");
  ctxt = canvas.getContext("2d");
  build();
  
}

function build(){
  update();
}

function update(){
  clearImage();
  c+=1;
  x /= w; y /= h;
  size = 111;
  n = PerlinNoise.noise(size*x,size*y,c);
  r = g = b = 255 * n;
//
  draw();
  requestAnimationFrame(update);
}
function draw(){
  // console.log("draw");
  doPixelLoop();
}

function clearImage( ) {
  canvas.width = canvas.width;
}  
     
function drawViaCallback( ) {

 var w = canvas.width;
 var h = canvas.height;
 
 var canvasData = ctxt.getImageData(0,0,w,h);

 for (var idx, x = 0; x < w; x++) {
  for (var y = 0; y < h; y++) {
      // Index of the pixel in the array
      idx = (x + y * w) * 4;    
      

      // The RGB values
      var r = canvasData.data[idx + 0];
      var g = canvasData.data[idx + 1];
      var b = canvasData.data[idx + 2];
      
      var pixel = callback( [r,g,b], x,y,w,h);

      canvasData.data[idx + 0] = pixel[0];
      canvasData.data[idx + 1] = pixel[1];
      canvasData.data[idx + 2] = pixel[2];
    }
  }
  ctxt.putImageData( canvasData, 0,0 );
}

function fillCanvas( color ) {
 
  ctxt.fillStyle = color; 
  ctxt.fillRect(0,0,canvas.width,canvas.height);
}

function doPixelLoop() {

  callback = function( pixel,x,y,w,h ){ 
    var r=pixel[0];
    var g=pixel[1]; 
    var b=pixel[2];

    x /= w; y /= h;
    size = 10;
    n = PerlinNoise.noise(size*x,size*y,.8);
    r = g = b = 255 * n;

    return [r,g,b]; };
 //
  try {
    fillCanvas( "#FFFFFF" );
    drawViaCallback( );
}
  catch(e) { alert("Error: " + e.toString()); }
}



  
 // This is a port of Ken Perlin's Java code.
 PerlinNoise = new function() {

  this.noise = function(x, y, z) {

   var p = new Array(512)
   var permutation = [ 151,160,137,91,90,15,
   131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
   190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
   88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
   77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
   102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
   135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
   5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
   223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
   129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
   251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
   49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
   138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
   ];
   for (var i=0; i < 256 ; i++) 
     p[256+i] = p[i] = permutation[i]; 

      var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
          Y = Math.floor(y) & 255,                  // CONTAINS POINT.
          Z = Math.floor(z) & 255;
      x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
      y -= Math.floor(y);                                // OF POINT IN CUBE.
      z -= Math.floor(z);
      var    u = fade(x),                                // COMPUTE FADE CURVES
             v = fade(y),                                // FOR EACH OF X,Y,Z.
             w = fade(z);
      var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,      // HASH COORDINATES OF
          B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;      // THE 8 CUBE CORNERS,

      return scale(lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),  // AND ADD
                                     grad(p[BA  ], x-1, y  , z   )), // BLENDED
                             lerp(u, grad(p[AB  ], x  , y-1, z   ),  // RESULTS
                                     grad(p[BB  ], x-1, y-1, z   ))),// FROM  8
                     lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),  // CORNERS
                                     grad(p[BA+1], x-1, y  , z-1 )), // OF CUBE
                     lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
                       grad(p[BB+1], x-1, y-1, z-1 )))));
    }
    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp( t, a, b) { return a + t * (b - a); }
    function grad(hash, x, y, z) {
      var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
      var u = h<8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
      v = h<4 ? y : h==12||h==14 ? x : z;
      return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
    } 
    function scale(n) { return (1 + n)/2; }
  }
