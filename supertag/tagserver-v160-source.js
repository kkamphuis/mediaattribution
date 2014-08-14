/** DownStream Tags Support Functions **/
d.downStreamStack = new Array();
d.downStreamTag = function(event_type, event_properties, segment, search_segment, userid, pixel_host) {
	if(event_properties.indexOf('ev_transid') == -1){
		if(scEventExists('event9')){
			if(scGetProducts() == 'ami_business'){
				event_properties += "&ev_transid=" + s.eVar26;
			} else{
				event_properties += "&ev_transid=" + s.eVar22;
			}
		}else if(scEventExists('event18')){
			if(scGetProducts() == 'ami_business'){
				event_properties += "&ev_transid=" + s.eVar26;
			} else{
				event_properties +=  "&ev_transid=" + s.eVar23;
			}
		}
	}
	pixel_host = typeof(pixel_host) != 'undefined' ? pixel_host : "pixel.everesttech.net";
	d.downStreamStack.push([event_type, event_properties, segment, search_segment, userid, pixel_host]);
};
d.downStreamOnClick = function(props){
    var i = new Image();
    i.src = '//pixel.everesttech.net/2243/t?' + props;
};

d.downStreamLoading = false;
d.downStreamTrigger = function() {
	if(typeof effp == 'function') {
		for(i = 0; i < d.downStreamStack.length; i++) {
			ef_event_type = d.downStreamStack[i][0];
			if(ef_event_type == "transaction") ef_transaction_properties = d.downStreamStack[i][1];
			if(ef_event_type == "pageview") ef_pageview_properties = d.downStreamStack[i][1];
			ef_segment = d.downStreamStack[i][2];
			ef_search_segment = d.downStreamStack[i][3];
			ef_userid = d.downStreamStack[i][4];
			ef_pixel_host = d.downStreamStack[i][5];
			ef_fb_is_app = 0;
			effp();
		}
		d.downStreamStack = new Array();
		d.downStreamLoading = false;
	}
};

d.attachOnClick = function(theID, func) {
	elementID = document.getElementById(theID);
	if(elementID.addEventListener){
		elementID.addEventListener('click', func, false);
	} else {
		elementID.attachEvent('onclick', func);
	}
};

d.gAdService = function(id, language, format, color, label, value) {
	google_conversion_id = id;
	google_conversion_language = language;
	google_conversion_format = format;
	google_conversion_color = color;
	google_conversion_label = label;
	google_conversion_value = value;
	d.aInclude('//www.googleadservices.com/pagead/conversion.js');
	var imageURL = '//www.googleadservices.com/pagead/conversion/' + google_conversion_id + '/?label=' + google_conversion_label + '&guid=ON&script=0';
	var ad_img = new Image();
	ad_img.src = imageURL;
};

d.gRemarketing = function(id, label, params, remarketing_only) {
	d.aInclude('//www.googleadservices.com/pagead/conversion.js');
	var imageURL = '//googleads.g.doubleclick.net/pagead/viewthroughconversion/' + id + '/?value=0&label=' + label + '&guid=ON&script=0';
	var ad_img = new Image();
	ad_img.src = imageURL;
};

/** Image Tags Support Function **/
d.imageTag = function(url) {
	var ad_img = new Image();
	ad_img.src = url;
};
/** iFrame Tags Support Function **/
d.iframeTag = function(url) {
	var divTag = document.createElement("div");
	randomID = 'iframeTag' + Math.floor(Math.random() * 10000000000000);
	divTag.id = randomID;
	divTag.style.display = 'none';
	divTag.innerHTML = '<iframe src="' + url + '" width="1" height="1" frameborder="0"></iframe>';
	document.body.appendChild(divTag);
	var tagType = '';
	if(url.indexOf('type=custo866;cat=singl081') > -1) {
		tagType = '|ma';
	}
};

d.facebookTag = function(pixelId) {
	var _fbq = window._fbq || (window._fbq = []);
	d.aInclude('//connect.facebook.net/en_US/fbds.js', function() {
		_fbq.push(['addPixelId', pixelId]);
		window._fbq = window._fbq || [];
		window._fbq.push(['track', 'PixelInitialized', {}]);
	});
};


/** Mediamind Tag **/
d.mediamindTag = function(activityID, randomID){
    d.imageTag('//bs.serving-sys.com/Serving/ActivityServer.bs?cn=as&ActivityID='+ activityID + '&rnd=' + randomID);
};

/**
 * media attribution tag
 *
 * the adserver call has 5 parameters, we customize them to be the following format. Pipe is used as separator between the values one parameter:
 * u1 = s.un(report suite id with brand) + action (vs, qs, qe, bs, be) + product category + product + transaction id
 * u2 = revenue (only on quote end and buy end events )
 * u3 = source(eVar61) + keyword(eVar62) ( only on visit start call )
 * u4 = page url
 * u5 = referrer url ( only on visit start call )
 *
 **/

pString = '';
pCategory = '';
d.maTag = function() {
	try {
		var u1 = s.un;
		var u2 = '0';
		var u3 = '';
		var u4 = escape(document.location.href);
		var u5 = '';
        d.maTagFired = false;
		if(s.eVar48) pCategory = s.eVar48;
		if(s.products) pString = d.replaceAll(s.products, ';', ':');

		//specific issue when a application form links towards itself, setting onClick on submit button
		if(s.pageName == 'bk:sun:campaign:termdeposits' || s.pageName == 'bk:sun:campaign:great') {

			pString = 'termdeposits';
			u3 = s.eVar61;
			u5 = escape(document.referrer);
			// lead start adserver call
			u1 = u1 + '|ls|' + pCategory + '|' + pString;
			et = 'lead-start';
			d.triggerMA(u1, u2, u3, u4, u5, et);

			//attach click to submit button
			d.attachOnClick('edit-webform-ajax-submit-1018', function() {
				// lead complete adserver call
				u1 = s.un;
				u5 = '';
				u1 = u1 + '|lc|' + pCategory + '|' + pString;
				et = 'lead-complete';
				d.triggerMA(u1, u2, u3, u4, u5, et);
				return;
			});
		}

		if(s.eVar61 && s.pageName != 'in:cil:request-a-quote-confirmation') {
			// fire the landing page adserver call
			u1 = u1 + '|vs|' + pCategory + '|' + pString;
			et = 'visit';
			u3 = s.eVar61;
			if(s.eVar62) u3 = u3 + '|' + s.eVar62;
			u5 = escape(document.referrer);
			d.triggerMA(u1, u2, u3, u4, u5, et);
		}
		if(scEventExists('event3')) {
			// lead start adserver call
			u1 = u1 + '|ls|' + pCategory + '|' + pString;
			et = 'lead-start';
			d.triggerMA(u1, u2, u3, u4, u5, et);
			return;
		}
		if(scEventExists('event4')) {
			// lead complete adserver call
			u1 = u1 + '|lc|' + pCategory + '|' + pString;
			et = 'lead-complete';
			d.triggerMA(u1, u2, u3, u4, u5, et);
			d.triggerMA(u1, u2, u3, u4, u5);
			return;
		}
		if(scEventExists('event8')) {
			// quote start adserver call
			u1 = u1 + '|qs|' + pCategory + '|' + pString;
			et = 'quote-start';
			d.triggerMA(u1, u2, u3, u4, u5, et);
			if(s.products.indexOf('ctp') < 0 && s.un == setting.getEnv('sun')) {
				d.iframeTag('https://fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco371;ord=1;num=' + Math.floor(Math.random() * 11111111111) + '?'); // 1046484
			}
			return;
		}
		if(scEventExists('event9') || s.pageName == 'in:cil:request-a-quote-confirmation' || s.pageName == 'in:gio:business-insurance:quote-request:thank-you') {
			// quote end adserver call
			if(s.pageName == 'in:gio:business-insurance:quote-request:thank-you') pString = ':business';
			u1 = u1 + '|qe|' + pCategory + '|' + pString;
			et = 'quote-end';
			if(s.eVar22) u1 = u1 + '|' + s.eVar22;
			u2 = d.getAmount('event14');
			d.triggerMA(u1, u2, u3, u4, u5, et);
			if(s.products.indexOf('ctp') < 0 && s.un == setting.getEnv('sun')) {
				d.iframeTag('https://fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco543;ord=1;num=' + Math.floor(Math.random() * 11111111111) + '?'); // 1051728
			}
			return;
		}
		if(scEventExists('event17')) {
			// buy start adserver call
			u1 = u1 + '|bs|' + pCategory + '|' + pString;
			et = 'buy-start';
			d.triggerMA(u1, u2, u3, u4, u5, et);
			if(s.products.indexOf('ctp') < 0 && s.un == setting.getEnv('sun')) {
				d.iframeTag('https://fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco417;ord=1;num=' + Math.floor(Math.random() * 11111111111) + '?'); // 1046485
			}
			return;
		}
		if(scEventExists('event18')) {
			// buy end adserver call
			u1 = u1 + '|be|' + pCategory + '|' + pString;
			et = 'buy-end';
			if(s.eVar23) u1 = u1 + '|' + s.eVar23;
			u2 = d.getAmount('event19');
			d.triggerMA(u1, u2, u3, u4, u5, et);
			if(s.products.indexOf('ctp') < 0 && s.un == setting.getEnv('sun')) {
				d.iframeTag('https://fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco590;ord=1;num=' + Math.floor(Math.random() * 11111111111) + '?'); // 1046487
			}
		}
		if (scEventExists("event37")) {
			u1 = u1 + '|c2c|' + pCategory + '|' + pString;
			et = 'click-2-call';
			if(s.eVar23) u1 = u1 + '|' + s.eVar23;
			u2  = d.getAmount("event19");
			d.triggerMA(u1, u2, u3, u4, u5, et);
		}
		var maEvents = { // priority matters
			//clickToCall already in scode file
			callMe: {
				name: "cm",
				urls: [
					"aami.com.au/business-insurance/quote-request",
					"giopi.suncorp.com.au/mcc/immediateCallBackRequestInitialisation.do",
					"clicktofone.com/live/apia/request-call-successful.aspx",
					"clicktofone.com/custom/shannons/request-call-msg.aspx?e=suc"
				]
			},
			competitionEntries: {
				name: "ce",
				urls: [
					"luckyaami.com.au/wafl",
					"luckyaami.com.au/winter",
					//facebook.com/aami/app_169552879874546
					//facebook.com/aami/app_320847361374064
					"insurancepromotions.com.au/gio/caraq",
					"trustnsw.com.au",
					"insurancepromotions.com.au/bingle/smarttv",
					"shannons.com.au/pebblebeach/confirm/",
					"shannons.com.au/club/competition/",
					"cilpromotions.com.au/thanks.html",
					//facebook.com/justcar/app_460018357406966
					"insurancepromotions.com.au/apia/winerytour/thanks",
					"insurancepromotions.com.au/bingle/appleaday/thanks"
				]
			},
			renewals: {
				name: "rn",
				urls: [
					"aami.com.au/online-services?quicktabs_online_services=1",
					"cmpid=BIN:GI:PI:CAR:EDM:20130621:102&2473PSEM",
					"cmpid=BIN:GI:PI:CAR:EDM:20130621:101&2473PSEM",
					"cmpid=BIN:GI:PI:CAR:EDM:20130621:103&2473PSEM",
					"cmpid=BIN:GI:PI:CAR:EDM:20130715:122&2473PSEM",
					"cmpid=BIN:GI:PI:CAR:EDM:20130715:120&2473PSEM",
					"cmpid=BIN:GI:PI:CAR:EDM:20130715:119&2473PSEM",
					"cmpid=BIN:GI:PI:CAR:EDM:20130715:121&2473PSEM",
					"cmpid=BIN:GI:PI:CAR:EDM:20130715:123&2473PSEM",
					"cmpid=BIN:GI:PI:CAR:EDM::104&2473PSEM"
				]
			},
			cardActivation: {
				name: "ca",
				urls: [
					"cil.aussietravelsaver.com.au/Activate.aspx"
				]
			}
		};

		for(var event in maEvents) {
			for(var j = maEvents[event].urls.length; j-- ;) {
				if(window.location.href.indexOf(maEvents[event].urls[j]) > -1) {
					u1 = s.un + "|" + maEvents[event].name + "|" + pCategory + "|" + pString;
					et = maEvents[event].name;
					d.triggerMA(u1, u2, u3, u4, u5, et);
					break;
				}
			}
		}

	} catch(e) {
		// do nothing
	}
};

d.triggerMA = function(event, premium, eVar61, currentURL, previousURL, eventType) {
    d.urlMA = "https://fls.doubleclick.net/activityi;src=875382;type=custo866;cat=singl081;u1=" + event + ";u2=" + premium + ";u3=" + eVar61 + ";u4=" + currentURL + ";u5=" + previousURL + ";ord=" + Math.floor(Math.random() * 11111111111) + "?";
    d.iframeTag(d.urlMA);
    d.maTagFired = true;
    superT.setCrossDom(function() { d.triggerDataCollectorAdserver(true, event, premium, eVar61, eventType) });
};

d.bazaarvoiceTags = function(type) {
	var brand = d.shouldFireAgencyTagsFor('sun') ? 'suncorp' : 'gio';
	d.aInclude('//display.ugc.bazaarvoice.com/static/' + brand + '/en_AU/bvapi.js', function() {
		$BV.SI.trackConversion({
			"type" : type,
			"label" : scGetProducts(),
			"value": 1
		});
	});
};

d.shouldFireAgencyTagsFor = function(account) {
	var forceFireAgencyTags = (d.getSiteFromReportSuite(s.un) == account) && (d.CookieValue != '');
	return s.un == setting.getEnv(account) || forceFireAgencyTags;
};

d.fireAamiStarcomTag = function(type,cat,cachebuster) {
	d.iframeTag('//875382.fls.doubleclick.net/activityi;src=875382;type='+type+';cat='+cat+';ord=1;num=' + cachebuster + '?');
};

d.fireAamiStarcomQuoteCompleteTag = function(type,cat) {
	var premium = d.getAmount('event14');
    d.iframeTag('//875382.fls.doubleclick.net/activityi;src=875382;type='+type+';cat='+cat+';qty=1;cost='+premium+';ord='+s.eVar22+'?');
};

d.fireAamiStarcomPolicyCompleteTag = function(type,cat) {
	var premium = d.getAmount('event19');
    d.iframeTag('//875382.fls.doubleclick.net/activityi;src=875382;type='+type+';cat='+cat+';qty=1;cost='+premium+';ord='+s.eVar23+'?');
};

d.fireAamiAdlensQuoteCompleteTag = function(type) {
	var premium = d.getAmount('event14');
	d.downStreamTag("transaction", type+premium+'&ev_transid='+s.eVar22, "", "", "2243");
};

d.fireAamiAdlensPolicyCompleteTag = function(type) {
	var premium = d.getAmount('event19');
	d.downStreamTag("transaction", type+premium+'&ev_transid='+s.eVar23, "", "", "2243");
};

