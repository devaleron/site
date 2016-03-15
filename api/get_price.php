<?php
include('function.php');
if((isset($_POST['street1'])) && (isset($_POST['street2'])) && (isset($_POST['house1'])) && (isset($_POST['house2']))
    && (isset($_POST['tel'])) && (isset($_POST['password'])))
{
    $resp = do_authorize('62.192.227.240', 8888,'/zakaz?typ=pricetrip&street1='.$_POST['street1'].'&dom1='.$_POST['house1'].'&street2='.$_POST['street2'].'&dom2='.$_POST['house2'], $_POST['tel'], $_POST['password']);
    $resp = explode(PHP_EOL."{",$resp);
    if(!empty($resp[1]))
    {
        print trim(iconv('windows-1251', 'UTF-8', "{".$resp[1]));
    }
}
else
{
    print trim(iconv('windows-1251', 'UTF-8', '{"error":"yes","error_type":"”казаны некорректные данные"}'));
}
?>
