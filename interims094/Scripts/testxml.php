<?php
	phpinfo();
	include 'dom.php';

	
	header("Content-type: text/xml");
	$dom = new DOMDocument();
	$dom->preserveWhiteSpace = false;
	$dom->formatOutput = true;
	$xml = '<?xml version="1.0"?>

<resultset statement="select schoolDistrictID, firstName, lastName
FROM int_teachers
">
  <row>
        <schoolDistrictID>AAR</schoolDistrictID>
        <firstName>A</firstName>
        <lastName>ROCHLIN</lastName>
  </row>

  <row>
        <schoolDistrictID>CCS</schoolDistrictID>
        <firstName>C</firstName>
        <lastName>SWIFT</lastName>
  </row>

  <row>
        <schoolDistrictID>CLS</schoolDistrictID>
        <firstName>L</firstName>
        <lastName>SHIPPER</lastName>
  </row>

  <row>
        <schoolDistrictID>CMS</schoolDistrictID>
        <firstName>L</firstName>
        <lastName>SILVERMAN</lastName>
  </row>

  <row>
        <schoolDistrictID>EAS</schoolDistrictID>
        <firstName>A</firstName>
        <lastName>SAMPLE</lastName>
  </row>

  <row>
        <schoolDistrictID>EDA</schoolDistrictID>
        <firstName>D</firstName>
        <lastName>AGLIRA</lastName>
  </row>

  <row>
        <schoolDistrictID>EGT</schoolDistrictID>
        <firstName>G</firstName>
        <lastName>TULL</lastName>
  </row>

  <row>
        <schoolDistrictID>EJD</schoolDistrictID>
        <firstName>J</firstName>
        <lastName>DOUGHERTY</lastName>
  </row>

  <row>
        <schoolDistrictID>EMM</schoolDistrictID>
        <firstName>I</firstName>
        <lastName>FLAMM</lastName>
  </row>

  <row>
        <schoolDistrictID>HBD</schoolDistrictID>
        <firstName>B</firstName>
        <lastName>DUTILL</lastName>
  </row>

  <row>
        <schoolDistrictID>HDR</schoolDistrictID>
        <firstName>D</firstName>
        <lastName>ROWLAND</lastName>
  </row>

  <row>
        <schoolDistrictID>HEC</schoolDistrictID>
        <firstName>E</firstName>
        <lastName>CARBONI</lastName>
  </row>

  <row>
        <schoolDistrictID>HEM</schoolDistrictID>
        <firstName>E</firstName>
        <lastName>MILTON</lastName>
  </row>

  <row>
        <schoolDistrictID>HJR</schoolDistrictID>
        <firstName>J</firstName>
        <lastName>RYAN</lastName>
  </row>

  <row>
        <schoolDistrictID>HRH</schoolDistrictID>
        <firstName>R</firstName>
        <lastName>HAENN</lastName>
  </row>

  <row>
        <schoolDistrictID>LJR</schoolDistrictID>
        <firstName>J</firstName>
        <lastName>RADBILL</lastName>
  </row>

  <row>
        <schoolDistrictID>LSR</schoolDistrictID>
        <firstName>S</firstName>
        <lastName>RIBAULT</lastName>
  </row>

  <row>
        <schoolDistrictID>MAC</schoolDistrictID>
        <firstName>A</firstName>
        <lastName>CLARK</lastName>
  </row>

  <row>
        <schoolDistrictID>MBG</schoolDistrictID>
        <firstName>B</firstName>
        <lastName>GRAY</lastName>
  </row>

  <row>
        <schoolDistrictID>MJK</schoolDistrictID>
        <firstName>J</firstName>
        <lastName>KALICKI</lastName>
  </row>

  <row>
        <schoolDistrictID>MJL</schoolDistrictID>
        <firstName>J</firstName>
        <lastName>LEE</lastName>
  </row>

  <row>
        <schoolDistrictID>MJS</schoolDistrictID>
        <firstName>J</firstName>
        <lastName>SCHREIBER</lastName>
  </row>

  <row>
        <schoolDistrictID>MSG</schoolDistrictID>
        <firstName>S</firstName>
        <lastName>GOLDMAN</lastName>
  </row>

  <row>
        <schoolDistrictID>MSH</schoolDistrictID>
        <firstName>S</firstName>
        <lastName>HOGAN</lastName>
  </row>

  <row>
        <schoolDistrictID>MTV</schoolDistrictID>
        <firstName>T</firstName>
        <lastName>VO</lastName>
  </row>

  <row>
        <schoolDistrictID>PCB</schoolDistrictID>
        <firstName>C</firstName>
        <lastName>BROWN</lastName>
  </row>

  <row>
        <schoolDistrictID>PNJ</schoolDistrictID>
        <firstName>N</firstName>
        <lastName>JUKA</lastName>
  </row>

  <row>
        <schoolDistrictID>SAB</schoolDistrictID>
        <firstName>A</firstName>
        <lastName>BASU</lastName>
  </row>

  <row>
        <schoolDistrictID>SFB</schoolDistrictID>
        <firstName>F</firstName>
        <lastName>BREEN</lastName>
  </row>

  <row>
        <schoolDistrictID>SGP</schoolDistrictID>
        <firstName>G</firstName>
        <lastName>PETERS</lastName>
  </row>

  <row>
        <schoolDistrictID>SJC</schoolDistrictID>
        <firstName>J</firstName>
        <lastName>CICCARELLI</lastName>
  </row>

  <row>
        <schoolDistrictID>SPS</schoolDistrictID>
        <firstName>P</firstName>
        <lastName>STEIN</lastName>
  </row>

  <row>
        <schoolDistrictID>SRD</schoolDistrictID>
        <firstName>R</firstName>
        <lastName>DAVIES</lastName>
  </row>

  <row>
        <schoolDistrictID>XLA</schoolDistrictID>
        <firstName>L</firstName>
        <lastName>AHMED</lastName>
  </row>
</resultset>			';
	$dom->loadXML( $xml );
	echo $dom->saveXML();
?>