/** Main Adserver Function **/
// const variables for pi tag.
piAId = '30552';
piCId = '1532';
d.adserverTags = function() {
	// only fire agency tag in PROD environment
	tmpenv = setting.env;
	setting.env = E_PROD;
	cachebuster = Math.floor(Math.random() * 11111111111);

	try { /** Media Attribution Call **/
		sites = new Array('sunaamiprod', 'sunapia', 'sunbingleprod', 'sungioprod', 'suninsuremyrideprod', 'sunjustcarprod', 'sunshannonsprod', 'sunprod', 'suncilprod', 'sunterriprod');
		for (i = 0; i < sites.length; i++) {
			if (sites[i] == s.un) {
				d.maTag();
				break;
			}
		}
		/** AAMI Tags **/
		if(d.shouldFireAgencyTagsFor('sunaami')) { /** AAMI Brochureware Tags **/
			d.gRemarketing('1030522869', 'BgjiCI_atwMQ9Y-y6wM', window.google_tag_params, true);
			if(s.pageName == 'in:ami:lp:comprehensive-car-insurance:luckyrhonda') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=aamim445;ord=1;num=' + cachebuster + '?');
            }
			if(s.pageName == 'in:ami:lp:home-and-contents-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamih671;cat=aamih759;ord=1;num=' + cachebuster + '?');
			}
            if(s.pageName == 'in:ami:aami-flexi-premiums'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=Flexi0;ord=1;num=' + cachebuster + '?');
            }
            /**Bella pixel + JS tagging**/
			if(s.pageName == 'in:ami:contact-aami:email-aami'){
			    d.downStreamTag("transaction","ev_AAMILifeEnquiryStart=1","8337","","1589","pixel.everesttech.net");
			}
			if(s.pageName == 'in:ami:contact-aami:email-aami:thank-you') {
			    d.downStreamTag("transaction","ev_AAMILifeEnquiryEnd=1","8345","","1589","pixel.everesttech.net");
				d.downStreamTag('transaction','ev_SunCTPSwitch=1','','','1589','piexel.everesttech.net');
			}
			if(s.pageName == 'in:ami:life-insurance') {
			   d.downStreamTag("pageview",  "",  "5849",  "", "1589", "pixel.everesttech.net");
			   d.gRemarketing('959521971', '', window.google_tag_params,true);
			   d.gRemarketing('980184072', '', window.google_tag_params,true);
               d.facebookTag('712832825446307');
			}
		    if(s.pageName == 'in:ami:life-insurance:quotes') {
			   d.downStreamTag("pageview",  "",  "8369",  "", "1589", "pixel.everesttech.net");
               d.facebookTag('712832825446307');
			}
			if(s.pageName == 'in:ami:life-insurance:help') {
			   d.downStreamTag("pageview",  "",  "8377",  "", "1589", "pixel.everesttech.net");
               d.facebookTag('712832825446307');
			}
			if(s.pageName == 'in:ami:life-insurance:life-insurance-calculator') {
			   d.downStreamTag("pageview",  "",  "8385",  "", "1589", "pixel.everesttech.net");
               d.facebookTag('712832825446307');
			}
			if(s.pageName == 'in:ami:home-insurance:home-building-contents-insurance') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamih671;cat=aamih759;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:business:quote:quote_started') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=mobil900;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:business:quote:quote_completed') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=mobil424;ord=1;num=' + cachebuster + '?');
			   d.imageTag('http://ib.adnxs.com/px?id=87127&order_id=' + s.eVar22 + '&value='+ d.getAmount('event14') + '&t=2');
			   d.imageTag('//e.insurance-email.com.au/pub/cct?_ri_=X0Gzc2X%3DWQpglLjHJlYQGrwfI3XBzclmXlscFrR5dkzfh&_ei_=EqKjjVt0FqkVoC78SUwIoVE');
			}
			if(s.pageName == 'in:ami:secapp:business:buy:buy_started') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=mobil811;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:business:buy:buy_completed') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=mobil027;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:mobile:homepage') {
				d.downStreamTag("transaction",  "ev_AAMIMobClaimAssistApp=1",  "",  "", "2243", "pixel.everesttech.net");
			}
			if(s.pageName == 'in:ami:mobile:car-insurance:comprehensive-car-insurance') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=mobil611;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:ctp:quote:quote_started') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=mobil890;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:ctp:quote:quote_completed') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=mobil489;ord=1;num=' + cachebuster + '?');
			   d.imageTag('http://ib.adnxs.com/px?id=87127&order_id=' + s.eVar22 + '&value='+ d.getAmount('event14') + '&t=2');
			}
			if(s.pageName == 'in:ami:secapp:ctp:buy:buy_started') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=mobil392;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:ctp:buy:buy_completed') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamip184;cat=mobil606;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
			}
			if(s.pageName == 'in:ami:secapp:business:marketstalls:buy:buy_started') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamim334;cat=mobil577;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:business:marketstalls:buy:buy_completed') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamim334;cat=mobil256;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:mobile:secapp:travel:quote:quote_started') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamit287;cat=mobil277;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:mobile:secapp:travel:quote:quote_completed') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamit287;cat=mobil797;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:mobile:secapp:travel:buy:buy_started') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamit287;cat=mobil677;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:mobile:secapp:travel:buy:buy_completed') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamit287;cat=mobil132;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:mobile:home-insurance') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=mobil961;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:mobile:car-insurance') {
			   d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=mobil846;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:ctp-insurance') {
			   d.downStreamTag("pageview","","8425","","1589");
               d.facebookTag('712832825446307');
			}
			if(s.pageName == 'in:ami:caravan-insurance') {
			   d.downStreamTag("pageview","","8441","","1589");
                d.facebookTag('712832825446307');
			}
			if(s.pageName == 'in:ami:business-insurance') {
			   d.downStreamTag("pageview","","8449","","1589");
               d.facebookTag('712832825446307');
			}
			if(s.pageName == 'in:ami:skilled-drivers') {
			   d.downStreamTag("pageview","","8457","","1589");
               d.facebookTag('712832825446307');
			}
			/**End here**/
			if(s.pageName == 'in:ami:lp:comprehensive-car-insurance-50'){
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=aami5991;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:lp:business-insurance:football'){
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=aamib618;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:lp:business-insurance:baker'){
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=aamib780;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:skilled-drivers:rememberwhen'){
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=skill746;cat=skill885;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:skilled-drivers:under25'){
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=skill746;cat=skill546;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:skilleddrivers:register'){
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=skill746;cat=skill873;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:skilleddrivers:refer'){
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=skill746;cat=skill739;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:skilled-drivers:make-booking'){
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=skill746;cat=skill601;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:skilled-drivers:course-booking-form:thank-you'){
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=skill746;cat=skill169;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:lp:business-insurance-2') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=aamib657;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:lp:business-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=aamiw284;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:insurance-quote:insurance-quote-terms') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamif002;cat=aamiq546;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_AAMIAllProductsQuotesTCs=1", "", "", "2243");
			}
			if(s.pageName == 'in:ami:insurance-quote') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamif002;cat=aamiq661;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_AAMIAllProductQuotesPage=1", "", "", "2243");
			}
			if(s.pageName == 'in:ami:ctp-insurance:ctp-insurance-nsw') {
				d.downStreamTag("transaction", "ev_AAMICTPNSWProductPage=1", "", "", "2243");
			}
			if(s.pageName == 'in:ami:ctp-insurance:ctp-insurance-qld') {
				d.downStreamTag("transaction", "ev_AAMICTPQLDProductPage=1", "", "", "2243");
				d.downStreamTag("transaction", "ev_CTPQLDPremiumPageV2=1", "", "", "2243");
			}
			if(s.pageName == 'in:ami:car-insurance:caravan-insurance') {
				d.downStreamTag("transaction", "ev_AAMICaravanProductPage=1", "", "", "2243");
				d.downStreamTag("pageview", "", "2302", "2301", "1589");
			}
			if(s.pageName == 'in:ami:home-insurance') {
				d.downStreamTag("pageview", "", "2310", "2309", "1589");
                d.facebookTag('712832825446307');
			}
			if(s.pageName == 'in:ami:home-insurance:home-contents-insurance') {
				d.downStreamTag("transaction", "ev_AAMIHomeConProductPage=1", "", "", "2243");
				d.downStreamTag("pageview", "", "2312", "2311", "1589");
			}
			if(s.pageName == 'in:ami:home-insurance:home-building-insurance') {
				d.downStreamTag("pageview", "", "2314", "2313", "1589");
			}
			if(s.pageName == 'in:ami:home-insurance:landlord-insurance') {
				d.downStreamTag("transaction", "ev_AAMIHomeLandlordProductPage=1", "", "", "2243");
			}
			if(s.pageName == 'in:ami:home-insurance:renters-insurance') {
				d.downStreamTag("transaction", "ev_AAMIHomeRentersProductPage=1", "", "", "2243");
			}
			if(s.pageName == 'in:ami:car-insurance') {
				d.downStreamTag("transaction", "ev_AAMIMotorProductPage=1", "1996", "1995", "2243");
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=aamip070;ord=1;num=' + cachebuster + '?');
                d.downStreamTag("pageview",  "",  "2302",  "2301", "1589");
                d.facebookTag('712832825446307');
			}
			if(s.pageName == 'in:ami:car-insurance:comprehensive-car-insurance') {
				d.downStreamTag("transaction", "ev_AAMICompPage=1", "1994", "1993", "2243");
				d.downStreamTag("pageview", "", "2304", "2303", "1589");
			}
			if(s.pageName == 'in:ami:motorcycle-insurance') {
				d.downStreamTag("transaction", "ev_AAMIMotorcycleProductPage=1", "", "", "2243");
                d.downStreamTag("pageview",  "",  "8433",  "", "1589");
                d.facebookTag('712832825446307');
			}
			if(s.pageName == 'in:ami:lp:renters-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamir166;cat=aamir072;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:travel-insurance') {
				d.downStreamTag("transaction", "ev_AAMITravelProductPage=1", "", "", "2243");
				d.downStreamTag("pageview", "", "2306", "2305", "1589");
                d.facebookTag('712832825446307');
			}
			if(s.pageName == 'in:ami:lp:travel-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamit287;cat=aamit688;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:travel:quote:select_cover:quote_started') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamit287;cat=aamit921;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:travel:quote:quote_completed') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamit287;cat=aamit979;ord=1;num=' + cachebuster + '?');
				d.imageTag('http://ib.adnxs.com/px?id=87127&order_id=' + s.eVar22 + '&value='+ d.getAmount('event14') + '&t=2');
			}
			if(s.pageName == 'in:ami:secapp:travel:buy:buy_started') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamit287;cat=aamit955;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:travel:buy:buy_completed') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamit404;cat=aamit698;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
			}
			if(s.pageName == 'in:ami:secapp:travel:buy:buy_started') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamit287;cat=aamit955;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:travel:buy:buy_completed') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamit404;cat=aamit698;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
			}
			if(s.pageName == 'in:ami:business-insurance:small-business-insurance?') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=aamiw284;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:business-insurance:quote-request:thank-you') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=busin591;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_AAMIWellCallYou=1", "", "", "1827");
			}
			if(s.pageName == 'in:ami:business-insurance:market-stall-and-exhibitor-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=busin100;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_AAMIBIMarketStallsBuyStart=1", "", "", "1827");
			}
			if(s.pageName == 'in:ami:lp:life-insurance') {
				d.gRemarketing('959521971', '', window.google_tag_params,true);
				d.gRemarketing('980184072', '', window.google_tag_params,true);
				d.downStreamTag("pageview", "", "2322", "2321", "1589");
                d.iframeTag('//fls.doubleclick.net/activityi;src=4080583;type=AAMIL0;cat=Sunco0;ord=1;num=' + cachebuster + '?');
                d.facebookTag('712832825446307');
			}
			if(s.pageName == 'in:ami:life-insurance:income-protection') {
				d.downStreamTag("pageview", "", "4680", "4679", "1589");
				d.gRemarketing('959521971', '', window.google_tag_params,true);
                d.facebookTag('712832825446307');
			}
			if(s.pageName == 'in:ami:life-insurance:enquiry') {
				d.downStreamTag("transaction", "ev_AAMILifeEnquiryStart=1&ev_transid=" + cachebuster, "", "", "1589");
                d.facebookTag('712832825446307');
			}
			if(s.pageName == 'in:ami:life-insurance:enquiry:thank-you') {
				d.downStreamTag("transaction", "ev_AAMILifeEnquiryEnd=1&ev_transid=" + cachebuster, "3073", "", "1589");
                d.facebookTag('712832825446307');
			}
			if(s.pageName == 'in:ami:homepage') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=aamih687;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_AAMIHomePage=1", "1990", "1989", "2243");
				d.downStreamTag("pageview", "", "2611", "2610", "1589");
				d.downStreamTag("pageview", "", "3387", "3386", "1589");
				d.gRemarketing('959521971', '', window.google_tag_params,true);
				d.gRemarketing('980184072', '', window.google_tag_params,true);
				d.gRemarketing('1030522869', 'BgjiCI_atwMQ9Y-y6wM', window.google_tag_params, true);
			}
			if(s.pageName == 'in:ami:lp:comprehensive-car-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=aamic302;ord=1;num=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=3203149;type=bidda180;cat=aamim469;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_AamiNewCarLP=1", "1183", "1182", "2243");
			}
			if(s.pageName == 'in:ami:travel-insurance:international-travel-insurance') {
				d.downStreamTag("pageview", "", "2308", "2307", "1589");
			}
			if(s.pageName == 'in:ami:lp:third-party-property-car-insurance-57') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aami3347;cat=aami3610;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:lp:third-party-property-car-insurance-4') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aami3347;cat=aami3254;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:business:marketstalls:buy:buy_started') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamim334;cat=marke527;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:business:marketstalls:buy:confirmation') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=busin450;ord=1;num=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamim334;cat=marke891;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:business:marketstalls:buy:payment') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamim334;cat=marke029;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:secapp:business:marketstalls:buy:buy_completed') {
				d.downStreamTag("transaction", "ev_AAMIBIMarketStallsBuyEnd=1&ev_AAMIBIMarketStallsBuyEndRevenue=" + d.getAmount('event19'), "", "", "1827");
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamim334;cat=marke419;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:ami:lp:comprehensive-car-insurance:safedriver') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=aamis711;ord=1;num=' + cachebuster + '?');
			}
			if(/^in:ami:mobile:/i.test(s.pageName)){
                var pages = {
                    "in:ami:mobile:homepage": {'visible-iphone': {
                        'http://itunes.apple.com/au/app/claim-assist/id540958620?mt=8': 'ev_AAMIMobClaimAssistApp=1'
                    }},
                    "in:ami:mobile:car-insurance": {'btn-standard': {
                        'tel:132244': 'ev_AAMIMobCarInsMakeAClaim=1',
                        'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobCarInsRetrieveAQuote=1',
                        'http://m.aami.com.au/car-insurance#payment-motorcycle': 'ev_AAMIMobCarInsMakeAPayment=1',
                        'http://www.aami.com.au/contact-aami/locations': 'ev_AAMIMobCarInsFindAnAssessmentCentre=1',
                        'https://insurance.aami.com.au/distAuth/UI/Login?goto=http%3A%2F%2Finsurance.aami.com.au%3A80%2Fselfservice%2F': 'ev_AAMIMobCarInsManageMyClaim=1',
                        'http://www.aami.com.au/my-policy-manager/insurance-policy-manager?mobile=no': 'ev_AAMIMobCarInsManageMyPolicy=1'
                    }},
                    "in:ami:mobile:car-insurance:comprehensive-car-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobCompCarInsMakeAClaim=1',
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobCompCarInsRetrieveAQuote=1',
                            'http://m.aami.com.au/car-insurance/comprehensive-car-insurance#payment-motorcycle': 'ev_AAMIMobCompCarInsMakeAPayment=1',
                            'http://www.aami.com.au/contact-aami/locations': 'ev_AAMIMobCompCarInsFindAnAssessmentCentre=1',
                            'https://insurance.aami.com.au/distAuth/UI/Login?goto=http%3A%2F%2Finsurance.aami.com.au%3A80%2Fselfservice%2F': 'ev_AAMIMobCompCarInsManageMyClaim=1',
                            'http://www.aami.com.au/my-policy-manager/insurance-policy-manager?mobile=no': 'ev_AAMIMobCompCarInsManageMyPolicy=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobCompCarInsCallForAQuote=1',
                            'http://m.aami.com.au/car-insurance/comprehensive-car-insurance#quickquote': 'ev_AAMIMobCompCarInsGetAQuoteOnline=1'
                        }
                    },
                    "in:ami:mobile:car-insurance:third-party-property-car-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobThirdPartyCarInsMakeAClaim=1',
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobThirdPartyCarInsRetrieveAQuote=1',
                            'http://m.aami.com.au/car-insurance/third-party-property-car-insurance#payment-motorcycle': 'ev_AAMIMobThirdPartyCarInsMakeAPayment=1',
                            'http://www.aami.com.au/contact-aami/locations': 'ev_AAMIMobThirdPartyCarInsFindAnAssessmentCentre=1',
                            'http://www.aami.com.au/my-policy-manager/insurance-policy-manager?mobile=no': 'ev_AAMIMobThirdPartyCarInsManageMyPolicy=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobThirdPartyCarInsCallForAQuote=1',
                            'http://m.aami.com.au/car-insurance/third-party-property-car-insurance#quickquote': 'ev_AAMIMobThirdPartyCarInsGetAQuoteOnline=1'
                        }
                    },
                    "in:ami:mobile:ctp-insurance:ctp-insurance-nsw": {
                        'btn-icon': {
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobCTPNSWCarInsRetrieveAQuote=1',
                            'http://m.aami.com.au/ctp-insurance/ctp-insurance-nsw#payment-ctp': 'ev_AAMIMobCTPNSWCarInsMakeAPayment=1'
                            // Manage my policy: 'ev_AAMIMobCTPNSWCarInsManageMyPolicy=1',
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobCTPNSWCarInsCallForAQuote=1',
                            'http://www.aami.com.au/insurance-quote/ctp-insurance-quote?mobile=no': 'ev_AAMIMobCTPNSWCarInsGetAQuoteOnline=1'
                        }
                    },
                    /*
                    "in:ami:mobile:ctp-insurance:ctp-insurance-qld": {
                        'btn-icon': {
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobCTPQLDCarInsRetrieveAQuote=1',
                            '#payment-ctp': 'ev_AAMIMobCTPQLDCarInsMakeAPayment=1',
                            // Manage my policy: 'ev_AAMIMobCTPQLDCarInsManageMyPolicy=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobCTPQLDCarInsCallForAQuote=1'
                        }
                    },
                    */
                    "in:ami:mobile:home-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobHomeInsMakeAClaim=1',
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobHomeInsRetrieveAQuote=1',
                            'http://m.aami.com.au/home-insurance#payment-motorcycle': 'ev_AAMIMobHomeInsMakeAPayment=1',
                            'https://insurance.aami.com.au/distAuth/UI/Login?goto=http%3A%2F%2Finsurance.aami.com.au%3A80%2Fselfservice%2F': 'ev_AAMIMobHomeInsManageMyClaim',
                            'http://www.aami.com.au/my-policy-manager/insurance-policy-manager?mobile=no': 'ev_AAMIMobHomeInsManageMyPolicy=1'
                        }
                    },
                    "in:ami:mobile:home-insurance:home-building-contents-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobHome_ContentsInsMakeAClaim=1',
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobHome_ContentsInsRetrieveAQuote=1',
                            'http://m.aami.com.au/home-insurance/home-building-contents-insurance#payment-motorcycle': 'ev_AAMIMobHome_ContentsInsMakeAPayment=1',
                            'https://insurance.aami.com.au/distAuth/UI/Login?goto=http%3A%2F%2Finsurance.aami.com.au%3A80%2Fselfservice%2F': 'ev_AAMIMobHome_ContentsInsManageMyClaim=1',
                            'http://www.aami.com.au/my-policy-manager/insurance-policy-manager?mobile=no': 'ev_AAMIMobHome_ContentsInsManageMyPolicy=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobHome_ContentsInsCallForAQuote=1',
                            'https://nb.aami.com.au/nb/cs?entry=new&lpHomeQuoteType=BC&cn=1': 'ev_AAMIMobHome_ContentsInsGetAQuoteOnline=1',
                            'https://nb.aami.com.au/nb/cs?entry=new&lpHomeQuoteType=BLD&cn=1': 'ev_AAMIMobHome_ContentsInsBuildingQuoteOnline=1',
                            'https://nb.aami.com.au/nb/cs?entry=new&lpHomeQuoteType=CTS&cn=1': 'ev_AAMIMobHome_ContentsInsContentsQuoteOnline=1'
                        }
                    },
                    "in:ami:mobile:home-insurance:landlord-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobLLBuilding_ContentsInsMakeAClaim=1',
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobLLBuilding_ContentsInsRetrieveAQuote=1',
                            'http://m.aami.com.au/home-insurance/landlord-insurance#payment-motorcycle': 'ev_AAMIMobLLBuilding_ContentsInsMakeAPayment=1',
                            'https://insurance.aami.com.au/distAuth/UI/Login?goto=http%3A%2F%2Finsurance.aami.com.au%3A80%2Fselfservice%2F': 'ev_AAMIMobLLBuilding_ContentsInsManageMyClaim=1',
                            'http://www.aami.com.au/my-policy-manager/insurance-policy-manager?mobile=no': 'ev_AAMIMobLLBuilding_ContentsInsManageMyPolicy=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobLLBuilding_ContentsInsCallForAQuote=1',
                            'https://nb.aami.com.au/nb/cs?entry=landlordnew&lpHomeQuoteType=LBC&cn=1': 'ev_AAMIMobLLBuilding_ContentsInsQuoteOnline=1',
                            'https://nb.aami.com.au/nb/cs?entry=landlordnew&lpHomeQuoteType=LLB&cn=1': 'ev_AAMIMobLLBuildingQuoteOnline=1'
                        }
                    },
                    "in:ami:mobile:home-insurance:strata-title-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobLLStrataTitleInsMakeAClaim=1',
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobLLStrataTitleInsRetrieveAQuote=1',
                            'http://m.aami.com.au/home-insurance/strata-title-insurance#payment-motorcycle': 'ev_AAMIMobLLStrataTitleInsMakeAPayment=1',
                            'https://insurance.aami.com.au/distAuth/UI/Login?goto=http%3A%2F%2Finsurance.aami.com.au%3A80%2Fselfservice%2F': 'ev_AAMIMobLLStrataTitleInsManageMyClaim=1',
                            'http://www.aami.com.au/my-policy-manager/insurance-policy-manager?mobile=no': 'ev_AAMIMobLLStrataTitleInsManageMyPolicy=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobLLStrataTitleInsCallForAQuote=1',
                            'https://nb.aami.com.au/nb/cs?entry=stratanew&lpHomeQuoteType=SRC&cn=1': 'ev_AAMIMobLLStrataTitleInsGetAQuoteOnline=1'
                        }
                    },
                    "in:ami:mobile:home-insurance:home-contents-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobRentersContentsInsMakeAClaim=1',
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobRentersContentsInsRetrieveAQuote=1',
                            'http://m.aami.com.au/home-insurance/home-contents-insurance#payment-motorcycle': 'ev_AAMIMobRentersContentsInsMakeAPayment=1',
                            'https://insurance.aami.com.au/distAuth/UI/Login?goto=http%3A%2F%2Finsurance.aami.com.au%3A80%2Fselfservice%2F': 'ev_AAMIMobRentersContentsInsManageMyClaim=1',
                            'http://www.aami.com.au/my-policy-manager/insurance-policy-manager?mobile=no': 'ev_AAMIMobRentersContentsInsManageMyPolicy=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobRentersContentsInsCallForAQuote=1',
                            'https://nb.aami.com.au/nb/cs?entry=new&lpHomeQuoteType=CTS&cn=1': 'ev_AAMIMobRentersContentsInsGetAQuoteOnline=1'
                        }
                    },
                    "in:ami:mobile:home-insurance:renters-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobRentersFire_TheftContentsInsMakeAClaim=1',
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobRentersFire_TheftContentsInsRetrieveAQuote=1',
                            'http://m.aami.com.au/home-insurance/renters-insurance#payment-motorcycle': 'ev_AAMIMobRentersFire_TheftContentsInsMakeAPayment=1',
                            'https://insurance.aami.com.au/distAuth/UI/Login?goto=http%3A%2F%2Finsurance.aami.com.au%3A80%2Fselfservice%2F': 'ev_AAMIMobRentersFire_TheftContentsInsManageMyClaim=1',
                            'http://www.aami.com.au/my-policy-manager/insurance-policy-manager?mobile=no': 'ev_AAMIMobRentersFire_TheftContentsInsManageMyPolicy=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobRentersFire_TheftContentsInsCallForAQuote=1',
                            'https://nb.aami.com.au/nb/cs?entry=firetheftctsnew&lpHomeQuoteType=FTC&cn=1': 'ev_AAMIMobRentersFire_TheftContentsInsGetAQuoteOnline=1'
                        }
                    },
                    //HOME INSURANCE
                    "in:ami:mobile:travel-insurance": {
                        'btn-icon': {
                            'tel:+61289871674': 'ev_AAMIMobTravelInsOverseasAssistance=1',
                            'tel:132244': 'ev_AAMIMobTravelInsAssistanceInAustralia=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobTravelInsCallForAQuote=1',
                            'https://cpdirect.vero.com.au/NASApp/cpdirect/TLAAMITravelMobileQuote?co=05&cp=53&pageAction=newQuote': 'ev_AAMIMobTravelInsGetAQuote=1'
                        }
                    },
                    "in:ami:mobile:business-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobBusinessInsMakeAClaim=1',
                            'tel:132244': 'ev_AAMIMobBusinessInsCallForEnquiries=1',
                            'http://m.aami.com.au/business-insurance#payment-business1': 'ev_AAMIMobBusinessInsMakeAPayment=1'
                        }
                    },
                    "in:ami:mobile:business-insurance:small-business-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobBusinessInsMakeAClaim=1',
                            'tel:132244': 'ev_AAMIMobBusinessInsCallForEnquiries=1',
                            'http://m.aami.com.au/business-insurance/small-business-insurance#payment-business1': 'ev_AAMIMobBusinessInsMakeAPayment=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobSmallBussinessInsCallForAQuote=1',
                            'https://quote.aami.com.au/business-insurance/#/select_your_business': 'ev_AAMIMobSmallBussinessInsGetAQuoteOnline=1'
                        }
                    },
                    "in:ami:mobile:business-insurance:public-liability-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobPublicLiabilityInsMakeAClaim=1',
                            'tel:132244': 'ev_AAMIMobPublicLiabilityInsCallForEnquiries=1',
                            'http://m.aami.com.au/business-insurance/public-liability-insurance#payment-business1': 'ev_AAMIMobPublicLiabilityInsMakeAPayment=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobPublicLiabilityInsCallForAQuote=1',
                            'https://quote.aami.com.au/business-insurance/#/select_your_business': 'ev_AAMIMobPublicLiabilityInsGetAQuoteOnline=1'
                        }
                    },
                    "in:ami:mobile:business-insurance:market-stall-and-exhibitor-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobMarketStallInsMakeAClaim=1',
                            'tel:132244': 'ev_AAMIMobMarketStallInsCallForEnquiries=1',
                            'http://m.aami.com.au/business-insurance/market-stall-and-exhibitor-insurance#payment-business1': 'ev_AAMIMobMarketStallInsMakeAPayment=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobMarketStallInsCallForAQuote=1'
                            // get a quote online: 'ev_AAMIMobMarketStallInsGetAQuoteOnline=1'
                        }
                    },
                    "in:ami:mobile:business-insurance:commercial-property-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobCommPropertyInsMakeAClaim=1',
                            'tel:132244': 'ev_AAMIMobCommPropertyInsCallForEnquiries=1',
                            'http://m.aami.com.au/business-insurance/commercial-property-insurance#payment-business1': 'ev_AAMIMobCommPropertyInsMakeAPayment=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobCommPropertyInsCallForAQuote=1'
                        }
                    },
                    "in:ami:mobile:motorcycle-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobMotorcycleInsMakeAClaim=1',
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobMotorcycleInsRetrieveAQuote=1',
                            'http://m.aami.com.au/motorcycle-insurance#payment-motorcycle': 'ev_AAMIMobMotorcycleInsMakeAPayment=1',
                            'http://www.aami.com.au/contact-aami/locations': 'ev_AAMIMobMotorcycleInsFindAnAssessmentCentre=1',
                            'https://insurance.aami.com.au/distAuth/UI/Login?goto=http%3A%2F%2Finsurance.aami.com.au%3A80%2Fselfservice%2F': 'ev_AAMIMobMotorcycleInsManageMyClaim=1',
                            'http://www.aami.com.au/my-policy-manager/insurance-policy-manager?mobile=no': 'ev_AAMIMobMotorcycleInsManageMyPolicy'
                        }
                    },
                    "in:ami:mobile:motorcycle-insurance:comprehensive-motorcycle-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobCompMotorcycleInsMakeAClaim=1',
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobCompMotorcycleInsRetrieveAQuote=1',
                            'http://m.aami.com.au/motorcycle-insurance/comprehensive-motorcycle-insurance#payment-motorcycle': 'ev_AAMIMobCompMotorcycleInsMakeAPayment=1',
                            'http://www.aami.com.au/contact-aami/locations': 'ev_AAMIMobCompMotorcycleInsFindAnAssessmentCentre=1',
                            'https://insurance.aami.com.au/distAuth/UI/Login?goto=http%3A%2F%2Finsurance.aami.com.au%3A80%2Fselfservice%2F': 'ev_AAMIMobCompMotorcycleInsManageMyClaim=1',
                            'http://www.aami.com.au/my-policy-manager/insurance-policy-manager?mobile=no': 'ev_AAMIMobCompMotorcycleInsManageMyPolicy=1'
                        },
                        'arrow': {
                            'tel: 13 22 44': 'ev_AAMIMobCompMotorcycleInsCallForAQuote=1',
                            'https://nb.aami.com.au/nb/cs?entry=motorcyclenew&cn=1': 'ev_AAMIMobCompMotorcycleInsGetAQuoteOnline=1'
                        }
                    },
                    "in:ami:mobile:motorcycle-insurance:third-party-property-motorcycle-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobThirdPartyMotorcycleInsMakeAClaim=1',
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobThirdPartyMotorcycleInsRetrieveAQuote=1',
                            'http://m.aami.com.au/motorcycle-insurance/third-party-property-motorcycle-insurance#payment-motorcycle': 'ev_AAMIMobThirdPartyMotorcycleInsMakeAPayment=1',
                            'http://www.aami.com.au/contact-aami/locations': 'ev_AAMIMobThirdPartyMotorcycleInsFindAnAssessmentCentre=1',
                            'http://www.aami.com.au/my-policy-manager/insurance-policy-manager?mobile=no': 'ev_AAMIMobThirdPartyMotorcycleInsManageMyPolicy=1'
                        },
                        'arrow': {
                            'tel: 13 22 44': 'ev_AAMIMobThirdPartyMotorcycleInsCallForAQuote=1',
                            'https://nb.aami.com.au/nb/cs?entry=motorcyclenew&cn=1': 'ev_AAMIMobThirdPartyMotorcycleInsGetAQuoteOnline=1'
                        }
                    },
                    "in:ami:mobile:ctp-insurance:ctp-insurance-nsw": {
                        'btn-icon': {
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobCTPNSWMotorcycleInsRetrieveAQuote=1',
                            'http://m.aami.com.au/ctp-insurance/ctp-insurance-nsw#payment-ctp': 'ev_AAMIMobCTPNSWMotorcycleInsMakeAPayment=1'
                            // Manage my policy: 'ev_AAMIMobCTPNSWMotorcycleInsManageMyPolicy=1',
                        },
                        'arrow': {
                            'tel: 13 22 44': 'ev_AAMIMobCTPNSWMotorcycleInsCallForAQuote=1',
                            'http://www.aami.com.au/insurance-quote/ctp-insurance-quote?mobile=no': 'ev_AAMIMobCTPNSWMotorcycleInsGetAQuoteOnline=1'
                        }
                    },
                    /*
                    "in:ami:mobile:ctp-insurance:ctp-insurance-qld": {
                        'btn-icon': {
                            '#payment-ctp': 'ev_AAMIMobCTPQLDMotorcycleInsMakeAPayment=1'
                            // Manage my policy: 'ev_AAMIMobCTPQLDMotorcycleInsManageMyPolicy=1',
                        },
                        'arrow': {
                            'tel: 13 22 44': 'ev_AAMIMobCTPQLDMotorcycleInsCallForAQuote=1',
                            'http://www.aami.com.au/insurance-quote/ctp-insurance-quote?mobile=no': 'ev_AAMIMobCTPQLDMotorcycleInsRetrieveAQuote=1'
                        }
                    },
                    */
                    "in:ami:mobile:caravan-insurance": {
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobCaravanInsMakeAClaim=1',
                            'https://nb.aami.com.au/nb/cs?entry=find&cn=1': 'ev_AAMIMobCaravanInsRetrieveAQuote=1',
                            'http://m.aami.com.au/caravan-insurance#payment-motorcycle': 'ev_AAMIMobCaravanInsMakeAPayment=1',
                            'https://insurance.aami.com.au/distAuth/UI/Login?goto=http%3A%2F%2Finsurance.aami.com.au%3A80%2Fselfservice%2F': 'ev_AAMIMobCaravanInsManageMyClaim=1',
                            'http://www.aami.com.au/my-policy-manager/insurance-policy-manager?mobile=no': 'ev_AAMIMobCaravanInsManageMyPolicy=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobCaravanInsCallForAQuote=1',
                            'https://nb.aami.com.au/nb/cs?entry=cvcnew&cn=1': 'ev_AAMIMobCaravanInsGetAQuote=1'
                        }
                    },
                    "in:ami:mobile:life-insurance": {
                        // Direct Track?
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobLifeInsMakeAClaim=1',
                            'tel:132244': 'ev_AAMIMobLifeInsCallForEnquiries=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobLifeInsCallForAQuote=1',
                            'http://www.aami.com.au/insurance-quote/life-insurance-quote-terms?mobile=no': 'ev_AAMIMobLifeInsGetAQuote=1'
                        }
                    },
                    "in:ami:mobile:life-insurance:income-protection": {
                        // Direct Track?
                        'btn-icon': {
                            'tel:132244': 'ev_AAMIMobIncomeProtectionMakeAClaim=1',
                            'tel:132244': 'ev_AAMIMobIncomeProtectionCallForEnquiries=1'
                        },
                        'arrow': {
                            'tel:132244': 'ev_AAMIMobIncomeProtectionCallForAQuote=1',
                            'http://life1.aami.com.au/eApplication/newBusiness?brand=AAMI&product=Income%20ProtectionIP&request_type=quote&application_type=Individual': 'ev_AAMIMobIncomeProtectionGetAQuote=1',
                            'tel:132244': 'ev_AAMIMobIncomeProtectionRequestACallback'
                        }
                    }
                };

                document.getElementByClassName = document.getElementsByClassName || function(className){
                    var els = this.getElementsByTagName('*');
                    var targets = [];
                    for(var i = els.length; i--;){
                        var cn = els[i].className.split(' ');
                        for(var j = cn.length; j--;){
                            if(cn === className)
                                targets.push(els[i]);
                        }
                    }
                };

                var bindToMobile = function(className, tags){
                    var els = document.getElementByClassName(className);

                    for(var i = els.length; i--;){
						var handleDownStream = null;
                        if(typeof tags[els[i].href] !== 'undefined'){
                            handleDownStream = function(e){
                                d.downStreamOnClick(tags[e.currentTarget.href]);
                            };
						} else if (/tel:132244/i.test(els[i].href)) {
							handleDownStream = function (e) {
								d.downStreamOnClick(tags['tel:132244']);
							};
						} else if (/tel:+61289871674/i.test(els[i].href)) {
							handleDownStream = function (e) {
								d.downStreamOnClick(tags['tel:+61289871674']);
							};
                        }
						if (typeof handleDownStream == 'function') {
                            if(els[i].addEventListener){
                                els[i].addEventListener('click', handleDownStream, false);
                            } else {
                                els[i].attachEvent('onclick', handleDownStream);
                            }
						}
                    }
                };

                for(var p in pages[s.pageName]){
                    if(pages[s.pageName].hasOwnProperty && pages[s.pageName].hasOwnProperty(p)){
                        bindToMobile(p, pages[s.pageName][p]);
                    }
                }
			}
			/** AAMI Quote Start **/
			if(scEventExists('event8')) {
				if(s.products.indexOf('travel') > -1 || ((typeof s.eVar48 != 'undefined') && (s.eVar48.indexOf('travel') > -1))) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamit287;cat=aamit432;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_AAMITravelQ1=1", "", "", "2243");
				} else if(s.products.indexOf('home_') > -1 || s.products.indexOf('landlord_') > -1 || ((typeof s.eVar48 != 'undefined') && (s.eVar48 == 'landlord' || s.eVar48 == 'home' || s.eVar48.indexOf('renter') > -1))) {
	                if(s.products.indexOf('home_building_&_contents') > -1) {
	                    d.fireAamiStarcomTag('aamio191','homeq706', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIHomeConQ1=1", "", "", "2243");
	                } else if(s.products.indexOf('home_building_only') > -1) {
	                    d.fireAamiStarcomTag('aamih671','aamih844', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIHomeBuildingQ1=1", "", "", "2243");
	                } else if(s.products.indexOf('home_contents_only') > -1) {
	                    d.fireAamiStarcomTag('aamih671','aamic813', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIContentsQ1=1", "", "", "2243");
	                } else if(s.products.indexOf('home_nps') > -1) {
	                    d.fireAamiStarcomTag('aamih671','homei355', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIHomeNPS1=1", "", "", "2243");
	                } else if(s.products.indexOf('landlord_building_') > -1 || s.products.indexOf('landlord_contents_') > -1) {
	                    d.fireAamiStarcomTag('aamih671','landl262', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIHomeLandlordQ1=1", "", "", "2243");
	                } else if(s.products.indexOf('landlord_nps') > -1) {
	                    d.fireAamiStarcomTag('aamih671','landl611', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMILandlordNPS=1", "", "", "2243");
	                } else if(s.products.indexOf('home_fire_&_theft_contents_only') > -1) {
	                    d.fireAamiStarcomTag('aamih671','home_784', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIContentsQ1=1", "", "", "2243");
	                } else if(s.products.indexOf('home_fire_&_theft_nps') > -1) {
	                    d.fireAamiStarcomTag('aamih671','homei355', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIHomeNPS1=1", "", "", "2243");
	                }
	            } else if(s.products.indexOf('business') > -1 || ((typeof s.eVar48 != 'undefined') && (s.eVar48.indexOf('business') > -1 || s.eVar48.indexOf('public') > -1 || s.eVar48.indexOf('market') > -1))) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=comme365;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_aamiciquotestart=1", "1356", "", "1827");
				} else if(s.products.indexOf('car') > -1 || s.products.indexOf('motor') > -1 || ((typeof s.eVar48 != 'undefined') && (s.eVar48 == 'car' || s.eVar48 == 'caravan' || s.eVar48 == 'ctp-greenslip-nsw' || s.eVar48 == 'motorcycle'))) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=3203149;type=bidda180;cat=aamim203;ord=1;num=' + cachebuster + '?');
					if(s.products.indexOf('car_comprehensive') > -1) {
						d.fireAamiStarcomTag('aamio191','carst020', cachebuster);
						d.downStreamTag("transaction", "ev_AAMIMotorQ1=1", "", "", "2243");
					} else if(s.products.indexOf('car_thirdparty') > -1) {
						d.fireAamiStarcomTag('aami3347','aami3238', cachebuster);
						d.downStreamTag("transaction", "ev_AAMIThirdPartyMotorQ1=1", "", "", "2243");
					} else if(s.products.indexOf('car_nonproduct_specific') > -1 || s.products.indexOf('motor_nonproduct_specific') > -1) {
						d.fireAamiStarcomTag('aamif002','carin081', cachebuster);
						d.downStreamTag("transaction", "ev_AAMICarNPS=1", "", "", "2243");
					} else if(s.products.indexOf('motorcycle') > -1) {
						d.fireAamiStarcomTag('aamim344','motor201', cachebuster);
						d.downStreamTag("transaction", "ev_AAMIMotorcycleQuoteStart=1", "", "", "2243");
					} else if(s.products.indexOf('car_ctp') > -1 || ((typeof s.eVar48 != 'undefined') && s.eVar48 == 'ctp-greenslip-nsw')) {
						d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=ctpqu138;ord=1;num=' + cachebuster + '?');
						d.downStreamTag("transaction", "ev_AAMICTPNSWQ1=1", "", "", "2243");
					}
				} else if(s.products.indexOf('life_protect') > -1 || s.products.indexOf('income_protection') > -1){
                    d.facebookTag('712832825446307');
                }

				if(navigator.userAgent.indexOf("MSIE 7.0") < 0) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=custo866;cat=quote823;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
				}
			} /** AAMI Quote Complete **/
			if(scEventExists('event9')) {
				d.imageTag('//e.insurance-email.com.au/pub/cct?_ri_=X0Gzc2X%3DWQpglLjHJlYQGzbvzbtkyazeR1DqPwSfozfkbcR&_ei_=Eg9e8ZPvz390ulmzt6Id6AI');
				if(s.products.indexOf('travel') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamit287;cat=aamit144;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_AAMITravelQ2=1&ev_AAMITravelQ2Revenue=" + d.getAmount('event14'), "", "", "2243");
				} else if(s.products.indexOf('home_') > -1 || s.products.indexOf('landlord_') > -1) {
	                if(s.products.indexOf('home_building_&_contents') > -1) {
	                    d.fireAamiStarcomQuoteCompleteTag('aamio191','homeq975');
	                    d.fireAamiAdlensQuoteCompleteTag("ev_AAMIHomeConQ2=1&ev_AAMIHomeConQ2Revenue=");
	                } else if(s.products.indexOf('home_building_only') > -1) {
	                    d.fireAamiStarcomQuoteCompleteTag('aamih671','aamih785');
	                    d.fireAamiAdlensQuoteCompleteTag("ev_AAMIHomeBuildingQ2=1&ev_AAMIHomeBuildingQ2Revenue=");
	                } else if(s.products.indexOf('home_contents_only') > -1) {
	                    d.fireAamiStarcomQuoteCompleteTag('aamih671','aamic784');
	                    d.fireAamiAdlensQuoteCompleteTag("ev_AAMIContentsQ2=1&ev_AAMIContentsQ2Revenue=");
	                } else if(s.products.indexOf('landlord_building_') > -1 || s.products.indexOf('landlord_contents_') > -1) {
	                    d.fireAamiStarcomQuoteCompleteTag('aamih671','landl198');
	                    d.fireAamiAdlensQuoteCompleteTag("ev_AAMIHomeLandlordQ2=1&ev_AAMIHomeLandlordQ2Revenue=");
	                } else if(s.products.indexOf('home_fire_&_theft_contents_only') > -1) {
	                    d.fireAamiStarcomQuoteCompleteTag('aamih671','home_654');
	                    d.fireAamiAdlensQuoteCompleteTag("ev_AAMIContentsQ2=1&ev_AAMIContentsQ2Revenue=");
	                }
	            } else if(s.products.indexOf('business') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=comme053;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_aamiciquoteend=1&ev_aamiciquoteendvalue=" + d.getAmount('event14'), "1358", "", "1827");
					d.imageTag('//e.insurance-email.com.au/pub/cct?ri=X0Gzc2X%3DWQpglLjHJlYQGnMFdze6CNjtTzaAdjzb92zfJCC&ei=EjIuRudawUuRBwQbqnIC3wY');
				} else if(s.products.indexOf('car') > -1 || s.products.indexOf('motor') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=3203149;type=bidda180;cat=aamim718;ord=1;num=' + cachebuster + '?');
					if(s.products.indexOf('car_comprehensive') > -1|| s.products.indexOf('car_thirdpartyproperty') > -1) {
						attachEfButtonEvents(["emailButton"], "//googleads.g.doubleclick.net/pagead/viewthroughconversion/1030522869/?value=0&label=Id8NCJfJ5AcQ9Y-y6wM&guid=ON&script=0");
					}
					if(s.products.indexOf('car_comprehensive') > -1) {
						d.fireAamiStarcomQuoteCompleteTag('aamio191','carqu944');
						d.fireAamiAdlensQuoteCompleteTag("ev_AAMIMotorQ2=1&ev_AAMIMotorQ2Revenue=");
					} else if(s.products.indexOf('car_thirdparty') > -1) {
						d.fireAamiStarcomQuoteCompleteTag('aami3347','aami3107');
						d.fireAamiAdlensQuoteCompleteTag("ev_AAMIThirdPartyMotorQ2=1&ev_AAMIThirdPartyMotorQ2Revenue=");
					} else if(s.products.indexOf('motorcycle') > -1) {
						d.fireAamiStarcomQuoteCompleteTag('aamip132','motor413');
						d.fireAamiAdlensQuoteCompleteTag("ev_AAMIMotorcycleQuoteComplete=1&ev_AAMIMotorcycleQuoteCompleteRev=");
					} else if(s.products.indexOf('car_ctp') > -1) {
						d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=ctpqu459;ord=1;num=' + cachebuster + '?');
						d.downStreamTag("transaction", "ev_AAMICTPNSWQ2=1&ev_AAMICTPNSWQ2Revenue=" + d.getAmount('event14'), "", "", "2243");
					}
				} else if(s.products.indexOf('life_protect') > -1 || s.products.indexOf('income_protection') > -1){
                    d.facebookTag('712832825446307');
                }

				if(s.products.indexOf('travel_mobile') > -1) {
					d.downStreamTag("transaction", "ev_AAMITravel_Mob_Q2=1", "", "", "2243");
				}
				if(navigator.userAgent.indexOf("MSIE 7.0") < 0) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=custo866;cat=quote709;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
				}
			}

			/** AAMI Retrieve Quote **/
			if(scEventExists('event10')) {
                if(s.products.indexOf('car_comprehensive') > -1) {
                    d.fireAamiStarcomTag('aamif002','compr470', cachebuster);
                    d.downStreamTag("transaction", "ev_AAMIMobCarInsRetrieveAQuote=1", "", "", "2243");
                } else if(s.products.indexOf('car_thirdparty') > -1) {
                    d.fireAamiStarcomTag('aamif002','third287', cachebuster);
                    d.downStreamTag("transaction", "ev_AAMIMobThirdPartyCarInsRetrieveAQuote=1", "", "", "2243");
                } else if(s.products.indexOf('motorcycle_comprehensive') > -1) {
                    d.fireAamiStarcomTag('aamif002','compr323', cachebuster);
                    d.downStreamTag("transaction", "ev_AAMIMobCompMotorcycleInsRetrieveAQuote=1", "", "", "2243");
                } else if(s.products.indexOf('motorcycle_thirdparty') > -1) {
                    d.fireAamiStarcomTag('aamim344','third900', cachebuster);
                    d.downStreamTag("transaction", "ev_AAMIMobThirdPartyMotorcycleInsRetrieveAQuote=1", "", "", "2243");
                } else if(s.products.indexOf('home_building_') > -1 || s.products.indexOf('home_contents_') > -1) {
                    d.fireAamiStarcomTag('aamih671','aamih116', cachebuster);
                    d.downStreamTag("transaction", "ev_AAMIMobHomeInsRetrieveAQuote=1", "", "", "2243");
                } else if(s.products.indexOf('home_fire_&_theft_contents_only') > -1) {
                    d.fireAamiStarcomTag('aamih671','home_268', cachebuster);
                    d.downStreamTag("transaction", "ev_AAMIMobRentersContentsInsRetrieveAQuote=1", "", "", "2243");
				} else if(s.products.indexOf('landlord_building_&_contents') > -1) {
                    d.fireAamiStarcomTag('aamif002','landl573', cachebuster);
                    d.downStreamTag("transaction", "ev_AAMIMobLLBuilding_ContentsInsRetrieveAQuote=1", "", "", "2243");
				} else if(s.products.indexOf('landlord_building_only') > -1) {
                    d.fireAamiStarcomTag('aamih671','aamih785', cachebuster);
                    d.downStreamTag("transaction", "ev_AAMIMobLLBuildingInsRetrieveAQuote=1", "", "", "2243");
				} else if(s.products.indexOf('landlord_contents_only') > -1) {
                    d.fireAamiStarcomTag('aamih671','aamic784', cachebuster);
                    d.downStreamTag("transaction", "ev_AAMIMobLLContentsInsRetrieveAQuote=1", "", "", "2243");
                }
			}
            /** AAMI App Start **/
            if(scEventExists('event11')) {
                if(s.products.indexOf('life_protect') > -1 || s.products.indexOf('income_protection') > -1){
                    d.facebookTag('712832825446307');
                }
            }
			/** AAMI Buy Start **/
			if(scEventExists('event17')) {
				if(s.products.indexOf('home_') > -1 || s.products.indexOf('landlord_') > -1) {
	                if(s.products.indexOf('home_building_&_contents') > -1) {
	                    d.fireAamiStarcomTag('aamih671','aamih116', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIHomeConA1=1", "", "", "2243");
	                } else if(s.products.indexOf('home_building_only') > -1) {
	                    d.fireAamiStarcomTag('aamih671','aamih647', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIHomeBuildingA1=1", "", "", "2243");
	                } else if(s.products.indexOf('home_contents_only') > -1) {
	                    d.fireAamiStarcomTag('aamih671','aamic109', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIContentsA1=1", "", "", "2243");
	                } else if(s.products.indexOf('landlord_building_') > -1 || s.products.indexOf('landlord_contents_') > -1) {
	                    d.fireAamiStarcomTag('aamih671','landl021', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIHomeLandlordA1=1", "", "", "2243");
	                } else if(s.products.indexOf('home_fire_&_theft_contents_only') > -1) {
	                    d.fireAamiStarcomTag('aamih671','home_780', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIContentsA1=1", "", "", "2243");
	                }
	            } else if(s.products.indexOf('business') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=comme963;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_aamiciappstart=1", "1359", "", "1827");
				} else if(s.products.indexOf('car') > -1 || s.products.indexOf('motor') > -1) {
	                if(s.products.indexOf('car_comprehensive') > -1) {
	                    d.fireAamiStarcomTag('aamio191','car-b533', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIMotorA1=1", "", "", "2243");
	                } else if(s.products.indexOf('car_thirdparty') > -1) {
	                    d.fireAamiStarcomTag('aami3347','aami3479', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIThirdPartyMotorA1=1", "", "", "2243");
	                } else if(s.products.indexOf('motorcycle') > -1) {
	                    d.fireAamiStarcomTag('aamim344','motor488', cachebuster);
	                    d.downStreamTag("transaction", "ev_AAMIMotorcycleA1=1", "", "", "2243");
	                }
	            }

				if(navigator.userAgent.indexOf("MSIE 7.0") < 0) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=custo866;cat=polic975;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
				}
			}
			/** AAMI Buy Complete **/
			if(scEventExists('event18')) {
				if(s.products.indexOf('travel') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamip184;cat=aamit252;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
					d.downStreamTag("transaction", "ev_AAMITravelBuy=1&ev_AAMITravelBuyRevenue=" + d.getAmount('event19'), "", "", "2243");
				} else if(s.products.indexOf('home_') > -1 || s.products.indexOf('landlord_') > -1) {
	                if(s.products.indexOf('home_building_&_contents') > -1) {
	                    d.fireAamiStarcomPolicyCompleteTag('aamip184','aamih211');
	                    d.fireAamiAdlensPolicyCompleteTag("ev_AAMIHomeConBuy=1&ev_AAMIHomeConBuyRevenue=");
	                } else if(s.products.indexOf('home_building_only') > -1) {
	                    d.fireAamiStarcomPolicyCompleteTag('aamih616','aamih168');
	                    d.fireAamiAdlensPolicyCompleteTag("ev_AAMIHomeBuildingBuy=1&ev_AAMIHomeBuildingBuyRevenue=");
	                } else if(s.products.indexOf('home_contents_only') > -1) {
	                    d.fireAamiStarcomPolicyCompleteTag('aamih616','aamic242');
	                    d.fireAamiAdlensPolicyCompleteTag("ev_AAMIContentsBuy=1&ev_AAMIContentsBuyRevenue=");
	                } else if(s.products.indexOf('landlord_building_') > -1 || s.products.indexOf('landlord_contents_') > -1) {
	                    d.fireAamiStarcomPolicyCompleteTag('aamip184','landl688');
	                    d.fireAamiAdlensPolicyCompleteTag("ev_AAMIHomeLandlordBuy=1&ev_AAMIHomeLandlordBuyRevenue=");
	                } else if(s.products.indexOf('home_fire_&_theft_contents_only') > -1) {
	                    d.fireAamiStarcomPolicyCompleteTag('aamih671','home_153');
	                    d.fireAamiAdlensPolicyCompleteTag("ev_AAMIContentsBuy=1&ev_AAMIContentsBuyRevenue=");
	                }
	            } else if(s.products.indexOf('business') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=comme828;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_aamiciappend=1&ev_aamiciappendvalue=" + d.getAmount('event19'), "1360", "", "1827");
					d.imageTag('//www.s2d6.com/x/?x=a&h=63758&o=' + s.eVar23 + '&');
					d.imageTag('//www.s2d6.com/x/?x=r&h=63758&o=' + s.eVar23 + '&g=593529836517&s=1&q=1&');
				} else if(s.products.indexOf('car') > -1 || s.products.indexOf('motor') > -1) {
					if (s.products.indexOf('motorcycle') == -1) {
                        d.imageTag('//e.insurance-email.com.au/pub/cct?_ri_=X0Gzc2X%3DWQpglLjHJlYQGgfKHDqzbBMEW30Ozf73fdLhW&_ei_=Eq6nmFxgK4wt6n3QD8PBTM0&OrderID=' + s.eVar23 + '&ORDERTOTAL=' + d.getAmount("event19"));
					}
	                if(s.products.indexOf('car_comprehensive') > -1) {
	                    d.fireAamiStarcomPolicyCompleteTag('aamip184','aamic054');
	                    d.fireAamiAdlensPolicyCompleteTag("ev_AAMIMotorBuy=1&ev_AAMIMotorBuyRevenue=");
	                } else if(s.products.indexOf('car_thirdparty') > -1) {
	                    d.fireAamiStarcomPolicyCompleteTag('aami3347','aami3729');
	                    d.fireAamiAdlensPolicyCompleteTag("ev_AAMIThirdPartyMotorBuy=1&ev_AAMIThirdPartyMotorBuyRevenue=");
	                } else if(s.products.indexOf('motorcycle') > -1) {
	                    d.fireAamiStarcomPolicyCompleteTag('aamim344','motor780');
	                    d.fireAamiAdlensPolicyCompleteTag("ev_AAMIMotorcycleBuyComplete=1&ev_AAMIMotorcycleBuyCompleteRev=");
	                } else if(s.products.indexOf('car_ctp') > -1) {
						d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamip184;cat=aamic657;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
						d.downStreamTag("transaction", "ev_AAMICTPNSWBuy=1&ev_AAMICTPNSWBuyRevenue=" + d.getAmount('event19'), "", "", "2243");
					}
				} else if(s.products.indexOf('travel_mobile') > -1) {
					d.downStreamTag("transaction", "ev_AAMITravel_Mob_Buy=1", "", "", "2243");
				} else if(s.products.indexOf('life_protect') > -1 || s.products.indexOf('income_protection') > -1){
                    d.facebookTag('712832825446307');
                }

				if(navigator.userAgent.indexOf("MSIE 7.0") < 0) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=custo866;cat=polic107;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
				}
			}

			/** make payment */
			if(s.pageName.indexOf('in:ami:secapp:sales:motor:buy:payment') > -1) {
				if(s.products.indexOf('car_comprehensive') > -1) {
					d.fireAamiStarcomTag('aamif002','compr457', cachebuster);
					d.downStreamTag("transaction", "ev_AAMIMobCarInsMakeAPayment=1", "", "", "2243");
				} else if(s.products.indexOf('car_thirdparty') > -1) {
					d.fireAamiStarcomTag('aamif002','third136', cachebuster);
					d.downStreamTag("transaction", "ev_AAMIMobThirdPartyCarInsMakeAPayment=1", "", "", "2243");
				}
			} else if(s.pageName.indexOf('in:ami:secapp:sales:motorcycle:buy:payment') > -1) {
				if(s.products.indexOf('motorcycle_comprehensive') > -1) {
					d.fireAamiStarcomTag('aamif002','motor470', cachebuster);
					d.downStreamTag("transaction", "ev_AAMIMobCompMotorcycleInsMakeAPayment=1", "", "", "2243");
				} else if(s.products.indexOf('motorcycle_thirdparty') > -1) {
					d.fireAamiStarcomTag('aamim344','third019', cachebuster);
					d.downStreamTag("transaction", "ev_AAMIMobThirdPartyMotorcycleInsMakeAPayment=1", "", "", "2243");
				}
			} else if(s.pageName.indexOf('in:ami:secapp:sales:home:buy:payment') > -1) {
				if(s.products.indexOf('home_building_') > -1 || s.products.indexOf('home_contents_') > -1) {
					d.fireAamiStarcomTag('aamip184','aamih211', cachebuster);
					d.downStreamTag("transaction", "ev_AAMIMobHomeInsMakeAPayment=1", "", "", "2243");
				} else if(s.products.indexOf('home_fire_&_theft_contents_only') > -1) {
					d.fireAamiStarcomTag('aamih671','home_518', cachebuster);
					d.downStreamTag("transaction", "ev_AAMIMobRentersContentsInsMakeAPayment=1", "", "", "2243");
				} else if(s.products.indexOf('landlord_building_&_contents') > -1) {
					d.fireAamiStarcomTag('aamip184','aamih211', cachebuster);
					d.downStreamTag("transaction", "ev_AAMIMobLLBuilding_ContentsInsMakeAPayment=1", "", "", "2243");
				} else if(s.products.indexOf('landlord_building_only') > -1) {
					d.fireAamiStarcomTag('aamih616','aamih168', cachebuster);
					d.downStreamTag("transaction", "ev_AAMIMobLLBuildingInsMakeAPayment=1", "", "", "2243");
				} else if(s.products.indexOf('landlord_contents_only') > -1) {
					d.fireAamiStarcomTag('aamih616','aamic242', cachebuster);
					d.downStreamTag("transaction", "ev_AAMIMobLLContentsInsMakeAPayment=1", "", "", "2243");
				}
			}

			if(navigator.userAgent.indexOf("MSIE 7.0") < 0) {
				if(typeof d.protocol != 'undefined' && s.pageName.indexOf('in:ami:business-insurance') < 0 && (d.protocol == 'http:' || s.pageName == 'in:ami:contact-aami:email-aami' || s.pageName == 'in:ami:contact-aami:email-feedback')) {
					d.downStreamTag("pageview", "", "2204", "2203", "2243");
				}
				if(s.pageName.indexOf('in:ami:business-insurance') > -1 && typeof d.protocol != 'undefined' && (d.protocol == 'http:' || s.pageName == 'in:ami:business-insurance:email-aami-business-insurance' || s.pageName == 'in:ami:business-insurance:feedback' || s.pageName == 'in:ami:business-insurance:quote-request')) {
					d.downStreamTag("pageview", "", "2200", "2199", "1827");
				}
				if(s.eVar61) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=custo866;cat=visit014;u5=' + s.eVar62 + ';u1=' + s.prop3 + ';u2=' + s.eVar61 + ';u3=' + escape(document.referrer) + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
				}
			}
		}
		/** APIA Tags **/
		if(d.shouldFireAgencyTagsFor('sunapia')) { /** APIA Brochureware Tags **/
			d.gRemarketing('1029881151','H4MnCLmcjwQQv_qK6wM',window.google_tag_params,true);
			/**Bella pixel+js tagging for 240**/
			if(s.pageName == 'in:apa:apia:contact-us') {
			    d.downStreamTag("pageview",  "",  "8481",  "", "1589");
				d.gRemarketing('959521971','',window.google_tag_params,true);
			}
            if(s.pageName == 'in:apa:apia:homepage-brand'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah645;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:apa:apia:health-insurance'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=APIAH0;cat=APIAH0;ord=1;num=' + cachebuster + '?');
                var freeCallBtnEle = d.getElementsByClassName('btn call-back secure-popup')[0];
                if(freeCallBtnEle){
                    freeCallBtnEle.onclick = function(){
                        d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=APIAH0;cat=APIAH002;ord=1;num=' + cachebuster + '?');
                        d.imageTag('//pixel.everesttech.net/2247/t?ev_Apia_RequestCallBack=1');
                    };
                }
            }
            if(s.pageName == 'in:apa:apia:mobile:health-insurance'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=APIAH0;cat=APIAH001;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:apa:apia:health-insurance:more-information'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=APIAH0;cat=APIAH00;ord=1;num=' + cachebuster + '?');
            }
			if(s.pageName == 'in:apa:apia:home-insurance:home') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah246;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:apa:apia:home-insurance:apartment') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah757;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:apa:apia:home-insurance:village') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah710;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:apa:apia:home-insurance:assisted-living') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah081;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:apa:apia:home-insurance:landlord') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah669;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:apa:apia') {
				d.downStreamTag("pageview", "", "2795", "2794", "1589");
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah645;ord=1;num=' + cachebuster + '?');
				d.gRemarketing('959521971','',window.google_tag_params,true);
				d.gRemarketing('1002075787','',window.google_tag_params,true);
			}
			if(s.pageName == 'in:apa:apia:end-amazing-getaway-competition') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apia-372;ord=1;num=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apia-110;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:apa:apia:quote-terms-conditions') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiaq659;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:apa:apia:boat-insurance') {
				d.downStreamTag("pageview", "", "2811", "2810", "1589");
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiab704;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_APIABoatProductPage=1", "", "", "2247");
				d.gRemarketing('1002075787','',window.google_tag_params,true);
			}
			if(s.pageName == 'in:apa:apia:caravan-insurance') {
				d.downStreamTag("pageview", "", "2801", "2800", "1589");
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiac712;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_APIAMotorCaravanProductPage=1", "", "", "2247");
				d.gRemarketing('1002075787','',window.google_tag_params,true);
			}
			if(s.pageName == 'in:apa:apia:motorhome-insurance') {
				d.downStreamTag("pageview", "", "2804", "2803", "1589");
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam178;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_APIAMotorhomeProductPage=2", "", "", "2247");
				d.gRemarketing('1002075787','',window.google_tag_params,true);
			}
			if(s.pageName == 'in:apa:apia:nsw-ctp-green-slip-insurance') {
				d.downStreamTag("pageview", "", "2799", "2798", "1589");
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiac020;ord=1;num=' + cachebuster + '?');
				d.gRemarketing('1002075787', '',window.google_tag_params,  true);
			}
			if(s.pageName == 'in:apa:apia:home-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah758;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_APIAHomeProductPage=1", "", "", "2247");
				d.downStreamTag("pageview","","2793","2792","1589");
				d.gRemarketing('959521971', '',window.google_tag_params,  true);
				d.gRemarketing('1002075787', '',window.google_tag_params,  true);
			}
			if(s.pageName == 'in:apa:apia:village-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah832;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_APIAHomeVillageProductPage=1", "", "", "2247");
			}
			if(s.pageName == 'in:apa:apia:apartment-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah606;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_APIAHomeApartmentProductPage=1", "", "", "2247");
			}
			if(s.pageName == 'in:apa:apia:assisted-living-residence-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah408;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_APIAHomeAsstLivingProductPage=1", "", "", "2247");
				d.downStreamTag("transaction", "ev_APIAHomeAsstLivingQ1=1", "", "", "2247");
			}
			if(s.pageName == 'in:apa:apia:landlord-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah649;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_APIAHomeLandlordProductPage=1", "", "", "2247");
			}
			if(s.pageName == 'in:apa:apia:car-insurance') {
				d.downStreamTag("pageview", "", "2797", "2796", "1589");
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam602;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_APIAMotorProductPage=1", "", "", "2247");
				d.gRemarketing('1002075787', '',window.google_tag_params,  true);
			}
			if(s.pageName == 'in:apa:apia:travel-insurance') {
				d.downStreamTag("pageview", "", "2813", "2812", "1589");
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiat581;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_APIATravelProductPage=1", "", "", "2247");
				d.gRemarketing('1002075787', '',window.google_tag_params,  true);
			}
			if(s.pageName == 'in:apa:apia:thank-you-generic') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=pereg657;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_APIACarAdvantageGenEND=1", "", "", "2247", "pixel2247.everesttech.net");
			}
			if(s.pageName == 'in:apa:apia:home-insurance-selector') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah482;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:apa:apia:get-insurance-quote') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiag395;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:apa:apia:car-advantage-campaign-car') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apial957;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_APIACarAdvantageCarSTART=1", "", "", "2247", "pixel2247.everesttech.net");
			}
			if(s.pageName == 'in:apa:apia:thank-you-car') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=hkkbv125;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_APIACarAdvantageCarEND=1", "", "", "2247", "pixel2247.everesttech.net");
			}
			if(s.pageName == 'in:apa:secapp:boat:form:boat_owner_details') {
				d.downStreamTag("transaction", "ev_APIABoatQ1=1", "", "", "2247", "pixel2247.everesttech.net");
			}
			if(s.pageName == 'in:apa:secapp:boat:form:form_completed') {
				d.downStreamTag("transaction", "ev_APIABoatQ2=1&ev_APIABoatQ2Revenue=1", "", "", "2247", "pixel2247.everesttech.net");
			}
			if(s.pageName == 'in:apa:apia:car-advantage-campaign-gen') {
				d.downStreamTag("transaction", "ev_APIACarAdvantageGenSTART=1", "", "", "2247", "pixel2247.everesttech.net");
			}
			if(s.pageName == 'in:apa:apia:car-advantage-campaign-home') {
				d.downStreamTag("transaction", "ev_APIACarAdvantageHomeSTART=1", "", "", "2247", "pixel2247.everesttech.net");
			}
			if(s.pageName == 'in:apa:apia:thank-you-home') {
				d.downStreamTag("transaction", "ev_APIACarAdvantageHomeEND=1", "", "", "2247", "pixel2247.everesttech.net");
			}
			if(s.pageName == 'in:apa:apia:renew-your-policy') {
				d.downStreamTag("pageview", "", "2817", "2816", "1589");
			}
			if(s.pageName == 'in:apa:secapp::selfservice:login') {
				d.downStreamTag("pageview", "", "2815", "2814", "1589");
			}
			if(s.pageName == 'in:apa:apia:home-insurance-index') {
				d.downStreamTag("pageview", "", "2793", "2792", "1589");
			}
			if(s.pageName == 'in:apa:apia:funeral-plan') {
				d.downStreamTag("pageview", "", "2807", "2806", "1589");
				d.gRemarketing('959521971','',window.google_tag_params,true);
				d.gRemarketing('1002075787','',window.google_tag_params,true);
			}
			if(s.pageName == 'in:apa:apia:make-claim') {
				d.downStreamTag("pageview", "", "2819", "2818", "1589");
			}
			if(s.pageName == 'in:apa:apia:injury-support-plan-insurance') {
				d.downStreamTag("pageview", "", "2809", "2808", "1589");
				d.gRemarketing('959521971','',window.google_tag_params,true);
				d.gRemarketing('1002075787','',window.google_tag_params,true);
			} /** APIA Quote Start **/
			if(scEventExists('event8')) {
				if(s.products.indexOf('car_') > -1 || ((typeof s.eVar48 != 'undefined') && s.eVar48.indexOf('car') > -1 && s.eVar48.indexOf('caravan') < 0)) {
					if(s.products.indexOf('car_ctp') > -1) {
						d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiac748;ord=1;num=' + cachebuster + '?');
						d.downStreamTag("transaction", "ev_APIACTPQuote=1", "", "", "2247");
					} else {
						d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam026;ord=1;num=' + cachebuster + '?');
						d.downStreamTag("transaction", "ev_APIAMotorQ1=1", "", "", "2247");
					}
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=custo820;cat=quote495;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('home_') > -1 || ((typeof s.eVar48 != 'undefined') && (s.eVar48 == 'home'))) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah482;ord=1;num=' + cachebuster + '?');

					//for SiteCat-87
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apia-284;ord=1;num=' + cachebuster + '?');

					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=custo820;cat=homeq727;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
					if(s.products.indexOf('village') > -1) {
						d.downStreamTag("transaction", "ev_APIAHomeVillageQ1=1", "", "", "2247");
					} else if(s.products.indexOf('landlord') > -1) {
						d.downStreamTag("transaction", "ev_APIAHomeLandlordQ1=1", "", "", "2247");
					} else if(s.products.indexOf('apartment') > -1) {
						d.downStreamTag("transaction", "ev_APIAHomeApartmentQ1=1", "", "", "2247");
					} else if(s.products.indexOf('assisted') > -1){
					    d.downStreamTag("transaction","ev_APIAHomeAsstLivingQ1=1","","","2247");
			        } else {
						d.downStreamTag("transaction", "ev_APIAHomeQ1=1", "", "", "2247");
					}


				}
				if(s.products.indexOf('caravan') > -1 || (typeof s.eVar48 != 'undefined') && (s.eVar48.indexOf('caravan') > -1)) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiac662;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_APIAMotorCaravanQ1=1", "", "", "2247");
				}
				if(s.products.indexOf('boat') > -1 || ((typeof s.eVar48 != 'undefined') && s.eVar48.indexOf('boat')) > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiab572;ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('motorhome_comprehensive') > -1 || ((typeof s.eVar48 != 'undefined') && s.eVar48.indexOf('motorhome') > -1)) {
					d.downStreamTag("transaction", "ev_APIAMotorhomeQ1=1", "", "", "2247");
				}
			} /** APIA Quote Complete **/
			if(scEventExists('event9')) {
				if(s.products.indexOf('car_') > -1) {
					if(s.products.indexOf('car_ctp') > -1) {
						d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiac055;ord=1;num=' + cachebuster + '?');
						d.downStreamTag("transaction", "ev_APIACTPQuoteRevenue=" + d.getAmount('event14'), "", "", "2247");
					} else {
						d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam262;ord=1;num=' + cachebuster + '?');
						d.downStreamTag("transaction", "ev_APIAMotorQ2=1&ev_APIAMotorQ2Revenue=" + d.getAmount('event14'), "", "", "2247");
					}
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=custo820;cat=quote772;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('caravan') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiac384;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_APIAMotorCaravanQ2=1&ev_APIAMotorCaravanQ2Revenue=" + d.getAmount('event14'), "", "", "2247");
				}
				if(s.products.indexOf('boat') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiab956;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_APIABoatQ2Revenue=" + d.getAmount('event14'), "", "", "2247");
				}
				if(s.products.indexOf('motorhome_comprehensive') > -1) {
					d.downStreamTag("transaction", "ev_APIAMotorhomeQ2=1&ev_APIAMotorhomeQ2Revenue=" + d.getAmount('event14'), "", "", "2247");
				}
				if(s.products.indexOf('home_') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah427;ord=1;num=' + cachebuster + '?');

					//for SiteCat-87
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apia-733;ord=1;num=' + cachebuster + '?');

					if(s.products.indexOf('apartment') > -1) {
						d.downStreamTag("transaction", "ev_APIAHomeApartmentQ2=1&ev_APIAHomeApartmentQ2Revenue=" + d.getAmount('event14'), "", "", "2247");
					} else if(s.products.indexOf('landlord') > -1) {
						d.downStreamTag("transaction", "ev_APIAHomeLandlordQ2=1&ev_APIAHomeLandlordQ2Revenue=" + d.getAmount('event14'), "", "", "2247");
					} else if(s.products.indexOf('village') > -1) {
						d.downStreamTag("transaction", "ev_APIAHomeVillageQ2=1&ev_APIAHomeVillageQ2Revenue=" + d.getAmount('event14'), "", "", "2247");
					} else if(s.products.indexOf('assisted') > -1) {
						d.downStreamTag("transaction", "ev_APIAHomeAsstLivingQ2=1&ev_APIAHomeAsstLivingQ2Revenue=" + d.getAmount('event14'), "", "", "2247");
					} else if(s.products.indexOf('home_buildingcontents') > -1) {
						d.downStreamTag("transaction", "ev_APIAHomeQ2=1&ev_APIAHomeQ2Revenue=" + d.getAmount('event14'), "", "", "2247");
					} else if(s.products.indexOf('buildingcontents') > -1) {
						d.downStreamTag("transaction", "ev_APIAHomeQ2=1&ev_APIAHomeQ2Revenue=" + d.getAmount('event14'), "", "", "2247");
					}
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=custo820;cat=homeq608;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
				}
			} /** APIA Buy Start **/
			if(scEventExists('event17')) {
				if(s.products.indexOf('car_') > -1) {
					if(s.products.indexOf('car_ctp') > -1) {
						d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiac494;ord=1;num=' + cachebuster + '?');
					} else {
						d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apia-810;ord=1;num=' + cachebuster + '?');
					}
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=custo820;cat=polic085;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('boat') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apia-706;ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('motorhome_comprehensive') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam559;ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('home_') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=custo820;cat=homep802;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
				}
			} /** APIA Buy Complete **/
			if(scEventExists('event18')) {
				if(s.products.indexOf('car_') > -1) {
                    d.imageTag('//e.insurance-email.com.au/pub/cct?_ri_=X0Gzc2X%3DWQpglLjHJlYQGnWAEXpINRnzdcmDl2UKyKbO&_ei_=EvbUXkjoD--8aucJKqIf7XA&OrderID='+ s.eVar23 +'&ORDERTOTAL=' + d.getAmount('event19'));
					if(s.products.indexOf('car_ctp') > -1) {
						d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiac633;ord=1;num=' + cachebuster + '?');
						d.downStreamTag("transaction", "ev_APIACTPBuy=" + d.getAmount('event19'), "", "", "2247");
						d.downStreamTag("transaction", "ev_APIACTPBuyRevenue=" + d.getAmount('event19'), "", "", "2247");
					} else {
						d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apia-808;ord=1;num=' + cachebuster + '?');
						d.downStreamTag("transaction", "ev_APIAMotorBuy=1&ev_APIAMotorBuyRevenue=" + d.getAmount('event19'), "", "", "2247");
					}
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=custo820;cat=polic310;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('caravan') > -1) {
					d.downStreamTag("transaction", "ev_APIAMotorCaravanBuy=1&ev_APIAMotorCaravanBuyRevenue=" + d.getAmount('event19'), "", "", "2247");
				}
				if(s.products.indexOf('boat') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apia-014;ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('motorhome_comprehensive') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam121;ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('home_') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=custo820;cat=homep506;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
					d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apia-733;ord=1;num=' + cachebuster + '?');
					if(s.products.indexOf('assisted') > -1) {
						d.downStreamTag("transaction", "ev_APIAHomeAsstLivingBuy=1&ev_APIAHomeAsstLivingBuyRevenue=" + d.getAmount('event19'), "", "", "2247");
					} else if(s.products.indexOf('village') > -1) {
						d.downStreamTag("transaction", "ev_APIAHomeVillageBuy=1&ev_APIAHomeVillageBuyRevenue=" + d.getAmount('event19'), "", "", "2247");
					} else if(s.products.indexOf("apartment") > -1) {
						d.downStreamTag("transaction", "ev_APIAHomeApartmentBuy=1&ev_APIAHomeApartmentBuyRevenue=" + d.getAmount('event19'), "", "", "2247");
					} else if(s.products.indexOf('landlord') > -1) {
						d.downStreamTag("transaction", "ev_APIAHomeLandlordBuy=1&ev_APIAHomeLandlordBuyRevenue=" + d.getAmount('event19'), "", "", "2247");
					} else {
						d.downStreamTag("transaction", "ev_APIAHomeBuy=1&ev_APIAHomeBuyRevenue=" + d.getAmount('event19'), "", "", "2247");
					}
				}
			}
			if(typeof d.protocol != 'undefined' && (d.protocol == 'http:' || s.pageName == 'in:apa:apia:enquire-online')) {
				d.downStreamTag("pageview", "", "2206", "", "2247");
			}
			if(s.eVar61) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=custo820;cat=custo080;u1=' + s.prop3 + ';u2=' + s.eVar61 + ';u5=' + s.eVar62 + ';u3=' + escape(document.referrer) + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
			}
		}
		/** Bingle Tags **/
		if(d.shouldFireAgencyTagsFor('sunbingle')) { /** Bingle Brochureware Tags **/

			d.gRemarketing('1031891490','h593CLD28QMQotSF7AM',window.google_tag_params,true);
			if(s.pageName == 'in:bin:car_insurance:homepage-b' || s.pageName == 'in:bin:car_insurance:homepage-c') {
				d.iframeTag('//1635365.fls.doubleclick.net/activityi;src=1635365;type=bingl903;cat=bingl556;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:bin:car_insurance:suncorp') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=bingl903;cat=bingl538;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:bin:car_insurance:homepage') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=bingl903;cat=bingl556;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_BingleHomePage=1", "1947", "", "2244");
			}
			if(s.pageName === 'in:bin:car_insurance:about-bingle' || s.pageName === 'in:bin:car_insurance:why-bingle') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=bingl903;cat=bingl219;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:bin:car_insurance:comprehensive-car-insurance-105-day') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=bingl903;cat=bingl101;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:bin:car_insurance:car_insurance_victoria' || s.pageName == 'in:bin:car_insurance:car_insurance_nsw' || s.pageName == 'in:bin:car_insurance:save' || s.pageName == 'in:bin:car_insurance:comprehensive-car-insurance-150-day' || s.pageName == 'in:bin:car_insurance:98save' || s.pageName == 'in:bin:car_insurance:nsw_ctp' || s.pageName == 'in:bin:car_insurance:ford' || s.pageName == 'in:bin:car_insurance:hyundai' || s.pageName == 'in:bin:car_insurance:mazda' || s.pageName == 'in:bin:car_insurance:honda' || s.pageName == 'in:bin:car_insurance:toyota' || s.pageName == 'in:bin:car_insurance:nissan' || s.pageName == 'in:bin:car_insurance:mitsubishi' || s.pageName == 'in:bin:car_insurance:holden' || s.pageName == 'in:bin:car_insurance:subaru') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=semla805;cat=semla270;ord=1;num=' + cachebuster + '?');
				if(s.pageName == 'in:bin:car_insurance:save'){
					d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=bingl903;cat=avera564;ord=1;num=' + cachebuster + '?');
				}
			} /** Bingle Quote Start **/
			if(scEventExists('event8')) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=bingl903;cat=quick621;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_BingleQuickPolicyStart=1", "1952", "", "2244");
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=custo426;cat=quote791;u2=' + s.prop3 + ';u5=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
			} /** Bingle Quote Complete **/
			if(scEventExists('event9')) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=bingl938;cat=quick076;qty=1;cost=' + d.getAmount('event14') + ';ord=' + s.eVar22 + '?');
				d.downStreamTag("transaction", "ev_BingleQuickPolicyComplete=1&ev_BingleQuickPolicyCompleteRev=" + d.getAmount('event14'), "1949", "", "2244");
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=custo426;cat=quote803;u2=' + s.prop3 + ';u5=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
			} /** Bingle Buy Start **/
			if(scEventExists('event17')) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=bingl903;cat=buypo666;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_BingleBuyPolicyStart=1", "1950", "", "2244");
				d.downStreamTag("transaction", "ev_BingleQuickPolicyStart=1", "", "", "2244");
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=custo426;cat=polic589;u2=' + s.prop3 + ';u5=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
			} /** Bingle Buy Complete **/
			if(scEventExists('event18')) {
                d.imageTag('//e.insurance-email.com.au/pub/cct?_ri_=X0Gzc2X%3DWQpglLjHJlYQGtRTDzbfirow0H1LJmzeLmAlO&_ei_=Eo1Nk-8CcPPCIKYZVQTDi6U&OrderID='+ s.eVar23 +'&ORDERTOTAL=' + d.getAmount('event19'));
				d.imageTag('//www.s2d6.com/x/?x=sp&h=50819&o=' + s.eVar23 + '&g=865732312299&s=' + d.getAmount('event19') + '&q=1');
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=bingl938;cat=buypo339;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
				d.downStreamTag("transaction", "ev_BinglePolicyComplete=1&ev_BinglePolicyCompleteRev=" + d.getAmount('event19'), "1951", "", "2244");
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=custo426;cat=polic288;u2=' + s.prop3 + ';u5=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
			}
			// Bingle
			if(typeof d.protocol != 'undefined' && d.protocol == 'http:') {
				d.downStreamTag("pageview", "", "2208", "2207", "2244");
			}
			if(s.eVar61) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=custo426;cat=visit009;u3=' + s.eVar61 + ';u2=' + s.prop3 + ';u6=' + s.eVar62 + ';u5=' + escape(document.location.href) + ';u4=' + escape(document.referrer) + ';ord=1;num=' + cachebuster + '?');
			}
		} /** Bingle Facebook App Tags **/
		if(d.shouldFireAgencyTagsFor('sunbinglefacebook')) {
			if(s.pageName == 'in:bin:fbapp:home') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=afltr520;cat=bingl075;ord=1;num=' + cachebuster + '?');
			}
			if(scEventExists('event55')) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1635365;type=afltr520;cat=bingl736;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_BingleComp=1", "", "", "2244");
			}
		} /** GIO Tags **/
		if(d.shouldFireAgencyTagsFor('sungio')) { /** GIO Brochureware Tags **/
			d.gRemarketing('1066334314','PgETCLbSsAQQ6vC7_AM',window.google_tag_params,true);

			if(s.pageName.length > 0 && s.pageName.indexOf('secapp') < 0){
				//Add the piTag for GIO BW pages
				d.aInclude(('https:' == document.location.protocol ? 'https://pi' : 'http://cdn') + '.pardot.com/pd.js');
			}
			if (s.pageName == 'in:gio:Always On:lpdm') {
				d.downStreamTag("transaction", "ev_GIOFDRCompetitionEntryStart_WithPolicyNo=1", "", "", "1485");
				d.gRemarketing('1052874292','4UILCOrFzgQQtKyG9gM',window.google_tag_params,true);
			}
			if (s.pageName == 'in:gio:Always On:Thanks [no lead]') {
				d.downStreamTag("transaction", "ev_GIOFDRCompetitionEntryEnd_WithPolicyNo=1", "", "", "1485");
				d.downStreamTag("transaction", "ev_GIOFDRCompetitionEntryEnd_WithoutPolicyNo=1", "", "", "1485");
				d.downStreamTag("transaction", "ev_GIOFDRCompetitionEntryEnd=1", "", "", "1485");
				d.gRemarketing('1052874292','4UILCOrFzgQQtKyG9gM',window.google_tag_params,true);
			}
			if (s.pageName == 'in:gio:Always On:aq') {
				d.downStreamTag("transaction", "ev_GIOFDRCompetitionEntryStart_WithoutPolicyNo=1", "", "", "1485");
				d.downStreamTag("transaction", "ev_GIOFDRCompetitionEntryStart=1", "", "", "1485");
				d.gRemarketing('1052874292','4UILCOrFzgQQtKyG9gM',window.google_tag_params,true);
			}
			if (s.pageName == 'in:gio:Always On:Terms') {
				d.gRemarketing('1052874292','4UILCOrFzgQQtKyG9gM',window.google_tag_params,true);
			}
			if(s.pageName == 'in:gio:homepage') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2168465;type=busin432;cat=homep366;ord=1;num=' + cachebuster + '');
				d.downStreamTag("pageview", "", "1079", "1078", "1485", "pixel1485.everesttech.net");
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=homep855;cat=gioho037;ord=' + cachebuster + '');
				d.gAdService('1007225733', 'en', '3', 'ffffff', 'CbEHCJvAzAIQhZek4AM', '0');
			}
			if(s.pageName == 'in:gio:mobile:home') {
				d.iframeTag('//ad.au.doubleclick.net/activity;src=1753472;type=homep855;cat=giomo945;ord=1;num=' + cachebuster + '');
			}
			if(s.pageName == 'in:gio:get-a-quote') {
				d.downStreamTag("pageview", "", "1085", "1084", "1485", "pixel1485.everesttech.net");
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=brand713;cat=getaq939;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName.indexOf("in:gio:business-insurance") > -1 && location.protocol == "http:") {
				d.imageTag('//ad.au.doubleclick.net/activity;src=1302792;type=count739;cat=actio241;ord=1;num=' + cachebuster + '?');
				d.iframeTag('//fls.au.doubleclick.net/activityi;src=2168465;type=busin432;cat=busin306;ord=1;num=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=busin032;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:nsw-ctp-green-slip') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=ctpgr267;cat=ctpla926;ord=1;num=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=ctpnw095;cat=ctpin566;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:home-insurance:55up-home-contents') {
				d.iframeTag('//ad.doubleclick.net/activity;src=1041465;type=gioho349;cat=55uph361;ord=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=homep972;cat=55uph656;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:home-insurance:home-contents-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1789374;type=homem555;cat=homep749;ord=1;num=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=homep972;cat=class221;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:home-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1789374;type=homem555;cat=homep847;ord=1;num=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=homep972;cat=homei392;ord=1;num=' + cachebuster + '?');
				d.gAdService('1007225733', 'en', '3', 'ffffff', 'fMK7CLvLzAIQhZek4AM', '0');
			}
			if(s.pageName.indexOf('in:gio:car-insurance:comprehensive-car-insurance') > -1) {
				d.iframeTag('//fls.au.doubleclick.net/activityi;src=1789298;type=motor352;cat=motor709;ord=1;num=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=motor462;cat=compr050;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName.indexOf('in:gio:car-insurance:platinum-car-insurance') > -1) {
				d.iframeTag('//fls.au.doubleclick.net/activityi;src=1753472;type=motor462;cat=motor999;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName.indexOf('in:gio:branch-locator') > -1 || s.pageName.indexOf('in:gio:motor-vehicle-assessment-centres') > -1 || s.pageName.indexOf('in:gio:agency-listing') > -1) {
				d.iframeTag('//ad.au.doubleclick.net/activity;src=1041465;type=giofb205;cat=branc209;ord=' + cachebuster + '?');
			}
			if(s.pageName.indexOf('in:gio:home-insurance:landlord-insurance') > -1) {
				d.iframeTag('//ad.doubleclick.net/activity;src=1041465;type=gioho349;cat=inves733;ord=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=homep972;cat=inves532;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:car-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1789298;type=motor352;cat=motor709;ord=1;num=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=motor462;cat=motor023;ord=1;num=' + cachebuster + '?');
				d.gAdService('1007225733', 'en', '3', 'ffffff', '4bJoCIvCzAIQhZek4AM', '0');
			}
			if(s.pageName == 'in:gio:promotions') {
				d.iframeTag('//fls.au.doubleclick.net/activityi;src=2168465;type=busin432;cat=promo319;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:about-us') {
				d.iframeTag('//ad.doubleclick.net/activity;src=1041465;type=gioho349;cat=about591;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:nsw-ctp-green-slip' || s.pageName == 'in:gio:car-insurance:ctp-greenslip-quote:quote_started') {
				d.downStreamTag("pageview", "", "1081", "1080", "1485", "pixel1485.everesttech.net");
				d.gAdService('1007225733', 'en', '3', 'ffffff', 'bff_CIPDzAIQhZek4AM', '0');
			}
			if(s.pageName == 'in:gio:car-insurance' || s.pageName == 'in:gio:car-insurance:comprehensive-car-insurance' || s.pageName == 'in:gio:car-insurance:third-party-car-insurance' || s.pageName == 'in:gio:car-insurance:car-quote-terms:quote_started' || s.pageName == 'in:gio:car-insurance:third-party-property-damage-insurance') {
				d.downStreamTag("pageview", "", "1083", "1082", "1485", "pixel1485.everesttech.net");
			}
			if(s.pageName == 'in:gio:car-insurance:third-party-property-damage-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=motor462;cat=firet153;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:car-insurance:third-party-car-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=motor462;cat=3rdpa347;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:business-insurance:commercial-vehicle-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=motor462;cat=comme190;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:home-insurance:platinum-home-contents') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=homep972;cat=plati937;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:home-insurance:top-strata-residential-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=homep972;cat=topst040;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:home-insurance:insurance-calculators') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=insur200;cat=insur310;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:travel-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=trave310;cat=trave662;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:travel-insurance:holiday-travel-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=trave310;cat=holid671;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:travel-insurance:annual-multi-trip-travel-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=trave310;cat=multi830;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:boat-caravan-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=boatc113;cat=boatc768;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:boat-caravan-insurance:boat-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=boatc113;cat=boati228;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:boat-caravan-insurance:trailer-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=boatc113;cat=carav738;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:business-insurance:small-businesses-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=small341;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:business-insurance:trade-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=trade966;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:business-insurance:public-liability-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=publi161;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:business-insurance:professionals-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=busin099;ord=1;num=' + cachebuster + '?');
			}
            if(s.pageName == 'in:gio:business-insurance:emergency-response-cover') {
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=Busin0;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-insurance:quote-request'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=busin681;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-insurance:quote-request:thank-you'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=Busin00;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-insurance'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=busin032;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-knowledge-centre'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=Busin000;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-insurance:commercial-vehicle-insurance'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=Comme0;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-insurance:hospitality-insurance'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=hospi712;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-insurance:local-business-insurance-specialist'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=Local0;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-insurance:not-for-profit-insurance'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=notfo099;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-insurance:professional-indemnity-insurance'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=Profe0;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-insurance:professionals-insurance'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=busin099;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-insurance:public-liability-insurance'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=publi161;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-insurance:retail-insurance'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=retai276;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-insurance:small-business-insurance'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=small341;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-insurance:trade-insurance'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=trade966;ord=1;num=' + cachebuster + '?');
            }
            if(s.pageName == 'in:gio:business-insurance:truck-insurance'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=Truck0;ord=1;num=' + cachebuster + '?');
            }
			if(s.pageName == 'in:gio:secapp:business_enquiry:form:form_completed') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=busin681;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:business-insurance:hospitality-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=hospi712;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:business-insurance:retail-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=retai276;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:business-insurance:not-for-profit-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=notfo099;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:personal-life-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=lifel821;cat=lifei850;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("pageview",  "",  "5857",  "", "1589", "pixel.everesttech.net");
				d.gRemarketing('959521971','',window.google_tag_params,true);
				d.gRemarketing('1013406781','',window.google_tag_params,true);
			}
			if(s.pageName == 'in:gio:personal-life-insurance:life-protection-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=lifel821;cat=lifep065;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("pageview",  "",  "5865",  "", "1589", "pixel.everesttech.net");
				d.gRemarketing('959521971','',window.google_tag_params,true);
			}
			if(s.pageName == 'in:gio:personal-life-insurance:funeral-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=lifel821;cat=funer760;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("pageview",  "",  "5873",  "", "1589", "pixel.everesttech.net");
				d.gRemarketing('959521971','',window.google_tag_params,true);
			}
			if(s.pageName == 'in:gio:personal-life-insurance:accidental-injury-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=lifel821;cat=accid313;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("pageview",  "",  "5881",  "", "1589", "pixel.everesttech.net");
				d.gRemarketing('959521971','',window.google_tag_params,true);
				d.gRemarketing('1013406781','',window.google_tag_params,true);
			}
			if(s.pageName == 'in:gio:personal-life-insurance:accidental-death-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=lifel821;cat=accid336;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:workers-compensation-insurance:quote-request') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=worke613;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:workers-compensation-insurance:quote-request:thank-you') {
				d.downStreamTag("transaction", "ev_GIOCI_WCOnlineFormEnd=1", "", "", "1827");
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=worke552;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:insurance:campaigns:better-protection') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=brand713;cat=bette517;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:car-insurance:campaigns:2yearprice') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=brand713;cat=2year075;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:gio:secapp:motor:quote:vehicle_details') {
				if(s.products.indexOf('car_comprehensive') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1789298;type=motor352;cat=q1beg962;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_motorquote1=1", "", "", "1485");
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=quote936;cat=carqu109;ord=1;num=' + cachebuster + '?');
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=custo128;cat=car-s441;u3=' + s.prop3 + ';u6=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
				}
			}
			if(s.pageName == 'in:gio:mobile:secapp:ctp:quote:quote_started') {
				d.downStreamTag("transaction", "ev_gioctp_quotestart_mob=1", "1416", "1415", "1485");
				d.iframeTag('//ad.au.doubleclick.net/activity;src=1753472;type=quote936;cat=ctpqu304;ord=1;num=' + cachebuster + '?');
				d.gAdService('1007225733', 'en', '3', 'ffffff', 'fEoqCLPMzAIQhZek4AM', '0');
			}
			if(s.pageName == 'in:gio:business-insurance:quote-request:thank-you') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=busin681;ord=1;num=' + cachebuster + '?');
			}

			//for SiteCat-94
			if(s.pageName == 'in:gio:platinum-car-insurance-campaign-4' || s.pageName == 'in:gio:platinum-car-insurance-campaign-3' || s.pageName == 'in:gio:car-insurance:campaigns:car-insurance-sem-lp') {
				d.gAdService("1007225733", "en", "3", "ffffff", "PniSCNPXzAIQhZek4AM", "0");
			}
			if(s.pageName == 'in:gio:nsw-ctp-green-slip:campaigns:sem1' || s.pageName == 'in:gio:nsw-ctp-green-slips:campaigns:green-slip-without-blind-spots') {
				d.gAdService("1007225733", "en", "3", "ffffff", "Sa6PCJPuzAIQhZek4AM", "0");
			}
			if(s.pageName == 'in:gio:home-insurance:campaigns:sem1' || s.pageName == 'in:gio:home-insurance:campaigns:sem2') {
				d.gAdService("1007225733", "en", "3", "ffffff", "qQVGCOvyzAIQhZek4AM", "0");
			}
			if(s.pageName == 'in:gio:make-a-claim') {
				d.gAdService("1007225733", "en", "3", "ffffff", "KPi0CKPR5AIQhZek4AM", "0");
			}
			//end of SiteCat-94


			/** GIO Quote Start **/
			if(scEventExists('event8')) {
				if(s.products.indexOf('car_') > -1) {
					d.bazaarvoiceTags('quote_start');
				}
				if(s.products.indexOf('car_ctp') > -1) {
					d.downStreamTag("transaction", "ev_gioctp_quotestart=1", "1416", "1415", "1485");
					d.downStreamTag("transaction", "ev_gioctp_quotestart_mob=1", "1416", "1415", "1485");
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=quote936;cat=ctpqu649;ord=1;num=' + cachebuster + '?');
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=custo128;cat=ctpqu942;u3=' + s.prop3 + ';u6=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
					d.gAdService('1007225733', 'en', '3', 'ffffff', '1aqCCJPQzAIQhZek4AM', '0');
				}
				if(s.products.indexOf('home_') > -1 || ((typeof s.eVar48 != 'undefined') && s.eVar48.indexOf('home') > -1)) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1789374;type=homem555;cat=quote676;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_homequote1=1", "", "", "1485");
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=quote936;cat=homeq008;ord=1;num=' + cachebuster + '?');
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=custo128;cat=homeq733;u3=' + s.prop3 + ';u6=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
					d.gAdService('1007225733', 'en', '3', 'ffffff', 'GPH5CPPTzAIQhZek4AM', '0');
				}
				if(s.products.indexOf('travel') > -1 || ((typeof s.eVar48 != 'undefined') && s.eVar48.indexOf('travel') > -1)) {
					d.downStreamTag("transaction", "ev_GioTvlQuoteStart=1", "", "", "1485");
				}
				if(s.products.indexOf('car_platinum') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=quote936;cat=plati705;ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('car_comprehensive') > -1) {
					d.gAdService('1007225733', 'en', '3', 'ffffff', 'fEoqCLPMzAIQhZek4AM', '0');
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=quote936;cat=carqu109;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_motorquote1=1", "", "", "1485");
				}
			} /** GIO Quote Complete **/
			if(scEventExists('event9')) {
				if(s.products.indexOf('car_') > -1) {
					d.bazaarvoiceTags('quote_completed');
				}
				if(s.products.indexOf('car_comprehensive') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1789298;type=motor352;cat=q9quo601;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_motorquote2=1&ev_GioMotorInsQuoteEndValue=" + d.getAmount('event14'), "", "", "1485");
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=quote936;cat=carqu404;ord=1;num=' + cachebuster + '?');
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=custo128;cat=carqu632;u3=' + s.prop3 + ';u6=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
					d.gAdService('1007225733', 'en', '3', 'ffffff', 'ePqRCKvNzAIQhZek4AM', '0');
				}
				if(s.products.indexOf('car_platinum') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=quote936;cat=plati338;ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('car_ctp') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=ctpgr434;cat=q2-qu398;qty=1;cost=' + d.getAmount('event14') + ';ord=' + s.eVar22 + '?');
					d.downStreamTag("transaction", "ev_gioctp_quoteend=1&ev_gioctpquotevalue=" + d.getAmount('event14'), "1417", "", "1485");
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=quote936;cat=ctpqu553;ord=1;num=' + cachebuster + '?');
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=custo128;cat=homeq777;u3=' + s.prop3 + ';u6=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
					d.gAdService('1007225733', 'en', '3', 'ffffff', 'Bx0RCIvRzAIQhZek4AM', '0');
				}
				if(s.products.indexOf('home_') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1789374;type=homem555;cat=quote777;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_homequote2=1&ev_GioHomeInsQuoteEndValue=" + d.getAmount('event14'), "", "", "1485");
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=quote936;cat=homeq415;ord=1;num=' + cachebuster + '?');
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=custo128;cat=ctpqu942;u3=' + s.prop3 + ';u6=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
					d.gAdService('1007225733', 'en', '3', 'ffffff', 'czBXCOvUzAIQhZek4AM', '0');
				}
				if(s.products.indexOf('travel') > -1) {
					d.downStreamTag("transaction", "ev_GioTvlQuoteEnd=1&ev_GioTvlQuoteRevenue=" + d.getAmount('event14'), "", "", "1485");
				}
				if(s.pageName == 'in:gio:mobile:secapp:ctp:quote:quote_completed') {
					d.downStreamTag("transaction", "ev_gioctp_quoteend_mob=1&ev_gioctpquotevalue_mob=" + d.getAmount('event14'), "1417", "", "1485");
					d.iframeTag('//ad.au.doubleclick.net/activity;src=1753472;type=quote936;cat=gioct008;ord=1;num=' + cachebuster + '?');
				}
			} /** GIO Buy Start **/
			if(scEventExists('event17')) {
				if(s.products.indexOf('car_') > -1) {
					d.bazaarvoiceTags('buy_start');
				}
				if(s.products.indexOf('car_comprehensive') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=polic782;cat=carpo369;ord=1;num=' + cachebuster + '?');
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=custo128;cat=carpo203;u3=' + s.prop3 + ';u6=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
					d.gAdService('1007225733', 'en', '3', 'ffffff', '2vcpCKPOzAIQhZek4AM', '0');
				}
				if(s.products.indexOf('car_ctp') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=ctpgr267;cat=purch095;ord=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_gioctp_appstart=1", "1418", "", "1485");
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=polic782;cat=ctppo956;ord=1;num=' + cachebuster + '?');
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=custo128;cat=homep467;u3=' + s.prop3 + ';u6=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
					d.gAdService('1007225733', 'en', '3', 'ffffff', 'BocUCIPSzAIQhZek4AM', '0');
				}
				if(s.products.indexOf('home_') > -1) {
					d.downStreamTag("transaction", "ev_homeapply1=1", "", "", "1485");
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=polic782;cat=homep366;ord=1;num=' + cachebuster + '?');
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=custo128;cat=ctpqu942;u3=' + s.prop3 + ';u6=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
					d.gAdService('1007225733', 'en', '3', 'ffffff', 'mtM_COPVzAIQhZek4AM', '0');
				}
				if(s.products.indexOf('car_platinum') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=polic782;cat=motor126;ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('travel') > -1) {
					d.downStreamTag("transaction", "ev_GioTvlAppStart=1", "", "", "1485");
				}
				if(s.pageName == 'in:gio:mobile:secapp:ctp:buy:buy_started') {
					d.downStreamTag("transaction", "ev_gioctp_appstart_mob=1", "1418", "", "1485");
					d.iframeTag('//ad.doubleclick.net/activity;src=1753472;type=polic782;cat=ctppo882;ord=1;num=' + cachebuster + '?');
				}
			} /** GIO Buy Complete **/
			if(scEventExists('event18')) {
				if(s.products.indexOf('car_') > -1) {
					d.bazaarvoiceTags('buy_completed');
                    d.imageTag('//e.insurance-email.com.au/pub/cct?_ri_=X0Gzc2X%3DWQpglLjHJlYQGuHza7Mry4NalqI630v9MKs3&_ei_=EvyJvne-_4e3HhsduPDx6B8&OrderID='+ s.eVar23 +'&ORDERTOTAL=' + d.getAmount('event19'));
				}
				if(s.products.indexOf('car_comprehensive') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1789298;type=polic661;cat=app7p683;qty=1;cost=' + d.getAmount('event19') + ';u2=' + s.eVar23 + ';ord=' + s.eVar23 + '?');
					d.downStreamTag("transaction", "ev_motorbuy=1&ev_motororderval=" + d.getAmount('event19'), "", "", "1485");
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=polic782;cat=carpo240;ord=1;num=' + cachebuster + '?');
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=custo128;cat=carpo857;u3=' + s.prop3 + ';u6=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
					d.gAdService('1007225733', 'en', '3', 'ffffff', 'hmpdCJvPzAIQhZek4AM', '0');
				}
				if(s.products.indexOf('car_ctp') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=ctpgr434;cat=purch432;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
					d.downStreamTag("transaction", "ev_ctpbuy=1&ev_ctporderval=" + d.getAmount('event19'), "1419", "", "1485");
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=polic782;cat=ctppo669;ord=1;num=' + cachebuster + '?');
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=custo128;cat=homep842;;u3=' + s.prop3 + ';u6=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
					d.gAdService('1007225733', 'en', '3', 'ffffff', 'jTi7CPvSzAIQhZek4AM', '0');
				}
				if(s.products.indexOf('car_platinum') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=polic782;cat=motor633;ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('home_') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1789374;type=polic348;cat=app7p409;qty=1;cost=' + d.getAmount('event19') + ';u1=' + d.getAmount('event19') + ';u2=' + s.eVar23 + ';ord=' + s.eVar23 + '?');
					d.downStreamTag("transaction", "ev_homeapply2=1&ev_homeappval=" + d.getAmount('event19'), "", "", "1485");
					d.downStreamTag("transaction", "ev_homebuy=1&ev_homeordereval=" + d.getAmount('event19'), "", "", "1485");
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=polic782;cat=homep845;ord=1;num=' + cachebuster + '?');
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=custo128;cat=ctpqu942;u3=' + s.prop3 + ';u6=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
					d.gAdService('1007225733', 'en', '3', 'ffffff', '21CoCNvWzAIQhZek4AM', '0');
				}
				if(s.products.indexOf('travel') > -1) {
					d.downStreamTag("transaction", "ev_GioTvlAppPurchase=1&ev_GioTvlAppRevenue=" + d.getAmount('event19'), "", "", "1485");
				}
				if(s.pageName == 'in:gio:mobile:secapp:ctp:buy:buy_completed') {
					d.downStreamTag("transaction", "ev_ctpbuy_mob=1&ev_ctporderval_mob=" + d.getAmount('event19'), "1419", "", "1485");
					d.iframeTag('//ad.au.doubleclick.net/activity;src=1753472;type=polic782;cat=ctppo628;ord=1;num=' + cachebuster + '?');
				}
			}
			if(s.pageName.indexOf('in:gio:business-insurance') < 0 && s.pageName.indexOf('in:gio:workers-compensation-insurance') < 0 && typeof d.protocol != 'undefined' && d.protocol == 'http:') {
				d.downStreamTag("pageview", "", "2196", "2195", "1485");
			}
			if(s.pageName.indexOf('in:gio:business-insurance') > -1 && typeof d.protocol != 'undefined' && d.protocol == 'http:') {
				d.downStreamTag("pageview", "", "2200", "2199", "1827");
			}
			if(s.pageName.indexOf('in:gio:workers-compensation-insurance') > -1 && typeof d.protocol != 'undefined' && d.protocol == 'http:') {
				d.downStreamTag("pageview", "", "2200", "2199", "1827");
				if(s.pageName != 'in:gio:workers-compensation-insurance:quote-request:thank-you') {
					d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=busin038;cat=worke182;ord=1;num=' + cachebuster + '?');
				}
			}
			if(s.eVar61) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1753472;type=custo128;cat=visit162;u4=' + s.eVar61 + ';u3=' + s.prop3 + ';u7=' + s.eVar62 + ';u6=' + escape(document.location.href) + ';u5=' + escape(document.referrer) + ';ord=1;num=' + cachebuster + '?');
			}
		} /** IMR Tags **/
		if(d.shouldFireAgencyTagsFor('suninsuremyride')) { /** IMR Brochureware Tags **/
			if(s.pageName == 'in:imr:homepage') {
				d.downStreamTag("transaction", "ev_IMRHomePage=1", "", "", "2218");

				//for SiteCat-73
				d.imageTag('http://www.googleadservices.com/pagead/conversion/1030509047/?value=0&label=3uu5CMOhwAMQ96Ox6wM&guid=ON&script=0');
			}

			//for SiteCat-73
			if(s.pageName == 'in:imr:insurance:lp:comprehensive' || s.pageName == 'in:imr:insurance:lp:one-dollar' || s.pageName == 'in:imr:insurance:lp:all-products') {
				d.imageTag('http://www.googleadservices.com/pagead/conversion/1030509047/?value=0&label=3uu5CMOhwAMQ96Ox6wM&guid=ON&script=0');
			}

			if(s.pageName == 'in:imr:imr:nsw-ctp-green-slip-insurance:quote_started') {
				d.imageTag('http://www.googleadservices.com/pagead/conversion/1030509047/?value=0&label=lhfbCLuiwAMQ96Ox6wM&guid=ON&script=0');
			}

			if(s.pageName == 'in:imr:secapp:motorcycle:selfservice:selfservice:loginOrRegister' || s.pageName == 'in:imr:imr:make-claim') {
				d.imageTag('http://www.googleadservices.com/pagead/conversion/1030509047/?value=0&label=Sm5fCLOjwAMQ96Ox6wM&guid=ON&script=0');
			}

			if(s.pageName == 'in:imr:secapp:motorcycle:quote:quote_started') {
				d.imageTag('http://www.googleadservices.com/pagead/conversion/1030509047/?value=0&label=mGGfCKukwAMQ96Ox6wM&guid=ON&script=0');
			}

			if(s.pageName == 'in:imr:secapp:motorcycle:quote:quote_completed' && scEventExists('event9')) {
				d.imageTag('http://www.googleadservices.com/pagead/conversion/1030509047/?value=0&label=yPj7CKOlwAMQ96Ox6wM&guid=ON&script=0');
			}

			if(s.pageName == 'in:imr:secapp:motorcycle:buy:buy_started') {
				d.imageTag('http://www.googleadservices.com/pagead/conversion/1030509047/?value=0&label=XETiCJumwAMQ96Ox6wM&guid=ON&script=0');
			}

			if(s.pageName == 'in:imr:secapp:motorcycle:buy:buy_completed') {
				d.imageTag('http://www.googleadservices.com/pagead/conversion/1030509047/?value=0&label=6G33CJOnwAMQ96Ox6wM&guid=ON&script=0');
			}
			//end of SiteCat-73
			if(s.pageName == 'in:imr:mobile') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2340099;type=insur971;cat=imrmo559;ord=1;num=' + cachebuster + '?');
			}

			/** IMR Quote Start **/
			if(scEventExists('event8')) {
				if(s.products.indexOf('ctp') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2340099;type=insur971;cat=ctpqu125;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_IMRCTPQuoteStart=1", "", "", "2218");
				} else {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2340099;type=insur971;cat=imrqu505;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_IMRBikeQuoteStart=1", "", "", "2218");
				}
			} /** IMR Quote Complete **/
			if(scEventExists('event9')) {
				if(s.products.indexOf('ctp') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2340099;type=insur561;cat=ctpqu075;qty=1;cost=' + d.getAmount('event14') + ';ord=' + s.eVar22 + '?');
					d.downStreamTag("transaction", "ev_IMRCTPQ2=1", "", "", "2218");
				} else {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2340099;type=insur561;cat=bikeq894;qty=1;cost=' + d.getAmount('event14') + ';ord=' + s.eVar22 + '?');
					d.downStreamTag("transaction", "ev_IMRBikeQuoteComplete=1&ev_IMRBikeQuoteRevenue=" + d.getAmount('event14'), "", "", "2218");
				}
			} /** IMR Buy Start **/
			if(scEventExists('event17')) {
				if(s.products.indexOf('ctp') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2340099;type=insur971;cat=ctppo409;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_IMRCTPBuyStart=1", "", "", "2218");
				} else {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2340099;type=insur971;cat=bikeb850;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_IMRBikeBuyPolicyStart=1", "", "", "2218");
				}
			} /** IMR Buy Complete **/
			if(scEventExists('event18')) {
				if(s.products.indexOf('ctp') > -1) {
                    d.imageTag('//e.insurance-email.com.au/pub/cct?_ri_=X0Gzc2X%3DWQpglLjHJlYQGoaje8FHNEo2zdwWaiyw1zdfk&_ei_=Er-BG2RYhvRVKIA781ujpcI&OrderID='+ s.eVar23 +'&ORDERTOTAL=' + d.getAmount('event19'));
					d.iframeTag('//fls.doubleclick.net/activityi;src=2340099;type=insur561;cat=ctppo247;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
					d.downStreamTag("transaction", "ev_IMRCTPBuyEnd=1&ev_IMRBuyPolicyRevenue=" + d.getAmount('event19'), "", "", "2218");
				} else {
					d.imageTag('//www.s2d6.com/x/?x=sp&h=62474&o=' + s.eVar23 + '&g=394373132212&s=' + d.getAmount('event19') + '&q=1');
					d.iframeTag('//fls.doubleclick.net/activityi;src=2340099;type=insur561;cat=bikeb016;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
					d.downStreamTag("transaction", "ev_IMRBikeBuyPolicyComplete=1&ev_IMRBikeBuyPolicyRevenue=" + d.getAmount('event19'), "", "", "2218");
				}
			}
			if(typeof d.protocol != 'undefined' && (d.protocol == 'http:' || s.pageName == 'in:imr:imr:help:need-help' || s.pageName == 'in:imr:imr:contact-us')) {
				d.downStreamTag("pageview", "", "2210", "2209", "2218");
				d.iframeTag('//fls.doubleclick.net/activityi;src=2340099;type=insur971;cat=imrho297;ord=1;num=' + cachebuster + '?');
			}
		} /** Just Car Tags **/
		if(d.shouldFireAgencyTagsFor('sunjustcar')) { /** Just Car Brochureware Tags **/
			if(s.pageName == 'in:jci:homepage') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1017099;type=justc188;cat=homep313;ord=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=1017099;type=justc188;cat=hsvpr387;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_JCIMotorHomePage=1", "", "", "2246");

				//for SiteCat-73
				d.imageTag('http://www.googleadservices.com/pagead/conversion/1049034812/?value=0&label=d8vYCMD50AMQvICc9AM&guid=ON&script=0');
			}
			if(s.pageName == 'in:jci:talk-to-us.asp') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1017099;type=justc188;cat=conta546;ord=' + cachebuster + '?');
			}

			//for SiteCat-73
			if(s.pageName == 'in:jci:car-insurance-claims') {
				d.imageTag('http://www.googleadservices.com/pagead/conversion/1049034812/?value=0&label=sQMBCKj80AMQvICc9AM&guid=ON&script=0');
			}

			/** Just Car Quote Start **/
			if(scEventExists('event8')) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1017099;type=justc188;cat=start507;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_JCIMotorQ1=1", "", "", "2246");

				//for SiteCat-73
				d.imageTag('http://www.googleadservices.com/pagead/conversion/1049034812/?value=0&label=a4c5CLj60AMQvICc9AM&guid=ON&script=0');
			} /** Just Car Quote Complete **/
			if(scEventExists('event9')) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1017099;type=justc188;cat=jciqo881;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_JCIMotorQ2=1&ev_JCIMotorQ2Rev=" + d.getAmount('event14'), "", "", "2246");

				//for SiteCat-73
				d.imageTag('http://www.googleadservices.com/pagead/conversion/1049034812/?value=0&label=HknyCLD70AMQvICc9AM&guid=ON&script=0');
			} /** Just Car Buy Start **/
			if(scEventExists('event17')) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1017099;type=justc188;cat=endof645;ord=1;num=' + cachebuster + '?');

				//for SiteCat-73
				d.imageTag('http://www.googleadservices.com/pagead/conversion/1049034812/?value=0&label=55JFCKD90AMQvICc9AM&guid=ON&script=0');
			} /** Just Car Buy Complete **/
			if(scEventExists('event18')) {
                d.imageTag('//e.insurance-email.com.au/pub/cct?_ri_=X0Gzc2X%3DWQpglLjHJlYQGowN5DNJ9j4s2N7uzf6NzdLwG&_ei_=Eu3byc48flTPoV-wFNOd984&OrderID='+ s.eVar23 +'&ORDERTOTAL=' + d.getAmount('event19'));
				d.iframeTag('//fls.doubleclick.net/activityi;src=1017099;type=justc188;cat=jcibu917;ord=1;num=' + cachebuster + '?');
				d.imageTag('//www.s2d6.com/x/?x=sp&h=62474&o=' + s.eVar23 + '&g=394373132212&s=' + d.getAmount('event19') + '&q=1');
				d.downStreamTag("transaction", "ev_JCIMotorBuy=1&ev_JCIMotorBuyRev=" + d.getAmount('event19'), "", "", "2246");

				//for SiteCat-73
				d.imageTag('http://www.googleadservices.com/pagead/conversion/1049034812/?value=0&label=Qxd3CJj-0AMQvICc9AM&guid=ON&script=0');
			}
			if(typeof d.protocol != 'undefined' && (d.protocol == 'http:' || s.pageName == 'in:jci:contact-us')) {
				d.downStreamTag("pageview", "", "2212", "2211", "2246");
			}
		} /** Shannons Tags **/
		if(d.shouldFireAgencyTagsFor('sunshannons')) { /** Shannons Brochureware Tags **/
			d.gRemarketing('1030106862','MFH6CKqitgQQ7t2Y6wM',window.google_tag_params,true);
			if(s.pageName == 'in:shn:homepage') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=shann428;cat=shann467;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_SHHomePage=1", "", "", "2219");
			}
			if(s.pageName == 'in:shn:promo:goodwoodferrari') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=goodw213;cat=shann946;ord=1;num=' + cachebuster + '?')
			}
			if(s.pageName == 'in:shn:promo:goodwoodferrari:thankyou') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=goodw213;cat=shann434;ord=1;num=' + cachebuster + '?')
			}
			if(s.pageName == 'in:shn:promo:goodwoodferrari:referralthankyou') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=goodw213;cat=shann927;ord=1;num=' + cachebuster + '?')
			} /** Shannons Quote Start **/
			if(scEventExists('event8')) {
				if(s.products.indexOf('car_') > -1 || ((typeof s.eVar48 != 'undefined') && s.eVar48.indexOf('car') > -1)) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=shann428;cat=carqu177;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_SHCarQuoteStart=1", "", "", "2219");
				}
				if(s.products.indexOf('home_') > -1 || ((typeof s.eVar48 != 'undefined') && s.eVar48.indexOf('home') > -1)) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=shann428;cat=homeq059;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_SHHomeQuoteStart=1", "", "", "2219");
				}
				if(s.products.indexOf('motorcycle_') > -1 || ((typeof s.eVar48 != 'undefined') && s.eVar48.indexOf('bike') > -1)) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=shann428;cat=bikeq828;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_SHBikeQuoteStart=1", "", "", "2219");
				}
			} /** Shannons Quote Complete **/
			if(scEventExists('event9')) {
				if(s.products.indexOf('car_') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=shann754;cat=carqu345;qty=1;cost=' + d.getAmount('event14') + ';ord=' + s.eVar22 + '?');
					d.downStreamTag("transaction", "ev_SHCarQuoteComplete=1&ev_SHCarQuoteCompleteRev=" + d.getAmount('event14'), "", "", "2219");
				}
				if(s.products.indexOf('home_') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=shann754;cat=homeq858;qty=1;cost=' + d.getAmount('event14') + ';ord=' + s.eVar22 + '?');
					d.downStreamTag("transaction", "ev_SHHomeQuoteComplete=1&ev_SHHomeQuoteCompleteRev=" + d.getAmount('event14'), "", "", "2219");
				}
				if(s.products.indexOf('motorcycle_') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=shann754;cat=bikeq867;qty=1;cost=' + d.getAmount('event14') + ';ord=' + s.eVar22 + '?');
					d.downStreamTag("transaction", "ev_SHBikeQuoteComplete=1&ev_SHBikeQuoteCompleteRev=" + d.getAmount('event14'), "", "", "2219");
				}
			} /** Shannons Buy Start **/
			if(scEventExists('event17')) {
				if(s.products.indexOf('car_') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=shann428;cat=carbu956;ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('home_') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=shann428;cat=homeb430;ord=1;num=' + cachebuster + '?');
				}
				if(s.products.indexOf('motorcycle_') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=shann428;cat=bikeb432;ord=1;num=' + cachebuster + '?');
				}
			} /** Shannons Buy Complete **/
			if(scEventExists('event18')) {
				if(s.products.indexOf('car_') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=shann754;cat=carbu572;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
                    d.imageTag('//e.insurance-email.com.au/pub/cct?_ri_=X0Gzc2X%3DWQpglLjHJlYQGoaje8FHNEo2zdwWaiyw1zdfk&_ei_=Er-BG2RYhvRVKIA781ujpcI&OrderID='+ s.eVar23 +'&ORDERTOTAL=' + d.getAmount('event19'));
				}
				if(s.products.indexOf('home_') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=shann754;cat=homeb373;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
				}
				if(s.products.indexOf('motorcycle_') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=2339994;type=shann754;cat=bikeb499;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
				}
			}
			if(typeof d.protocol != 'undefined' && d.protocol == 'http:') {
				d.downStreamTag("pageview", "", "2214", "2213", "2219");
			}
		}

		/** Suncorp Tags **/
		if(d.shouldFireAgencyTagsFor('sun')) { /** Suncorp Brochureware Tags **/
			d.gRemarketing('1052146104','-tuMCODCmgQQuPPZ9QM',window.google_tag_params,true);
			/** SEM Tags **/
			var semTags = [
			                {
								conversion: 1004226082,
								pages: [
						                'bk:sun:secapp:superonline:acquire:sundirectsuperemployerapply',
						                'bk:sun:secapp:superonline:acquire:sundirectsuperemployersubmit',
						                'bk:sun:bank-accounts',
						                'bk:sun:financial-services',
						                'bk:sun:savings',
						                'bk:sun:investing',
						                'bk:sun:bank-accounts:business',
						                'bk:sun:business-banking',
						                'bk:sun:loans:business-loans:calculators-and-tools',
						                'bk:sun:loans:business-loans',
						                'bk:sun:savings:term-deposits',
						                'bk:sun:credit-cards:business-card',
						                'bk:sun:financial-services:merchant-services',
						                'bk:sun:super:sites:default:files:campaign:index2.html',
						                'bk:sun:secapp:eds:manage:dashboard',
						                'bk:sun:secapp:superonline:manage:dashboard',
                                        'bk:sun:home-loans',
                                        'bk:sun:home-loans:options:home-package-plus',
                                        'bk:sun:home-loans:calculators-and-tools',
                                        'bk:sun:home-loans:fixedrate',
                                        'bk:sun:home-loans:homeinvesting',
                                        'bk:sun:home-loans:calculators-and-tools:how-much-can-i-borrow',
                                        'bk:sun:home-loans:calculators-and-tools:repayments',
                                        'bk:sun:bank-accounts:personal-transactions',
                                        'bk:sun:loans:car-loans',
                                        'bk:sun:investing:margin-lending',
                                        'bk:sun:investing:term-deposits',
                                        'bk:sun:credit-cards:rewards:gold-card',
                                        'bk:sun:credit-cards:rewards:platinum-card',
                                        'sp:sun:secapp:sales:superonline:apply:account_type',
                                        'sp:sun:secapp:sales:superonline:apply:application_completed:everydaysuper_new'
						               ]
							},
							{
								conversion: 994343173,
								pages: [
						                'bk:sun:credit-cards',
						                'bk:sun:credit-cards:clear-options-card',
						                'bk:sun:credit-cards:rewards',
						                'bk:sun:credit-cards:business-card',
						                'bk:sun:credit-cards:card-comparison-table',
						                'bk:sun:credit-cards:useful-forms-and-links',
						                'bk:sun:credit-cards:fees-and-charges'
						               ]
						}];
			for (var i = 0; i < semTags.length; i++) {
				for (var j = 0; j < semTags[i].pages.length; j++) {
					if (s.pageName == semTags[i].pages[j]) {
						d.imageTag('//googleads.g.doubleclick.net/pagead/viewthroughconversion/' + semTags[i].conversion + '/?value=0&guid=ON&script=0');
						break;
					}
				}
			}
			/** Everday Super Tags **/
			if(s.pageName == 'bk:sun:secapp:superonline:acquire:sundirectsuperemployerapply') {
				d.downStreamTag("transaction","ev_DirectSuperEmployerAppStart=1","","","1589","pixel.everesttech.net");
			}
			if(s.pageName == 'bk:sun:secapp:superonline:acquire:sundirectsuperemployersubmit') {
				d.downStreamTag("transaction","ev_DirectSuperEmployerAppEnd=1&ev_transid=" + cachebuster,"","","1589","pixel.everesttech.net");
			}
			/** Suncorp Bank Tags **/
            //term deposits confirmation page
			if(s.pageName == 'bk:sun:investing:margin-lending:contact') {
				d.imageTag("//pixel.everesttech.net/1589/t?ev_MarginLendingEnquiryEnd=1");
			}
			if(s.pageName == 'bk:sun:about:ways-to-bank:mobile-banking') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_091;cat=2014_00;ord=1;num=' + cachebuster + '?');
            }
			if(s.pageName == 'bk:sun:bank-accounts:personal-transactions:compare-accounts') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_-;cat=2014_---;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:bank-accounts:personal-transactions:how-to-apply-online') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_-;cat=2014_--_;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:bank-accounts:personal-transactions:how-to-guide') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_-;cat=2014_--;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:bank-accounts:interest-rates') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_-;cat=2014_--0;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:bank-accounts:personal-transactions') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_-;cat=2014_-;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:savings:term-deposits:interest-rates') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_111;cat=2014_-;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:savings:savings-accounts:campaign:saver') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_140;cat=2014_525;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:savings:savings-accounts:campaign:online') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_140;cat=2014_689;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:savings:term-deposits:campaign:great') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_140;cat=2014_196;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:homeloanequity') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_091;cat=2014_079;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:payitoff') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_091;cat=2014_520;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:fixedrate') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_426;cat=2014_101;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:homeloans') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_426;cat=2014_334;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:super:sites:default:files:campaign:index2.html') {
				d.iframeTag('//1792027.fls.doubleclick.net/activityi;src=1792027;type=sunco016;cat=every750;ord=1;num=' + cachebuster + '?');
			}
            if(s.pageName == 'bk:sun:homepage') {
			    d.downStreamTag("pageview","","5749","","1589","pixel.everesttech.net");
				d.downStreamTag("pageview","","2198","2197","1589","pixel.everesttech.net");
				d.gRemarketing('983345818','2uxDCP611wcQmtXy1AM',window.google_tag_params,true);
				d.imageTag('//googleads.g.doubleclick.net/pagead/viewthroughconversion/983345818/?value=0&label=2uxDCP611wcQmtXy1AM&guid=ON&script=0');
                d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=SUN14;cat=Sunco0;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:agribusiness') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_545;cat=2013_611;ord=1;num=' + cachebuster + '?');
                d.downStreamTag("pageview","","5755","","1589","pixel.everesttech.net");
				d.downStreamTag("pageview","","2198","2197","1589","pixel.everesttech.net");
				d.gRemarketing('983345818','2uxDCP611wcQmtXy1AM',window.google_tag_params,true);
				d.imageTag('//googleads.g.doubleclick.net/pagead/viewthroughconversion/983345818/?value=0&label=2uxDCP611wcQmtXy1AM&guid=ON&script=0');

			}
            if(s.pageName == 'bk:sun:bank-accounts') {
				d.downStreamTag("pageview","","5750","","1589","pixel.everesttech.net");
				d.downStreamTag("pageview","","2198","2197","1589","pixel.everesttech.net");
				d.gRemarketing('983345818','2uxDCP611wcQmtXy1AM',window.google_tag_params,true);
				d.imageTag('//googleads.g.doubleclick.net/pagead/viewthroughconversion/983345818/?value=0&label=2uxDCP611wcQmtXy1AM&guid=ON&script=0');
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_126;cat=banka644;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:agribusiness:farm-management-deposit-account') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_545;cat=2013_130;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:agribusiness:cash-flow-solutions') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_545;cat=2013_968;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:agribusiness:loans') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_545;cat=2013_590;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:agribusiness:contact') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_545;cat=2013_925;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:secapp:agribusiness_enquiry:form:form_started') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_545;cat=2013_815;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction","ev_SuncorpAgriEnquireStart=1","","","1589","pixel.everesttech.net");
			}
		    if(s.pageName == 'bk:sun:secapp:agribusiness_enquiry:form:form_completed') {
		    	d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_545;cat=2013_612;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction","ev_SuncorpAgriEnquireEnd=1","","","1589","pixel.everesttech.net");
		    }
			if(s.pageName == 'bk:sun:secapp:termdeposit_enquiry:form:form_started') {
				d.downStreamTag("transaction","ev_TermDepositEnqStart=1","","","1589","pixel.everesttech.net");
			}
			if(s.pageName == 'bk:sun:campaign:termdeposits') {
				d.imageTag('//pixel.everesttech.net/1589/t?ev_TermDepositEnqStart=1');
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_999;cat=2013_234;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:credit-cards') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_284;cat=2013_602;ord=1;num=' + cachebuster + '?');
                d.downStreamTag("pageview","","5754","","1589","pixel.everesttech.net");
				d.downStreamTag("pageview","","2198","2197","1589","pixel.everesttech.net");
				d.gRemarketing('983345818','2uxDCP611wcQmtXy1AM',window.google_tag_params,true);
				d.imageTag('//googleads.g.doubleclick.net/pagead/viewthroughconversion/983345818/?value=0&label=2uxDCP611wcQmtXy1AM&guid=ON&script=0');
			}
			if(s.pageName == 'bk:sun:credit-cards:card-comparison-table') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_284;cat=2013_988;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:credit-cards:rewards:platinum-card') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_284;cat=2013_053;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:credit-cards:rewards:gold-card') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_284;cat=2013_250;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:credit-cards:clear-options-card') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_284;cat=2013_046;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:credit-cards:business-card') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_284;cat=2013_022;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:credit-cards:rewards:about') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_284;cat=2013_156;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:home-loans') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_897;cat=2013_010;ord=1;num=' + cachebuster + '?');
			}
            if(s.pageName == 'bk:sun:home-loans:wowfactor'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_426;cat=HomeL0;ord=1;num=' + cachebuster + '?"');
            }
			if(s.pageName == 'bk:sun:home-loans:apply') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_897;cat=2013_087;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:secapp:homeloan_lenderappointment:form:form_started') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_897;cat=2013_362;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:secapp:homeloan_lenderappointment:form:form_completed') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_897;cat=2013_358;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:home-loans:choose-a-loan:how-to-guide') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_897;cat=2013_848;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:home-loans:calculators-and-tools') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_897;cat=2013_888;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:home-loans:calculators-and-tools:repayments') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_897;cat=2013_687;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:home-loans:calculators-and-tools:mortgage-offset') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_897;cat=2013_963;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:home-loans:options') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_897;cat=2013_011;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:home-loans:enquiry') {
                d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=retai179;cat=enqui913;ord=1;num=' + cachebuster + '?');
                d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=OurPlace;cat=2014_00;ord=1;num=' + cachebuster + '?');
			} else if(s.pageName == 'bk:sun:home-loans:enquiry:submit') {
				d.imageTag("//pixel.everesttech.net/1589/t?ev_LenderAppointments=1&ev_LenderApptValue=300000");
                d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=retai179;cat=enqui764;ord=1;num=' + cachebuster + '?');
                d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=OurPlace;cat=2014_000;ord=1;num=' + cachebuster + '?');
			}
            if(s.pageName == 'bk:sun:home-loans:campaign:our-place'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=OurPlace;cat=2014_0;ord=1;num=' + cachebuster + '?');
            }
			if(s.pageName == 'bk:sun:loans' || s.pageName == 'bk:sun:loans:personal-loans' || s.pageName == 'bk:sun:loans:business-loans' || s.pageName == 'bk:sun:home-loans') {
				d.downStreamTag("pageview","","5753","","1589","pixel.everesttech.net");
				d.downStreamTag("pageview","","2198","2197","1589","pixel.everesttech.net");
				d.gRemarketing('983345818','2uxDCP611wcQmtXy1AM',window.google_tag_params,true);
				d.imageTag('//googleads.g.doubleclick.net/pagead/viewthroughconversion/983345818/?value=0&label=2uxDCP611wcQmtXy1AM&guid=ON&script=0');
			}
			if(s.pageName == 'bk:sun:loans:business-loans') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_356;cat=2013_665;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:loans:personal-loans') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_621;cat=2013_581;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:loans:personal-loans:interest-rates') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_621;cat=2013_503;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:loans:car-loans') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_621;cat=2013_968;ord=1;num=' + cachebuster + '?');
			}
            if(s.pageName == 'bk:sun:loans:car-loans:campaign:carloans'){
                d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_497;cat=2014_0;ord=1;num=' + cachebuster + '?');
            }
			if(s.pageName == 'bk:sun:savings' || s.pageName == 'bk:sun:savings:savings-accounts'){
				d.downStreamTag("pageview","","5751","","1589","pixel.everesttech.net");
				d.downStreamTag("pageview","","2198","2197","1589","pixel.everesttech.net");
				d.gRemarketing('983345818','2uxDCP611wcQmtXy1AM',window.google_tag_params,true);
				d.imageTag('//googleads.g.doubleclick.net/pagead/viewthroughconversion/983345818/?value=0&label=2uxDCP611wcQmtXy1AM&guid=ON&script=0');
				if(s.pageName == 'bk:sun:savings') {
					d.iframeTag('//1792027.fls.doubleclick.net/activityi;src=1792027;type=2013_772;cat=2013_738;ord=1;num=' + cachebuster + '?');
				}
			}
			if(s.pageName == 'bk:sun:savings:savings-accounts:help-me-choose') {
				d.iframeTag('//1792027.fls.doubleclick.net/activityi;src=1792027;type=2013_772;cat=2013_059;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:savings:savings-accounts:eoptions') {
				d.iframeTag('//1792027.fls.doubleclick.net/activityi;src=1792027;type=2013_772;cat=2013_054;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:bank-accounts:personal-transactions:everyday-options') {
				d.iframeTag('//1792027.fls.doubleclick.net/activityi;src=1792027;type=2013_772;cat=2013_950;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:savings:term-deposits' || s.pageName == 'bk:sun:savings:term-deposits:personal' || s.pageName == 'bk:sun:savings:term-deposits:business'){
				d.downStreamTag("pageview","","5752","","1589","pixel.everesttech.net");
				d.downStreamTag("pageview","","2198","2197","1589","pixel.everesttech.net");
				d.gRemarketing('983345818','2uxDCP611wcQmtXy1AM',window.google_tag_params,true);
				d.imageTag('//googleads.g.doubleclick.net/pagead/viewthroughconversion/983345818/?value=0&label=2uxDCP611wcQmtXy1AM&guid=ON&script=0');
				if(s.pageName == 'bk:sun:savings:term-deposits:personal') {
					d.iframeTag('//1792027.fls.doubleclick.net/activityi;src=1792027;type=2013_999;cat=termd100;ord=1;num=' + cachebuster + '?');
				}
			}
			if(s.pageName == 'bk:sun:savings:term-deposits') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_999;cat=2013_658;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:savings:term-deposits:calculator') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_999;cat=2013_607;ord=1;num=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_111;cat=2014_--;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:savings:term-deposits:enquiry') {
				d.downStreamTag("transaction","ev_TermDepositEnqStart=1","","","1589","pixel.everesttech.net");
                d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=termd706;cat=termd443;ord=1;num=' + cachebuster + '?');
			} else if(s.pageName == 'bk:sun:secapp:termdeposit_enquiry:form:form_completed') {
                d.downStreamTag("transaction","ev_TermDepositEnqEnd=1","","","1589","pixel.everesttech.net");
                d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=termd373;cat=termd848;ord=1;num=' + cachebuster + '?');
            }
		    if(s.pageName == 'bk:sun:secapp:deposits:apply:application_started:nonproductspecific') {
		    	d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=every293;cat=perso273;ord=1;num=' + cachebuster + '?');
		    }
		    if(s.pageName == 'bk:sun:secapp:personalloan:apply:application_started') {
		    	d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=perso941;cat=perso440;ord=1;num=' + cachebuster + '?');
		    } else if(s.pageName == 'bk:sun:secapp:personalloan:apply:application_completed') {
		    	d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=perso941;cat=perso247;ord=1;num=' + cachebuster + '?');
		    }
			if(s.pageName == 'bk:sun:bank-accounts:personal-transactions') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_772;cat=2013_815;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:bank-accounts:business-transactions:business-everyday-account') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_772;cat=2013_639;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:bank-accounts:personal-transactions:everyday-basics') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_772;cat=2013_826;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:sites:default:files:campaign:compareaccounts:index.html') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_772;cat=2013_431;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:bank-accounts:personal-transactions') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_772;cat=2013_924;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:savings:savings-accounts:kids-savings-account') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_772;cat=2013_872;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:bank-accounts:personal-transactions:55-plus-account') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_772;cat=2013_109;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:bank-accounts:business-transactions:compare-accounts') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_772;cat=2013_300;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:investing' || s.pageName == 'bk:sun:investing:margin-lending'){
				d.downStreamTag("pageview","","5756","","1589","pixel.everesttech.net");
				d.downStreamTag("pageview","","2198","2197","1589","pixel.everesttech.net");
				d.gRemarketing('983345818','2uxDCP611wcQmtXy1AM',window.google_tag_params,true);
				d.imageTag('//googleads.g.doubleclick.net/pagead/viewthroughconversion/983345818/?value=0&label=2uxDCP611wcQmtXy1AM&guid=ON&script=0');
			}
			if(s.pageName == 'bk:sun:investing:margin-lending') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_930;cat=2013_808;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:investing:margin-lending:how-to-apply') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_930;cat=2013_937;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:financial-services:merchant-services') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_662;cat=2013_977;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:financial-services:merchant-services:enquire') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_662;cat=2013_616;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:business:enquire') {
				d.imageTag('//pixel1589.everesttech.net/1589/t?ev_SUNBizBankEnqStart=1');
			} else if(s.pageName == 'bk:sun:business-banking:thankyou') {
				d.imageTag('//pixel1589.everesttech.net/1589/t?ev_SUNBizBankEnqEnd=1');
			}
			if(s.pageName == 'bk:sun:foreign-currency') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_887;cat=2013_466;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:foreign-currency:travel-money:foreign-currench-cash') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_887;cat=2013_987;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:foreign-currency:travel-money:cash-passport') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2013_887;cat=2013_632;ord=1;num=' + cachebuster + '?');
			}

			/** Suncorp Insurance Tags **/
			if(s.pageName == 'in:sun:secapp:financialplanner_enquiry:form:form_started') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=trans957;cat=trans998;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:secapp:financialplanner_enquiry:form:form_completed') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=trans957;cat=trans231;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:sites:default:files:campaign:funeralplan:index') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_731;cat=funer226;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:funeral-plan') {
				d.ifrmaeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_731;cat=sunco463;ord=1;num=' + cachebuster + '?');
				d.facebookTag('658553810846510');
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:free-info-pack') {
			    d.downStreamTag("transaction","ev_SuncorpLifeInfoQStart=1","3342","3341","1589","pixel.everesttech.net");
			    d.facebookTag('658553810846510');
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:free-info-pack:thank-you') {
			    d.downStreamTag("transaction","ev_SuncorpLifeInfoQEnd=1","3344","3343","1589","pixel.everesttech.net");
			}
			if(s.pageName == 'in:sun:insurance') {
			    d.downStreamTag("pageview", "", "2603", "2602", "1589");
				d.gRemarketing('959521971','',window.google_tag_params,true);
			}
			if(s.pageName == 'in:sun:homepage') {
			    d.downStreamTag("pageview", "", "2601", "2600", "1589");
				d.gRemarketing('959521971','',window.google_tag_params,true);
				d.gRemarketing('1004226082','',window.google_tag_params,true);
				d.facebookTag('658553810846510');
                d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=2014_0;cat=2014_0;ord=1;num=' + cachebuster + '?');
			}

			/* Tags released June 2013 */
			if(s.pageName == 'in:sun:insurance:home') {
				d.downStreamTag("pageview","","8585","","1589");
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homepi13;cat=2013_121;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:home-contents') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homepi13;cat=2013_205;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:home-building') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homepi13;cat=2013_478;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:home:contents') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homepi13;cat=2013_956;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:landlord') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homepi13;cat=2013_515;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:car') {
				d.downStreamTag("pageview","","8593","","1589");
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=motopi13;cat=2013_940;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:car:comprehensive') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=motopi13;cat=2013_255;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:car:third-party') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=motopi13;cat=2013_229;ord=1;num=' + cachebuster + '?');
			}
			/**/
			if(s.pageName == 'in:sun:insurance:sites:default:files:fm:campaigns:choice:index_choice_popups.htm') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=motor841;cat=motor448;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:campaigns:must-have-home-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homec285;cat=homei493;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=sunco948;ord=' + cachebuster + '?');
				d.facebookTag('658553810846510');
			}
			if(s.pageName == 'in:sun:sites:default:files:campaign:lifeprotect:index.html') {
				d.facebookTag('658553810846510');
			}
			/* Outdated tag
			if(s.pageName == 'in:sun:insurance:car-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=carno953;cat=carin431;ord=' + cachebuster + '?');
			}
			*/
			if(s.pageName == 'in:sun:insurance:car-insurance:comprehensive-car-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=carno953;cat=carin481;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:car-insurance:comprehensive-car-insurance-detail') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=carno953;cat=carin721;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:ctp') {
				d.downStreamTag("pageview","","8601","", "1589");
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=carno953;cat=ctpho286;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:car-insurance:third-party-damage-cover') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=carno953;cat=third173;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:car-insurance:third-party-damage-cover-detail') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=carno953;cat=third421;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:car-insurance:fire-theft-third-party-damage') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=carno953;cat=firet371;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:car-insurance:fire-theft-third-party-damage-detail') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=carno953;cat=firet355;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:suncorpmotor') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=carno953;cat=safer948;ord=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=teaml760;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:lowestctp:index.html') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=sunco023;cat=ctpin259;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:landlord:index.html') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=sunco023;cat=sunco744;ord=' + cachebuster + '?');
			}
			/* Outdated tag
			if(s.pageName == 'in:sun:insurance:boat-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=boatc644;cat=boati052;ord=' + cachebuster + '?');
			}
			*/
			if(s.pageName == 'in:sun:insurance:boat') {
			    d.downStreamTag("pageview","","3093","3092", "1589");
			}
			if(s.pageName == 'in:sun:insurance:boat-insurance:comprehensive-boat-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=boatc644;cat=boati419;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:boat-insurance:comprehensive-boat-insurance-detail') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=boatc644;cat=boati758;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:boat-insurance:essential-cover') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=boatc644;cat=boati365;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:boat-insurance:faqs') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=boatc644;cat=boati301;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:motorhome-caravan-trailer') {
			    d.downStreamTag("pageview","","3089","3088","1589");
			}
			/* Outdated tag
			if(s.pageName == 'in:sun:insurance:motorcycle-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=motor205;cat=motor072;ord=' + cachebuster + '?');
			}
			*/
			if(s.pageName == 'in:sun:insurance:motorcycle-insurance:comprehensive-motorcycle-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=motor205;cat=motor899;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:motorcycle-insurance:comprehensive-motorcycle-insurance-detail') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=motor205;cat=motor807;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:motorcycle-insurance:fire-theft-third-party-damage') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=motor205;cat=motor864;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:motorcycle-insurance:fire-theft-third-party-damage-detail') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=motor205;cat=motor658;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:motorcycle-insurance:third-party-damage-cover') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=motor205;cat=motor355;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:motorcycle-insurance:third-party-damage-cover-detail') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=motor205;cat=motor528;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:motorcycle') {
			    d.downStreamTag("pageview","","3097","3096", "1589");
			}
			/* Outdated tag
			if(s.pageName == 'in:sun:insurance:home-contents-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homec285;cat=homei719;ord=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=gener465;cat=conte964;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:home-contents-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homec285;cat=homei719;ord=' + cachebuster + '?');
			}
			*/
			/* Outdated tag
			if(s.pageName == 'in:sun:insurance:home-contents-insurance:home-contents') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homec285;cat=class304;ord=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homec285;cat=unlim071;ord=' + cachebuster + '?');
			}
			*/
			if(s.pageName == 'in:sun:insurance:home-contents-insurance:home-summary') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homec285;cat=summa806;ord=' + cachebuster + '?');
			}
			/* Outdated tag
			if(s.pageName == 'in:sun:insurance:home-contents-insurance:investor') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homec285;cat=inves808;ord=' + cachebuster + '?');
			}
			*/
			if(s.pageName == 'in:sun:insurance:home-contents-insurance:investor-summary') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homec285;cat=summa865;ord=' + cachebuster + '?');
			}
			/* Outdated tag
			if(s.pageName == 'in:sun:insurance:home-contents-insurance:platinum') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homec285;cat=plati910;ord=' + cachebuster + '?');
			}
			*/
			if(s.pageName == 'in:sun:insurance:home-contents-insurance:55up') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homec285;cat=55uph983;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:home-contents-insurance:55up-summary') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homec285;cat=summa369;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:life-insurance') {
				d.downStreamTag("pageview", "", "1977", "1976", "1589");
				d.gRemarketing('959521971','',window.google_tag_params,true);
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=lifei356;ord=' + cachebuster + '?');
				d.facebookTag('658553810846510');
				d.aInclude('//maxymiser.hs.llnwd.net/o36/suncorp/js/mmcore.js');
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:life-protect-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=3608486;type=lifep968;cat=scsun221;ord=' + cachebuster + '?');
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=lifei959;ord=' + cachebuster + '?');
				d.facebookTag('658553810846510');
				d.downStreamTag("pageview", "", "3084", "", "1589");
				d.gRemarketing('959521971','',window.google_tag_params,true);
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:funeral-plan') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=funer281;ord=' + cachebuster + '?');
				d.downStreamTag("pageview", "", "3103", "", "1589");
				d.gRemarketing('959521971','',window.google_tag_params,true);
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:accidental-injury-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=accid626;ord=' + cachebuster + '?');
				d.facebookTag('658553810846510');
				d.downStreamTag("pageview", "", "3105", "", "1589");
				d.gRemarketing('959521971','',window.google_tag_params,true);
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:accidental-death') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=accid003;ord=' + cachebuster + '?');
				d.downStreamTag("pageview", "", "3107", "3106", "1589");
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:lifeguard') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=sunco263;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:life-cover') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=lifec667;ord=' + cachebuster + '?');
				d.facebookTag('658553810846510');
				d.aInclude('//maxymiser.hs.llnwd.net/o36/suncorp/js/mmcore.js');
				d.downStreamTag("pageview","","8569","","1589");
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:life-insurance-resources') {
			    d.downStreamTag("pageview","","8577","","1589");
			    d.facebookTag('658553810846510');
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:recovery-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=traum006;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:recovery-insurance:sun-recovery') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=sunco436;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:recovery-protect') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=recov777;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:perm-disablement') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=total531;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:income-protection') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=incom630;ord=' + cachebuster + '?');
				d.aInclude('//maxymiser.hs.llnwd.net/o36/suncorp/js/mmcore.js');
				d.downStreamTag("pageview", "", "3101", "3100", "1589");
				d.downStreamTag("pageview", "", "4678", "4677", "1589");
				d.gRemarketing('959521971','',window.google_tag_params,true);
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:income-protection:business-expenses') {
				d.downStreamTag("pageview","","8617","", "1589");
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=incom152;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:transit-storage-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=trans022;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:travel-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=trave696;ord=' + cachebuster + '?');
				d.downStreamTag("pageview", "", "3110", "3109", "1589");
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:financial-adviser') {
			    d.downStreamTag("pageview","","8609","","1589");
			}
			if(s.pageName == 'bk:sun:super') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=sunco016;cat=sunco473;ord=1;num=' + cachebuster + '?');
			}if(s.pageName == 'bk:sun:super:what-we-offer:everyday-super-account') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=sunco016;cat=sunco142;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'bk:sun:personal') {
				d.downStreamTag("pageview", "", "3112", "3111", "1589");
			}
			if(s.pageName == 'bk:sun:everyday-super') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=sunco016;cat=sunco307;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("pageview", "", "5156", "5155", "1589");
			}
			if(s.pageName == 'sp:sun:secapp:sales:superonline:apply:account_type') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=sunco016;cat=sunco114;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_DirectSuperApplyStart=1", "", "", "1589");
			}
			if(s.pageName == 'bk:sun:secapp:eds:apply:application_started:eds_super') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=sunco016;cat=sunco333;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_DirectSuperNew1About=1", "5158", "5157", "1589");
			}
			if(s.pageName == 'sp:sun:secapp:sales:superonline:apply:review_details:everydaysuper_new') {
				d.downStreamTag("transaction", "ev_DirectSuperNew2Review=1", "", "", "1589");
			}
			if(s.pageName == 'sp:sun:secapp:sales:superonline:apply:application_completed:everydaysuper_new') {
				d.downStreamTag("transaction", "ev_DirectSuperNew3End=1", "5160", "5159", "1589");
			}
			if(s.pageName == 'bk:sun:personal:superannuation') {
				d.downStreamTag("pageview", "", "5154", "5153", "1589");
			}
			if(s.pageName == 'sp:sun:secapp:sales:superonline:apply:application_started:everydaysuper_withib') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=sunco016;cat=sunco318;ord=1;num=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_DirectSuperExistingStart=1", "", "", "1589");
			}
			if(s.pageName == 'sp:sun:secapp:sales:superonline:apply:application_started:everydaysuper_withoutib') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=1792027;type=sunco016;cat=sunco055;ord=1;num=' + cachebuster + '?');
                var registerBtn = document.getElementById('logOnToIB');
                registerBtn.onclick = function(e){
                    var target = e.target? e.target: e.srcElement;
                    d.imageTag("//pixel.everesttech.net/1589/t?ev_DirectSuperExistingRegister=1");
                    setTimeout("document.location = '" + target.href + "'", 800);
                    return false;
                }
			}
			/* Outdated tag
			if(s.pageName == 'in:sun:insurance:get-a-quote') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur183;cat=insur737;ord=' + cachebuster + '?');
			}
			*/
			if(s.pageName == 'in:sun:insurance:ctp:multiple-policy-discounts') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=multi930;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('suncorp.com.au/insurance/get-a-quote?node=1921') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur183;cat=carin840;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('suncorp.com.au/insurance/get-a-quote?node=1969') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur183;cat=homec111;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:ctp:quote') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur183;cat=ctpin329;ord=' + cachebuster + '?');
				d.downStreamTag("transaction", "ev_SunCTPQuote=1", "", "", "1589");
			}
			if(s.pageName == 'in:sun:insurance:caravan-trailer-insurance') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=boatc644;cat=carav002;ord=' + cachebuster + '?');
				d.downStreamTag("pageview", "", "3089", "3088", "1589");
			}
			if(s.pageName == 'in:sun:insurance:caravan-trailer-insurance:quote') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur183;cat=carav403;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:boat-insurance:quote') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur183;cat=boati194;ord=' + cachebuster + '?');
				d.downStreamTag("pageview", "", "3093", "3092", "1589");
			}
			if(s.pageName == 'in:sun:insurance:motorcycle-insurance:quote') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur183;cat=motor008;ord=' + cachebuster + '?');
				d.downStreamTag("pageview", "", "3097", "3096", "1589");
			}
			if(s.pageName == 'in:sun:insurance:transit-storage-insurance:quote') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur183;cat=trans402;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:familyctp:index.html') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=sunco023;cat=ctpin231;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:suncorpmotor:community-grant-scheme') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=qpssp332;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:suncorpmotor:youngcare-to-drive-change') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=young903;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('webapps.suncorp.com.au/eGI/index.jsp') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=sunco755;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('webapps.suncorp.com.au/eGI/jsp/findQuote.jsp') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=sunco604;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('webapps.suncorp.com.au/eGI/InitiateQuote.do?riskTypeCode=VSN') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=motor382;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('webapps.suncorp.com.au/eGI/MotorPersonalDetails.do?action=next') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=motor848;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('webapps.suncorp.com.au/eGI/MotorMiscellaneousDetails.do?action=next') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=motor418;ord=1;num=' + cachebuster + '?');
			}
			if(document.URL.indexOf('webapps.suncorp.com.au/eGI/MotorPolicySummary.do?action=processApplication') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=motor846;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('webapps.suncorp.com.au/eGI/payment/invoice.jsp') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=aqgxc790;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('webapps.suncorp.com.au/eGI/HomeMiscellaneousDetails.do?action=next') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=homec054;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('webapps.suncorp.com.au/eGI/InitiateQuote.do?riskTypeCode=HOM&productType=I') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=inves690;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('webapps.suncorp.com.au/eGI/HomeMiscellaneousDetails.do?action=next') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=inves467;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('webapps.suncorp.com.au/eGI/InitiateQuote.do?riskTypeCode=HOM&productType=U') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=55uph637;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('webapps.suncorp.com.au/eGI/InitiateQuote.do?riskTypeCode=HOM&productType=P') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=plati804;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:carquote') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur183;cat=carin028;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('floodfacts.suncorp.com.au/#/intro') > -1) {

				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=homec285;cat=flood570;ord=' + cachebuster + '?');
			}
			if(document.URL.indexOf('info.suncorp.com.au/insurance/familyctp/index.html') > -1) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=sunco023;cat=ctpin231;ord=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:life-insurance-quotes') {
				d.downStreamTag("transaction", "ev_SUNQuotePageStart=1", "3086", "3085", "1589");
			}



			if(s.pageName == 'in:sun:insurance:home:contents') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=sunco023;cat=conte394;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:landlord') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=sunco023;cat=sunco744;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:ctp') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=sunco023;cat=ctpcl464;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:sites:default:files:campaign:familyctp:index.html') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=sunco023;cat=ctpin149;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:lp:CTP Switch:Switch Landing Page') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=ctpap010;cat=ctpsw448;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:lp:CTP Switch:Confirm Page') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=ctpap010;cat=ctpsw412;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:lp:CTP Switch:Thank you') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=ctpap010;cat=ctpsw654;ord=1;num=' + cachebuster + '?');
                d.downStreamTag('transaction','ev_SunCTPSwitch=1','','','1589','piexel.everesttech.net');
			}
			if(s.pageName == 'in:sun:insurance:safer-roads:community-grant-scheme') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=qpssp332;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:safer-roads:youngcare-to-drive-change') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=young903;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:safer-roads') {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=misce517;cat=teaml760;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:sun:insurance:life-insurance:bill-protect'){
				d.downStreamTag("pageview", "", "5488", "5487", "1589");
			}


			/** Suncorp Quote Start **/
			if(scEventExists('event8')) {
				if(s.products.indexOf('car') > -1 || s.products.indexOf('motor') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=motor382;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_SunMotorInsQuoteStart=1", "", "", "1589");
				}
				if(s.products.indexOf('car_ctp') > -1) {
					d.downStreamTag("transaction", "ev_SunCTPGetAQuoteStart=1", "", "", "1589");
				}
				if(s.products.indexOf('home') > -1) {
					d.downStreamTag("transaction", "ev_SunHomeInsQuoteStart=1", "", "", "1589");
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=homec059;ord=1;num=' + cachebuster + '?');
					d.bazaarvoiceTags('quote_start');
				}
				if(s.products.indexOf('travel') > -1) {
					d.downStreamTag("transaction", "ev_SunTvlQuoteStart=1", "", "", "1589");
				}
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=custo071;cat=quote131;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
			} /** Suncorp Quote Complete **/
			if(scEventExists('event9')) {
				if(s.products.indexOf('car') > -1 || s.products.indexOf('motor') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=motor418;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_SunMotorInsQuoteEnd=1&ev_SunMotorInsQuoteEndValue=" + d.getAmount('event14'), "", "", "1589");
				}
				if(s.products.indexOf('home') > -1) {
					d.downStreamTag("transaction", "ev_SunHomeInsQuoteEnd=1&ev_SunHomeInsQuoteEndValue=" + d.getAmount('event14'), "", "", "1589");
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur879;cat=homec329;ord=1;num=' + cachebuster + '?');
					d.bazaarvoiceTags('quote_completed');
				}
				if(s.products.indexOf('travel') > -1) {
					d.downStreamTag("transaction", "ev_SunTvlQuoteEnd=1&ev_SunTvlQuoteRevenue=" + d.getAmount('event14'), "", "", "1589");
				}
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=custo071;cat=quote889;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
			} /** Suncorp Buy Start **/
			if(scEventExists('event17')) {
				if(((s.products.indexOf('car_comprehensive') > -1 || s.products.indexOf('car_platinum') > -1) && s.products.indexOf('branch') < 0) || s.products.indexOf('motor') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=motor111;cat=carin250;ord=1;num=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_SunMotorInsAppStart=1", "", "", "1589");
				}
				if(s.products.indexOf('car_ctp') > -1) {
					d.downStreamTag("transaction", "ev_SunCTPFormFirst=1", "", "", "1589");
				}
				if(s.products.indexOf('home') > -1) {
					d.downStreamTag("transaction", "ev_SunHomeInsAppStart=1", "", "", "1589");
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur172;cat=homei380;ord=1;num=' + cachebuster + '?');
					d.bazaarvoiceTags('buy_start');
				}
				if(s.products.indexOf('travel') > -1) {
					d.downStreamTag("transaction", "ev_SunTvlAppStart=1", "", "", "1589");
				}
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=custo071;cat=polic702;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
			} /** Suncorp Buy Complete **/
			if(scEventExists('event18')) {
                if (s.products.indexOf('car_') > -1){
                    d.imageTag('//e.insurance-email.com.au/pub/cct?_ri_=X0Gzc2X%3DWQpglLjHJlYQGoLyyzcWfueuEXzfvzePv8HSEf&_ei_=EgSWf0UqF264ZI3R5QCgPJs&OrderID='+ s.eVar23 +'&ORDERTOTAL=' + d.getAmount('event19'));
                }
                if(((s.products.indexOf('car_comprehensive') > -1 || s.products.indexOf('car_platinum') > -1) && s.products.indexOf('branch') < 0) || s.products.indexOf('motor') > -1) {
                    d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=motor111;cat=carin321;ord=1;num=' + cachebuster + '?');
                    d.downStreamTag("transaction", "ev_SunMotorInsAppEnd=1&ev_SunMotorInsAppEndValue=" + d.getAmount('event19'), "", "", "1589");
				}
				if(s.products.indexOf('car_ctp') > -1) {
					d.downStreamTag("transaction", "ev_SunCTPFormThankYou=1", "", "", "1589");
				}
				if(s.products.indexOf('home') > -1) {
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur172;cat=homei233;ord=' + cachebuster + '?');
					d.downStreamTag("transaction", "ev_SunHomeInsAppEnd=1&ev_SunHomeInsAppEndValue=" + d.getAmount('event19'), "", "", "1589");
					d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=insur172;cat=homei233;ord=1;num=' + cachebuster + '?');
					d.bazaarvoiceTags('buy_completed');
				}
				if(s.products.indexOf('travel') > -1) {
					d.downStreamTag("transaction", "ev_SunTvlAppPurchase=1&ev_SunTvlAppRevenue=" + d.getAmount('event19'), "", "", "1589");
				}
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=custo071;cat=polic404;u1=' + s.prop3 + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName.indexOf('in:sun:insurance:business-insurance') < 0 && s.pageName.indexOf('in:sun:insurance') > -1 && typeof d.protocol != 'undefined' && (d.protocol == 'http:' || s.pageName == 'in:sun:insurance:contactus:email')) {
				d.downStreamTag("pageview", "", "2609", "2608", "1589");
			}
			if(s.eVar61) {
				d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=custo071;cat=visit641;u5=' + s.eVar62 + ';u1=' + s.prop3 + ';u2=' + s.eVar61 + ';u3=' + escape(document.referrer) + ';u4=' + escape(document.location.href) + ';ord=1;num=' + cachebuster + '?');
			}
		}

		/** CIL Tags **/
		if(d.shouldFireAgencyTagsFor('suncil')) { /** Just Car Brochureware Tags **/
			d.gRemarketing('1023122950','duJzCJLOrwUQhrzu5wM',window.google_tag_params,true);
			if(s.pageName == 'in:cil:request-a-quote') {
				if(s.getQueryParam('sid')) {
					d.downStreamTag("transaction", "ev_CILQuoteSubmit=1", "", "", "2340");
				} else {
					d.iframeTag('//fls.doubleclick.net/activityi;src=3249960;type=carav890;cat=reque811;ord=1;num=' + cachebuster + '?');
				}
			}
			if(s.pageName == 'in:cil:homepage') {
				d.imageTag('//ad.au.doubleclick.net/activity;src=3249960;type=carav890;cat=cilho622;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:cil:rv-insurance') {
				d.imageTag('//ad.doubleclick.net/activity;src=3249960;type=carav890;cat=vehic706;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:cil:rv-insurance:product-disclosure-statement') {
				d.imageTag('//ad.doubleclick.net/activity;src=3249960;type=carav890;cat=pdswi394;ord=1;num=' + cachebuster + '?');
			}
			if(s.pageName == 'in:cil:request-a-quote-confirmation') {
				d.imageTag('//ad.doubleclick.net/activity;src=3249960;type=carav890;cat=reque997;ord=1;num=' + cachebuster + '?');
				d.imageTag('//pixel.everesttech.net/2340/t?ev_C2C=1');
			}
		}

		/** Terri Scheer Tags **/
		if(d.shouldFireAgencyTagsFor('sunterri')) {
			d.gRemarketing('1033607546','0edtCKbfjAQQ-rLu7AM',window.google_tag_params,true);
			d.downStreamTag("pageview", "", "2216", "2215", "2257");
		}

		/** Bizi Production Tags **/
		if(d.shouldFireAgencyTagsFor('sunbizi')) {
			//Engine Start
			if(scEventExists('event3')) {
				d.imageTag('//www.googleadservices.com/pagead/conversion/1000421404/?value=0&label=8r3sCNTksQMQnPCE3QM&guid=ON&script=0');
				d.downStreamTag("transaction", "ev_BiziDiscoverStart=1", "4249", "4248", "1589");
			}
			//Engine Complete
			if(s.pageName == 'sg:biz2:wizard:checklist') {
				d.imageTag('//www.googleadservices.com/pagead/conversion/1000421404/?value=0&label=gGcvCMzlsQMQnPCE3QM&guid=ON&script=0');
				d.downStreamTag("transaction", "ev_BiziChecklistEnd=1", "4251", "4250", "1589");
			}
			//Email Captured
			if(scEventExists('event5') && scEventExists('event36')) {
				d.imageTag('//www.googleadservices.com/pagead/conversion/1000421404/?value=0&label=3UnKCMTmsQMQnPCE3QM&guid=ON&script=0');
				d.downStreamTag("transaction", "ev_BiziEmailToSelf=1", "4257", "4256", "1589");
			}
			//Default Remarketing
			if(scEventExists('event31')) {
				d.imageTag('//googleads.g.doubleclick.net/pagead/viewthroughconversion/999635245/?value=0&label=MZfyCJPYpwMQrfLU3AM&guid=ON&script=0');
			}
			//Insurance Remarketing
			if(typeof bizline !== 'undefined' && bizline.toLowerCase() == 'insurance') {
				d.imageTag('//googleads.g.doubleclick.net/pagead/viewthroughconversion/999635245/?value=0&label=6ZMPCIvZpwMQrfLU3AM&guid=ON&script=0');
			}
			//Banking Remarketing
			if(typeof bizline !== 'undefined' && bizline.toLowerCase() == 'banking') {
				d.imageTag('//googleads.g.doubleclick.net/pagead/viewthroughconversion/999635245/?value=0&label=ywuMCPvapwMQrfLU3AM&guid=ON&script=0');
			}
			if(s.pageName == 'sg:biz2:home') {
				d.downStreamTag("pageview", "", "4243", "4242", "1589");
			}
			if(s.pageName == 'sg:biz2:learn') {
				d.downStreamTag("pageview", "", "4245", "4244", "1589");
			}
			if(s.pageName == 'sg:biz2:wizard:checklist:continue') {
				d.downStreamTag("transaction", "ev_BiziWhereToBuy=1", "4255", "4254", "1589");
			}
		}

		/** Agency AD Tags **/
		if(d.shouldFireAgencyTagsFor('suncontent')) {
            if(s.pageName.indexOf('in:ami:carsguide-quote') > -1) {
                d.imageTag('//ad.doubleclick.net/ad/N3197.125981.2410002385421/B7769710.108963499;sz=1x1;ord=' + cachebuster);
                var btnEle = document.getElementById('btn-quote');
                if (btnEle) {
                    btnEle.href = 'https://ad.doubleclick.net/ddm/clk/282171928;108963499;y?' + btnEle.href;
                }
            }
		}


        /** CP Direct Engine Tags **/
        if(d.shouldFireAgencyTagsFor('suncpdirect')) {
            /* CP Direct Engine Quote Start */
            if(scEventExists('event8')) {
                if(s.prop36 == "Bank_of_Queensland") {
                    // home
                    if(s.products.indexOf('home') > -1){
                        d.iframeTag('//fls.doubleclick.net/activityi;src=3749740;type=Insur0;cat=Insur00-;ord=' + cachebuster + '?');
                    }
                    // motor
                    else if(s.products.indexOf('motor') > -1 || s.products.indexOf('car') > -1) {
                        d.iframeTag('//fls.doubleclick.net/activityi;src=3749740;type=Insur0;cat=Insur008;ord=' + cachebuster + '?' );
                    }
                    // travel
                    else if (s.products.indexOf('travel') > -1) {
                        d.iframeTag('//fls.doubleclick.net/activityi;src=3749740;type=Insur0;cat=Insur00B;ord=' + cachebuster + '?' );
                    }
                }
            }

            /* CP Direct Engine Quote Completed */
            if(scEventExists('event9')) {
                 if(s.prop36 == "Bank_of_Queensland"){
                     //home
                     if(s.products.indexOf('home') > -1) {
                        d.iframeTag('//fls.doubleclick.net/activityi;src=3749740;type=Insur0;cat=Insur00A;ord=1;num=' + cachebuster + '?');
                     }
                     //motor
                     else if(s.products.indexOf('motor') > -1 || s.products.indexOf('car') > -1) {
                        d.iframeTag('//fls.doubleclick.net/activityi;src=3749740;type=Insur0;cat=Insur009;ord=1;num=' + cachebuster + '?');
                     }
                     //travel
                     else if (s.products.indexOf('travel') > -1) {
                        d.iframeTag('//fls.doubleclick.net/activityi;src=3749740;type=homel778;cat=Insur0;ord=1;num=' + cachebuster + '?');
                     }
                 }
                /** CPdirect Bankwest quote complete**/
                if (s.prop36 == 'BankWest') {
                    if (s.products.indexOf('car')) {
                        d.mediamindTag('491952', cachebuster);
                    } else if (s.products.indexOf('home')) {
                        d.mediamindTag('491954', cachebuster);
                    }
                }
            }

            /* CP Direct Engine Buy Completed */
            if(scEventExists('event18')) {
                if (s.prop36 == "Bank_of_Queensland"){
                    //home
                    if(s.products.indexOf('home') > -1){
                        d.iframeTag('//fls.doubleclick.net/activityi;src=3749740;type=Insur00;cat=Insur001;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
                    }
                    //motor
                    else if(s.products.indexOf('motor') > -1 || s.products.indexOf('car') > -1) {
                        d.iframeTag('//fls.doubleclick.net/activityi;src=3749740;type=Insur00;cat=Insur000;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
                    }
                    //travel
                    else if (s.products.indexOf('travel') > -1) {
                        d.iframeTag('//fls.doubleclick.net/activityi;src=3749740;type=Insur00;cat=Insur002;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
                    }
                    //landlord
                    else if (s.products.indexOf('landlord') > -1 || s.products.indexof('renter_contents') > -1){
                        d.iframeTag('//fls.doubleclick.net/activityi;src=3749740;type=Insur00;cat=Insur003;qty=1;cost=' + d.getAmount('event19') + ';ord=' + s.eVar23 + '?');
                    }
                }
                /** CPdirect Bankwest buy complete**/
                if (s.prop36 == 'BankWest') {
                    if (s.products.indexOf('car')) {
                        d.mediamindTag('491953', cachebuster);
                    } else if (s.products.indexOf('home')) {
                        d.mediamindTag('491955', cachebuster);
                    }
                }
            }


        }

		// include the DownStream tag aSync and set DownStream trigger function as callback.
		if(!d.downStreamLoading) {
			d.aInclude('//www.everestjs.net/static/st.js', d.downStreamTrigger);
		}
		d.downStreamLoading = true;
	} catch(e) {
		// to avoid tag is not being triggered
		if(!d.downStreamLoading) d.aInclude('//www.everestjs.net/static/st.js', d.downStreamTrigger);
		d.downStreamLoading = true;
	}

    /* Fire Datacollector for MA tag */
    if (d.maTagFired == false) {
        // pageview dc tags
        superT.setCrossDom(function() { d.triggerDataCollectorAdserver(false, undefined, undefined, undefined) });
    }

	// changed back to current environment
	setting.env = tmpenv;
};
d.buttonTags = function(){
  //bingle
  d.addButtonTag('in:bin','GLOBAL', 'global-makeaclaim', 'eVar36,events', 'event20', 'in:bin:global:makeaclaim', true);
  d.addButtonTag('in:bin','GLOBAL', 'global-login', 'eVar36,events', 'event20', 'in:bin:global:login');
  d.addButtonTag('in:bin','GLOBAL', 'global-renewpolicy', 'eVar36,events', 'event20', 'in:bin:global:renewpolicy');
  d.addButtonTag('in:bin','in:bin:car_insurance:homepage', 'homepage-topquote', 'eVar36,events', 'event20', 'in:bin:car_insurance:homepage:topquotebutton');
  d.addButtonTag('in:bin','in:bin:car_insurance:homepage', 'homepage-bottomquote', 'eVar36,events', 'event20', 'in:bin:car_insurance:homepage:bottomquotebutton');

  d.addButtonTag('in:bin','in:bin:car_insurance:how-you-save', 'howyousave-rightquote', 'eVar36,events', 'event20', 'in:bin:car_insurance:how-you-save:rightquotebutton');
  d.addButtonTag('in:bin','in:bin:car_insurance:how-you-save', 'howyousave-bottomquote', 'eVar36,events', 'event20', 'in:bin:car_insurance:how-you-save:bottomquotebutton');
  d.addButtonTag('in:bin','in:bin:car_insurance:how-you-save', 'howyousave-findoutmore', 'eVar36,events', 'event20', 'in:bin:car_insurance:how-you-save:findoutmorebutton');
  d.addButtonTag('in:bin','in:bin:car_insurance:claims-process', 'claimsprocess-tab1claim', 'eVar36,events', 'event20', 'in:bin:car_insurance:claims-process:tab1claimbutton', true);

  d.addButtonTag('in:bin','in:bin:car_insurance:contact-us', 'edit-submit', 'eVar36,events', 'event20', 'in:bin:car_insurance:contact-us:sendbutton', true);
  d.addButtonTag('in:bin','in:bin:car_insurance:claims', 'call-me-submit', 'eVar36,events', 'event20', 'in:bin:car_insurance:claims:callmebutton');

  // RHS "Need to make a claim?" Block
  d.addButtonTag('in:bin','GLOBAL', 'rhs-claim', 'eVar36,events', 'event20', 'in:bin:global:rightclaimbutton', true);
  d.addButtonTag('in:bin','GLOBAL', 'rhs-quote', 'eVar36,events', 'event20', 'in:bin:global:rightquotebutton');

  // Bottom "FAQ Link" Block
  d.addButtonTag('in:bin','GLOBAL', 'bottom-faq-link', 'eVar36,events', 'event20', 'in:bin:global:FAQslink');

  // FAQ - Categories
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-tid-8', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQcategory:Top10');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-tid-1', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQcategory:Buying');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-tid-2', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQcategory:Cover');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-tid-4', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQcategory:Claiming');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-tid-3', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQcategory: Managing');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-tid-9', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQcategory: Contacting');

 // FAQ - Questions
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-77', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Contact');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-78', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:RentalCar');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-79', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Windscreen');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-80', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Updatepolicy');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-81', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Changesonline');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-82', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Renew');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-83', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Noclaimbonus');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-84', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Accident');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-85', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Stolen');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-87', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Howmuchcover');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-88', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Calculatepremium');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-89', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Onlinesecurity');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-90', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Paymentoptions');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-92', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Covernotes');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-93', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Childscar');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-94', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Additionalcar');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-95', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Existingdamage');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-96', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:NSWCTP');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-97', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Australiawide');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-98', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Learnerdrivers');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-99', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Towing');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-100', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Pregnant');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-101', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Testdrive');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-102', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Personalitems');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-103', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Emergencycosts');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-104', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Toolsoftrade');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-105', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Offroad');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-106', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Businessuse');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-107', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Serviced');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-108', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Internationallicence');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-109', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Overseas');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-110', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Legalliability');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-111', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Privatelyimported');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-112', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Modifiedcars');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-113', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Trailer');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-114', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Makeaclaim');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-115', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Excesses');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-117', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Drivernotinsured');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-118', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Badlydamaged');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-119', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Choiceofrepairer');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-120', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Forgottenpassword');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-121', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Cancelpolicy');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-122', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Swapcar');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-123', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Policyholder');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-124', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Generalenquiry');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-125', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Contactclaim');
  d.addButtonTag('in:bin','in:bin:car_insurance:faqs', 'faq-nid-126', 'eVar36,events', 'event20', 'in:bin:car_insurance:faqs:FAQquestion:Complaint');

   // PDF download
  d.addButtonTag('in:bin','in:bin:car_insurance:whats-covered', 'whatscovered-toppds', 'eVar36,events', 'event20', 'in:bin:car_insurance:whats-covered:topPDSdownload');
  d.addButtonTag('in:bin','in:bin:car_insurance:whats-covered', 'whatscovered-bottompds', 'eVar36,events', 'event20', 'in:bin:car_insurance:whats-covered:bottomPDSdownload');
  d.addButtonTag('in:bin','in:bin:car_insurance:product-disclosure', 'productdisclosure-pds', 'eVar36,events', 'event20', 'in:bin:car_insurance:product-disclosure:PDSdownload');
  d.addButtonTag('in:bin','in:bin:car_insurance:product-disclosure', 'productdisclosure-premiumexcess', 'eVar36,events', 'event20', 'in:bin:car_insurance:product-disclosure:premexcessclaimsguidedownload');
  d.addButtonTag('in:bin','in:bin:car_insurance:product-disclosure', 'productdisclosure-pds-icon', 'eVar36,events', 'event20', 'in:bin:car_insurance:product-disclosure-icon:PDSdownload');
  d.addButtonTag('in:bin','in:bin:car_insurance:product-disclosure', 'productdisclosure-premiumexcess-icon', 'eVar36,events', 'event20', 'in:bin:car_insurance:product-disclosure-icon:premexcessclaimsguidedownload');

  // Quick tabs
  d.addButtonTag('in:bin','in:bin:car_insurance:claims-process', 'tab-1', 'eVar36,events', 'event20', 'in:bin:car_insurance:claims-process:tab1');
  d.addButtonTag('in:bin','in:bin:car_insurance:claims-process', 'tab-2', 'eVar36,events', 'event20', 'in:bin:car_insurance:claims-process:tab2');
  d.addButtonTag('in:bin','in:bin:car_insurance:claims-process', 'tab-3', 'eVar36,events', 'event20', 'in:bin:car_insurance:claims-process:tab3');
  d.addButtonTag('in:bin','in:bin:car_insurance:claims-process', 'tab-4', 'eVar36,events', 'event20', 'in:bin:car_insurance:claims-process:tab4');
  d.addButtonTag('in:bin','in:bin:car_insurance:claims-process', 'tab-5', 'eVar36,events', 'event20', 'in:bin:car_insurance:claims-process:tab5');

  //aami online service
  d.addButtonTag('in:ami','in:ami:online-services', 'quicktabs-tab-online_services-0', 'eVar36,events', 'event20', 'in:ami:online-services:quick-tab_online-services');
  d.addButtonTag('in:ami','in:ami:online-services', 'quicktabs-tab-online_services-1', 'eVar36,events', 'event20', 'in:ami:online-services:quick-tab_payments');
  d.addButtonTag('in:ami','in:ami:online-services', 'quicktabs-tab-online_services-2', 'eVar36,events', 'event20', 'in:ami:online-services:quick-tab_claim-online');
  d.addButtonTag('in:ami','in:ami:online-services', 'quicktabs-tab-online_services-3', 'eVar36,events', 'event20', 'in:ami:online-services:quick-tab_my-claim-manager');
  d.addButtonTag('in:ami','in:ami:online-services', 'exist-customer-claim-manager', 'eVar36,events', 'event20', 'in:ami:online-services:exist-customer-claim-manager', true);
  d.addButtonTag('in:ami','in:ami:online-services', 'exist-customer-payments', 'eVar36,events', 'event20', 'in:ami:online-services:exist-customer-payments', true);
  d.addButtonTag('in:ami','in:ami:online-services', 'exist-customer-claim-online', 'eVar36,events', 'event20', 'in:ami:online-services:exist-customer-claim-online', true);
  d.addButtonTag('in:ami','in:ami:online-services', 'exist-customer-mcme', 'eVar36,events', 'event20', 'in:ami:online-services:exist-customer-mcme', true);

  //aami vehicle selection
  d.addButtonEventByClassName("in:ami:secapp:motor:quote:quote_started", "FindYourCarButton_question", "carSearchButton", "span");
  d.addButtonEventByClassName("in:ami:secapp:motor:quick_quote:quote_started","FindYourCarButton_question", "carSearchButton", "span");
  d.addButtonsTag("in:ami", "in:ami:secapp:motor:quote:quote_started", "VehicleId", "prop37,prop38,events", "event70", "Motor Model Selected");
  d.addButtonsTag("in:ami", "in:ami:secapp:motor:quick_quote:quote_started", "VehicleId", "prop37,prop38,events", "event70", "Motor Model Selected");

  //save a quote
  d.addButtonTag('in:sun','in:sun:secapp:motor:quote:quote_completed','emailButton','eVar22,events,products','event72','Motor Email Quote');
  d.addButtonTag('in:sun','in:sun:secapp:home_classic:quote:quote_completed','emailButton','eVar22,events,products','event72','Home Email Quote');
  d.addButtonTag('in:sun','in:sun:secapp:home_extras:quote:quote_completed','emailButton','eVar22,events,products','event72','Home Email Quote');
  d.addButtonTag('in:sun','in:sun:secapp:home_advantages:quote:quote_completed','emailButton','eVar22,events,products','event72','Home Email Quote');

  //GIO email quote
  d.addButtonTag('in:gio','GLOBAL','emailButton','eVar22,events,products','event72','Email Quote');

  //self service type
  if(scEventExists('event18') && (s.siteID == "in:sun" || s.siteID == "in:ami") && (s.products.indexOf("home_") > -1 || s.products.indexOf("car_") > -1)) {
  	d.addButtonTag(s.un, s.pageName, 'registerEmailButton', 'eVar9, events', 'event1', 'Register now');
  }
};
//Loads necessary events prior to loading html page
function addLoadEvent(func) {
   var oldonload = window.onload;
   if (typeof window.onload != 'function') {
      window.onload = func;
   } else {
      window.onload = function() {
         oldonload();
         func();
      }
   }
};

