$(document).ready(function() {
	setTimeout('hideLoginError()', 5000);

	$("#login-form").submit(function() {
		hideLoginError();
	});
});

function hideLoginError() {
	$("#login-error").stop().fadeOut(300);
}