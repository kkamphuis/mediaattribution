d.aInclude = function(url, cB) {
	var h = document.getElementsByTagName('head');
	if (h.length == 0) h[0] = document.body.parentNode.appendChild(document.createElement('head'));
	var n = document.createElement('script');
	n.type = 'text/javascript';
	n.src = url;
	if (cB) {
		if (n.addEventListener) n.addEventListener('load', cB, false);
		else if (n.attachEvent) n.attachEvent('onreadystatechange', function () { if (n.readyState == 'complete' || n.readyState == 'loaded') cB(); });
	}
	h[0].appendChild(n);
	return true;
}

d.getSiteFromReportSuite = function(un) {
	var i = un.indexOf('prod');
	var j = un.indexOf('dev');
	var account = i > -1 ? un.substring(0,i) : (j > -1 ? un.substring(0,j) : un);
	return account;
};

//include the Omniture scode file
d.getCurrentVersion = function() {
	return d.CodeFile.substring(7, d.CodeFile.indexOf("."));
}

//attach document state change event
d.attachEvent = function(event, func , element) {
    if (typeof element == 'undefined') {
        element = document;
    }
	if(ie) element.attachEvent('on' + event, func);
	else element.addEventListener(event, func);
}
d.getElementsByClassName = function(className) {

	if (window.navigator.appVersion.indexOf('MSIE 7.0') > 0) {
		(function(g, s) {
		g=document, s=g.createStyleSheet();
		g.querySelectorAll = function(r, c, i, j, a) {
			a=g.all, c=[], r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
			for (i=r.length; i--;) {
				s.addRule(r[i], 'k:v');
				for (j=a.length; j--;) a[j].currentStyle.k && c.push(a[j]);
				s.removeRule(0);
			}
			return c;
		}
		})()
	}

    if (ie) return document.querySelectorAll('.' + className);
	return document.getElementsByClassName(className);
}

d.getInnerText = function(element) {
    if (element) {
    	if (element.innerText) {
    		return d.trim(element.innerText);
    	} else {
    		return d.trim(element.textContent);
    	}
    }
    return '';
}

d.trim = function(text){
    return typeof text != 'undefined' ? text.replace(/^\s+|\s+$/g, '') : '';
}

d.include(d.Codebase+'mbox-v' + d.getCurrentVersion() + '.js');
d.include(d.Codebase+'scode-v' + d.getCurrentVersion() + '.js');
d.include(d.Codebase+'tagserver-v' + d.getCurrentVersion() + '.js');
d.currentURL=location.href.toLowerCase();
if(d.currentURL.indexOf('terrischeer') > -1){
	if(checkEnv('')) {
		d.include(d.Codebase+'terrischeer-sitecat.js');
	} else {
		d.include(d.Codebase+'terrischeer-sitecat-source.js');
	}
}

//---------- ClickTale ---------- //

//---------- GA ----------//
var _gaq = _gaq || [];

d.ClickTaleBottom = function(js) {
	//do not load ClickTale script twice
	if (typeof window.ClickTaleScriptSource == 'undefined') {
		document.write(unescape("%3Cscript%20src='" +
	                            (document.location.protocol == 'https:' ?
	                             'https://clicktalecdn.sslcs.cdngc.net/' :
	                             'http://cdn.clicktale.net/') +
	                            js + "'%20type='text/javascript'%3E%3C/script%3E"));
	}
};

d.getAmount = function(event) {
	if(s.products.indexOf(event) > -1){
		amount = s.products.substr(s.products.indexOf(event)+event.length+1);
		if(amount.indexOf(',') > -1) amount = amount.substr(0, amount.indexOf(','));
		return amount;
	}else{
		return "0";
	}
}

//----------- Page Load Time-------------//
var inHeadTS;

// ---------- Page Top Function ---------- //
d.t = function(){
	// page load time: support older browsers
	inHeadTS=(new Date()).getTime();
	// Redirect Test and Target
	if(
		d.currentURL.indexOf('http://www.justcarinsurance.com.au/index.asp')>=0 ||
		d.currentURL.indexOf('http://justcarinsurance.com.au/index.asp')>=0
	){
		document.write('<div class="mboxDefault"></div><scr'+'ipt language="javascript1.2">mboxCreate(\'JCI_Home_Redirect\');</scr'+'ipt>');
	}
	// ClickTale
	if(d.currentURL.indexOf('http://www.aami.com.au/') == 0 || d.currentURL.indexOf('http://www.bingle.com.au/') == 0 || d.currentURL.indexOf('http://www.suncorp.com.au/') == 0
		|| d.currentURL.indexOf('http://www.gio.com.au/') == 0 || d.currentURL.indexOf('https://insurance.suncorp.com.au/home') == 0){
		var WRInitTime=(new Date()).getTime();
	}

	if(d.currentURL.indexOf('www.suncorp.com.au/insurance/campaigns/life-protect-your-family') > -1
		|| d.currentURL.indexOf('www.aami.com.au/life-insurance/income-protection') > -1
		|| d.currentURL.indexOf('www.suncorp.com.au/sites/default/files/campaign/lifeprotect/index.html') > -1) {
		if(s.getQueryParam('net_uid') != '' ) {
			s.getAndPersistValue(s.getQueryParam('net_uid'), 'net_uid');
		}
		if (s.getQueryParam('seg') != '') {
			s.getAndPersistValue(s.getQueryParam('seg'), 'seg');
		}
		if(s.getQueryParam('cmpid') != '') {
			s.getAndPersistValue(s.getQueryParam('cmpid'), 'cmpid');
		}
	}
}


// ---------- Page Bottom Function ---------- //
d.b = function(){
	// do not send data to SiteCatalyst when SuperTag is disabled
	if (typeof s.siteID == 'undefined' || s.siteID == '') {
		return;
	}

	// Test and Target
	/* Global mbox for AAMI, Suncorp and GIO Motor */
    (function () {
	    var secureGlobalMboxes = [
	        'insurance.suncorp.com.au/motor/',
	        'insurance.aami.com.au/motor/',
	        'insurance.gio.com.au/motor/',
	        'insurance.sys.aami.com.au/motor/',
	        'insurance.aami.com.au/home/pub/aamiquote',
	        'insurance.suncorp.com.au/home/pub/sunquote',
	        'insurance.gio.com.au/home/pub/gioquote',
	        'insurance.sys.aami.com.au/home/pub/sunquote',
	        'insurance.sys.aami.com.au/home/pub/gioquote',
	        'insurance.sys.aami.com.au/home/pub/aamiquote'
	    ];
	    var i;
	    for (i in secureGlobalMboxes) {
	        if (window.location.href.indexOf(secureGlobalMboxes[i]) > -1 && s.pageName.indexOf('dealerquote') < 0 && s.pageName.indexOf('dealerbuy') < 0 && s.pageName.indexOf('unknown') < 0 ) {
	            var mboxName = '';
	            var mboxNameArr = s.pageName
	                .replace(/^(in:)|sales:|:quote(?!:jeopardy|_)|:buy(?!:jeopardy|_)/g,'')
	                .replace(':secapp',':sec')
	                .replace('ami','aami')
	                .replace(/home_classic|home_extras|home_advantages|home_landlord/i, 'home')
	                .replace('quote:jeopardy', 'quote_jeopardy')
	                .replace('buy:jeopardy', 'buy_jeopardy')
	                .replace(':quote_started',':qs')
	                .replace(':quote_completed',':qc')
	                .replace(':buy_started',':bs')
	                .replace(':buy_completed',':bc')
	                .split(':');
	            for (var i=0;i<mboxNameArr.length;i++) {
	                if (i<4) {
	                    mboxName += mboxNameArr[i] + '_';
	                }
	            }
	            mboxName = mboxName.toUpperCase() + 'M1';

	            if (s.pageName.indexOf('buy_completed') > -1) {
	                var eventIndex = s.events.indexOf('event19:');
	                if (eventIndex > -1) {
	                    eventIndex += 8;
	                    var commaIndex = s.events.indexOf(',',eventIndex);
	                    if (commaIndex < 0) { commaIndex = s.events.length; }
	                    var orderTotal = s.events.substring(eventIndex,commaIndex).replace(/\$|,/g,'');
	                    mboxCreate(mboxName,'pageName='+s.pageName,'orderId='+s.eVar23,'orderTotal='+orderTotal);
	                } else {
	                    mboxCreate(mboxName,'pageName='+s.pageName,'error=event19');
	                }
	            } else {
	                mboxCreate(mboxName,'pageName='+s.pageName);
	            }
	        }
	    }
	})();

	// when use prod site to test, force report suite to dev
	if ((checkEnv(d.ClientNameDev) || checkEnv(d.ClientNameTest) || checkEnv(d.LocalDevName))) {
		setting.env = E_DEV;
		s.un = s.un.indexOf('prod') > -1 ? setting.getEnv(s.un.substring(0,s.un.indexOf('prod'))) : s.un.indexOf('dev') > -1 ? s.un : setting.getEnv(s.un);
	}

	d.adjustBrochureware(s);

	var delay = false;
	/* ClickTale Call */
	if (window.navigator.appVersion.indexOf('MSIE 7.0') < 0 && window.navigator.appVersion.indexOf('MSIE 8.0') < 0) {
		if(d.currentURL.indexOf('http://www.aami.com.au/') == 0 || s.getPageName() == 'in:ami:life-insurance:life-insurance-calculator'){
			d.ClickTaleBottom("www02/ptc/6fe21bcd-c381-4497-befd-d3d62a2a6cd1.js");
			delay = true;
		}
		if(d.currentURL.indexOf('http://www.bingle.com.au/') == 0){
			d.ClickTaleBottom("www02/ptc/4d9ed179-188c-4460-a70d-378d380f8895.js");
			delay = true;
		}
	    if((d.currentURL.indexOf('http://www.suncorp.com.au/') == 0 && s.pageName != 'in:sun:homepage')
		|| ((/insurance.suncorp.com.au\/home/i.test(d.currentURL) || /(insurance|sunpay).uat.suncorp.com.au\/(home|payonlineweb)/i.test(d.currentURL))
		&& (s.pageName.indexOf('in:sun:secapp:home_classic') == 0 || s.pageName.indexOf('in:sun:secapp:home_advantages') == 0|| s.pageName.indexOf('in:sun:secapp:home_extras') == 0))) {
		    d.ClickTaleBottom("www02/ptc/8d43d9e9-72d8-40b2-a9ae-34e4cbe9d545.js");
			delay = true;
		}

		if(d.currentURL.indexOf('http://www.gio.com.au/') == 0) {
		    d.ClickTaleBottom("www02/ptc/4629092c-1c77-428a-a47d-18eb1ceb6ea6.js");
			delay = true;
		}
	}

	if(s.siteID == 'in:apa') {
		delay = true;
	}

	// if use call back function, delay 1s
	if (delay) {
		setTimeout(d.firePageLoadTagsWhenReady,500);
	} else {
		d.firePageLoadTagsNow();
	}
}

