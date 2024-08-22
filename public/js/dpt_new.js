var SITE_NAME = '/dpt_new';

$(function () {
	//버튼 - 로그인
	$('#btnLogin').on('click', function () {
		$('#frmLogin').submit();
	});

	//버튼 - OTP인증확인
	$('#btnLoginOtp').on('click', function () {
		$('#frmLoginOtp').submit();
	});

	//로그인 Form 체크
	$('#frmLogin').submit(function () {
		var isValid = checkLogin();

		if (!isValid) {
			return false;
		}

		return doLogin();
	});

	//OTP Form 체크
	$('#frmLoginOtp').submit(function () {
		if (!checkBlankData('otp_code')) {
			return false;
		}

		return doLoginOtp();
	});
});

function checkLogin() {
	if (!checkBlankData('login_id')) {
		return false;
	}

	if (!checkBlankData('login_pw')) {
		return false;
	}

	return true;
}

function doLogin() {
	var url = SITE_NAME + '/login/check';

	$.post(
		url,
		$('#frmLogin').serialize(),
		function (result) {
			var data = result.data;
			var msg = result.msg;

			if (msg == '1' || msg == 'sms_comm_ok') {
				document.location.href = SITE_NAME;
				return true;
			} else if (msg == '5') {
				//OTP 입력화면
				document.location.href = SITE_NAME + '/login/otp';
				return true;
			} else if (msg == '8') {
				//아이디가 존재하지 않습니다.
				alertModal(qq204[lang_code]);
				return false;
			} else if (msg == '9') {
				//비밀번호가 일치하지 않습니다.
				alertModal(qq204[lang_code]);
				return false;
			} else if (msg == '10') {
				//비밀번호 변경 화면으로 이동
				//비밀번호 변경화면
				document.location.href = SITE_NAME + '/login/change_password';
				return true;
			} else if (msg == '100') {
				var login_attempt_limit_cnt = data;
				//로그인 시도 가능횟수를 초과하였습니다. 관리자에게 문의해 주세요.
				alertModal(qq205[lang_code].replace('#', login_attempt_limit_cnt));
				return false;
			} else if (msg == '200') {
				//로그인후 리다렉트 url로 이동
				var redirect_url = data;
				document.location.href = redirect_url;
				return true;
			} else if (msg == '300') {
				//웹매니저 접속 포트로 로그인하도록 유도
				alertModal(qq235[lang_code]); //올바른 경로가 아닙니다. 다시 접속해 주세요.
				var redirect_url = data;
				document.location.href = redirect_url;
				return true;
			} else {
				alertModal(result.msg);
				return false;
			}
		},
		'json'
	);

	return false;
}

function doLoginOtp() {
	var url = SITE_NAME + '/login/check_otp';

	$.post(
		url,
		$('#frmLoginOtp').serialize(),
		function (result) {
			var data = result.data;
			var msg = result.msg;

			if (msg == '1') {
				//로그인성공
				document.location.href = SITE_NAME;
				return true;
			} else if (msg == '8') {
				//아이디불일치
				alertModal(qq204[lang_code]);
				return false;
			} else if (msg == '9') {
				//비밀번호불일치
				alertModal(qq204[lang_code]);
				return false;
			} else if (msg == '10') {
				//비밀번호 변경 화면으로 이동
				document.location.href = SITE_NAME + '/login/change_password';
				return true;
			} else if (msg.substr(0, 3) == '100') {
				var login_attempt_limit_cnt = data;
				//로그인 시도 가능횟수를 초과하였습니다. 관리자에게 문의해 주세요.
				alertModal(qq205[lang_code].replace('#', login_attempt_limit_cnt));
				return false;
			} else if (msg.substr(0, 3) == '200') {
				var redirect_url = data;
				document.location.href = redirect_url;
				return true;
			} else if (msg == '300') {
				//웹매니저 접속 포트로 로그인하도록 유도
				alertModal(qq235[lang_code]); //올바른 경로가 아닙니다. 다시 접속해 주세요.
				var redirect_url = data;
				document.location.href = redirect_url;
				return true;
			} else {
				alertModal(result.msg);
				return false;
			}
		},
		'json'
	);

	return false;
}

/*OPT 입력대기시간 카운팅*/
function printClock() {
	var clock = $('#clock').val();
	var min, mindiv, sec, total;

	if (clock < 60 && clock > 0) {
		mindiv = clock;
	}
	if (clock >= 60) {
		mindiv = clock - 60;
	}

	min = parseInt(clock / 60);

	if (mindiv < 10) {
		mindiv = '0' + mindiv;
	}

	if (clock < 120) {
		total = min + ' : ' + mindiv;
	} else {
		total = '2:00';
	}

	if (clock == 0 || clock == 'NaN' || clock == 'undefined' || clock == 'NaN : undefined') {
		var callback = function () {
			location.href = SITE_NAME + '/login/logout';
		};
		$('#baseminView').val('00:00');
		alertModal(inputtimeout[lang_code], callback);
		return;
	} else {
		clock = clock - 1;

		$('#baseminView').val(total);
		$('#clock').val(clock);
		setTimeout('printClock()', 1000); // 1초마다 printClock() 함수 호출
	}

	// change containers:
	// $(document).ready(function () {
	// 	$('#changeButton').on('click', function () {
	// 		// Create a new container element
	// 		//	console.log('hello world');
	// 		var newContainer = $('<div></div>');

	// 		// Add content to the new container
	// 		newContainer.html('<p>New content inside the new container after button click.</p>');

	// 		// Append the new container to the document
	// 		$('body').append(newContainer);
	// 	});
	// });
}

// password hide/show:
$(document).ready(function () {
	$('#show_hide_password a').on('click', function (event) {
		event.preventDefault();
		if ($('#show_hide_password input').attr('type') == 'text') {
			$('#show_hide_password input').attr('type', 'password');
			$('#show_hide_password i').addClass('fa-eye-slash');
			$('#show_hide_password i').removeClass('fa-eye');
		} else if ($('#show_hide_password input').attr('type') == 'password') {
			$('#show_hide_password input').attr('type', 'text');
			$('#show_hide_password i').removeClass('fa-eye-slash');
			$('#show_hide_password i').addClass('fa-eye');
		}
	});
});
