s_doPluginExtend = function() {
    if(typeof d != 'undefined') {
    	if(typeof d.maTag == "function") d.maTag();
    	if(typeof d.triggerQuoteSaved == "function") d.triggerQuoteSaved();

	    /* DATALICIOUS: Track Engagement */
	    var dl_pre = false;
	    dl_url = d.getCookie('dl_url').split(',');
	    for (var i = 0; i < dl_url.length; i++) {
	        if(dl_url[i] == s.pageName) {
	            var dl_pre = true;
	            break;
	        }
	    };

	    if(d.getCookie('dl_pc') < 4 && dl_pre == false) {
	        b = new Date().getTime();
	        a = superT.getCookie('dl_time') || new Date().getTime();

	        d.difference = (b - a) / 1000;
	        superT.setCookie('dl_time', a, '', superT.getTopDomain());

	        superT.setCookie('dl_url', superT.getCookie('dl_url') + ',' + s.pageName, '', superT.getTopDomain());

	        if(superT.getCookie('dl_pc')) {
	            var count = superT.getCookie('dl_pc')            
	        } else {
	            var count = '0';
	        }
	        superT.setCookie('dl_pc', Number(count) + 1, '', superT.getTopDomain());
	    }

	    if((superT.getCookie('dl_pc') == 3 || d.difference > 60) && superT.getCookie('dl_fired') !== 'true') {
	        d.triggerDataCollector(true, undefined, undefined, s.eVar61, 'engagement');
	        superT.setCookie('dl_fired', 'true', '',superT.getTopDomain());
	    }
	}
};
