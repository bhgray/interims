<?php

$xml = "<root>&amp;</root>";

$xmldoc = @domxml_open_mem($xml,DOMXML_LOAD_PARSING,$error);

echo "<pre>";Ê Ê # Just for nice layout
foreach ($error as $errorline) {Ê Ê # Loop through all errors
ÊÊ echo $errorline['errormessage'];
ÊÊ echo " NodeÊ : " . $errorline['nodename'] . "\n";
ÊÊ echo " LineÊ : " . $errorline['line'] . "\n";
ÊÊ echo " Column : " . $errorline['col'] . "\n\n";
}

?>