//Adds the onClick event which calls the function to fire the EF pixel to the button based on list of predefined buttons
function __ef_button_list() {
	var efEvents = {
		byPageName: {
			// full page name, original codes
			names: ["all"],
			buttons: ["node-317", "close_action_spanid", "submit_spanid", "enabled_submit_span_id", "edit-submit", "edit-webform-ajax-submit-1018"]
		},
		byPageNamePrefix: {
			// add AAMI, Suncorp here in the future
			names: ["in:gio:secapp:sales:motor"],
			buttons: ["callBackButton"],
			tag: "//pixel.everesttech.net/1485/t?ev_motorcallback=1"
		}
	};
	for (var condition in efEvents) {
		for(var j = efEvents[condition].names.length; j--;) {
			if ((condition == "byPageName" && efEvents[condition].names[j] == "all") ||
					(condition == "byPageNamePrefix" && s.pageName.indexOf(efEvents[condition].names[j]) > -1)){
				attachEfButtonEvents(efEvents[condition].buttons, efEvents[condition].tag);
			}
		}
	}
};

function attachEfButtonEvents(buttons, tag) {
	for (var i=0; i <buttons.length; i++) {
		if(document.getElementById(buttons[i]) != null) {
			if (typeof tag == "undefined") {
				document.getElementById(buttons[i]).onclick = __ef_fire_pixel;
			} else {
				document.getElementById(buttons[i]).onclick = function() {
					d.imageTag(tag);
				}
			}
        }
    }
};

