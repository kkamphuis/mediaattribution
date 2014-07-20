/* Customised by Datalicious http://www.datalicious.com V5 2010-10-14 */
/* Current Version: V72 */
/* Date: 09-01-2013 */

//------------- ENVIRONMENT CONFIG ------
var E_DEV = 'dev';
var E_TEST = 'test';
var E_PROD = 'prod';
var setting = {};
setting.env = E_PROD;
setting.getEnv = function(name) {
	if (name == 'sunapia' && setting.env == E_PROD) {
		return name;
	}
	return name + setting.env;
};

var d = {};

//------------- START CONFIG ------------------
d.Codebase				= '';

d.ClientProd				= '//assets.suncorp.com.au/js/';
d.ClientDev					= '//assetsdev.int.corp.sun/js/';
d.ClientTest 				= '//assetstest.suncorp.com.au/js/';
d.LocalDevTestCodebase		= '//localhost:8080/js/';
if ('https:' == document.location.protocol) {
	d.LocalDevTestCodebase		= '//localhost:8090/js/';
}

d.ClientName				= 'suncorp';
d.ClientNameDev				= 'suncorpdev';
d.ClientNameTest			= 'suncorptest';
d.CodebaseLivetest		= '//www.datalicious.com/clients/' + d.ClientName + '/livetest/js/';
d.CodebaseLatestCode	= '//www.datalicious.com/clients/' + d.ClientName + '/latestcode/js/';
d.LocalDevName				= 'localtest';
d.code_version 			= '156';
d.CodeFile				= 'dcode-v' + d.code_version + '.js';
d.DFile					= 'datalicious.js';
d.AllScripts			= document.getElementsByTagName('script');

//----------- BASE FUNCTIONS -------------------
d.gqp = function(name){name=name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var regexS="[\\?&]"+name+"=([^&#]*)";var regex=new RegExp(regexS);var results=regex.exec(window.location.href);if(results==null)return"";else return results[1];};
d.replaceAll = function(input,stringToFind,stringToReplaceWith){myRegExp=new RegExp(stringToFind, 'g');return input.replace(myRegExp, stringToReplaceWith);};
d.getHost = function(url){if(url.indexOf("://")>=0)url=url.substring(url.indexOf('://')+3,url.length);if(url.indexOf("/")>=0)url=url.substring(0,url.indexOf("/"));return url;};
d.setCookie = function(c_name,value,expiredays){var exdate=new Date();exdate.setDate(exdate.getDate()+expiredays);document.cookie=c_name+"="+escape(value)+";domain=."+d.replaceAll(d.getHost(window.location.href.toLowerCase()),"www.","")+";path=/"+((expiredays==null)?"":";expires="+exdate.toGMTString());};
d.getCookie = function(c_name){if(document.cookie.length>0){c_start=document.cookie.indexOf(c_name+"=");if(c_start!=-1){c_start=c_start+c_name.length+1;c_end=document.cookie.indexOf(";",c_start);if(c_end==-1)c_end=document.cookie.length;return unescape(document.cookie.substring(c_start,c_end));}}return"";};
d.include = function(filename){document.write(unescape("%3Cscript src='" + filename + "' type='text/javascript'%3E%3C/script%3E"));};
d.includeAS = function(file){var a=document.createElement('script');a.type='text/javascript';a.async=true;a.src=file;var b=document.getElementsByTagName('script')[0];b.parentNode.insertBefore(a,b);};

//------- ARE WE TESTING? ---------------------
d.URL=document.location.href.toLowerCase(); 
d.Test = d.gqp('datalicious');

if (d.Test == d.ClientNameDev) {
	d.setCookie('datCookie', d.ClientNameDev, 1);
}
else if (d.Test == d.ClientNameTest) {
	d.setCookie('datCookie', d.ClientNameTest, 1);
}
else if (d.Test == d.LocalDevName) {
	d.setCookie('datCookie', d.LocalDevName, 1);
}
else if (d.Test == d.ClientName) {
	d.setCookie('datCookie', d.ClientName, 1);
}
else if (d.Test == 'test') {
	d.setCookie('datCookie', 'test', 1);
}
else if (d.Test == 'optimisation') {
	d.setCookie('datCookie', 'optimisation', 1);
}
else if (d.Test == 'normal') {
	d.setCookie('datCookie', '', 0);
}
d.CookieValue = d.getCookie('datCookie');

d.Codebase = d.ClientProd;

checkEnv = function(env) {
	return d.CookieValue == env;
}

try {
	for(i=0; i<d.AllScripts.length; i++){
		if(d.AllScripts[i].src.indexOf(d.DFile) > -1){
			d.thisFileCodebase = d.Codebase = d.AllScripts[i].src.split('?')[0].replace(d.DFile, "");
			d.Codebase = d.thisFileCodebase;  
			break;
		}
	}


	if(checkEnv('test')){
		d.Codebase = d.CodebaseLivetest;
		d.CodeFile = d.CodeFile.replace(/\.js/g, "-test.js");
	}
	else if(checkEnv('optimisation')) {
		d.Codebase = d.CodebaseLivetest;
		d.CodeFile = d.CodeFile.replace(/\.js/g, "-optimisation.js");
	}
	else if(!checkEnv('')) {
		setting.env = E_DEV;
		if(checkEnv(d.ClientNameDev)) {
			// This will use the test files on the client server folder livetest
			d.Codebase = d.ClientDev;
		} 
		else if(checkEnv(d.ClientNameTest)) {
			// This will use the test files on the client server folder livetest
			d.Codebase = d.ClientTest;
		}  
		else if (checkEnv(d.LocalDevName)) {
			d.Codebase = d.LocalDevTestCodebase;
		}
		else if (checkEnv(d.ClientName)) {
			d.Codebase = d.ClientProd;
		}
		
		var thisFileFromProd = d.thisFileCodebase.toLowerCase().indexOf(d.ClientProd) > -1; 
		// increment the version no. of the dcode.js file when this file is downloaded from PROD
		
		if (thisFileFromProd && !checkEnv(d.ClientName)) {
			dcodeVersion = parseInt(d.code_version) + 1;
			d.CodeFile = 'dcode-v' + dcodeVersion + '.js';
		}
		else if (!thisFileFromProd && checkEnv(d.ClientName)) {
			dcodeVersion = parseInt(d.code_version) - 1;
			d.CodeFile = 'dcode-v' + dcodeVersion + '.js';
		}

	}
	
} catch (e) {
	d.Codebase = d.ClientProd;
}

d.protocol=document.location.protocol.toLowerCase();

if (typeof d.CodeFile != 'undefined') d.include(d.Codebase + d.CodeFile);