var firePageLoadTagsAttempts = 0;
d.firePageLoadTagsWhenReady = function() {
	if (typeof ClickTaleGetUID != 'function' && firePageLoadTagsAttempts < 6) {
		firePageLoadTagsAttempts++;
		setTimeout(d.firePageLoadTagsWhenReady, 500);
		return;
	}
	d.firePageLoadTagsNow();
}

d.firePageLoadTagsNow = function() {
	// fire now
	s_code=s.t();if(s_code)document.write(s_code);
	scApplyTrackLink();
	d.adserverTags();
	d.buttonTags();
};

// ----- QLD 25K Campaign (To be removed after campaign)----- //
d.trackEnter = function(postcode, insuranceString, monthString){
	if(typeof postcode != 'undefined'){
		scTempEvents=s.events;
		s.linkTrackVars="eVar12";
		s.eVar12=postcode;
		s.tl(this,"o","postcode: "+postcode);
		// restore events and clear filters
		s.events=scTempEvents;
		s.linkTrackVars="none";
		s.linkTrackEvents="none";
	}
	if(typeof insuranceString != 'undefined'){
		var products = insuranceString.split(':');
		if(typeof monthString != 'undefined'){
			var months = monthString.split(':');
			var date = new Date();
			var thisMonth = date.getMonth();
			thisMonth++;
			var renewIndex = -1;
			var minMonth = 100;
			for(i in months){
				if(months[i] != 'mm'){
					var month = parseInt(months[i], 10);
					if(month - thisMonth < 0) month=month+12;
					if(month - thisMonth < minMonth){
						minMonth = month - thisMonth;
						renewIndex = i;
					}
				}
			}
			if(renewIndex != -1 && (renewIndex >=0 && renewIndex <=3)){
				cachebuster = Math.floor(Math.random()*11111111111);
				var retargeting = products[renewIndex];
				if(retargeting == 'car'){
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco658;ord=1;num='+cachebuster+'?'); // 1051726
				}
				if(retargeting == 'home'){
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco403;ord=1;num='+cachebuster+'?'); // 1051729
				}
				if(retargeting == 'contents'){
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco137;ord=1;num='+cachebuster+'?'); // 1051731
				}
				if(retargeting == 'boat'){
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco294;ord=1;num='+cachebuster+'?'); // 1051737
				}
				if(retargeting == 'landlord'){
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco071;ord=1;num='+cachebuster+'?'); // 1051732
				}
				if(minMonth <= 3){
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco436;ord=1;num='+cachebuster+'?'); // 1046482
				}else{
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco149;ord=1;num='+cachebuster+'?'); // 1046481
				}
			}
		}
	}
}

d.socialShare = function(shareType){
	if(typeof shareType != 'undefined'){
		scTempEvents=s.events;
		s.linkTrackVars="events,eVar74";
		s.linkTrackEvents="event74";
		s.eVar74=shareType;
		s.events="event74";
		s.tl(this,"o","share: "+shareType);
		// restore events and clear filters
		s.events=scTempEvents;
		s.linkTrackVars="none";
		s.linkTrackEvents="none";

	}
}

d.trackSegment = function(segment){
	if(typeof segment != 'undefined'){
		cachebuster = Math.floor(Math.random()*11111111111);
		segment = segment.toLowerCase();
		if(segment == 'future' || segment == 'new' || segment =='existing'){
			scTempEvents=s.events;
			s.linkTrackVars="events,eVar73";
			s.linkTrackEvents="event73";
			s.eVar73=segment;
			s.events="event73";
			s.tl(this,"o","segment: "+segment);
			// restore events and clear filters
			s.events=scTempEvents;
			s.linkTrackVars="none";
			s.linkTrackEvents="none";
			if(segment == 'existing'){
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco260;ord=1;num='+cachebuster+'?'); // 1046483
			}
			if(segment == 'new'){
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco402;ord=1;num='+cachebuster+'?'); // 1051742
			}
		}
		if(segment == 'enter'){
			s.tl(this,"o","25K landing enter");
		}
	}
}

d.addButtonTag = function(siteID, pageName, buttonID, linkTrackVars, linkTrackEvents, linkName, transfer){
	if (pageName != s.pageName && !(pageName == 'GLOBAL' && s.siteID.indexOf(siteID) >= 0)) {
		return;
	}
    var element = document.getElementById(buttonID);
    if (element){
		if (transfer) {
			element.onclick=function() {
				d.fireButtonTag(s.un, linkTrackVars, linkTrackEvents, linkName, element);
				return false;};
		} else {
			element.onclick=function() {
				d.fireButtonTag(s.un, linkTrackVars, linkTrackEvents, linkName)};
		}
	}
}

