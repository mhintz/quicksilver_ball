import SimplexNoise from 'simplex-noise';
const simplex = new SimplexNoise();

export const noise2 = (x, y) => simplex.noise2D(x, y);
export const noise3 = (x, y, z) => simplex.noise3D(x, y, z);
export const noise4 = (x, y, z, w) => simplex.noise4D(x, y, z, w);

// Helper functions - Util
export const $ = (id) => document.getElementById(id);
const start = Date.now();
export const elapsedTime = () => Date.now() - start;
export const getPixelRatio = () => typeof window !== 'undefined' && 'devicePixelRatio' in window && window.devicePixelRatio > 1 ? window.devicePixelRatio : 1;
export const getWebGLContext = (canvas) => canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

// Helper functions - Math
export const deg2Rad = (deg) => Math.PI * deg / 180;
export const rad2Deg = (rad) => 180 * rad / Math.PI;
export const randNum = (lo, hi) => {
  if (typeof hi === 'undefined') {
    if (typeof lo === 'undefined') {
      lo = 1;
    }
    hi = lo;
    lo = 0;
  }
  return lo + (hi - lo) * Math.random();
};

// Helper functions - color
// const pos2HSV = 
export const randRGB = () => vec4.fromValues(Math.random(), Math.random(), Math.random(), 1);
export const randRGBInt = () => [randNum(255), randNum(255), randNum(255), 255];

export const flatten = (arr) => arr.reduce((flat, item) => {
  // Recursively flattens inner contents to handle nested arrays of any dimension
  return flat.concat(Object.prototype.toString.call(item[0]) === '[object Array]' ? flatten(item) : item);
}, []);

// Helper functions - Arrays / Buffers
export const flatten2 = (nested2) => nested2.reduce((chain, item) => chain.concat(item), []);

export const flatten2Buffer = (nestedArr, unitLength) => {
  let buffer = new Float32Array(nestedArr.length * unitLength);
  nestedArr.forEach((unit, idx) => {
    buffer.set(unit, idx * unitLength);
  });
  return buffer;
}

export const flatten2UIntBuffer = (nestedArr, unitLength) => {
  let buffer = new Uint8Array(nestedArr.length * unitLength);
  nestedArr.forEach((unit, idx) => {
    buffer.set(unit, idx * unitLength);
  });
  return buffer;
};

export const flatten2IndexBuffer = (nestedArr, unitLength) => {
  let buffer = new Uint16Array(nestedArr.length * unitLength);
  nestedArr.forEach((unit, idx) => {
    buffer.set(unit, idx * unitLength);
  });
  return buffer;
}
