var Background = ( function() {
    var settings = {
        colors: [
            [255,255,0],
            [0,0,0]
        ],
        
        size: 8.0,
        
        speed: 0.01
    }
    var selector = {
        wrapper: '[data-background-role="wrapper"]',
        progress: '[data-background-role="progress"]',
        toggle: '[data-background-role="toggle"]',
        hero: '[data-background-role="hero"]'
    }
    var state = {
        direction: 1
    }
    
    var resizeTimer;
    
    // three js objects
    var scene;
    var camera;
    var renderer;
    var material;
    var plane;
    var animationTime = 0;
    var uniforms;
    
    var init = function() {
        build();
        
        onResize();
        
        bindEvents();
        
        tick();
    }
    
    var bindEvents = function() {

        $( window )
            .on( 'resize', function() {
                if( resizeTimer ) {
                    clearTimeout( resizeTimer );
                }
                resizeTimer = setTimeout( function() {
                    onResize();
                }, 500 );
            } );    
        
        $( document )

            .on( 'change', selector.progress, function() {
                var value = parseFloat( $( this ).val() );
                
                uniforms.progress.value = value;
            
                console.log( uniforms.progress.value );
            } )
            .on( 'click', selector.toggle, function() {                
                TweenLite.to( 
                    uniforms.progress, 
                    2, 
                    {
                        value: state.direction,
                        ease: Power2.easeInOut,
                        onComplete: function() {
                            if( state.direction === 1 ) {
                                state.direction = 0;
                            } else {
                                state.direction = 1;
                            }
                        }
                    }
                );
            } );        
    }
    
    var onResize = function() {
        if( !camera || !renderer ) {
            return false;
        }
        
        camera.left = window.innerWidth / -2;
        camera.right = window.innerWidth / 2;
        camera.top = window.innerHeight / 2;
        camera.bottom = window.innerHeight / -2;
        camera.updateProjectionMatrix();

        uniforms.iResolution.value.x = window.innerWidth;
        uniforms.iResolution.value.y = window.innerHeight;        
        
        // renderer
        renderer.setSize( window.innerWidth, window.innerHeight );
        
        if( !plane ) {
            return false;
        }
              
        plane.scale.set(
            window.innerWidth,
            window.innerHeight,
            1
        );
        
        plane.position.set(
            0,
            0,
            0
        );        
    }
    
    var build = function() {
        // scene
        scene = new THREE.Scene();

        // camera
        camera = new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 10000 );
        camera.position.z = 100;
        camera.lookAt( scene.position );
    
        // renderer
        renderer = new THREE.WebGLRenderer( {
            antialias: true
        } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setClearColor( 0x0066FF,  1 );

        // container
        $( selector.wrapper ).append( $( renderer.domElement ) );
    
        // geometry
        var geometry = new THREE.PlaneBufferGeometry( 1,1 );
    
        // material
        uniforms = {
            animationTime: { 
                type: 'f', 
                value: 1.0 
            },
            iResolution: { 
                type: 'v2', 
                value: new THREE.Vector2() 
            },
            color1: {
                type: 'v3',
                value: new THREE.Vector3( 
                    settings.colors[1][0],
                    settings.colors[0][0],
                    settings.colors[0][0]
                )
            },
            color2: {
                type: 'v3',
                value: new THREE.Vector3( 
                    settings.colors[1][0],
                    settings.colors[0][1],
                    settings.colors[0][2]                
                )
            },
            progress: {
                type: 'f',
                value: 0.5
            },
            size: {
                type: 'f',
                value: settings.size
            }            
        }            
        
        material = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader : $( '#shader--vertex' ).text(),
            fragmentShader : $( '#shader--fragment' ).text(),
            side: THREE.DoubleSide
        } );         
        
        plane = new THREE.Mesh( geometry, material );
        scene.add( plane );          
    }
    
    var tick = function() {
        update();
        render();
        
        requestAnimationFrame( tick );        
    }

    var update = function() {
        uniforms.animationTime.value = uniforms.animationTime.value + settings.speed;
    }    
    
    var render = function() {
        renderer.render( scene, camera );
    }    
    
    return {
        init: function() { init(); }
    }
} )();

$( function() {
    Background.init();
} );