/* Now these are in s_doPlugins */

// Config
var scInternalDomains = new Array();
var scBrandTerms = 'suncorp';
if(scCount == 0){
    for(i = 0; i < scConfig.length; i++){
        if(s.un.indexOf(scConfig[i][0]) > -1){
            scInternalDomains = scConfig[i][5].split(',');
        }
    }
}
scInternalRef = false;
for (i = 0; i < scInternalDomains.length; i++) {
    if (_dGetHostName(document.referrer).toLowerCase().indexOf(scInternalDomains[i].toLowerCase()) >= 0) scInternalRef = true;
}
if (document.location.href.indexOf('s_tnt=') < 0) {
    s.getAndPersistValue(_dRef, '_rr');
} else {
    _dRef = s.getAndPersistValue(null, '_rr');
}
if (scCount == 0 && (!scInternalRef)) {
    /* Datalicious PurchasePath */
    var scSEM = false;
    var originalCampaign = '';
    _dBrandTerms = scBrandTerms;
    if (s.campaign) {
        _dCompaignCode = s.campaign;
        _dCompaignCode = _dCompaignCode.toLowerCase();
        if (_dCompaignCode.indexOf(':edm:') >= 0) _dCompaignCode = 'em'; // eDM
        if (_dCompaignCode.indexOf(':dis:') >= 0) _dCompaignCode = 'ds'; // Display
        if (_dCompaignCode.indexOf(':van:') >= 0) _dCompaignCode = 'vn'; // Vanity
        if (_dCompaignCode.indexOf(':van:') >= 0) _dCompaignCode = 'vn'; // Vanity
        if (_dCompaignCode.indexOf(':aff:') >= 0) _dCompaignCode = 'af'; // Affiliate
        if (_dCompaignCode.indexOf(':com:') >= 0) _dCompaignCode = 'cm'; // Comparison
        if (_dCompaignCode.indexOf(':sem:') >= 0) {
            originalCampaign = s.campaign;
            s.campaign = '';
            _dCompaignCode = '';
            scSEM = true;
        }
    }
    // TODO Media Attribution
    _dOmniturePurchasePath();
    if (scSEM) {
        if (s.eVar61.indexOf('seo:') == 0) {
            if (s.eVar64.length == 2) {
                if (s.eVar61.indexOf('branded') > -1) {
                    s.eVar64 = 'cb';
                } else {
                    s.eVar64 = 'cg';
                }
            } else {
                var scFirstTouch = s.eVar64.substr(0, 3);
                var scMiddleTouches = '';
                if (s.eVar64.length > 5) {
                    scMiddleTouches = s.eVar64.substr(5);
                }
                if (s.eVar61.indexOf('branded') > -1) {
                    s.eVar64 = scFirstTouch + 'cb' + scMiddleTouches;
                } else {
                    s.eVar64 = scFirstTouch + 'cg' + scMiddleTouches;
                }
            }
        } else {
            if (s.eVar64.length == 2) {
                s.eVar64 = 'ps'; // paid search without keyword detected
            } else {
                var scFirstTouch = s.eVar64.substr(0, 3);
                var scMiddleTouches = '';
                if (s.eVar64.length > 5) {
                    scMiddleTouches = s.eVar64.substr(5);
                }
                s.eVar64 = scFirstTouch + 'ps' + scMiddleTouches;
            }
        }
        s.campaign = s.eVar61 = originalCampaign;
        _dSetCookie("__ppFullPath", s.eVar64, _dExpireDays);
    }
    if (s.eVar62) {
        var scKeywordStack = '';
        if (scSEM) {
            scKeywordStack = 'paid:';
        } else {
            scKeywordStack = 'organic:';
        }
        scKeywordStack = scKeywordStack + s.eVar62;
        s.eVar63 = s.crossVisitParticipation(scKeywordStack, 's_evar63', '30', '10', '>', ''); // Keyword Stacking
    }
}
