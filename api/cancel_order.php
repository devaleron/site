<?php
include('function.php');
if(isset($_POST['id_zakaz']) && (isset($_POST['tel'])) && (isset($_POST['password']))) {
    $resp = do_authorize('62.192.227.240', 8888,'/zakaz?typ=cancel&id_zakaz='.$_POST['id_zakaz'], $_POST['tel'], $_POST['password']) or die('{"error":"yes"}');
$resp = explode('
',$resp);
    $count = count($resp)-1;
    if(!empty($resp[$count]))
    {
         //$resp = trim(iconv('windows-1251', 'UTF-8',$resp[$count]), true);
        print $resp[$count];
        //print trim(iconv('windows-1251', 'UTF-8', $resp[$count]));
    }
    else
    {
        print '{"error":"yes","error_type":"Не удается отследить статус заказа"}';
    }
}
else {
    print '{"error":"yes","error_type":"Не удается отследить статус заказа"}';
}
?>
