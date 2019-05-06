// import-block
import { options } from '../modules/settings.js';

// define-block
var undef;
var SCREEN_WIDTH = undef;
var SCREEN_HEIGHT = undef;
var savePass = undef;
var blendPass = undef;
var composer = undef;

async function init( renderer, scene, camera, width, height ) {
	composer = new THREE.EffectComposer( renderer );
	composer.setSize( width, height );

	SCREEN_WIDTH = width;
	SCREEN_HEIGHT = height;

	var renderPass = new THREE.RenderPass( scene, camera );

	var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
	savePass = new THREE.SavePass( new THREE.WebGLRenderTarget( SCREEN_WIDTH, SCREEN_HEIGHT, renderTargetParameters ) );

	blendPass = new THREE.ShaderPass( THREE.BlendShader, "tDiffuse1" );

	blendPass.uniforms[ 'tDiffuse2' ].value = savePass.renderTarget.texture;
	blendPass.uniforms[ 'mixRatio' ].value = 0.25;

	var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( width, height ), 0.2, 0, 0.19 );
	var copyPass = new THREE.ShaderPass( THREE.CopyShader );
	copyPass.renderToScreen = true;

	composer.addPass( renderPass );

	composer.addPass( blendPass );
	composer.addPass( savePass );

	composer.addPass( bloomPass );
	composer.addPass( copyPass );
}

function render() {
	if ( options.motionBlur ) {
		blendPass.enabled = true;
		savePass.enabled = true;
	} else {
		blendPass.enabled = false;
		savePass.enabled = false;
	}
	composer.render();
}

function setSize( width, height ) {
	SCREEN_WIDTH = width;
	SCREEN_HEIGHT = height;
	composer.setSize( width, height );
}

export { init, setSize, render };