d.addButtonEventByClassName = function(pageName, buttonClassName, nodeId, tagName) {
    if ( typeof s != 'undefined' && typeof s.un != 'undefined' && (typeof pageName != 'undefined') && (typeof buttonClassName != 'undefined') ) {
        if ( pageName == s.pageName ){
			var button = d.getElementsByClassName(buttonClassName);
	        if (button && button.length > 0){
	            button[0].onclick=function() {
	                d.setCookie(buttonClassName, true);
	            };
	        }
        }
    }
}
d.addButtonsTag = function(siteID, pageName, buttonName, linkTrackVars, linkTrackEvents, linkName){
  // Make sure the supertag exists and that a pageName and buttonID are defined
  if ( typeof s != 'undefined' && typeof s.un != 'undefined' && (typeof pageName != 'undefined') && (typeof buttonName != 'undefined') ) {
      // Check if the click event is "on this page or is global"
      if ( (pageName == s.pageName) || ((s.siteID.indexOf(siteID) >= 0) && (pageName == 'GLOBAL') ) ){
        // Attach the tag to the onclick of the link
        var elements = document.getElementsByName(buttonName);
        if (linkTrackVars.indexOf('prop37') >= 0) {
            s.prop37 = 'CarSearchResult';
            if (elements && elements.length > 0) {
                s.prop38 = elements.length;
			} else {
                s.prop38 = 0;
            }
            d.setCookie('prop38',s.prop38);
        }
        for (i=0; i<elements.length;i++) {
        if (elements[i]){
                    elements[i].onclick=function() {
                    d.fireButtonTag(s.un, linkTrackVars, linkTrackEvents, linkName);
                };
        }
    }
      }
  }
}
// find name
d.getTxtWhinNchar = function (text,length)
{
    if(text.length < length)
    {
        text = text.replace(/\s+/gi,'-')
    }
    else
    {
        texts=text.split(" ");
        text=texts[0];
        for(j = 1; j < texts.length;j++)
        {
            nextLen=text.length + texts[j].length + 1;
            if(nextLen > length)
            {
                break;
            }
            text=text + '-' + texts[j];
        }
    }
    return text;
}
// Call the tag on a event click
d.fireButtonTag = function(siteID, linkTrackVars, linkTrackEvents, linkName, element){
    // Make sure the supertag exists and that pageName and buttonID are defined
    if ( (typeof siteID != 'undefined') && (typeof linkTrackVars != 'undefined') && (typeof linkTrackEvents != 'undefined') && (typeof linkName != 'undefined') ) {
        //var s=s_gi(siteID);
		s.useForcedLinkTracking=true;
        scTempEvents=s.events;
        s.events=linkTrackEvents;
        s.linkTrackVars=linkTrackVars;
        s.linkTrackEvents=linkTrackEvents;
        s.eVar36=linkName;
		if (linkTrackVars.indexOf('eVar22') >= 0) {
			s.events=linkTrackEvents + ':' + s.eVar22;
			if(s.pageName.indexOf('in:sun:secapp:motor:quote:quote_completed') >= 0) {
				d.imageTag('//googleads.g.doubleclick.net/pagead/viewthroughconversion/1052146104/?value=0&label=SIJRCODe0AkQuPPZ9QM&guid=ON&script=0');
			}  else if(s.pageName.indexOf('in:gio:secapp:sales:motor:quote:quote_completed') >= 0) {
				d.imageTag('//googleads.g.doubleclick.net/pagead/viewthroughconversion/1066334314/?value=0&label=9Qn9CPb0rQcQ6vC7_AM&guid=ON&script=0');
			}
		} else if (s.pageName == 'in:ami:life-insurance:life-insurance-calculator') {
			var linkName = s.eVar36;
			setTimeout(function () {
				var error = '';
				elements = d.getElementsByClassName('error');
				for (i = 1; i < elements.length; i = i + 2) {
					if (elements[i].style.display != "none") {
						error = error + d.getInnerText(elements[i].parentElement.parentElement.firstElementChild).replace('*', '') + " is required.|";
					}
				}
				scTempEvents=s.events;
				s.usePlugins=false;
				if (error) {
					s.events = "event64";
					s.linkTrackEvents = "event64";
					s.list3 = error.substring(0, error.length-1);
					s.linkTrackVars = 'events,list3';
					s.tl(this,'o','Validation Error');
				} else {
					var elements = document.getElementById('step-ul');
					for (i = 0; i < elements.childElementCount; i++) {
					    if (elements.childNodes[i].className=='selected') {
					    	s.eVar36 = linkName + ' ' + d.getInnerText(elements.childNodes[i]);
					    	break;
					    }
					}
					s.events = "event20";
					s.linkTrackEvents = "event20";
					s.linkTrackVars = 'events,eVar36';
					s.tl(this,'o', s.eVar36);
				}
				s.events=scTempEvents;
				s.usePlugins=true;
			}, 600);
			return;
		} else if(scEventExists('event1') && (s.siteID == "in:sun" || s.siteID == "in:ami") && (s.products.indexOf("home_") > -1 || s.products.indexOf("car_") > -1)) {
			s.eVar9 = 'in_selfservice_nb_register';
  			s.events = s.serializeEvent('event1');
		}
		if (s.trackingServer == null || s.trackingServer.length == 0) {
			s.trackingServer = "metrics.suncorp.com.au";
		}
		if (s.trackingServerSecure == null || s.trackingServerSecure.length == 0) {
			s.trackingServerSecure = "smetrics.suncorp.com.au";
		}
        s.usePlugins=false;
        s.forcedLinkTrackingTimeout = 500;
		if (element == null ) {
			s.tl(this,'o',linkName);
		} else {
			s.tl(element,'o',linkName, null, 'navigate');
		}
		s.events=scTempEvents;
		s.usePlugins=true;
    }
}

