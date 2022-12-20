var cw,
	ch,
	avg,
	orbs,
	count;

function rand( min, max ) {
	return Math.random() * ( max - min ) + min;
}

function init() {
	wrap = document.querySelector( '.wrap' );
	orbs = [];
	count = 100;
	reset();
	loop();
}

function reset() {
	cw = window.innerWidth;
	ch = window.innerHeight;
	avg = ( cw + ch ) / 2;
	while( wrap.firstChild ) {
		wrap.removeChild( wrap.firstChild );
	}
	orbs.length = 0;
	
	for( var i = 0; i < count; i++ ) {
		var elem = document.createElement( 'div' ),
			orb = {
				elem: elem,
				x: rand( 0, cw ),
				y: rand( 0, ch ),
				vx: rand( -1, 1 ),
				vy: rand( -1, 1 ),
				radius: rand( avg / 50, avg / 10 )
			};
		elem.className = 'orb';
		elem.style.width = orb.radius * 2 + 'px';
		elem.style.height = orb.radius * 2 + 'px';
		orbs.push( orb );
		wrap.appendChild( elem );
	}
}

function loop() {
	window.requestAnimationFrame( loop );
	
	for( var i = 0; i < count; i++ ) {
		var orb = orbs[ i ];
		orb.x += orb.vx;
		orb.y += orb.vy;
		
		if( orb.x - orb.radius > cw ) {
			orb.x = -orb.radius;	
		}
		
		if( orb.x + orb.radius < 0 ) {
			orb.x = cw + orb.radius;	
		}
		
		if( orb.y - orb.radius > ch ) {
			orb.y = -orb.radius;	
		}
		
		if( orb.y + orb.radius < 0 ) {
			orb.y = ch + orb.radius;	
		}

		if( Modernizr.csstransforms3d ) {
			orb.elem.style[ '-webkit-transform' ] = 'translate3d(' + ( orb.x - orb.radius ) + 'px, ' + ( orb.y - orb.radius ) + 'px, 0)';
			orb.elem.style[ 'transform' ] = 'translate3d(' + ( orb.x - orb.radius ) + 'px, ' + ( orb.y - orb.radius ) + 'px, 0)';
		} else if( Modernizr.csstransforms ) {
			orb.elem.style[ '-webkit-transform' ] = 'translate(' + ( orb.x - orb.radius ) + 'px, ' + ( orb.y - orb.radius ) + 'px)';
			orb.elem.style[ 'transform' ] = 'translate(' + ( orb.x - orb.radius ) + 'px, ' + ( orb.y - orb.radius ) + 'px)';
		} else {
			orb.elem.style.left = ( orb.x - orb.radius ) + 'px';
			orb.elem.style.top = ( orb.y - orb.radius ) + 'px';
		}
	}
}

window.addEventListener( 'resize', reset, false );

init();