var SERVER_API = "https://30creative.ro/mobileapps/NodeJSAPI";

var user_id;

$(document).ready(function(){

	/* Checkbox */
    $(document).on('click', '.screen-content .label-input .checkbox', function(){
		var expand = $(this).attr('expand');
        if($(this).hasClass('checked')) {
            $(this).removeClass('checked');
        } else {
            $(this).addClass('checked');
        }
		
    });

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
});

function logout() {
	localStorage.removeItem("token");

	$('.loading').hide();
	$('.screen-content .label-input .checkbox').removeClass('checked');
	
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
		url: SERVER_API + "/login.php",
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		success: function(response) {
			var data = response;
			$('.loading').hide();
			$('.screen.login-screen .button').show();
			if (data.status == 'success') {
				if($("#remember").hasClass("checked")){
					localStorage.setItem("token", data.token);
				}
				$('#email').val("");
				$('#password').val("");
				gotoHome();
				
			} else {
				$(".register-btn").removeClass("none");
				$(".login-btn").addClass("none");
				$("#name").parent().removeClass("none");
			}
		},
		error: function(xhr, status, error){
			console && console.log(xhr.statusText);
			console && console.log(status);
			console && console.log(error);
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
		url: SERVER_API + "/register.php",
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
			$('.screen.login-screen .button.register-btn').show();
		},
		error: function(xhr, status, error){
			console && console.log(xhr.statusText);
			console && console.log(status);
			console && console.log(error);
			
			$('.loading').hide();
			$('.screen.login-screen .button.register-btn').show();
			/* Modal message login error */
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

	$('.screen.login-screen .button.register-btn').hide();
	$('.screen.login-screen .button.login-btn').show();

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
function gotoLevel2() {
	screen.orientation.lock('landscape');
	window.location.href = 'level2.html';
	
}

// /* END level 2 */

function final() {
    // final function to return the user in the home page
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