<?php
include('function.php');
if((isset($_POST['street'])) && (isset($_POST['tel'])) && (isset($_POST['password'])))
{
    $resp = do_authorize('62.192.227.240', 8888, '/zakaz?typ=getstreet&street='.urlencode($_POST['street']), $_POST['tel'], $_POST['password']);

    $resp = explode(PHP_EOL."{", $resp);

    if(isset($resp[1]))
    {
        print trim("{".$resp[1]);
    }
    else
    {
        print '{"error":"yes","error_type":"Указан некорректный пароль"}';
    }
}
else
{
    print '{"error":"yes","error_type":"Указаны некорректные данные"}';
}
?>