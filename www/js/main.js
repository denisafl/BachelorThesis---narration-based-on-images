var SERVER_API = "https://3332-2a02-2f00-b30a-3d00-88fa-bebd-9f1c-9a7c.eu.ngrok.io/api";

var user_id;

var activity_images = [];
var activity_extra_images = [];
var activity_documents = [];
var activity_rights = [];
var filesToSync = 0;
var filesSynced = 0;

function selDoc(type){
	window.OurCodeWorld.Filebrowser.filePicker.multi({
		success: function(data){
			if(!data.length){
				// No file selected
				return;
			}

			//console.log(data);
			data.forEach(function(file) {
				var fileName = file.substr(file.lastIndexOf('/')+1);
				var newHtml = '<div>"'+fileName+'"</div>';
				if( type == 3){
					$('.activity-screen #activity_documents_container').append(newHtml);
					activity_documents.push(file);
				}
				if( type == 4){
					$('.activity-screen #activity_rights_container').append(newHtml);
					activity_r.push(file);
				}
			});
		},
		//startupPath:"/emulated/0/Downloads",
		error: function(err){
			console.log(err);
		}
	});
}

function selPic(type) {
	
	cordova.plugins.diagnostic.requestExternalStorageAuthorization(function(status){
		console.log("Authorization request for external storage use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
		if( status == cordova.plugins.diagnostic.permissionStatus.GRANTED ){
			window.imagePicker.getPictures(
				function(results) {
					
					for (var i = 0; i < results.length; i++) {
						var newHtml = '<img style="width: 50%;" src="' + results[i] + '">';
						if( type == 1 ){
							$('.activity-screen #activity_images_container').append(newHtml);
							activity_images.push(results[i]);
						}
						if( type == 2 ){
							$('.activity-screen #activity_extra_images_container').append(newHtml);
							activity_extra_images.push(results[i]);
						}				
					}
				}, function (error) {
					console.log('Error: ' + error);
				}, {
					quality: 50,
					maximumImagesCount: 100
				}
			);
		}
	}, function(error){
		console.error(error);
	});
	
}

$(document).ready(function(){

	// Set up login form height 

	$('.screen.login-screen .form').css('max-height', ($(window).height() - $('.screen.login-screen .top').height() + 35) + 'px');
	
	if(location.hash == '#reload-login') {
		location.hash = "";
		gotoLogin();
	}
	if(location.hash == '#reload-home') {
		location.hash = "";
	}
	
	if(localStorage.getItem("token") != null && localStorage.getItem("token").length > 0){
		$('body').removeClass();
		$('body').addClass('home');

		$('.footer .control-panel').show();
		$('.footer .login').hide();
	}
	
	$(document).on('click', '.activity-screen #activity_images', function(){
		selPic(1);
	});
	$(document).on('click', '.activity-screen #activity_extra_images', function(){
		selPic(2);
	});
	$(document).on('click', '.activity-screen #activity_documents', function(){
		selDoc(3);
	});
	$(document).on('click', '.activity-screen #activity_rights', function(){
		selDoc(4);
	});
	
	/* Select */
	$(document).on('change', '.activity-screen #yes_no_select', function() {
		console.log(this.value);
		if( this.value == 'yes' ){
			$('.activity-screen .extra').show();
		}else if( this.value == 'no' ){
			$('.activity-screen .extra').hide();
		}
	});

    /* Checkbox */
    // $(document).on('click', '.screen-content .label-input .checkbox', function(){
	// 	var expand = $(this).attr('expand');
    //     if($(this).hasClass('checked')) {
    //         $(this).removeClass('checked');
	// 		$('.ridicare-deee-screen .screen-content .'+expand).hide();
    //     } else {
    //         $(this).addClass('checked');
	// 		$('.ridicare-deee-screen .screen-content .'+expand).show();
    //     }
		
    // });

});

function logout() {
	localStorage.removeItem("token");
	
	gotoLogin();
	$('.footer .control-panel').hide();
	$('.footer .login').show();
}

function login() {
	$('.loading').show();
	$('.screen.login-screen .button').hide();
	var data = {
		email: $('#email').val(),
		password: $('#password').val(),
	};
	$.ajax({
		type: "post",
		url: SERVER_API + "/login",
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		success: function(response) {
			var data = response;
			$('.loading').hide();
			$('.screen.login-screen .button').show();
			// if (data.status == 'success') {
			// 	if($("#remember").hasClass("checked")){
			// 		localStorage.setItem("token", data.token);
			// 	}
			// 	$('#email').val("");
			// 	$('#password').val("");
			// 	gotoHome();
				
			// } else {
			// 	$(".register-btn").removeClass("none");
			// 	$(".login-btn").addClass("none");
			// 	$("#name").parent().removeClass("none");
			// }
			$('#email').val("");
				$('#password').val("");
			 	gotoHome();
			
			/* Ecran schimbare password */
			/*if( data.security_level == 0){
				breadCrumbs.push('new-password');

				$('body').removeClass();
				$('body').addClass('new-password');

				$('.screen.new-password-screen .form').css('max-height', ($(window).height() - $('.screen.new-password-screen .top').height() + 35) + 'px');
			}else{
				gotoHome();
				$('.footer .control-panel').show();
				$('.footer .login').hide();
				$('#cod_scoala').val(""),
				$('#password').val("")
			}*/
		},
		error: function(xhr, status, error){
			console && console.log(xhr.statusText);
			console && console.log(status);
			console && console.log(error);
			
			// $('.loading').hide();
			// $('.screen.login-screen .button').show();
			// /* Modal mesaj eroare login */
			// $('.modal.login-error').fadeIn();
			$('#email').val("");
				$('#password').val("");
			 	gotoHome();
		}
	});

}

function register() {
	$('.loading').show();
	$('.screen.login-screen .button').hide();
	var data = {
		email: $('#email').val(),
		password: $('#password').val(),
	};
	$.ajax({
		type: "post",
		url: SERVER_API + "/register",
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		success: function(response) {
			var data = response;
			console.log(data);
			if (data.status == 'success') {
				if($("#remember").hasClass("checked")){
					localStorage.setItem("token", data.token);
				}
				$('#email').val("");
				$('#password').val("");
				gotoHome();
				
			}
			$('.loading').hide();
			$('.screen.login-screen .button').show();
			
			/* Ecran schimbare password */
			/*if( data.security_level == 0){
				breadCrumbs.push('new-password');

				$('body').removeClass();
				$('body').addClass('new-password');

				$('.screen.new-password-screen .form').css('max-height', ($(window).height() - $('.screen.new-password-screen .top').height() + 35) + 'px');
			}else{
				gotoHome();
				$('.footer .control-panel').show();
				$('.footer .login').hide();
				$('#cod_scoala').val(""),
				$('#password').val("")
			}*/
		},
		error: function(xhr, status, error){
			console && console.log(xhr.statusText);
			console && console.log(status);
			console && console.log(error);
			
			$('.loading').hide();
			$('.screen.login-screen .button').show();
			/* Modal mesaj eroare login */
			$('.modal.login-error').fadeIn();
		}
	});

}

function setPassword() {
	$('.loading').show();
	$('.screen.new-password-screen .button').hide();
	var data = {
		action: 'newPassword',
		user_id: localStorage.getItem("user_id"),
		password: $('#newPassword').val()
	};
	$.ajax({
		type: "post",
		url: SERVER_API,
		data: data,
		dataType: 'json',
		success: function(response) {
			var data = response.data;
			console.log(response);
			$('.loading').hide();
			$('.screen.new-password-screen .button').show();
			
			gotoHome();
			$('.footer .control-panel').show();
			$('.footer .login').hide();
		},
		error: function(xhr, status, error){
			console && console.log(xhr.statusText);
			console && console.log(status);
			console && console.log(error);
			$('.loading').hide();
			$('.screen.new-password-screen .button').show();
		}
	});

}

var breadCrumbs = [];
breadCrumbs.push('home');

function gotoLogin() {
    breadCrumbs.push('login');

    $('body').removeClass();
    $('body').addClass('login');

    $('.screen.login-screen .form').css('max-height', ($(window).height() - $('.screen.login-screen .top').height() + 35) + 'px');
}

function gotoLevel1(){
	screen.orientation.lock('landscape');
	popup = 1;
	colors = 0;
	breadCrumbs.push('level1');
    $('body').removeClass();
    $('body').addClass('level1');
	
    $('.header').hide();
    $('.footer').hide();
	$(".color").removeAttr("style");
}

function gotoControlPanel() {
    breadCrumbs.push('control-panel');

    $(window).scrollTop(0);

    $('body').removeClass();
    $('body').addClass('control-panel');
    $('.screen.control-panel-screen').css('top', $('.header').outerHeight() + 'px');
	
	$('.loading').show();
}

function goBack() {
    $('body').removeClass();
    $('body').addClass(breadCrumbs[breadCrumbs.length - 2]);
    breadCrumbs.pop();
}

function gotoHome() {
    breadCrumbs.push('home');

    $(window).scrollTop(0);

    $('body').removeClass();
    $('body').addClass('home');

	$('.footer .control-panel').show();
	$('.footer .login').hide();
}

function gotoAbout() {
    breadCrumbs.push('about');
	$(window).scrollTop(0);

    $('body').removeClass();
    $('body').addClass('about');
	$('.screen.about-screen').css('top', $('.header').outerHeight() + 'px');
	
}

function modalClose() {
    $('.modal').fadeOut();
}

function modalCloseIframe() {
	$('.modal.iframe-popup iframe').attr('src', '');
	$('.modal').fadeOut();
}

var popup = 1;
var colors = 0;

function popupPrev(level, popupClass) {
    popup--;
    $('.level' + level + '-screen .' + popupClass + ' .popup-text').hide();
    $('.level' + level + '-screen .' + popupClass + ' .popup-text-' + popup).show();
    $('.level' + level + '-screen .' + popupClass + ' .left-arrow').hide();
    $('.level' + level + '-screen .' + popupClass + ' .right-arrow').show();
}
function popupNext(level, popupClass) {
    popup++;
    $('.level' + level + '-screen .' + popupClass + ' .popup-text').hide();
    $('.level' + level + '-screen .' + popupClass + ' .popup-text-' + popup).show();
    $('.level' + level + '-screen .' + popupClass + ' .right-arrow').hide();
    $('.level' + level + '-screen .' + popupClass + ' .left-arrow').show();    
}
function popupClose() {
    $('.popup').fadeOut();
}
function reloadLevel(level) {
    if(level == 1) {
        location.reload();
    }
    if(level == 2) {
        $('.poluare').removeClass('fara-nor');
        $('.poluare').show();
        $('.nor').show();
        $('.monitor').show();
        $('.masina-veche').show();
        $('.masina-electrica').hide();
        $('.copac').hide();
        $('.copac img.copac-img').css('opacity', '0');
        $('.copac .button').show();
    }
}


/* Level 1  */
$(function() {
    $(".banana, .waterdrop, .tomato, .apple, .plum, .corn, .pease, .orange, .cucumber, .broccoli, .pepper, .ice-cream, .donut, .carrot, .strawberry, .onion, .lemon, .pear, .grapes, .eggplant").draggable({
        revert: function(droppableContainer) {
            if(droppableContainer) {
                // drop is valid
            } else {
                $('.popup.color-wrong').fadeIn();
            }
            return(!droppableContainer)
        }
    });
    $(".container-red" ).droppable({
        accept: ".color-red",
        drop: function( event, ui ) {
            colors++;
            $('.' + ui.draggable.attr('color')).fadeOut();
            if(colors == $('.color').length){
                $('.level1-screen .popup.final').fadeIn();
            }
        }
    });
    $(".container-orange" ).droppable({
        accept: ".color-orange",
        drop: function( event, ui ) {
            colors++;
            $('.' + ui.draggable.attr('color')).fadeOut();
            if(colors == $('.color').length){
                $('.level1-screen .popup.final').fadeIn();
            }
        }
    });
    $(".container-green" ).droppable({
        accept: ".color-green",
        drop: function( event, ui ) {
            colors++;
            $('.' + ui.draggable.attr('color')).fadeOut();
            if(colors == $('.color').length){
                $('.level1-screen .popup.final').fadeIn();
            }
        }
    });
    $(".container-blue" ).droppable({
        accept: ".color-blue",
        drop: function( event, ui ) {
            colors++;
            $('.' + ui.draggable.attr('color')).fadeOut();
            if(colors == $('.color').length){
                $('.level1-screen .popup.final').fadeIn();
            }
        }
    });
    $(".container-yellow" ).droppable({
        accept: ".color-yellow",
        drop: function( event, ui ) {
            colors++;
            $('.' + ui.draggable.attr('color')).fadeOut();
            if(colors == $('.color').length){
                $('.level1-screen .popup.final').fadeIn();
            }
        }
    });
    $(".container-pink" ).droppable({
        accept: ".color-pink",
        drop: function( event, ui ) {
            colors++;
            $('.' + ui.draggable.attr('color')).fadeOut();
            if(colors == $('.color').length){
                $('.level1-screen .popup.final').fadeIn();
            }
        }
    });
    $(".container-purple" ).droppable({
        accept: ".color-purple",
        drop: function( event, ui ) {
            colors++;
            $('.' + ui.draggable.attr('color')).fadeOut();
            if(colors == $('.color').length){
                $('.level1-screen .popup.final').fadeIn();
            }
        }
    });

	// Adding sound to items
	const waterdrop = document.querySelector('.waterdrop');
	const waterdropSound = document.querySelector('#waterdrop-sound');

	const lemon = document.querySelector('.lemon');
	const lemonSound = document.querySelector('#lemon-sound');

	const pear = document.querySelector('.pear');
	const pearSound = document.querySelector('#pear-sound');

	const corn = document.querySelector('.corn');
	const cornSound = document.querySelector('#corn-sound');

	const banana = document.querySelector('.banana');
	const bananaSound = document.querySelector('#banana-sound');

	const donut = document.querySelector('.donut');
	const donutSound = document.querySelector('#donut-sound');

	const iceCream = document.querySelector('.ice-cream');
	const iceCreamSound = document.querySelector('#iceCream-sound');

	const apple = document.querySelector('.apple');
	const appleSound = document.querySelector('#apple-sound');

	const tomato = document.querySelector('.tomato');
	const tomatoSound = document.querySelector('#tomato-sound');

	const pepper = document.querySelector('.pepper');
	const pepperSound = document.querySelector('#pepper-sound');

	const pease = document.querySelector('.pease');
	const peaseSound = document.querySelector('#pease-sound');

	const grapes = document.querySelector('.grapes');
	const grapesSound = document.querySelector('#grapes-sound');
	
	const plum = document.querySelector('.plum');
	const plumSound = document.querySelector('#plum-sound');
	
	const broccoli = document.querySelector('.broccoli');
	const broccoliSound = document.querySelector('#broccoli-sound');
	
	const orange = document.querySelector('.orange');
	const orangeSound = document.querySelector('#orange-sound');
	
	const carrot = document.querySelector('.carrot');
	const carrotSound = document.querySelector('#carrot-sound');

	const onion = document.querySelector('.onion');
	const onionSound = document.querySelector('#onion-sound');

	const cucumber = document.querySelector('.cucumber');
	const cucumberSound = document.querySelector('#cucumber-sound');

	const strawberry = document.querySelector('.strawberry');
	const strawberrySound = document.querySelector('#strawberry-sound');

	const eggplant = document.querySelector('.eggplant');
	const eggplantSound = document.querySelector('#eggplant-sound');

	waterdrop.addEventListener('mouseenter', () => {
		waterdropSound.play();
	});

	waterdrop.addEventListener('touchstart', () => {
		waterdropSound.play();
	});

	waterdrop.addEventListener('touchleave', () => {
		waterdropSound.pause();
		waterdropSound.currentTime = 0;
	});
	  
	waterdrop.addEventListener('mouseleave', () => {
		waterdropSound.pause();
		waterdropSound.currentTime = 0;
	});
	  
	lemon.addEventListener('mouseenter', () => {
		lemonSound.play();
	  });
	lemon.addEventListener('touchstart', () => {
		lemonSound.play();
	})
	lemon.addEventListener('touchleave', () => {
		lemonSound.play();
	})  
	  
	lemon.addEventListener('mouseleave', () => {
		lemonSound.pause();
		lemonSound.currentTime = 0;
	  });
	  
	pear.addEventListener('mouseenter', () => {
		pearSound.play();
	  });
	  
	pear.addEventListener('touchstart', () => {
		pearSound.play();
	  });
	
	pear.addEventListener('touchleave', () => {
		pearSound.play();
	  });
	  
	pear.addEventListener('mouseleave', () => {
		pearSound.pause();
		pearSound.currentTime = 0;
	  });
	  
	corn.addEventListener('mouseenter', () => {
		cornSound.play();
	  });
	  
	corn.addEventListener('touchstart', () => {
		cornSound.play();
	  });
	corn.addEventListener('touchleave', () => {
		cornSound.play();
	  });
	  
	corn.addEventListener('mouseleave', () => {
		cornSound.pause();
		cornSound.currentTime = 0;
	  });
	banana.addEventListener('mouseenter', () => {
		bananaSound.play();
	  });
	  
	banana.addEventListener('touchstart', () => {
		bananaSound.play();
	  });
	banana.addEventListener('touchleave', () => {
		bananaSound.play();
	  });
	  
	banana.addEventListener('mouseleave', () => {
		bananaSound.pause();
		bananaSound.currentTime = 0;
	  });  
	donut.addEventListener('mouseenter', () => {
		donutSound.play();
	  });
	donut.addEventListener('touchstart', () => {
		donutSound.play();
	  });
	donut.addEventListener('touchleave', () => {
		donutSound.play();
	  });
	  
	donut.addEventListener('mouseleave', () => {
		donutSound.pause();
		donutSound.currentTime = 0;
	  });  

	iceCream.addEventListener('mouseenter', () => {
		iceCreamSound.play();
	  });
	iceCream.addEventListener('touchstart', () => {
		iceCreamSound.play();
	  });
	iceCream.addEventListener('touchleave', () => {
		iceCreamSound.play();
	  });
	  
	iceCream.addEventListener('mouseleave', () => {
		iceCreamSound.pause();
		iceCreamSound.currentTime = 0;
	  });   
	  
	apple.addEventListener('mouseenter', () => {
		appleSound.play();
	  });
	apple.addEventListener('touchstart', () => {
		appleSound.play();
	  });
	apple.addEventListener('touchleave', () => {
		appleSound.play();
	  });
	  
	apple.addEventListener('mouseleave', () => {
		appleSound.pause();
		appleSound.currentTime = 0;
	  });  
	  
	tomato.addEventListener('mouseenter', () => {
		tomatoSound.play();
	  });
	tomato.addEventListener('touchstart', () => {
		tomatoSound.play();
	  });
	tomato.addEventListener('touchleave', () => {
		tomatoSound.play();
	  });
	  
	tomato.addEventListener('mouseleave', () => {
		tomatoSound.pause();
		tomatoSound.currentTime = 0;
	  });  
	 
	pepper.addEventListener('mouseenter', () => {
		pepperSound.play();
	  });
	pepper.addEventListener('touchstart', () => {
		pepperSound.play();
	  });
	pepper.addEventListener('touchleave', () => {
		pepperSound.play();
	  });
	  
	pepper.addEventListener('mouseleave', () => {
		pepperSound.pause();
		pepperSound.currentTime = 0;
	  });    

	pease.addEventListener('mouseenter', () => {
		peaseSound.play();
	  });
	pease.addEventListener('touchstart', () => {
		peaseSound.play();
	  });
	pease.addEventListener('touchleave', () => {
		peaseSound.play();
	  });
	  
	pease.addEventListener('mouseleave', () => {
		peaseSound.pause();
		peaseSound.currentTime = 0;
	  }); 
	
	grapes.addEventListener('mouseenter', () => {
		grapesSound.play();
	  });
	grapes.addEventListener('touchstart', () => {
		grapesSound.play();
	  });
	grapes.addEventListener('touchleave', () => {
		grapesSound.play();
	  });
	  
	grapes.addEventListener('mouseleave', () => {
		grapesSound.pause();
		grapesSound.currentTime = 0;
	  });    
	  
	plum.addEventListener('mouseenter', () => {
		plumSound.play();
	  });
	plum.addEventListener('touchstart', () => {
		plumSound.play();
	  });
	plum.addEventListener('touchleave', () => {
		plumSound.play();
	  });
	  
	plum.addEventListener('mouseleave', () => {
		plumSound.pause();
		plumSound.currentTime = 0;
	  }); 
	  
	broccoli.addEventListener('mouseenter', () => {
		broccoliSound.play();
	  });
	broccoli.addEventListener('touchstart', () => {
		broccoliSound.play();
	  });
	broccoli.addEventListener('touchleave', () => {
		broccoliSound.play();
	  });
	  
	broccoli.addEventListener('mouseleave', () => {
		broccoliSound.pause();
		broccoliSound.currentTime = 0;
	  }); 	
	  
	orange.addEventListener('mouseenter', () => {
		orangeSound.play();
	  });
	orange.addEventListener('touchstart', () => {
		orangeSound.play();
	  });
	orange.addEventListener('touchleave', () => {
		orangeSound.play();
	  });
	  
	orange.addEventListener('mouseleave', () => {
		orangeSound.pause();
		orangeSound.currentTime = 0;
	  }); 
	  
	carrot.addEventListener('mouseenter', () => {
		carrotSound.play();
	  });
	carrot.addEventListener('touchstart', () => {
		carrotSound.play();
	  });
	carrot.addEventListener('touchleave', () => {
		carrotSound.play();
	  });
	  
	carrot.addEventListener('mouseleave', () => {
		carrotSound.pause();
		carrotSound.currentTime = 0;
	  }); 
	  
	onion.addEventListener('mouseenter', () => {
		onionSound.play();
	  });
	onion.addEventListener('touchstart', () => {
		onionSound.play();
	  });
	onion.addEventListener('touchleave', () => {
		onionSound.play();
	  });
	  
	onion.addEventListener('mouseleave', () => {
		onionSound.pause();
		onionSound.currentTime = 0;
	  });    
	  
	cucumber.addEventListener('mouseenter', () => {
		cucumberSound.play();
	  });
	cucumber.addEventListener('touchstart', () => {
		cucumberSound.play();
	  });
	cucumber.addEventListener('touchleave', () => {
		cucumberSound.play();
	  });
	  
	cucumber.addEventListener('mouseleave', () => {
		cucumberSound.pause();
		cucumberSound.currentTime = 0;
	  });    

	strawberry.addEventListener('mouseenter', () => {
		strawberrySound.play();
	  });
	strawberry.addEventListener('touchstart', () => {
		strawberrySound.play();
	  });
	strawberry.addEventListener('touchleave', () => {
		strawberrySound.play();
	  });
	  
	strawberry.addEventListener('mouseleave', () => {
		strawberrySound.pause();
		strawberrySound.currentTime = 0;
	  });   

	eggplant.addEventListener('mouseenter', () => {
		eggplantSound.play();
	  });
	eggplant.addEventListener('touchstart', () => {
		eggplantSound.play();
	  });
	eggplant.addEventListener('touchleave', () => {
		eggplantSound.play();
	  });
	  
	eggplant.addEventListener('mouseleave', () => {
		eggplantSound.pause();
		eggplantSound.currentTime = 0;
	  });  
});

/* END Level 1 */


// /* Level 2 */
// function gotoLevel2() {
//     $('body').removeClass('level1');
//     $('body').addClass('level2');
//     $('.level2-screen .popup.intro').fadeIn();
// }

// function startLevel2() {
//     $('.popup').fadeOut();
//     $('.poluare').show();
//     $('.button').show();
// }

// // Define the story steps and options
// const storySteps = [
// 	{
// 	  stepText: "Choose a beginning...",
// 	  options: [
// 		{
// 		  image: "images/image1.jpg",
// 		  text: "Once upon a time",
// 		  background: "background1.jpg"
// 		},
// 		{
// 		  image: "image2.jpg",
// 		  text: "In a faraway land",
// 		},
// 		{
// 		  image: "image3.jpg",
// 		  text: "Long, long ago",
// 		},
// 		{
// 		  image: "image4.jpg",
// 		  text: "In a magical kingdom",
// 		},
// 	  ],
// 	},
// 	{
// 	  stepText: "Choose a place...",
// 	  options: [
// 		{
// 		  image: "image5.jpg",
// 		  text: "In the enchanted forest",
// 		},
// 		{
// 		  image: "image6.jpg",
// 		  text: "On a beautiful beach",
// 		},
// 		{
// 		  image: "image7.jpg",
// 		  text: "In a bustling city",
// 		},
// 		{
// 		  image: "image8.jpg",
// 		  text: "At the top of a mountain",
// 		},
// 	  ],
// 	},
// 	{
// 	  stepText: "Choose a character...",
// 	  options: [
// 		{
// 		  image: "image9.jpg",
// 		  text: "A brave knight",
// 		},
// 		{
// 		  image: "image10.jpg",
// 		  text: "A friendly dragon",
// 		},
// 		{
// 		  image: "image11.jpg",
// 		  text: "A mischievous fairy",
// 		},
// 		{
// 		  image: "image12.jpg",
// 		  text: "A curious astronaut",
// 		},
// 	  ],
// 	},
// 	{
// 	  stepText: "Choose an object...",
// 	  options: [
// 		{
// 		  image: "image13.jpg",
// 		  text: "A magic wand",
// 		},
// 		{
// 		  image: "image14.jpg",
// 		  text: "A treasure chest",
// 		},
// 		{
// 		  image: "image15.jpg",
// 		  text: "A spaceship",
// 		},
// 		{
// 		  image: "image16.jpg",
// 		  text: "A secret map",
// 		},
// 	  ],
// 	},
// 	{
// 	  stepText: "Choose an ending...",
// 	  options: [
// 		{
// 		  image: "image17.jpg",
// 		  text: "And they lived happily ever after.",
// 		},
// 		{
// 		  image: "image18.jpg",
// 		  text: "The end.",
// 		},
// 		{
// 		  image: "image19.jpg",
// 		  text: "To be continued...",
// 		},
// 		{
// 		  image: "image20.jpg",
// 		  text: "And so the adventure continues.",
// 		},
// 	  ],
// 	},
//   ];
  
//   // Initialize variables
//   let currentStep = 0;
//   const selectedOptions = new Array(storySteps.length);
  
//   // Function to render the current step
//   function renderStep() {
// 	const storyContainer = document.getElementById("story-container");
// 	const optionsContainer = document.getElementById("options-container");
// 	const nextButton = document.getElementById("next-button");
  
// 	storyContainer.textContent = `Step ${currentStep + 1}: ${storySteps[currentStep].stepText}`;
  
// 	optionsContainer.innerHTML = "";
  
// 	for (let i = 0; i < storySteps[currentStep].options.length; i++) {
// 	  const option = storySteps[currentStep].options[i];
// 	  const optionElement = document.createElement("div");
// 	  const imageElement = document.createElement("img");
// 	  const textElement = document.createElement("div");
  
// 	  optionElement.className = "option";
// 	  imageElement.src = option.image;
// 	  imageElement.className = "option-image";
// 	  textElement.className = "option-text";
// 	  textElement.textContent = option.text;
  
// 	  optionElement.addEventListener("click", () => selectOption(i));
  
// 	  optionElement.appendChild(imageElement);
// 	  optionElement.appendChild(textElement);
  
// 	  optionsContainer.appendChild(optionElement);
// 	}
  
// 	nextButton.disabled = true;
//   }
  
//   // Function to handle option selection
//   function selectOption(optionIndex) {
// 	const selectedOption = selectedOptions[currentStep];
  
// 	// Toggle the selection state
// 	if (selectedOption === optionIndex) {
// 	  selectedOptions[currentStep] = undefined;
// 	} else {
// 	  selectedOptions[currentStep] = optionIndex;
// 	}
  
// 	// Update the UI to reflect the selection
// 	const options = document.querySelectorAll(".option");
// 	options.forEach((option, index) => {
// 	  if (index === optionIndex) {
// 		option.classList.toggle("selected");
// 	  } else {
// 		option.classList.remove("selected");
// 	  }
// 	});
  
// 	// Enable the Next button if an option is selected
// 	const nextButton = document.getElementById("next-button");
// 	nextButton.disabled = selectedOptions[currentStep] === undefined;
//   }
  
//   // Function to generate the story summary
//   function generateSummary() {
// 	let summary = "";
// 	for (let i = 0; i < selectedOptions.length; i++) {
// 	  const optionIndex = selectedOptions[i];
// 	  if (optionIndex !== undefined) {
// 		const option = storySteps[i].options[optionIndex];
// 		summary += option.text + " ";
// 	  }
// 	}
// 	return summary.trim();
//   }
  
//   // Function to proceed to the next step or display the summary
//   function nextStep() {
// 	currentStep++;
// 	if (currentStep < storySteps.length) {
// 	  renderStep();
// 	} else {
// 	  const summaryContainer = document.getElementById("summary-container");
// 	  const nextButton = document.getElementById("next-button");
  
// 	  // Hide the options container and disable the Next button
// 	  document.getElementById("options-container").style.display = "none";
// 	  nextButton.disabled = true;
  
// 	  // Update the summary
// 	  summaryContainer.textContent = "Summary: " + generateSummary();
  
// 	  // Scroll to the summary container
// 	  summaryContainer.scrollIntoView({ behavior: "smooth" });
// 	}
//   }
  
//   // Render the initial step
//   renderStep();
  
  

// /* END level 2 */

function final() {
    // AICI ESTE FUNCTIA DE FINAL SA-L INTOARCEM IN APLICATIE
	location.reload();
}


function final_home() {
	location.hash = 'reload-home';
	location.reload();
}
function final_login() {
	location.hash = 'reload-login';
	location.reload();
}

function onBackKeyDown(e) { 
	if( $('.modal iframe').is(':visible') ){
		modalCloseIframe();
		e.preventDefault(); 
	}else if( $('body').hasClass('home') ){
		navigator.app.exitApp();
	}else{
		modalClose();
		goBack();
	}
}