<?
include('function.php');

if((!empty($_POST['tel'])) && (is_numeric($_POST['tel'])) && (strlen($_POST['tel']) == '10')) {
		$resp = explode(PHP_EOL."{", do_authorize('62.192.227.240', 8888, '/zakaz?typ=getpasw', $_POST['tel'], ''));
		if(isset($resp[1])) {
				print '{"error":"no","resp":"1"}';
		} else {
				//print '{"error":"yes","error_type":"Нельзя запрашивать пароль чаще 1 раза в сутки"}';
				print '{"error":"no","resp":"1"}';
		}
} else {
			print '{"error":"yes","error_type":"Указаны некорректные данные"}';
}


?>
