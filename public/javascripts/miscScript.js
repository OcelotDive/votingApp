

function backUp() {
    $('#leftHand').removeClass('animated fadeInUpBig').addClass('animated fadeOutLeft');
    $('#rightHand').removeClass('animated fadeInDownBig').addClass('animated fadeOutRight');
    
    
}
function backIn() {
     $('#leftHand').removeClass('animated fadeOutLeft').addClass('animated fadeInLeft');
    $('#rightHand').removeClass('animated fadeOutRight').addClass('animated fadeInRight');
}
function shake() {
      $('#leftHand').removeClass('animated fadeInLeft').addClass('animated shake');
    $('#rightHand').removeClass('animated fadeInRight').addClass('animated shake');
}

setTimeout('backUp()', 1500);
setTimeout('backIn()', 2500);
setTimeout('shake()', 3300);


var reveal = document.getElementById('revealPoll');

var voteCastImage = document.getElementById('voteCastImage');
voteCastImage.style.display = 'block';
function refresh() {
    location.reload();
    voteCastImage.style.display = 'none';
}

function barhighlight() {
    $('#barButton').removeClass('btn-danger').addClass('btn-primary');
    $('#pieButton').removeClass('btn-primary').addClass('btn-danger');
    $('#columnButton').removeClass('btn-primary').addClass('btn-danger');
    $('#scatterButton').removeClass('btn-primary').addClass('btn-danger');
    $('#areaButton').removeClass('btn-primary').addClass('btn-danger');
    $('#barButton').animate({left: "300px"},1000);
    
}
function piehighlight() {
    $('#pieButton').removeClass('btn-danger').addClass('btn-primary');
    $('#barButton').removeClass('btn-primary').addClass('btn-danger');
    $('#columnButton').removeClass('btn-primary').addClass('btn-danger');
    $('#scatterButton').removeClass('btn-primary').addClass('btn-danger');
    $('#areaButton').removeClass('btn-primary').addClass('btn-danger');
}
function columnhighlight() {
    $('#columnButton').removeClass('btn-danger').addClass('btn-primary');
    $('#pieButton').removeClass('btn-primary').addClass('btn-danger');
    $('#barButton').removeClass('btn-primary').addClass('btn-danger');
    $('#scatterButton').removeClass('btn-primary').addClass('btn-danger');
    $('#areaButton').removeClass('btn-primary').addClass('btn-danger');
}
function scatterhighlight() {
    $('#scatterButton').removeClass('btn-danger').addClass('btn-primary');
    $('#pieButton').removeClass('btn-primary').addClass('btn-danger');
    $('#barButton').removeClass('btn-primary').addClass('btn-danger');
    $('#columnButton').removeClass('btn-primary').addClass('btn-danger');
    $('#areaButton').removeClass('btn-primary').addClass('btn-danger');
    
}
function areahighlight() {
    $('#areaButton').removeClass('btn-danger').addClass('btn-primary');
    $('#pieButton').removeClass('btn-primary').addClass('btn-danger');
    $('#barButton').removeClass('btn-primary').addClass('btn-danger');
    $('#columnButton').removeClass('btn-primary').addClass('btn-danger');
    $('#scatterButton').removeClass('btn-primary').addClass('btn-danger');
    
}