d.adjustBrochureware = function(s) {
    if (s) {
		s.linkInternalFilters=s.linkInternalFilters + ",tel:,"
		if(s.pageName == 'in:imr:secapp:motorcycle:buy:buy_started'){
			s.getAndPersistValue(s.products, 'IMRProducts');
		} else if(s.pageName == 'in:imr:secapp:motorcycle:buy:buy_completed'){
			if(s.products.indexOf(';nonproductspecific') >= 0){
				s.products = s.products.replace(';nonproductspecific',s.getAndPersistValue(null, 'IMRProducts'));
			}
		} else if(s.pageName == 'in:bin:secapp:motor:quote:quote_completed'){
			if(scEventExists('event9')){
				s.getAndPersistValue(s.eVar22,'BingleQuoteNumber');
			} else if(scEventExists('event10')){
				s.getAndPersistValue("QTE"+s.events.substring(s.events.indexOf(":")+1),'BingleQuoteNumber');
			}
		} if(s.siteID == 'in:jci') {
			if(s.pageName == 'in:jci:secapp:motor:buy:buy_started'){
				s.getAndPersistValue(s.products, 'JCIProducts');
			}
			if(s.products.indexOf('#product#') >= 0){
				s.products = s.products.replace('#product#', s.getAndPersistValue(null, 'JCIProducts'));
			}
			if(/\w+/i.test(s.products)) {
				if(s.products.indexOf(';') != 0) {
					s.products = ';' + s.products;
				} else if(s.products.indexOf(',') > 0) {
					s.products = s.products.replace(',', '');
				} else if(scEventExists('event18')) {
					s.list1 = s.products + '_' + window.location.href + '_' + s.events;
				}
			}
		} else if(s.getPageName() == 'in:ami:life-insurance:life-insurance-calculator') {
			d.attachEvent('readystatechange', function() {
				if(document.readyState == 'complete') {
					d.addButtonTag(s.siteID, s.pageName, 'webform-client-form-6062-nextButton', 'eVar36,events', 'event20', 'Next');
					d.addButtonTag(s.siteID, s.pageName, 'webform-client-form-6062-prevButton', 'eVar36,events', 'event20', 'Back');
				}
			});
		} else if (s.pageName.indexOf('in:ami:secapp:selfservice:claim:lodgement:contactingyou') > -1) {
			var element = document.getElementById('fileUpload');

            if (element != null) {
                element.onclick = function trackError() {
                    var element1 = document.getElementById('document-error-message-box');
                    var element2 = document.getElementById('upload-error');
                    var error = d.getInnerText(element1) + d.getInnerText(element2);
                    if (/You can only|Error uploading/i.test(error)) {
                        s.linkTrackEvents = "event64";
                        s.linkTrackVars = "events,list3,products";
                        s.usePlugins = false;
                        var override = new Object();
                        override.events = "event64";
                        override.list3 = error.replace('\n', '|');
                        s.tl(this, 'o', 'Validation Error for file upload on claim online', override);
                        s.usePlugins = true;
                    } else {
                        setTimeout(trackError, 1000);
                    }
                };
            }
		} else if (/in:\w+:secapp:(sales:)?\w+:quote:(retrieve_quote|quote_retrieve)/i.test(s.pageName)) {
			var km = s.getAndPersistValue(null, scGetQuoteNumber() + '_eVar67');
			if (km) {
				s.eVar57 = km;
				s.getAndPersistValue(km, s.eVar26 + '_eVar67');
			}
            var element = document.getElementById('_eventId_submit') || document.getElementById('_eventId_nextpage');

            if (element != null) {
                d.attachEvent('readystatechange', function () {
                    if (document.readyState == 'complete') {
                        var errorEle = document.getElementById('*.errors') || document.getElementById('errors.errors');
                        var error = errorEle != null ? d.getInnerText(errorEle.childNodes[1].childNodes[1]) : '';
                        var quoteEle = document.getElementById('retrieveQuote.quoteNumber') || document.getElementById('quoteNumber');
                        var quoteNumber = quoteEle != null ? quoteEle.value : "";
                        if (error.indexOf("not found") > -1) {
                            s.linkTrackEvents = "event64";
                            s.linkTrackVars = "events,list3,products,eVar22";
                            s.usePlugins = false;
                            var override = new Object();
                            override.events = "event64:" + quoteNumber;
                            override.list3 = "Quote not found";
                            override.eVar22 = quoteNumber;
                            s.tl(this, 'o', 'Validation Error for quote retrieve page', override);
                            s.usePlugins = true;
                        }
                    }
                });
            }
            //capture eVar22
            s.eVar22 = scGetQuoteNumber();
        } else if (/in:\w+:secapp:(sales:)?\motor:quote:quote_started/i.test(s.pageName)) {
        	var element = document.getElementById('policyStartDatePicker');
        	if (!element) return;
        	var getPolicyStartDate = function() {
	        	var dateArray = element.value.split('/');
	        	if (dateArray && dateArray.length == 3) {
	        		var policyStart = new Date(dateArray[2],dateArray[1]-1,dateArray[0]);
	        		return policyStart;
	    		}
        	}
        	var getDaysToPolicyStartDate = function() {
        		var policyStart = getPolicyStartDate();
        		var millisecondsOfDay = 24*60*60*1000;
        		var now = new Date();
        		var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        		var elapsedDays = Math.floor((policyStart - today) / millisecondsOfDay);
        		elapsedDays = elapsedDays < 0 ? '0' : elapsedDays + '';
        		return elapsedDays;
        	}
        	s.eVar70 = getDaysToPolicyStartDate();
        	s.getAndPersistValue(s.eVar70, s.eVar26 + '_eVar70');
        	element.onchange = function() {
				s.linkTrackVars = 'products,eVar70';
				s.usePlugins = false;
				var override = new Object();
				override.eVar70 = getDaysToPolicyStartDate();
				s.getAndPersistValue(override.eVar70, s.eVar26 + '_eVar70');
				s.tl(this, 'o', 'Days to Policy Start Date', override);
				s.usePlugins = true;
        	}

            //Year of manufacture
            var vehicleYearOfManufactureList = document.getElementById('vehicleYearOfManufactureList');
            if(vehicleYearOfManufactureList){
                vehicleYearOfManufactureList.onchange = function(){
                    if ("" != vehicleYearOfManufactureList.value){
                        s.eVar15 = s.prop17 = vehicleYearOfManufactureList.value;
                        s.getAndPersistValue(s.eVar15, 'yearofmanufacture');
                    }
                }
            }
        } else if (/in:\w+:secapp:(sales:)?\motor:quote:car_details/i.test(s.pageName)) {
        	var elements = document.getElementsByName('averageKmTravelPerYear');
        	if (!elements) return;
    		for (i=0; i<elements.length; i++) {
    			elements[i].onclick = function(e) {
    				s.linkTrackVars = 'products,eVar57';
    				s.usePlugins = false;
    				var override = new Object();
    				override.eVar57 = this.value;
    				s.getAndPersistValue(this.value, s.eVar26 + '_eVar67');
    				s.tl(this, 'o', 'Amount of KM', override);
    				s.usePlugins = true;
    			};
    		}
        }
        if (/in:\w+:secapp:(sales:)?\motor:quote:/i.test(s.pageName)) {
        	var daysToPolicyStartDate = s.getAndPersistValue(null, s.eVar26 + '_eVar70');
        	if (daysToPolicyStartDate) s.eVar70 = daysToPolicyStartDate;
        	var km = s.getAndPersistValue(null, s.eVar26 + '_eVar67');
        	if (km) s.eVar57 = km;
            var vehicleYearOfManufacture = s.getAndPersistValue(null, 'yearofmanufacture');
            if (vehicleYearOfManufacture) s.eVar15 = s.prop17 = vehicleYearOfManufacture;
        	// set browser cookie when quote is completed, will expire in 45 days
        	if(/quote_completed/i.test(s.pageName)) s.getAndPersistValue(km, s.eVar22 + '_eVar67', 45);
        }

        if (s.pageName == 'in:apa:apia:health-insurance' || s.getPageName() == 'in:apa:health-insurance') {
            function fireInteractionTag(eVar71) {
                if (eVar71 != ''){
                    s.plugins = false;
                    var override = {};
                    override.linkTrackVars = 'eVar71,events';
                    override.linkTrackEvents = 'event71';
                    override.eVar71 = eVar71;
                    override.events = 'event71';
                    s.tl(this, 'o', eVar71, override);
                    s.plugins = true;
                }
            }

            var add_or_remove = document.getElementsByClassName('add-remove');
            if (add_or_remove.length > 1) {
                for (var i = 0; i < add_or_remove.length; i++) {
                    add_or_remove[i].onclick = function(e){
                        var eVar71 = '';
                        var element = (ie) ? e.srcElement : e.target;
                        if (element && element.parentNode && element.parentNode.parentNode){
                            var dataPlan = element.parentNode.parentNode.getAttribute('data-plan');
                            if(/hospital/i.test(dataPlan)){
                                if ("ADD TO COVER" == d.getInnerText(element)){
                                    eVar71 = "Hospital Add to Cover";
                                }else if("REMOVE" == d.getInnerText(element)){
                                    eVar71 = "Hospital Remove from cover";
                                }
                            }else if(/extras|advanced/i.test(dataPlan)){
                                if ("ADD TO COVER" == d.getInnerText(element)){
                                    eVar71 = "Extras Add to Cover";
                                }else if("REMOVE" == d.getInnerText(element)){
                                    eVar71 = "Extras Remove from cover";
                                }
                            }
                        }
                        fireInteractionTag(eVar71);
                    };
                }
            }


            var moreArr = document.getElementsByClassName('more');
            if(moreArr.length > 1){
                for (var i = 0; i < moreArr.length; i++){
                    moreArr[i].onclick = function(e){
                        var eVar71 = '';
                        var element = (ie) ? e.srcElement : e.target;
                        if (element && element.parentNode && element.parentNode.parentNode && element.parentNode.parentNode.parentNode){
                            var dataCover = element.parentNode.parentNode.parentNode.getAttribute('data-cover');
                            if(/hospital/i.test(dataCover)){
                                eVar71 = "Hospital View Inclusions";
                            }else if(/extras/i.test(dataCover)){
                                eVar71 = "Extras View Inclusions";
                            }
                        }
                        fireInteractionTag(eVar71);
                    };
                }
            }
        }

        if (s.pageName.indexOf('in:ami:secapp:business:marketstalls:buy') > -1){
            s.products = ';business_market_stall_public_liability';
            if (s.pageName == 'in:ami:secapp:business:marketstalls:buy:buy_started'){
                quote = document.getElementById('quote');
                if (quote) {
                    d.attachEvent('click', function () {
                        var premiumLabels = document.getElementsByClassName('premiumLabelShow');
                        if (premiumLabels.length > 3) {
                            //cover limit
                            s.getAndPersistValue(premiumLabels[1].id.substr(-9), 'cover_limit');

                            //policy Duration
                            var policyDurationID = premiumLabels[2].id;
                            var policyDuration = policyDurationID.substr(policyDurationID.indexOf('Duration') + 8);
                            s.getAndPersistValue(policyDuration, 'policy_duration');
                        }
                    }, quote);
                }
            }else if(s.pageName == 'in:ami:secapp:business:marketstalls:buy:confirmation'){
                //Cover limit
                s.eVar31 = s.getAndPersistValue(null, 'cover_limit');
                //Policy Duration
                s.prop26 = s.getAndPersistValue(null, 'policy_duration');
            }
        }

        //capture evar69 event78
        if(s.pageName.indexOf('in:ami:secapp:sales:home:quote:quote_completed') > -1 )
        {
            radio_crc=document.getElementById('buildingSumInsuredType-crc');
            check_tenant=document.getElementById('tenantProtection');
            name=scGetProducts().split('_')[0];
            if(radio_crc)
            {
                d.attachEvent('click',function(){
                    s.linkTrackEvents = "event78";
                    s.linkTrackVars = "eVar69";
                    s.usePlugins = false;
                    var override = new Object();
                    override.events = "event78";
                    override.eVar69 =name + '_complete_replacement_offer';
                    s.tl(this, 'o', name + '_complete_replacement_offer is selected', override);
                    s.usePlugins = true;
                },radio_crc);
            }
            if(check_tenant)
            {
                d.attachEvent('click',function(){
                    if(this.checked)
                    {
                        s.linkTrackEvents = "event78";
                        s.linkTrackVars = "eVar69";
                        s.usePlugins = false;
                        var override = new Object();
                        override.events = "event78";
                        override.eVar69 =name + '_tenant_protection';
                        s.tl(this, 'o', name + '_tenant_protection is selected', override);
                        s.usePlugins = true;
                    }
                },check_tenant);
            }
        }

        if(s.pageName.indexOf('in:ami:secapp:sales:home:quote:contents_cover') > -1 )
        {
            radio_yes=document.getElementById('hasPersonalValuables1');
            name=s.pageName.split(':')[7].split('_')[0];
            if(radio_yes)
            {
                d.attachEvent('click',function(){
                    s.linkTrackEvents = "event78";
                    s.linkTrackVars = "eVar69";
                    s.usePlugins = false;
                    var override = new Object();
                    override.events = "event78";
                    override.eVar69 =name + '_portable_valuablees';
                    s.tl(this, 'o', name + '_portable_valuablees is selected', override);
                    s.usePlugins = true;
                },radio_yes);
            }
        }
        if(/in:sun:secapp:home\w+:quote:quote_completed/i.test(s.pageName))
        {
            ids=['accidentalDamage','safetyNetCover','hasMotorBurnout','petInjuryCover'];
            for(id in ids)
            {
                checkbox=document.getElementById(ids[id]);
                if(checkbox)
                {
                    d.attachEvent('click',function(){
                        if(this.checked)
                        {
                            product_name = s.pageName.split(':')[3].split('_')[0];
                            name=d.getInnerText(this.parentElement.parentElement);
                            name=name.toLowerCase().replace(/\s+/gi,'-')
                            s.linkTrackEvents = "event78";
                            s.linkTrackVars = "eVar69";
                            s.usePlugins = false;
                            var override = new Object();
                            override.events = "event78";
                            override.eVar69 =product_name + '_' + name;
                            s.tl(this, 'o', product_name + '_' + name, override);
                            s.usePlugins = true;

                        }
                    },checkbox);
                }
            }
        }

        if(/in:sun:secapp:home\w+:quote:contents_cover/i.test(s.pageName) )
        {
            radio_yes = document.getElementById('hasPersonalValuables1');
            radio_yes = radio_yes.parentElement.childNodes[1];
            if (radio_yes) {
                name = s.pageName.split(':')[3].split('_')[0];
                d.attachEvent('click',function () {
                    s.linkTrackEvents = "event78";
                    s.linkTrackVars = "eVar69";
                    s.usePlugins = false;
                    var override = new Object();
                    override.events = "event78";
                    override.eVar69 = name + '_portable_valuables';
                    s.tl(this, 'o', name + '_portable_valuables is selected', override);
                    s.usePlugins = true;
                },radio_yes);
            }
        }

//        if(s.getPageName() == 'in:sun:insurance:car:comprehensive')
//        {
//            links = document.getElementsByClassName('popover-marker')
//            if(links)
//            {
//                for(i = 5;i < links.length;i++)
//                {
//                    link = links[i];
//                    d.attachEvent('click',function(){
//                        text= d.getTxtWhinNchar(d.getInnerText(this),26);
//                        s.linkTrackVars = "prop8";
//                        s.usePlugins = false;
//                        var override = new Object();
//                        override.prop8 ='car_' + text;
//                        s.tl(this, 'o', 'car_' + text, override);
//                        s.usePlugins = true;
//                    },link);
//                }
//            }
//        }
//        if(s.getPageName() == 'in:sun:insurance:car')
//        {
//            setTimeout(function() {
//                button_findmore = document.getElementsByClassName('button-image')[0];
//                if(button_findmore)
//                {
//                    d.attachEvent('click', function(){
//                        s.linkTrackVars = "prop8";
//                        s.usePlugins = false;
//                        var override = new Object();
//                        override.prop8 ='car_find-more';
//                        s.tl(this, 'o', 'car_find-more', override);
//                        s.usePlugins = true;
//                    },button_findmore);
//                }
//            }, 1000);
//        }
//        if(/in:ami:secapp:sales:motor:quote:quote_completed/i.test(s.pageName))
//        {
//            ids=['windScreen','hireCarUnlimited','roadsideAssistance'];
//            for(id in ids)
//            {
//                checkbox=document.getElementById(ids[id]);
//                if(checkbox)
//                {
//
//                    d.attachEvent('click',function(){
//                        if(this.checked)
//                        {
//                            product_name = s.pageName.split(':')[4];
//                            name=d.getInnerText(this.parentElement.parentElement);
//                            name=name.toLowerCase().replace(/\s+/gi,'-');
//                            s.linkTrackEvents = "event78";
//                            s.linkTrackVars = "eVar69";
//                            s.usePlugins = false;
//                            var override = new Object();
//                            override.events = "event78";
//                            override.eVar69 =product_name + '_' + name;
//                            s.tl(this, 'o', product_name + '_' + name, override);
//                            s.usePlugins = true;
//
//                        }
//                    },checkbox);
//                }
//            }
//            thirdpartcheckbox=document.getElementById('thirdPartyFireTheft');
//            if(thirdpartcheckbox)
//            {
//                d.attachEvent('click',function(){
//                    if(this.checked)
//                    {
//                        product_name = s.pageName.split(':')[4];
//                        name=d.getInnerText(this.parentElement.parentElement);
//                        name=name.toLowerCase().replace(/\s+/gi,'-');
//                        s.linkTrackEvents = "event78";
//                        s.linkTrackVars = "eVar69";
//                        s.usePlugins = false;
//                        var override = new Object();
//                        override.events = "event78";
//                        override.eVar69 =product_name + '_' + name;
//                        s.tl(this, 'o', product_name + '_' + name, override);
//                        s.usePlugins = true;
//
//                    }
//                },thirdpartcheckbox);
//            }
//            paylinks = document.getElementsByClassName('alternate-price-link switchToComprehensive');
//            if(paylinks)
//            {
//                for(link in paylinks)
//                {
//                    d.attachEvent('click',function(){
//                        product_name = s.pageName.split(':')[4];
//                        name=d.getInnerText(this);
//                        name=name.toLowerCase().replace(/\s+/gi,'-');
//                        s.linkTrackEvents = "event78";
//                        s.linkTrackVars = "eVar69";
//                        s.usePlugins = false;
//                        var override = new Object();
//                        override.events = "event78";
//                        override.eVar69 =product_name + '_' + name;
//                        s.tl(this, 'o', product_name + '_' + name, override);
//                        s.usePlugins = true;
//                    },paylinks[link]);
//                }
//            }
//
//        }
//
//
//        if(s.pageName.indexOf('in:ami:secapp:sales:home:quote') > -1)
//        {
//            if(scEventExists('event8'))
//            {
//                select=document.getElementById('previousInsurer')
//                if(select)
//                {
//                    d.attachEvent('change', function () {
//                        select = document.getElementById('previousInsurer');
//                        if (select.selectedIndex != 0) {
//                            s.getAndPersistValue(select[select.selectedIndex].text,"ami_home_previous");
//                        }
//                    });
//
//                }
//            }
//            else
//            {
//                previous= s.c_r("ami_home_previous");
//                if(previous)
//                {
//                    s.eVar21 = previous;
//                    s.prop23 = s.eVar21;
//                }
//            }
//        }
//
//        if(/in:sun:secapp:motor:quote:quote_completed/i.test(s.pageName))
//        {
//            ids = ['windScreen','hireCarLimited','winScreenHireCarUnlimitedBundle'];
//            for(id in ids)
//            {
//                checkbox = document.getElementById(ids[id]);
//                if(checkbox)
//                {
//                    d.attachEvent('click',function(){
//                        if(this.checked)
//                        {
//                            product_name = s.pageName.split(':')[3];
//                            name = d.getInnerText(this.parentElement.parentElement);
//                            name = name.toLowerCase().replace(/\s+/gi,'-');
//                            s.linkTrackEvents = "event78";
//                            s.linkTrackVars = "eVar69";
//                            s.usePlugins = false;
//                            var override = new Object();
//                            override.events = "event78";
//                            override.eVar69 =product_name + '_' + name;
//                            s.tl(this, 'o', product_name + '_' + name, override);
//                            s.usePlugins = true;
//
//                        }
//                    },checkbox);
//                }
//            }
//            thirdpartcheckbox = document.getElementById('thirdPartyFireTheft');
//            if(thirdpartcheckbox)
//            {
//                d.attachEvent('click',function(){
//                    if(this.checked)
//                    {
//                        product_name = s.pageName.split(':')[3];
//                        name=d.getInnerText(this.parentElement.parentElement);
//                        name=name.toLowerCase().replace(/\s+/gi,'-');
//                        s.linkTrackEvents = "event78";
//                        s.linkTrackVars = "eVar69";
//                        s.usePlugins = false;
//                        var override = new Object();
//                        override.events = "event78";
//                        override.eVar69 =product_name + '_' + name;
//                        s.tl(this, 'o', product_name + '_' + name, override);
//                        s.usePlugins = true;
//
//                    }
//                },thirdpartcheckbox);
//            }
//            paylinks = document.getElementsByClassName('alternate-price-link switchToComprehensive');
//            if(paylinks)
//            {
//                for(link in paylinks)
//                {
//                    d.attachEvent('click',function(){
//                        product_name = s.pageName.split(':')[3];
//                        name=d.getInnerText(this);
//                        name=name.toLowerCase().replace(/\s+/gi,'-');
//                        s.linkTrackEvents = "event78";
//                        s.linkTrackVars = "eVar69";
//                        s.usePlugins = false;
//                        var override = new Object();
//                        override.events = "event78";
//                        override.eVar69 =product_name + '_' + name;
//                        s.tl(this, 'o', product_name + '_' + name, override);
//                        s.usePlugins = true;
//                    },paylinks[link]);
//                }
//            }
//        }
//        if (s.getPageName() == 'in:ami:car-insurance') {
//            links = document.links;
//            for (link in links) {
//                txt = d.getInnerText(links[link]);
//                if (txt.indexOf('Find out more') > -1 || txt.indexOf('Compare Car Insurance policies') > -1) {
//                    d.attachEvent('click',function(){
//                        text= d.getTxtWhinNchar(d.getInnerText(this),26);
//                        s.linkTrackVars = "prop8";
//                        s.usePlugins = false;
//                        var override = new Object();
//                        override.prop8 ='car_' + text;
////                        s.tl(this, 'o', 'car_' + text, override);
//                        s.usePlugins = true;
//                    },links[link]);
//                }
//
//            }
//        }
//
//        if (s.getPageName() == 'in:ami:car-insurance:comprehensive-car-insurance') {
//            links = document.links;
//            for (link = 17; link < 46; link++) {
//                d.attachEvent('click', function () {
//                    text = d.getTxtWhinNchar(d.getInnerText(this), 26);
//                    s.linkTrackVars = "prop8";
//                    s.usePlugins = false;
//                    var override = new Object();
//                    override.prop8 = 'car_' + text;
////                    s.tl(this, 'o', 'car_' + text, override);
//                    s.usePlugins = true;
//                }, links[link]);
//            }
//
//        }
//        if (s.getPageName() == 'in:ami:home-insurance:comparison') {
//            links = document.links;
//            for (link in links) {
//                url = links[link].href;
//                if (url) {
//                    if (url.indexOf('javascript:void(0)') > -1) {
//                        d.attachEvent('click', function () {
//                            text = d.getTxtWhinNchar(d.getInnerText(this), 26);
//                            s.linkTrackVars = "prop8";
//                            s.usePlugins = false;
//                            var override = new Object();
//                            override.prop8 = 'home_' + text;
////                            s.tl(this, 'o', 'home_' + text, override);
//                            s.usePlugins = true;
//                        }, links[link]);
//                    }
//                }
//            }
//        }
//        if(s.getPageName() == 'in:ami:home-insurance:landlord-insurance')
//        {
//            links = document.links;
//            for (link in links) {
//                url = links[link].href;
//                if (url) {
//                    if (url.indexOf('javascript:void(0)') > -1) {
//                        d.attachEvent('click', function () {
//                            text = d.getTxtWhinNchar(d.getInnerText(this), 26);
//                            s.linkTrackVars = "prop8";
//                            s.usePlugins = false;
//                            var override = new Object();
//                            override.prop8 = 'home_' + text;
////                            s.tl(this, 'o', 'home_' + text, override);
//                            s.usePlugins = true;
//                        }, links[link]);
//                    }
//                }
//            }
//        }
//
//        if(s.getPageName() == 'in:ami:home-insurance:landlord-contents-insurance')
//        {
//            links = document.links;
//            for (link in links) {
//                url = links[link].href;
//                if (url) {
//                    if (url.indexOf('javascript:void(0)') > -1) {
//                        d.attachEvent('click', function () {
//                            text = d.getTxtWhinNchar(d.getInnerText(this), 26);
//                            s.linkTrackVars = "prop8";
//                            s.usePlugins = false;
//                            var override = new Object();
//                            override.prop8 = 'home_' + text;
////                            s.tl(this, 'o', 'home_' + text, override);
//                            s.usePlugins = true;
//                        }, links[link]);
//                    }
//                }
//            }
//            clickme=document.getElementById('click-me-to-slow-scroll');
//            d.attachEvent('click', function () {
//                text = d.getTxtWhinNchar(d.getInnerText(this), 26);
//                s.linkTrackVars = "prop8";
//                s.usePlugins = false;
//                var override = new Object();
//                override.prop8 = 'home_' + text;
////                s.tl(this, 'o', 'home_' + text, override);
//                s.usePlugins = true;
//            }, clickme);
//        }
//        if(s.getPageName() == 'in:sun:insurance:home')
//        {
//            propers = document.getElementsByClassName('popover-marker');
//            for (link in propers) {
//                d.attachEvent('click', function () {
//                    text = d.getTxtWhinNchar(d.getInnerText(this), 26);
//                    s.linkTrackVars = "prop8";
//                    s.usePlugins = false;
//                    var override = new Object();
//                    override.prop8 = 'home_' + text;
////                    s.tl(this, 'o', 'home_' + text, override);
//                    s.usePlugins = true;
//                }, propers[link]);
//            }
//            bnts = document.getElementsByClassName('button-image');
//            for(link in bnts)
//            {
//                txt = d.getInnerText(links[link]);
//                if (txt.indexOf('Find out more') > -1) {
//                    d.attachEvent('click',function(){
//                        text= d.getTxtWhinNchar(d.getInnerText(this),26);
//                        s.linkTrackVars = "prop8";
//                        s.usePlugins = false;
//                        var override = new Object();
//                        override.prop8 ='car_' + text;
////                        s.tl(this, 'o', 'car_' + text, override);
//                        s.usePlugins = true;
//                    },bnts[link]);
//                }
//            }
//            links = document.links;
//            for (link = 31; link < 39; link++) {
//                d.attachEvent('click', function () {
//                    text = d.getTxtWhinNchar(d.getInnerText(this), 26);
//                    s.linkTrackVars = "prop8";
//                    s.usePlugins = false;
//                    var override = new Object();
//                    override.prop8 = 'car_' + text;
////                    s.tl(this, 'o', 'car_' + text, override);
//                    s.usePlugins = true;
//                }, links[link]);
//            }
//        }
//        if(s.getPageName() == 'in:sun:insurance:home-contents')
//        {
//            links = document.getElementsByClassName('popover-marker');
//            for (link=0;link < links.length-1;link ++) {
//                d.attachEvent('click', function () {
//                    text = d.getTxtWhinNchar(d.getInnerText(this), 26);
//                    s.linkTrackVars = "prop8";
//                    s.usePlugins = false;
//                    var override = new Object();
//                    override.prop8 = 'car_' + text;
////                    s.tl(this, 'o', 'car_' + text, override);
//                    s.usePlugins = true;
//                }, links[link]);
//            }
//            links = document.links;
//            for (link = 32; link < 40; link++) {
//                d.attachEvent('click', function () {
//                    text = d.getTxtWhinNchar(d.getInnerText(this), 26);
//                    s.linkTrackVars = "prop8";
//                    s.usePlugins = false;
//                    var override = new Object();
//                    override.prop8 = 'car_' + text;
////                    s.tl(this, 'o', 'car_' + text, override);
//                    s.usePlugins = true;
//                }, links[link]);
//            }
//        }
//        if(s.getPageName() == 'in:sun:insurance:home-building')
//        {
//            links = document.getElementsByClassName('popover-marker');
//            for (link=0;link < links-1;link ++) {
//                d.attachEvent('click', function () {
//                    text = d.getTxtWhinNchar(d.getInnerText(this), 26);
//                    s.linkTrackVars = "prop8";
//                    s.usePlugins = false;
//                    var override = new Object();
//                    override.prop8 = 'car_' + text;
////                    s.tl(this, 'o', 'car_' + text, override);
//                    s.usePlugins = true;
//                }, links[link]);
//            }
//            links = document.links;
//            for (link = 28; link < 36; link++) {
//                d.attachEvent('click', function () {
//                    text = d.getTxtWhinNchar(d.getInnerText(this), 26);
//                    s.linkTrackVars = "prop8";
//                    s.usePlugins = false;
//                    var override = new Object();
//                    override.prop8 = 'car_' + text;
////                    s.tl(this, 'o', 'car_' + text, override);
//                    s.usePlugins = true;
//                }, links[link]);
//            }
//        }
//        if(s.getPageName() == 'in:sun:insurance:home:contents')
//        {
//            links = document.getElementsByClassName('popover-marker');
//            for (link=0;link < links.length;link ++) {
//                d.attachEvent('click', function () {
//                    text = d.getTxtWhinNchar(d.getInnerText(this), 26);
//                    s.linkTrackVars = "prop8";
//                    s.usePlugins = false;
//                    var override = new Object();
//                    override.prop8 = 'car_' + text;
////                    s.tl(this, 'o', 'car_' + text, override);
//                    s.usePlugins = true;
//                }, links[link]);
//            }
//            links = document.links;
//            for (link = 32; link < 40; link++) {
//                d.attachEvent('click', function () {
//                    text = d.getTxtWhinNchar(d.getInnerText(this), 26);
//                    s.linkTrackVars = "prop8";
//                    s.usePlugins = false;
//                    var override = new Object();
//                    override.prop8 = 'car_' + text;
////                    s.tl(this, 'o', 'car_' + text, override);
//                    s.usePlugins = true;
//                }, links[link]);
//            }
//        }
//        if(s.getPageName == 'in:sun:insurance:landlord')
//        {
//            link = document.links[35];
//            d.attachEvent('click', function () {
//                text = d.getTxtWhinNchar(d.getInnerText(this), 26);
//                s.linkTrackVars = "prop8";
//                s.usePlugins = false;
//                var override = new Object();
//                override.prop8 = 'car_' + text;
////                s.tl(this, 'o', 'car_' + text, override);
//                s.usePlugins = true;
//            }, link)
//
//        }
    }
};

