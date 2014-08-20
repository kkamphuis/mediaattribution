maDFATag = function() {
	var u1 = ';u1=',
		u2 = ';u2=',
		u3 = ';u3=',
		u4 = ';u4=',
		u5 = ';u5=';

	var eventType = '';
	if (Analytics.util.containsEventTypes('LEAD', 'QUOTE', 'BUY')) {
		if (Analytics.util.containsEvent('LEAD_STARTED')) {
			eventType = 'lead-start';
		} else if (Analytics.util.containsEvent('LEAD_COMPLETED')) {
			eventType = 'lead-complete';
		} else if (Analytics.util.containsEvent('QUOTE_STARTED')) {
			eventType = 'quote-start';
		} else if (Analytics.util.containsEvent('QUOTE_COMPLETED')) {
			eventType = 'quote-end';
		} else if (Analytics.util.containsEvent('BUY_STARTED')) {
			eventType = 'buy-start';
		} else if (Analytics.util.containsEvent('BUY_COMPLETED')) {
			eventType = 'buy-end';
		}
		u1 += (Analytics.setting.rsID + ':' + eventType + ':' + Analytics.util.getProduct());
		u2 += Analytics.util.getTransactionValue();
		u3 += s.eVar61;
		if (s.eVar62) u3 += ('|' + s.eVar62);
		u4 += escape(document.location.href);
		u5 += escape(document.referrer);
		var url = "//fls.doubleclick.net/activityi;src=875382;type=custo866;cat=singl081";
	    url = url + u1 + u2 + u3 + u4 + u5 + ";ord=" + Math.floor(Math.random() * 11111111111) + "?";
	    Analytics.track(url);
	    d.triggerDataCollector(true, u1, u2, u3, 'MA', eventType);
	} else {
		d.triggerDataCollector(false);
	}
};
