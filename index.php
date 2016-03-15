<?php 

include "app/config.php";
include "app/detect.php";
if($browser_t != 'web') $browser_t = 'smartphone';
if (($page_name=='') || ($page_name=='index.php'))
{
	include $browser_t.'/index.html';
	include $browser_t.'/about.html';
	include $browser_t.'/whatwe.html';
	include $browser_t.'/services.html';
	include $browser_t.'/contact.html';
}
else
{
	include $browser_t.'/404.html';
}

?>