/* DATACOLLECTOR: CONFIG */
var superT = {};

/* Configuration section */
superT.search = '';
superT.social = '';
superT.campaignQueryParameter = 'cmpid';
superT.brandKeywords = ['suncorp'];
superT.company = 'suncorp';
superT.project = 'purchase_path';
superT.platform = 'datacollector-v1';
superT.sites = ['suncorp.com.au'];
superT.dcV2 = superT.dcV2 || {};

/* DATACOLLECTOR: GLOBAL FUNCTIONS */
 superT.dcV2 = superT.dcV2 || {};
superT.contains=function(e,t){var n,r;for(n=0,r=e.length;n<r;n++){if(e[n]===t){return true}}return false};superT.getExpiryDate=function(e,t){var n=null,r;if(typeof e==="string"){parsedArgDate=parseFloat(e);if(isNaN(parsedArgDate)){n=null}else{r=parsedArgDate}}else{if(typeof e==="number"||typeof e==="float"){r=e}else{if(typeof e==="undefined"){n=null}}}if(typeof r!="undefined"&&r!==null){if(!t){var t=new Date}n=new Date(t.getTime()+r*1440*6e4)}return n};superT.getCookie=function(e,t){var n=new RegExp(e+"=([^;]+)",t);var r=n.exec(document.cookie||"");return r&&unescape(r[1])||""};superT.getHost=function(e){e=e||window.location.href;if(e.indexOf("javascript:")==0){return""}if(e.indexOf("#")==0){return""}if(e.indexOf("://")>=0){e=e.substring(e.indexOf("://")+3,e.length)}if(e.indexOf("/")>=0){e=e.substring(0,e.indexOf("/"))}if(e.indexOf("?")>=0){e=e.substring(0,e.indexOf("?"))}if(e.indexOf(":")>=0){e=e.substring(0,e.indexOf(":"))}return e};superT.setCookieOnParentDomain=function(e,t,n,r){var r=r||document.domain;var i="";var s=r.split(".");s=s.reverse();for(var o=0;o<s.length;o++){if(typeof s[o]!="undefined"){i="."+s[o]+i;superT.setCookie("superT_te","t","",i);var u=superT.getCookie("superT_te");superT.setCookie("superT_te","t","-1",i);if(u!=""){superT.setCookie(e,t,n,i);break}}}};superT.setCookie=function(e,t,n,r){var i="";r=r||"."+superT.replaceAll(superT.getHost(window.location.href.toLowerCase()),"www.","");if(n instanceof Date){expireDate=n}else{expireDate=superT.getExpiryDate(n)}i+=e+"="+escape(t);if(r){i+=";domain="+r}i+=";path=/"+(expireDate===null?"":";expires="+expireDate.toGMTString());document.cookie=i};superT.replaceAll=function(e,t,n){var r=new RegExp((t+"").replace(/[.?*+^$[\]\\\/(){}|-]/g,"\\$&"),"g");return(e||"").replace(r,n||"")};superT.Object={each:function(e,t,n){for(var r in e){if("function"===typeof e.hasOwnProperty&&e.hasOwnProperty(r)){if(t.call(n||e,r,e[r],e)===false){return}}}}};superT.trim=function(e){if(e!==undefined&&e!==null&&typeof e==="string"){return e.replace(/^\s+|\s+$/g,"")}return e};var JSON;JSON||(JSON={test:"yes"}),function(){function f(e){return e<10?"0"+e:e}function quote(e){return escapable.lastIndex=0,escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t=="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];a&&typeof a=="object"&&typeof a.toJSON=="function"&&(a=a.toJSON(e)),typeof rep=="function"&&(a=rep.call(t,e,a));switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a){return"null"}gap+=indent,u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1){u[n]=str(n,a)||"null"}return i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]",gap=o,i}if(rep&&typeof rep=="object"){s=rep.length;for(n=0;n<s;n+=1){typeof rep[n]=="string"&&(r=rep[n],i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i))}}else{for(r in a){Object.prototype.hasOwnProperty.call(a,r)&&(i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i))}}return i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}",gap=o,i}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(e){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(e){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","  ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(e,t,n){var r;gap="",indent="";if(typeof n=="number"){for(r=0;r<n;r+=1){indent+=" "}}else{typeof n=="string"&&(indent=n)}rep=t;if(!t||typeof t=="function"||typeof t=="object"&&typeof t.length=="number"){return str("",{"":e})}throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i=="object"){for(n in i){Object.prototype.hasOwnProperty.call(i,n)&&(r=walk(i,n),r!==undefined?i[n]=r:delete i[n])}}return reviver.call(e,t,i)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")})}();superT.JSON=JSON;superT.bind=function(e,t,n,r){if(e!==undefined&&e!==null){var i=e.tagName||"";if(i.toLowerCase()!=="script"&&"load"===t&&true===superT.isReady){n()}else{if(e.addEventListener){r=r||false;e.addEventListener(t,n,r)}else{if(e.attachEvent){e.attachEvent("on"+t,function(){n.call(event.srcElement,event)})}}}}};superT.gqp=function(e,t){var n="";if(e!==undefined&&e!==null){e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");t=t||window.location.href;var r="[\\?&]"+e+"=([^&#]*)";var i=new RegExp(r);var s=i.exec(t);if(s!==null){n=s[1]}}return n};superT.apply=function(e,t,n){if(n){superT.apply(e,n)}if(e&&typeof t==="object"){for(var r in t){e[r]=t[r]}}return e};superT.Array={each:function(e,t,n,r){var i,s=e.length;if(r!==true){for(i=0;i<s;i++){if(t.call(n||e[i],e[i],i,e)===false){return i}}}else{for(i=s-1;i>-1;i--){if(t.call(n||e[i],e[i],i,e)===false){return i}}}return true},contains:function(e,t){var n,r;for(n=0,r=e.length;n<r;n++){if(e[n]===t){return true}}return false},isArray:function(e){return Object.prototype.toString.call(e)==="[object Array]"},isIterable:function(e){var t=Object.prototype.toString.call(e);return t==="[object Array]"||t==="[object HTMLCollection]"||t==="[object NodeList]"}};superT.apply(superT,{text:function(e,t){var n=this,r="";t=typeof t==="undefined"?" | ":t;if(typeof e==="string"){elems=superT.selectMultiple(e);superT.Array.each(elems,function(e,n){r+=superT.text(e,t)+t});r=r.substr(0,r.length-2)}else{var i=e}if(r.length===0&&i!==undefined&&i!==null){if(i.nodeType==3||i.nodeType==4){r+=i.nodeValue}else{if(i.nodeType!=8){if(i.nodeName==="INPUT"&&i.type==="text"){r+=i.value}else{if(i.nodeName==="SELECT"){var s=i.options[i.selectedIndex];if(s){r+=s.text}}else{for(var o=0;o<i.childNodes.length;++o){r+=superT.text(i.childNodes[o])}}}}}}return superT.trim(r)},genId:function(){var e=(new Date).getTime(),t=Math.floor(Math.random()*1e6),n=e+"."+t;return n},campaignQueryParameter:""});superT.apply(superT,{an:{co:superT.company,pr:superT.project,lt:superT.liveTesting,cv:function(){if(superT.liveTesting===true){return superT.version+"-test"}else{return superT.version}}(),ru:document.referrer,d1:"",d2:"",d3:"",st:"",cc:function(){var e="";superT.Array.each(superT.campaignQueryParameter.split(","),function(t){var n=superT.gqp(superT.trim(t));if(""!==n){e+=t+":"+n+","}});if(e!==""){e=e.substring(0,e.length-1)}return e}(),tags:[],containers:[],rules:[],mtm:{},sr:function(){var e="";superT.Object.each(window.screen,function(t,n){e+=t+":"+n+","});return e.substring(0,e.length-1).toLowerCase()}(),ssb:function(e){if(e!==undefined&&e!==null&&e!==""){e=e.replace(/(\s+)/g,"-").replace(/[^0-9a-zA-Z_\-\.]/g,"").toLowerCase()}return e},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)}},soca:{hasPerformed:false,isSearchEngine:function(e){return RegExp(superT.search.replace(/:[^,]+/g,"").replace(/,/g,"|")).test(e.toLowerCase())},getSearchKeyword:function(e){var t="",n=superT.getHost(e),r=superT.search.split(","),i;for(i=0;i<r.length;i++){var s=r[i].split(":")[0];var o=r[i].split(":")[1];if(n.indexOf(s)>=0){if(!t||t==="-na-"){t=unescape(superT.gqp(o,e))}if(!t){t="-na-"}}}return t},getSocialMediaDomain:function(e){var t="";var n=superT.social.split(",");for(i=0;i<n.length;i++){if(superT.getHost(e).indexOf(n[i])>=0){t=n[i]}}return t},perform:function(e,t){if(this.hasPerformed){return}this.hasPerformed=true;e=typeof e!=="undefined"?e:document.referrer;t=t||window.location.href;var n=superT.campaignQueryParameter.split(","),r=superT.replaceAll(superT.getHost(e).toLowerCase(),"www.",""),i=superT.replaceAll(superT.getHost(t).toLowerCase(),"www.",""),s=[],o="",u="",a;superT.source=superT.channel=superT.channelTop="";superT.campaign=superT.st="";u=this.getSearchKeyword(e);for(a=0;a<n.length;a++){if(superT.gqp(superT.trim(n[a]),t)){s.push(superT.gqp(superT.trim(n[a]),t))}}n=s.join(",");superT.campaign=n;if(e){if(this.isSearchEngine(r)){o=n?"sem":"seo";var f=":g";superT.Array.each(superT.brandKeywords,function(e){if(RegExp(e,"i").test(u)){f=":b"}});superT.channelTop=o+(u==="-na-"?"":f);superT.channel=superT.channelTop+":"+r;superT.st=u||"";superT.source=superT.channel+(n&&":"+n)}else{if(r!==i){switch(true){case!!this.getSocialMediaDomain(e):o="soc";break;case superT.contains(superT.sites,r):o="int";break;default:o="ext"}superT.source=superT.channel=o+":"+r;superT.channelTop=o}}}else{if(n){superT.source=superT.channel=superT.channelTop=n;superT.st=u||""}else{superT.source=superT.channel=superT.channelTop="dir"}}superT.an.st=superT.st}}});superT.an.ca="";(function(e){var t="superT_v1",n="superT_s1",r=.5*(1/24),i=function(){return e.getCookie(t)},s=function(n,r,i,s){e.setCookieOnParentDomain(t,n+":"+r+":"+i+":"+s,365)},o=function(){return e.getCookie(n)},u=function(){e.setCookieOnParentDomain(n,e.genId(),r)},a=function(){e.setCookieOnParentDomain(n,o(),r)},f=function(){return""===i()}(),l=function(){return""===o()}();if(f){e.an.nr="new";e.an.id=e.genId();e.an.vi=1;e.an.pa=1;e.an.pv=1;s(e.an.id,1,1,1);u()}else{e.an.nr="repeat";var c=i().split(":"),h=c[0],p=c[1],d=c[2],v=c[3];if(l){u();typeof p!=="undefined"?p++:p=1;d=0}else{a()}typeof d!=="undefined"?d++:d=1;typeof v!=="undefined"?v++:v=1;e.an.id=h;e.an.vi=p;e.an.pv=d;e.an.pa=v;s(e.an.id,p,d,v)}e.an.vc=o();e.path=[];if(window.location.pathname.length>3){e.path=window.location.pathname.split("/");e.an.d1=e.path[1]=e.an.ssb(e.path[1]);e.an.d2=e.path[2]=e.an.ssb(e.path[2]);e.an.d3=e.path[3]=e.an.ssb(e.path[3])}e.apply(e.an,{st:e.st,tz:function(){return-(new Date).getTimezoneOffset()}(),fh:function(){return(new Date).getHours()}(),pu:window.location.href,xr:e.genId()})})(superT);superT.apply(superT,{company:superT.company,project:superT.project,getCampaign:function(e,t){superT.soca.perform(e,t);return superT.campaign}});superT.getCampaign();superT.dcV2.systemParams={"cc.co":superT.company,"cc.pr":superT.project,"cs.ch":"website","e.id":document.location.href,"e.ty":"page|view","eo.id":document.referrer,"s.id":superT.an.vc,"ps.id":superT.an.nr,"pic.s1":superT.an.id};superT.Object={each:function(e,t,n){for(var r in e){if("function"===typeof e.hasOwnProperty&&e.hasOwnProperty(r)){if(t.call(n||e,r,e[r],e)===false){return}}}}};var reqCounter=0;superT.buildURLVal=function(e){switch(typeof e){case"function":try{return superT.buildURLVal(e())}catch(t){}break;case"string":case"number":return encodeURIComponent(e);case"boolean":return e?"1":"0"}};superT.buildUri=function(e,t){if(typeof e!=="string"){return""}var n=function(e){var t=e.charAt(e.length-1);return t==="?"||t==="&"?e:e.indexOf("?")===-1?e+="?":e+="&"};e=n(e);superT.Object.each(t,function(t,r){var i=superT.buildURLVal(r);if(typeof i==="string"){e=n(e+encodeURIComponent(t)+"="+i)}});return e.substring(0,e.length-1)};var _highestDomain="";superT.getTopDomain=function(){if(!_highestDomain){var e=document.domain,t=e.split("."),n=t.length,r="",i;while(n--){if(typeof t[n]!="undefined"){r="."+t[n]+r;document.cookie="superT_te=1; domain="+r;i=document.cookie.match(/superT_te=1;?/)!==null;document.cookie="superT_te=; domain="+r+"; expires="+new Date(0);if(i){_highestDomain=r;break}}}}return _highestDomain};superT.dcV2.triggerDataCollector=function(e,t,n){var n=n||{};if(typeof n.re==="undefined"&&t){n.re=t.type}var r={};superT.apply(r,n,superT.dcV2.systemParams);superT.allParams=r;var i=superT.buildUri(e,r);(new Image).src=i;if(i.length<2e3){(new Image).src=i}else{var s={};s["cc.co"]=superT.allParams["cc.co"];s["cc.pr"]=superT.allParams["cc.pr"];s["e.id"]=superT.allParams["e.id"];s["e.ty"]=superT.allParams["e.ty"];s["s.id"]=superT.allParams["s.id"];s["eo.id"]=superT.allParams["eo.id"];s["pic.s1"]=superT.allParams["pic.s1"];s["so.at"]=superT.allParams["so.at"];s["e.u1"]=superT.allParams["e.u1"];s["e.u2"]=superT.allParams["e.u2"];var i=superT.buildUri(e,s);if(i.length<2e3){(new Image).src=i}}return i}

/* DATACOLLECTOR: FUNCTION TO FIRE PIXEL */
d.triggerDataCollectorAdserver = function(conversion, event, premium, eVar61, eventType) {
    d.dc2Params = {};
    d.dc2Params = {
    	"pic.e1": superT.getCookie('superT_e1'),
        "cc.pr": superT.project,
        "cc.co": superT.company,
        "e.id": document.location.href,
        "eo.id": document.referrer,
        "so.at": s.eVar61,
        "so.ca": s.campaign,
        "so.intca": s.eVar2,
        "e.u1": event || '',
        "e.u2": premium || ''
    };

    if (conversion == true) {
        cat1 = s.prop2 || '';
        if (s.prop2 == 'in') {
            cat1 = 'insurance';
        }
        if (s.prop2 == 'bk') {
            cat1 = 'banking';
        }

        if (premium == '0') {
        	var value = s.eVar30 || premium;
        } else {
        	var value = premium;
        }

        var product = '';
        if(s.products) {
           var product = s.products.split(';')[1];
        }
        prMA = product || s.eVar48 || s.prop48 || '';
        d.dc2Params['e.ty'] = 'page|conversion|' + eventType;
        d.dc2Params['et.id'] = s.eVar22 || s.eVar23;
        d.dc2Params['et.va'] = value;
        d.dc2Params['et.pa'] = s.eVar28;
        d.dc2Params['et.km'] = s.eVar57;
        d.dc2Params['et.prin'] = s.eVar21;
        d.dc2Params['etp.n1.na'] = prMA;
        d.dc2Params['etp.n1.pr'] = value;
        d.dc2Params['etp.n1.ca'] = cat1 + '|' + s.un + '|' + prMA;
        d.dc2Params['etp.n1.te'] = s.eVar24;
        d.dc2Params['p.ge'] = s.eVar11;
        d.dc2Params['p.ag'] = s.eVar10;
        d.dc2Params['pl.pc'] = s.eVar12;
    }

    superT.dcV2.triggerDataCollector('//dc-c97c.optimahub.com', typeof e != 'undefined' ? e : undefined, d.dc2Params);
}

//Set varaible that contains document.referrer OR the original referrer based on URL. Fix for Test & Target
d.ref = document.referrer;
if (document.location.href.indexOf('s_tnt=') < 0) {
    d.setCookie('_rr', document.referrer);
}

if (document.location.href.indexOf('s_tnt=') > -1) {
    d.ref = d.getCookie('_rr');
}
