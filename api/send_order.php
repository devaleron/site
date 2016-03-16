<?php
include('function.php');
if((isset($_POST['json'])) && (!empty($_POST['json'])) && (isset($_POST['tel'])) && (isset($_POST['password']))
		&& (isset($_POST['auto_type'])) && (is_numeric($_POST['auto_type'])) && (isset($_POST['price'])) && (is_numeric($_POST['price']))
		&& (isset($_POST['baby'])) && (is_numeric($_POST['baby'])) && (isset($_POST['bag'])) && (is_numeric($_POST['bag']))
		&& (isset($_POST['animals'])) && (is_numeric($_POST['animals'])) && (isset($_POST['comment'])) && (strlen($_POST['comment']) < 16) )
{
    $resp = do_authorize('62.192.227.240', 8888,'/zakaz?typ=order&order='.base64_encode($_POST['json']).'&auto_type='.$_POST['auto_type'].'&price='.$_POST['price'].'&baby='.$_POST['baby'].'&bag='.$_POST['bag'].'&animals='.$_POST['animals'].'&comment='.base64_encode($_POST['comment']), $_POST['tel'], $_POST['password']) or die('error');
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
