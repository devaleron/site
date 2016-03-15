<?php
function do_authorize($host, $port, $uri, $user, $pwd) {
    $out  = "GET $uri HTTP/1.1\r\n";
    $out .= "Host: ".$host."\r\n";
    $out .= "Connection: Close\r\n";
    $out .= 'Authorization: Basic '.base64_encode($user.':'.$pwd)."\r\n";
    $out .= "\r\n";

    if (!$sock = @fsockopen($host, $port, $errno, $errstr, 10)) {
        return 0;
    }
    fwrite($sock, $out);
    $data = '';
    while (!feof($sock)) {
        $data .= fgets($sock);
    }
    fclose($sock);
    return $data;
}
?>
