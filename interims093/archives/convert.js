/*******************************************************
CONVERSIONS
By Ryan Parman
Distributed according to SkyGPL 2.1, http://www.skyzyx.com/license/
*******************************************************/

function decimal(dec)
{
	this.dec=dec;
	this.toBinary=function() { return this.dec.toString(2); }
	this.toHex=function() { return this.dec.toString(16).toUpperCase(); }
	this.toOctal=function() { return this.dec.toString(8); }
}

function binary(bin)
{
	this.bin=bin;
	this.toDecimal=function() { return parseInt(this.bin, 2); }
	this.toHex=function() { return this.toDecimal().toString(16).toUpperCase(); }
	this.toOctal=function() { return this.toDecimal().toString(8); }
}

function hex(hex)
{
	this.hex=hex;
	this.toDecimal=function() { return parseInt(this.hex, 16); }
	this.toBinary=function() { return this.toDecimal().toString(2); }
	this.toOctal=function() { return this.toDecimal().toString(8); }
}

function octal(oct)
{
	this.oct=oct;
	this.toDecimal=function() { return parseInt(this.oct, 8); }
	this.toBinary=function() { return this.toDecimal().toString(2); }
	this.toHex=function() { return this.toDecimal().toString(16).toUpperCase(); }
}
