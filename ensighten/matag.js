var d = {};
d.maTag = function() {
	try {
		var u1 = Analytics.setting.rsID;
		var u2 = '0';
		var u3 = s.eVar61;
		var u4 = escape(document.location.href);
		var u5 = escape(document.referrer);
        d.maTagFired = false;
		var pString = '';
		if(dataLayer.dataModel.product) pString = ':' + dataLayer.dataModel.product;
		
		if(s.eVar61 && s.pageName != 'in:cil:request-a-quote-confirmation') {
			// fire the landing page adserver call
			u1 = u1 + '|vs|' + pCategory + '|' + pString;
			u3 = s.eVar61;
			if(s.eVar62) u3 = u3 + '|' + s.eVar62;
			u5 = escape(document.referrer);
			d.triggerMA(u1, u2, u3, u4, u5);
		}
		if(scEventExists('event3')) {
			// lead start adserver call
			u1 = u1 + '|ls|' + pString;
			d.triggerMA(u1, u2, u3, u4, u5);
			return;
		}
		if(scEventExists('event4')) {
			// lead complete adserver call
			u1 = u1 + '|lc|' + pString;
			d.triggerMA(u1, u2, u3, u4, u5);
			return;
		}
		if(scEventExists('event8')) {
			// quote start adserver call
			u1 = u1 + '|qs|' + pString;
			d.triggerMA(u1, u2, u3, u4, u5);
			if(s.products.indexOf('ctp') < 0 && Analytics.setting.rsID == setting.getEnv('sun')) {
				d.iframeTag('https://fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco371;ord=1;num=' + Math.floor(Math.random() * 11111111111) + '?'); // 1046484
			}
			return;
		}
		if(scEventExists('event9') || s.pageName == 'in:cil:request-a-quote-confirmation' || s.pageName == 'in:gio:business-insurance:quote-request:thank-you') {
			// quote end adserver call
			if(s.pageName == 'in:gio:business-insurance:quote-request:thank-you') pString = ':business';
			u1 = u1 + '|qe|' + pString;
			if(s.eVar22) u1 = u1 + '|' + s.eVar22;
			u2 = d.getAmount('event14');
			d.triggerMA(u1, u2, u3, u4, u5);
			if(s.products.indexOf('ctp') < 0 && Analytics.setting.rsID == setting.getEnv('sun')) {
				d.iframeTag('https://fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco543;ord=1;num=' + Math.floor(Math.random() * 11111111111) + '?'); // 1051728
			}
			return;
		}
		if(scEventExists('event17')) {
			// buy start adserver call
			u1 = u1 + '|bs|' + pString;
			d.triggerMA(u1, u2, u3, u4, u5);
			if(s.products.indexOf('ctp') < 0 && Analytics.setting.rsID == setting.getEnv('sun')) {
				d.iframeTag('https://fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco417;ord=1;num=' + Math.floor(Math.random() * 11111111111) + '?'); // 1046485
			}
			return;
		}
		if(scEventExists('event18')) {
			// buy end adserver call
			u1 = u1 + '|be|' + pString;
			if(s.eVar23) u1 = u1 + '|' + s.eVar23;
			u2 = d.getAmount('event19');
			d.triggerMA(u1, u2, u3, u4, u5);
			if(s.products.indexOf('ctp') < 0 && Analytics.setting.rsID == setting.getEnv('sun')) {
				d.iframeTag('https://fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco590;ord=1;num=' + Math.floor(Math.random() * 11111111111) + '?'); // 1046487
			}
		}
		if (scEventExists("event37")) {
			u1 = u1 + '|c2c|' + pString;
			if(s.eVar23) u1 = u1 + '|' + s.eVar23;
			u2  = d.getAmount("event19");
			d.triggerMA(u1, u2, u3, u4, u5);
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
					"insurancepromotions.com.au/gio/caraq",
					"trustnsw.com.au",
					"insurancepromotions.com.au/bingle/smarttv",
					"shannons.com.au/pebblebeach/confirm/",
					"shannons.com.au/club/competition/",
					"cilpromotions.com.au/thanks.html",
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
					u1 = Analytics.setting.rsID + "|" + maEvents[event].name + "|" + pString;
					d.triggerMA(u1, u2, u3, u4, u5);
					break;
				}
			}
		}

	} catch(e) {
		// do nothing
	}
};

d.triggerMA = function(event, premium) {
    d.urlMA = "https://fls.doubleclick.net/activityi;src=875382;type=custo866;cat=singl081;u1=" + event + ";u2=" + premium + ";u3=" + s.eVar61 + ";u4=" + escape(document.location.href) + ";u5=" + escape(document.referrer) + ";ord=" + Math.floor(Math.random() * 11111111111) + "?";
    d.iframeTag(d.urlMA);
    d.maTagFired = true;
    d.triggerDataCollectorAdserver(true, event, premium, s.eVar61, 'MA');
};
