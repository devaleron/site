<?php
include('function.php');

if((isset($_POST['tel'])) && (is_numeric($_POST['tel'])) && (strlen($_POST['tel']) == '10') &&
		(isset($_POST['password'])) && (is_numeric($_POST['password'])) && (strlen($_POST['password']) == '4'))
{
	$resp = do_authorize('62.192.227.240', 8888, '/zakaz?typ=login', $_POST['tel'], $_POST['password']);
	$resp = explode(PHP_EOL . "{", $resp);
	if (!isset($resp[1]))
	{
		//print iconv('windows-1251', 'UTF-8', '{"error":"yes","error_type":"Пароль или телефон указан неверно"}');
		print '{"error":"yes","error_type":"Пароль или телефон указан неверно"}';
	}
	else
	{
		$resp[1] = '{' . $resp[1];
		if (json_decode(iconv('windows-1251', 'UTF-8', trim($resp[1])))) {
			//setcookie('tel', $_POST['tel'], time() + 3600*720);
			//setcookie('password', $_POST['password'], time() + 3600*720);
			print trim(iconv('windows-1251', 'UTF-8', trim($resp[1])));
		}
		else
		{
			//print '{"error":"yes","error_type":"Ошибка при обработке данных"}';
			print iconv('windows-1251', 'UTF-8', '{"error":"yes","error_type":"Ошибка при обработке данных"}');
		}
	}
}
?>