//Fires the EF conversion pixel
function __ef_fire_pixel(event) {
   if(s.pageName == 'in:apa:apia:mobile:caravan-insurance'){
    d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam061;ord=1;num=' + cachebuster + '?');
   }
   if(s.pageName == 'in:apa:apia:mobile:car-insurance') {
   	d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam439;ord=1;num=' + cachebuster + '?');
   }
   if(s.pageName == 'in:apa:apia:mobile:home-insurance') {
   	d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiah016;ord=1;num=' + cachebuster + '?');
   }
   if(s.pageName == 'in:apa:apia:mobile:comprehensive-boat-insurance') {
   	d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam028;ord=1;num=' + cachebuster + '?');
   }
   if(s.pageName == 'in:apa:apia:mobile:travel-insurance') {
   	d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam912;ord=1;num=' + cachebuster + '?');
   }
   if(s.pageName == 'in:apa:apia:mobile:get-a-quote') {
   	d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam585;ord=1;num=' + cachebuster + '?');
   }
   if(s.pageName == 'in:apa:apia:mobile:ctp-insurance') {
   	d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam267;ord=1;num=' + cachebuster + '?');
   }
   if(s.pageName == 'in:apa:apia:mobile:motorhome-insurance') {
   	d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam591;ord=1;num=' + cachebuster + '?');
   }
   if(s.pageName == 'in:apa:apia:mobile:funeral-insurance') {
   	d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam245;ord=1;num=' + cachebuster + '?');
   }
   if(s.pageName == 'in:apa:apia:mobile:renew-your-policy') {
   	d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam570;ord=1;num=' + cachebuster + '?');
   }
   if(s.pageName == 'in:apa:apia:mobile:contact-information') {
   	d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam765;ord=1;num=' + cachebuster + '?');
   }
   if(s.pageName == 'in:apa:apia:mobile:how-claim') {
   	d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam019;ord=1;num=' + cachebuster + '?');
   }
   if(s.pageName == 'in:apa:mobile:home') {
   	d.iframeTag('//fls.doubleclick.net/activityi;src=2417670;type=apiaf561;cat=apiam302;ord=1;num=' + cachebuster + '?');
   }
   if(s.pageName == 'in:sun:secapp:incomeprotection:quote:quote_page') {
    d.downStreamTag("transaction","ev_SuncorpBPReferOcc=1","5412","5411","1589","pixel.everesttech.net");
   }
   if(s.pageName == 'in:sun:secapp:incomeprotection:buy:billprotect_offer') {
    d.downStreamTag("transaction","ev_SuncorpBPAccept=1","","","1589","pixel.everesttech.net");
   }
   if(s.pageName == 'in:sun:insurance:life-insurance:life-insurance-quotes' && scEventExists('event65')) {
	d.downStreamTag("transaction", "ev_SUNQuotePageEnd=1", "3087", "", "1589");
   }
   if(s.pageName == 'in:ami:secapp:incomeprotection:quote:quote_page') {
    d.downStreamTag("transaction",  "ev_AAMIBPReferOcc=1",  "5408",  "5407", "1589", "pixel.everesttech.net");
   }
};

d.aInclude('//www.everestjs.net/static/st.js');
addLoadEvent(__ef_button_list);
