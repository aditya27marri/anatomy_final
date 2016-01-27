THREE.UCSCharacter = function() {

	var scope = this;
	
	var mesh;
	var bodyd = [];
	bodyd[0] =  '';
	bodyd[1] = 'The muscular system is an organ system consisting of skeletal, smooth and cardiac muscles. It permits movement of the body, maintains posture, and circulates blood throughout the body. The muscular system in vertebrates is controlled through the nervous system, although some muscles (such as the cardiac muscle) can be completely autonomous. Together with the skeletal system it forms the musculoskeletal system, which is responsible for movement of the human body.';
	bodyd[2] = 'The human skeleton is the internal framework of the body. It is composed of 270 bones at birth – this total decreases to 206 bones by adulthood after some bones have fused together.[1] The bone mass in the skeleton reaches maximum density around age 30. The human skeleton can be divided into the axial skeleton and the appendicular skeleton. The axial skeleton is formed by the vertebral column, the rib cage and the skull. The appendicular skeleton, which is attached to the axial skeleton, is formed by the pectoral girdle, the pelvic girdle and the bones of the upper and lower limbs.';
	bodyd[3] = 'The nervous system is the part of an animal"s body that coordinates its voluntary and involuntary actions and transmits signals between different parts of its body. Nervous tissue first arose in wormlike organisms about 550 to 600 million years ago. In most animal species it consists of two main parts, the central nervous system (CNS) and the peripheral nervous system (PNS). The CNS contains the brain and spinal cord. The PNS consists mainly of nerves, which are enclosed bundles of the long fibers or axons, that connect the CNS to every other part of the body. The PNS includes motor neurons, mediating voluntary movement; the autonomic nervous system, comprising the sympathetic nervous system and the parasympathetic nervous system, which regulate involuntary functions, and the enteric nervous system, which functions to control the gastrointestinal system.';
	bodyd[4] = 'The circulatory system, also called the cardiovascular system, is an organ system that permits blood to circulate and transport nutrients (such as amino acids and electrolytes), oxygen, carbon dioxide, hormones, and blood cells to and from the cells in the body to provide nourishment and help in fighting diseases, stabilize temperature and pH, and maintain homeostasis. The study of the blood flow is called hemodynamics. The study of the properties of the blood flow is called hemorheology';
	bodyd[5] = 'The urinary system, also known as the renal system, consists of the two kidneys, ureters, the bladder, and the urethra. Each kidney consists of millions of functional units called nephrons. The purpose of the renal system is to eliminate wastes from the body, regulate blood volume and pressure, control levels of electrolytes and metabolites, and regulate blood pH. The kidneys have extensive blood supply via the renal arteries which leave the kidneys via the renal vein. Following filtration of blood and further processing, wastes (in the form of urine) exit the kidney via the ureters, tubes made of smooth muscle fibers that propel urine towards the urinary bladder, where it is stored and subsequently expelled from the body by urination (voiding). The female and male urinary system are very similar, differing only in the length of the urethra.';
	bodyd[6] = 'In the human digestive system, the process of digestion has many stages, the first of which starts in the mouth (oral cavity). Digestion involves the breakdown of food into smaller and smaller components which can be absorbed and assimilated into the body. The secretion of saliva helps to produce a bolus which can be swallowed to pass down the oesophagus and into the stomach.';
	
	this.scale = 1;
	this.infodis = 0;
	this.root = new THREE.Object3D();
	
	this.numSkins;
	this.numMorphs;
	
	this.skins = [];
	this.materials = [];
	this.morphs = [];

	this.onLoadComplete = function () {};
	
	this.loadCounter = 0;

	this.loadParts = function ( config ) {
		
		this.numSkins = config.skins.length;
		this.numMorphs = config.morphs.length;
		
		// Character geometry + number of skins
		this.loadCounter = 1 + config.skins.length;
		
		// SKINS
		//alert('hi');
		console.log('UCSCharacter loadParts');
		this.skins = loadTextures( config.baseUrl + "skins/", config.skins );
		this.materials = createMaterials( this.skins );
		
		// MORPHS
		this.morphs = config.morphs;
		
		// CHARACTER
		var loader = new THREE.JSONLoader();
		console.log( config.baseUrl + config.character );
		loader.load( config.baseUrl + config.character, function( geometry ) {
			geometry.computeBoundingBox();
			geometry.computeVertexNormals();

			//THREE.AnimationHandler.add( geometry.animation );

			mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial() );
			scope.root.add( mesh );
			
			var bb = geometry.boundingBox;
			scope.root.scale.set( config.s, config.s, config.s );
			scope.root.position.set( config.x, config.y - bb.min.y * config.s, config.z );

			mesh.castShadow = true;
			mesh.receiveShadow = true;

			animation = new THREE.Animation( mesh, geometry.animation );
			animation.play();
			
			scope.setSkin(0);
			
			scope.checkLoadComplete();
		} );

	};
	
	this.setSkin = function( index ) {
		if(!this.infodis){
			this.infodis = 1;
		}else{
			$("#info").html(bodyd[index]);
			if(index !=0){
			if( $('#volumeimg').is(':empty')){
			$("#volumeimg").show();
			$("#volumeimg").append( "click for audio<img title='click for audio' type='image' id='icon' src='images/index.png' onclick='callme()' ></img>"+ "<img title='click for audio' type='image' id='iconstop' src='images/iconstop.png' onclick='stopspeak()' ></img>");	
		}
		}
		else{
		$("#volumeimg").empty();
		$("#volumeimg").hide();	
		}
		}
		console.log('UCSCharacter setSkin' + index );
		
		if ( mesh && scope.materials ) {
			mesh.material = scope.materials[ index ];
		}
	};
	
	this.updateMorphs = function( influences ) {
		console.log('UCSCharacter updateMorphs');
		if ( mesh ) {
			for ( var i = 0; i < scope.numMorphs; i ++ ) {
				mesh.morphTargetInfluences[ i ] = influences[ scope.morphs[ i ] ] / 100;
			}
		}
	}
	
	function loadTextures( baseUrl, textureUrls ) {
		console.log('loadTextures UCSCharacter');
		var mapping = THREE.UVMapping;
		var textures = [];

		for ( var i = 0; i < textureUrls.length; i ++ ) {

			textures[ i ] = THREE.ImageUtils.loadTexture( baseUrl + textureUrls[ i ], mapping, scope.checkLoadComplete );

			var name = textureUrls[ i ];
			name = name.replace(/\.jpg/g, "");
			textures[ i ].name = name;
			console.log(textures[ i ].name );

		}

		return textures;
	};

	function createMaterials( skins ) {
		var materials = [];
		console.log('createMaterials UCSCharacter');
		for ( var i = 0; i < skins.length; i ++ ) {

			materials[ i ] = new THREE.MeshLambertMaterial( {
				color: 0xeeeeee,
				specular: 10.0,
				map: skins[ i ],
				skinning: true,
				morphTargets: true,
				wrapAround: true
			} );

		}
		
		return materials;
	}

	this.checkLoadComplete = function () {
		console.log('checkLoadComplete');
		scope.loadCounter -= 1;

		if ( scope.loadCounter === 0 ) {

			scope.onLoadComplete();

		}

	}

}
