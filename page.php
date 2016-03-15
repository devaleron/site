<?php 

include "app/config.php";
include "app/detect.php";
if($browser_t != 'web') $browser_t = 'smartphone';
if (($page_name=='') || (strstr($page_name, 'page.php')))
{
	include $browser_t . '/page.html';
}
if((isset($_GET['page'])) && (is_numeric($_GET['page'])))
{
	if(is_file($browser_t . '/'.$_GET['page'].'.html'))
	{
		include $browser_t . '/'.$_GET['page'].'.html';
	}
}
if (($page_name=='') || (strstr($page_name, 'page.php')))
{
	include $browser_t . '/page2.html';
	include $browser_t.'/page_contact.html';
}
else
{
	include $browser_t.'/404.html';
}

?>
