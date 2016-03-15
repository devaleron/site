<?php
include('function.php');
if((isset($_POST['json'])) && (!empty($_POST['json'])) && (isset($_POST['tel'])) && (isset($_POST['password']))
		&& (isset($_POST['auto_type'])) && (is_numeric($_POST['auto_type'])) && (isset($_POST['price'])) && (is_numeric($_POST['price']))) {
    $resp = do_authorize('62.192.227.240', 8888,'/zakaz?typ=order&order='.base64_encode(iconv('UTF-8', 'windows-1251', $_POST['json'])).'&auto_type='.$_POST[
    'auto_type'].'&price='.$_POST['price'], $_POST['tel'], $_POST['password']) or die('error');
    print $resp;
    $resp = explode(PHP_EOL."{",$resp);
    if(!empty($resp[1]))
    {
        print trim(iconv('windows-1251', 'UTF-8', "{".$resp[1]), true);
    }
    else
    {
        print '{"error":"yes","error_type":"Не удалось отправить заказ"}';
    }
    //print 'OK';
}
else {
    print '{"error":"yes","error_type":"Ну удалось оформить заказ"}';
}
?>
