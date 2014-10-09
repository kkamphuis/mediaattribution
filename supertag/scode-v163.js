/* SiteCatalyst code version: H.22.1.
Copyright 1996-2011 Adobe, Inc. All Rights Reserved
http://www.omniture.com */

/*
 * Change Log:
 * - This is a copy of v51 with line 607 updated ti true
 * - Upgrade to H.22.1
 * - Update the internal filter to dynamically include the current domain
 * - Restore the tracking servers for GIO, APIA and Bingle until the global report suite is implemented
 */

/************************ ADDITIONAL FEATURES ************************
     Plugins
*/
// the initial page load time function call
s_getLoadTime();
var scHost=window.location.host;
scHost=scHost.toLowerCase();
if(scHost.indexOf('www.') == 0) scHost=scHost.substr(4);

var scConfig = new Array();
//note: scConfig[i][0] = report suite prefix
//note: scConfig[i][1] = brand name
//note: scConfig[i][2] = siteID
//note: scConfig[i][3] = metric server domain
//note: scConfig[i][4] = brand term list
//note: scConfig[i][5] = internal domain list
scConfig[0] = ['sun', 'suncorp', 'in:sun', 'suncorp.com.au', 'suncorp', 'suncorp.com.au,suncorp.custhelp.com,suncorpbank.com.au,suncorp.cardservicesdirect.com.au,suncorpuat.cardservicesdirect.com.au,simfundsmanagement.com.au,insurancepromotions.com.au'];
scConfig[1] = ['sunaami', 'aami', 'in:ami', 'aami.com.au', 'aami', 'aami.com.au,vero.com.au,luckyaami.com.au'];
scConfig[2] = ['sunapia', 'apia', 'in:apa:apia', 'apia.com.au', 'apia', 'apia.com.au,guidetothegoodlife.com.au'];
scConfig[3] = ['sunbingle', 'bingle', 'in:bin:car_insurance', 'bingle.com.au', 'bingle', 'bingle.com.au,bingle.com'];
scConfig[4] = ['suncil', 'cil', 'in:cil', 'suncorp.com.au', 'cil', 'cilinsurance.com.au,cilinsurances.com.au'];
scConfig[5] = ['sungio', 'gio', 'in:gio', 'gio.com.au', 'gio', 'gio.com.au,giopi.suncorp.com.au,giopiweb.suncorp.com.au,gioctpgreenslip.suncorp.com.au,apps.suncorp.com.au'];
scConfig[6] = ['suninsuremyride', 'insure my ride', 'in:imr:imr', 'insuremyride.com.au', 'insure my ride,insure+my+ride,insure%20my%20ride', 'insuremyride.com.au,gioctpgreenslip.suncorp.com.au,insuremyridepromotions.com.au'];
scConfig[7] = ['sunjustcar', 'just car', 'in:jci', 'justcarinsurance.com.au', 'just car,just+car,just%20car', 'justcarinsurance.com.au,canvas2kickass.com,imps.nminnovation.com,justcarpromotions.com.au'];
scConfig[8] = ['sunshannons', 'shannons', 'in:shn', 'shannons.com.au', 'shannons', 'shannons.com.au'];
scConfig[9] = ['sunterr', 'terri scheer', 'in:ts', 'suncorp.com.au', 'terri scheer,terri+scheer,terri%20scheer', 'terrischeer.com.au'];
scConfig[10] = ['sunrepairlink', 'repairlink', 'in:rlk', 'repairlink.com.au', 'repair link,repair+link,repair%20link,repairlink', 'repairlink.com.au'];
scConfig[11] = ['sunbinglefacebook', 'bingle', 'in:bin:fbapp', 'bingle.com.au', 'bingle', 'binglecomps.com.au'];
scConfig[12] = ['sunjustcarratemyride', 'just car', 'in:jci:fbapp', 'justcarinsurance.com.au', 'just car,just+car,just%20car', 'justcarinsurance.com.au,canvas2kickass.com,imps.nminnovation.com'];
scConfig[13] = ['sunshannonsclub', 'shannons', 'in:shn:club', 'shannons.com.au', 'shannons', 'shannonsclub.studiomoso.com.au'];
scConfig[14] = ['sunvero', 'vero', 'in:ver', 'vero.com.au', 'vero', 'vero.com.au,verocentral.com.au,singleid.net.au'];
scConfig[15] = ['sunbizi', 'bizi', 'sg:biz2', 'suncorp.com.au', 'bizi', 'bizi.com.au'];
scConfig[16] = ['sunideaexchange', 'ideaexchange', 'sg:iex', 'suncorp.com.au', 'ideaexchange', 'ideaxchange.int.corp.sun, ideaxchange'];

if(typeof s_account == 'undefined'){
    // modify s_account to correct value when you deploy it
    var s_account='sundev';
    if(scHost.indexOf('gio.com.au') > -1) s_account=setting.getEnv('sungio'); // GIO has no account defined on page
    else if(scHost.indexOf('apia.com.au') > -1) s_account='sunapia'; // APIA has no account defined on page
    else if(scHost.indexOf('bingle.com.au') > -1) s_account=setting.getEnv('sunbingle'); // Bingle account is defined after s_code loaded
    else if (scHost.indexOf('aami.com.au') > -1) {
        s_account = setting.getEnv('sunaami');
    }
    else if (scHost.indexOf('suncorp.com.au') > -1 || scHost.indexOf('suncorpbank.com.au') > -1 || scHost.indexOf('suncorpinsurance.com.au') > -1) {
        s_account = setting.getEnv('sun');
    }
    else if (scHost.indexOf('insuremyride.com.au') > -1) {
        s_account = setting.getEnv('suninsuremyride');
    }
}
var s=s_gi(s_account)
/************************** FUNCTIONS **************************/
scLiveChatInteraction = function(interactionType, field){
    scTempEvents=s.events;
    s.linkTrackVars="events,eVar47,eVar54";
    s.linkTrackEvents="event60,event61";
    if(s.pageName.indexOf(":quote") > -1){
     s.events="event60";
    }else if(s.pageName.indexOf(":buy") > -1){
     s.events="event61";
    }
    s.eVar47=interactionType;
    s.eVar54=field;
    s.tl(this,"o","LiveChat: "+interactionType);
    // restore events and clear filters
    s.events=scTempEvents;
    s.linkTrackVars="none";
    s.linkTrackEvents="none";
}
var ie = /*@cc_on!@*/false;
scApplyTrackLink = function() {
    var aElements = document.getElementsByTagName('a');
    for (var i=0; i < aElements.length; i++){
        scAddListener(aElements[i], scTrackLink);
        scLocateInternalPromotion(aElements[i]);
    }
};
scLocateInternalPromotion = function(element){
    var intCID = s.getQueryParam('intcmp','',element.href);
    if(intCID){
        scTrackInternalPromotionImp(intCID);
    }
}
scTrackInternalPromotionImp = function(intCID){
    scTempEvents=s.events;
    s.linkTrackVars="events,eVar2";
    s.linkTrackEvents="event34";
    s.events="event34";
    s.eVar2=intCID;
    s.usePlugins=false;
    s.tl(this,"o","Intcmp Imp: "+intCID);
    // restore events and clear filters
    s.events=scTempEvents;
    s.linkTrackVars="none";
    s.linkTrackEvents="none";
    s.usePlugins=true;
}
scAddListener = function(element, func) {
    if(ie){
        element.attachEvent('onclick', func);
    }else{
        element.addEventListener('click', func, false);
    }
};
scTrackLink = function(e) {
    try{
        var currentElement = (ie) ? e.srcElement : e.target;
        if (currentElement) {
            while (currentElement.tagName != "A") {
                currentElement = currentElement.parentNode;
            }
        }
        scTackExitLink(currentElement);
        if (currentElement.href.search(/^tel:/i) > -1) {
            if (ie) {
                return false;
            } else {
                e.preventDefault();
            }
        }
    } catch(e) {
        ;
    }
};
scEmailButton = function() {
    scTempEvents=s.events;
    s.linkTrackVars="events,eVar22,products";
    s.linkTrackEvents="event72";
    s.events = "event72:" + s.eVar22;
    if (s.products.indexOf("event")){
        s.products = s.products.substr(0,s.products.indexOf("event"));
    }
    s.usePlugins=false;
    s.tl(this,"o","Terri Sheer: Quote Emailed");
    d.triggerQuoteSaved();
    // restore events and clear filters
    s.events=scTempEvents;
    s.linkTrackVars="none";
    s.linkTrackEvents="none";
    s.usePlugins=true;
};

scJeopardy = function(errorMessage, errorKind) {
    scTempEvents=s.events;

    if(errorKind == 'business') {
        s.linkTrackVars="events,eVar17";
        s.linkTrackEvents="event15";
        s.eVar17 = errorMessage;
        s.pageName = s.pageName + ':' + s.eVar17;
        s.events = 'event15:' + s.eVar26;
        s.usePlugins=false;
        s.tl(this,"o","Terri Sheer: Business Jeopardy");
    }

    if(errorKind == 'technical') {
        s.linkTrackVars="events,eVar25";
        s.linkTrackEvents="event41";
        s.eVar25 = errorMessage;
        s.pageName = s.pageName + ':' + s.eVar25;
        s.events = 'event41:' + s.eVar26;
        s.usePlugins=false;
        s.tl(this,"o","Terri Sheer: Technical Jeopardy");
    }

    // restore events and clear filters
    s.events=scTempEvents;
    s.linkTrackVars="none";
    s.linkTrackEvents="none";
    s.usePlugins=true;
};
trackGIOClick2Call = function(elem) {
    var pixel = '';
    try {
        var headingElem = elem.parentNode.parentNode.parentNode.getElementsByTagName('h3')[0];
        var heading = (headingElem.textContent || headingElem.innerText);
    } catch (e){ heading = ''; }
    try {
        var labelElem = elem.parentNode.previousSibling.previousSibling.previousSibling.previousSibling.getElementsByTagName('li')[0];
        var label = (labelElem.textContent || labelElem.innerText);

    } catch (e){ label = '';}


    switch (true) {
    case /comprehensive car/i.test(label):
        pixel = "//pixel.everesttech.net/1485/t?ev_GIOMobileCarC2C=1"
        break;
    case /platinum car insurance/i.test(label):
        pixel = "//pixel.everesttech.net/1485/t?ev_GIOMobileCarC2C=1"
        break;
    case /fire, theft & third party property/i.test(label):
        pixel = "//pixel.everesttech.net/1485/t?ev_GIOMobileCarC2C=1"
        break;
    case /third party property/i.test(label):
        pixel = "//pixel.everesttech.net/1485/t?ev_GIOMobileCarC2C=1"
        break;
    case /small businesses/i.test(label):
        pixel = "//pixel.everesttech.net/1485/t?ev_GIOBISmallBusinessC2C=1"
        break;
    case /commercial vehicles/i.test(label):
        pixel = "//pixel.everesttech.net/1485/t?ev_GIOMobileCarC2C=1"
        break;
    case /boat insurance/i.test(label):
        pixel = "//pixel.everesttech.net/1485/t?ev_GIOMobileOtherC2C=1"
        break;
    case /caravan and trailer insurance/i.test(label):
        pixel = "//pixel.everesttech.net/1485/t?ev_GIOMobileOtherC2C=1"
        break;
    case /not for profit/i.test(label):
        pixel = "//pixel.everesttech.net/1485/t?ev_GIOBINotForProfitC2C=1"
        break;
    case /New South Wales/i.test(label):
        pixel = "//pixel.everesttech.net/1485/t?ev_GIOBIWCC2C=1"
        break;
    case /compulsory third party|ctp/i.test(heading):
        pixel = "//pixel.everesttech.net/1485/t?ev_GIOMobileCTPC2C=1"
        break;
    case /(home|strata) insurance/i.test(heading):
        pixel = "//pixel.everesttech.net/1485/t?ev_GIOMobileHomeC2C=1";
        break;
    case /travel insurance/i.test(heading):
        pixel = "//pixel.everesttech.net/1485/t?ev_GIOMobileOtherC2C=1";
        break;
    }

    if(pixel)
        new Image().src = pixel;
};

scTackExitLink = function(currentElement) {
    var linkHref = currentElement.href;    
    if(linkHref.search(/^tel:/i) > -1) {
        scTempEvents=s.events;
        s.usePlugins=false;
        s.useForcedLinkTracking = true;
        s.forcedLinkTrackingTimeout = 500;
        s.linkTrackVars="events,eVar36";
        s.linkTrackEvents="event37";
        s.events="event37";
        s.eVar36="click to call|" + s.pageName;
        if(typeof d != undefined && typeof d.maTag === "function") d.maTag();

        var adlens = {
            "in:ami:mobile:travel-insurance": "//pixel.everesttech.net/2243/t?ev_AAMITravelMobileC2C=1",
            "in:apa:apia:mobile:home-insurance": "//pixel.everesttech.net/2247/t?ev_APIAMobileHomeC2C=1",
            "in:apa:apia:mobile:car-insurance": "//pixel.everesttech.net/2247/t?ev_APIAMobileCarC2C=1'",
            "in:apa:apia:mobile:ctp-insurance": "//pixel.everesttech.net/2247/t?ev_APIAMobileCTPC2C=1",
            "in:apa:apia:mobile:caravan-insurance": "//pixel.everesttech.net/2247/t?ev_APIAMobileOtherC2C=1",
            "in:apa:apia:mobile:comprehensive-boat-insurance": "//pixel.everesttech.net/2247/t?ev_APIAMobileOtherC2C=1",
            "in:apa:apia:mobile:funeral-insurance": "//pixel.everesttech.net/2247/t?ev_APIAMobileOtherC2C=1",
            "in:apa:apia:mobile:travel-insurance": "//pixel.everesttech.net/2247/t?ev_APIAMobileOtherC2C=1",
            "in:jci:mobile:get-a-quote:how-to-get-a-quote": "//pixel.everesttech.net/2246/t?ev_JCIMobC2C=1",
            "in:jci:mobile:contact-us": "//pixel.everesttech.net/2246/t?ev_JCIMobileContactUsC2C=1",
            "in:shn:homepage": "//pixel.everesttech.net/2219/t?ev_ShannonsMobileC2C=1",
            "bk:sun:loans:business-loans:our-business-loans": "//pixel.everesttech.net/1589/t?ev_MobBizLClickToCall=1",
            "bk:sun:bank-accounts": "//pixel.everesttech.net/1589/t?ev_MobTDClickToCall=1",
            "bk:sun:investing:term-deposits" : "//pixel.everesttech.net/1589/t?ev_MobTDClickToCall=1",
            "bk:sun:home-loans": "//pixel.everesttech.net/1589/t?ev_MobHLClickToCall=1",
            "bk:sun:loans:personal-loans": "//pixel.everesttech.net/1589/t?ev_MobPLClickToCall=1",
            "bk:sun:fixedrate": "//pixel.everesttech.net/1589/t?ev_MobTDClickToCall=1",
            "bk:sun:campaign:carloans": "//pixel.everesttech.net/1589/t?ev_MobTDClickToCall=1"
        };

        if(/^in:apa:apia:mobile/.test(s.pageName) && currentElement.className === 'ui-link'){
            var linktext = (currentElement.textContent || currentElement.innerText);
            if(/call|here/i.test(linktext)) {
                var da_img = new Image();
                da_img.src = "//pixel.everesttech.net/2247/t?ev_APIAMobileHeaderC2C=1";
            }
        } else if(adlens[s.pageName]){
            var da_img = new Image();
            da_img.src = adlens[s.pageName];
        } else if(/^in:gio:mobile:get-insurance-quote/.test(s.pageName)){
            trackGIOClick2Call(currentElement);
        } else if(s.pageName == "bk:sun:agribusiness"){
            d.imageTag("//pixel.everesttech.net/1589/t?ev_MobBizLClickToCall=1");
            d.imageTag("//pixel.everesttech.net/1589/t?ev_MobTDClickToCall=1");
        }
        
        // iframe tag
        if (s.pageName == 'in:ami:mobile:car-insurance:comprehensive-car-insurance') {
            d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=mobil549;ord=1;num=' + cachebuster + '?');
        } else if (s.pageName == 'in:ami:mobile:travel-insurance') {
            d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamit287;cat=mobil378;ord=1;num=' + cachebuster + '?');
        } else if (s.pageName == 'in:ami:mobile:home-insurance') {
            d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=mobil575;ord=1;num=' + cachebuster + '?');
        } else if (s.pageName == 'in:ami:mobile:ctp-insurance:ctp-insurance-nsw' || s.pageName == 'in:ami:mobile:ctp-insurance:ctp-insurance-act') {
            d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamio191;cat=mobil648;ord=1;num=' + cachebuster + '?');
        } else if (s.pageName == 'in:ami:mobile:business-insurance') {
            d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aamib983;cat=mobil561;ord=1;num=' + cachebuster + '?');
        } else if (s.pageName == 'in:ami:mobile:car-insurance:third-party-property-car-insurance') {
            d.iframeTag('//fls.doubleclick.net/activityi;src=875382;type=aami3347;cat=mobil447;ord=1;num=' + cachebuster + '?');
        };
        
        s.tl(currentElement,"o","Click to Call: "+linkHref, null,'navigate');
        // restore events and clear filters
        s.events=scTempEvents;
        s.linkTrackVars="none";
        s.linkTrackEvents="none";
        s.usePlugins=true;
        s.useForcedLinkTracking = false;
        s.forcedLinkTrackingTimeout = 250;
    }
    // PDF downloads
    var fileMatch = linkHref.match(new RegExp(/\.pdf$|\.pdf\?/));
    if(fileMatch != null) {
        if(typeof fileMatch[0] !== 'undefined') {
            scTempEvents=s.events;
            s.usePlugins=false;
            s.linkTrackVars="eVar49,events";
            s.linkTrackEvents="event33";
            s.eVar49=linkHref;
            s.events="event33";
            s.tl(this,"o","Form Download:"+linkHref);
            // restore events and clear filters
            s.events=scTempEvents;
            s.linkTrackVars="none";
            s.linkTrackEvents="none";
            s.usePlugins=true;
        }
    }
};
scEventExists = function(event){
    if(s.events){
        var events = s.events.split(',');
        for(i=0;i<events.length;i++){
            if(events[i]==event || events[i].indexOf(event+':') > -1){
                return true;
            }
        }
    }
    return false;
}
scProductExists = function(product){
    if(s.products){
        var products = s.products.split(',');
        for(i=0;i<products.length;i++){
            var product_array = products[i].split(';');
            if(product_array.length>1){
                if(product_array[1]==product) return true;
            }
        }
    }
    return false;
}
scGetProducts = function(){
    var returnValue = ''
    if(s.products){
        var products = s.products.split(',');
        for(i=0;i<products.length;i++){
            var delimiter = i == products.length - 1 ? '' : ';';
            var product_array = products[i].split(';');
            if(product_array.length>1){
                returnValue = returnValue + product_array[1] + delimiter;
            }
        }
    }
    return returnValue;
}
scGetQuoteNumber = function () {
    var events = s.events.split(',');
    var quoteNumber = '';
    for(i=0;i<events.length;i++){
        if (events[i].indexOf('event9') > -1 || events[i].indexOf('event10') > -1) {
            quoteNumber = events[i].split(':')[1];
        }
    }
    return quoteNumber;
}

scGetISODateString = function() {
    function pad(number) {
        var r = String(number);
        if (r.length === 1) {
            r = '0' + r;
        }
        return r;
    }

    var time = new Date();

    return time.getUTCFullYear()
        + '-' + pad(time.getUTCMonth() + 1)
        + '-' + pad(time.getUTCDate())
        + 'T' + pad(time.getUTCHours())
        + ':' + pad(time.getUTCMinutes())
        + ':' + pad(time.getUTCSeconds())
        + '.' + String((time.getUTCMilliseconds() /
        1000).toFixed(3)).slice(2, 5)
        + 'Z';
};

//manual Survey launch
if (/*@cc_on!@*/false) { // check for Internet Explorer
    document.onfocusin = onFocus;
} else {
    window.onfocus = onFocus;
}
function onFocus(){
    if(s.c_r('s_bin_qs')){
        if(s.pageName && s.pageName!='in:bin:secapp:motor:quote:car_selection:quote_started'){
            if(typeof s.Survey.launch == "function") { s.Survey.launch("31847"); }
            s.c_w('s_bin_qs','',-1); //delete cookie
        }
    }
    if(s.c_r('s_bin_ss')){
        if(s.pageName && s.pageName.indexOf('in:bin:secapp:selfservice:claim:lodgement') == -1){
            if(typeof s.Survey.launch == "function") { s.Survey.launch("32011"); }
            s.c_w('s_bin_ss','',-1); //delete cookie
        }
    }
    if(s.c_r('s_ami_income_qc')){
        if(s.pageName && (s.pageName != "in:ami:secapp:sales:directlife:quote:quote_completed:income_protection" &&
                        s.pageName != "in:ami:secapp:sales:directlife:application:application_started:income_protection" &&
                        s.pageName != "in:ami:secapp:sales:directlife:application:application_summary:income_protection" &&
                        s.pageName != "in:ami:secapp:sales:directlife:buy:buy_started:income_protection")){
            if(typeof s.Survey.launch == "function") { s.Survey.launch("33435"); }
            s.c_w('s_ami_income_qc', '',-1); //delete cookie
        }
    }
    if(s.c_r('s_ami_home_qsp')){
        if(s.pageName && (s.pageName.indexOf("in:ami:secapp:sales:home") == -1)){
            if(typeof s.Survey.launch == "function") s.Survey.launch("33744");
            s.c_w('s_ami_home_qsp', '',-1);
        }
    }
    if(s.c_r('s_sun_life_qc')){
        if(s.pageName && (s.pageName != "in:sun:secapp:sales:directlife:quote:quote_completed:life_protect" &&
                        s.pageName != "in:sun:secapp:sales:directlife:application:application_started:life_protect" &&
                        s.pageName != "in:sun:secapp:sales:directlife:application:application_summary:life_protect" &&
                        s.pageName != "in:sun:secapp:sales:directlife:buy:buy_started:life_protect")){
            if(typeof s.Survey.launch == "function") { s.Survey.launch("33434"); }
            s.c_w('s_sun_life_qc', '',-1); //delete cookie
        }
    }
    if(s.c_r('s_sun_motor_qs')){
        if(s.pageName && (s.pageName.indexOf("in:sun:secapp:motor") == -1)){
            if(typeof s.Survey.launch == "function") s.Survey.launch("32997");
            s.c_w('s_sun_motor_qs', '',-1);
        }
    }
    if(s.c_r('s_gio_motor_qsp')){
        if(s.pageName && (s.pageName.indexOf("in:gio:secapp:sales:motor") == -1)){
            if(typeof s.Survey.launch == "function") s.Survey.launch("33309");
            s.c_w('s_gio_motor_qsp', '',-1);
        }
    }
    if(s.c_r('s_sun_home_qsp')){
        if(!(/in:sun:secapp:home/i.test(s.pageName))){
            if(typeof s.Survey.launch == "function") s.Survey.launch("33307");
            s.c_w('s_sun_home_qsp', '',-1);
        }
    }
    if(s.c_r('s_sun_home_bsp')){
        if(!(/in:sun:secapp:home/i.test(s.pageName))){
            if(typeof s.Survey.launch == "function") s.Survey.launch("33745");
            s.c_w('s_sun_home_bsp', '',-1);
        }
    }
    if(s.c_r('s_gio_home_qsp')){
        if(!(/in:gio:secapp:sales:home/i.test(s.pageName))){
            if(typeof s.Survey.launch == "function") s.Survey.launch("33308");
            s.c_w('s_gio_home_qsp', '',-1);
        }
    }
    if(s.c_r('s_everdaysuper_qsp')){
        if(s.pageName && (s.pageName.indexOf("sp:sun:secapp:sales:superonline:apply") == -1)){
            if(typeof s.Survey.launch == "function") s.Survey.launch("33828");
            s.c_w('s_everdaysuper_qsp', '',-1);
        }
    }
    if(s.c_r('s_apia_car_bsp'))
    {
        if(s.pageName && s.pageName != "in:apa:secapp:motor:quote:completed")
        {
            if(typeof s.Survey.launch == "function") s.Survey.launch("33805");
            s.c_w('s_apia_car_bsp', '',-1);
        }
    }

    if(s.c_r('s_apia_home_bsp'))
    {
        if(s.pageName && s.pageName != "in:apa:secapp:home:quote:completed")
        {
            if(typeof s.Survey.launch == "function") s.Survey.launch("33806");
            s.c_w('s_apia_home_bsp', '',-1);
        }
    }

}

/************************** CONFIG SECTION **************************/
/* You may add or alter any code config here. */
s.cookieDomainPeriods="3"
/* Link Tracking Config */
s.useForcedLinkTracking=false   //use custom link tracking
s.trackDownloadLinks=true
s.trackExternalLinks=true
s.trackInlineStats=true
s.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx"
s.linkInternalFilters="javascript:,suncorp.com.au,vero.com.au,custhelp.com,cardservicesdirect.com.au,"+window.location.host
s.linkLeaveQueryString=false
s.linkTrackVars="None"
s.linkTrackEvents="None"
/* Plugin Config */
s.usePlugins=true

/* Page Name Plugin Config */
s.siteID="none"            // leftmost value in pagename
s.defaultPage=""       // filename to add when none exists
s.queryVarsList=""     // query parameters to keep
s.pathExcludeDelim=";" // portion of the path to exclude
s.pathConcatDelim=":"   // page name component separator
s.pathExcludeList=""   // elements to exclude from the path
    
/* PurchasePath Config */
var _dCompaignCode = '';
var _dTrafficSourceVariable = 'eVar61';
var _dStackingVariable = 'eVar64';
var _dKeywordVariable = 'eVar62';
var _dBrandTerms = 'suncorp';
var _dExpireDays = 365;

/*********Media Module Calls**************/
s.loadModule('Media');
s.Media.autoTrack=true;
s.Media.trackVars="eVar38,prop30,events";
s.Media.trackEvents="event25,event75,event76";
s.Media.trackUsingContextData = true;
s.Media.trackSeconds=6;
s.Media.contextDataMapping = {
    "a.media.name":"eVar38,prop30",
    "a.media.view":"event25",
    "a.media.complete":"event76",
    "a.media.timePlayed":"event75"
};

function s_doPlugins(s) {
    /* Add calls to plugins here */

    // Scode version
    s.prop50 = d.code_version;
    
    // Server host
    s.server=scHost;
    
    // set default page for Bingle Facebook App
    if(s.server.indexOf("binglecomps.com.au") > -1) s.defaultPage="home";
    
    // Form analysis
    if(typeof s.formList != 'undefined') s.setupFormAnalysis();
    
    // Config
    var scInternalDomains = new Array();
    var scBrandTerms = 'suncorp';
    if(scCount==0){
        scSiteID = s.siteID;
        for(i=0; i<scConfig.length; i++){
            if(s.un.indexOf(scConfig[i][0]) > -1){
                if(scSiteID == "none") s.siteID = scConfig[i][2]; // assign site id
                s.trackingServer='metrics.'+scConfig[i][3]; // assign metrics server
                s.trackingServerSecure='smetrics.'+scConfig[i][3]; // assign secure metrics server
                scInternalDomains=scConfig[i][5].split(',');
                scBrandTerms=scConfig[i][4];
            }
        }
    }
    
    /* Fix for URL changes happening to these sites that would drop portions of page name*/
    if(window.location.host.indexOf("insuremyride.com.au")>-1 && window.location.pathname.indexOf("/imr/") < 0) s.siteID = 'in:imr:imr';
    if(window.location.host.indexOf("apia.com.au")>-1 && window.location.pathname.indexOf("/apia/") < 0) s.siteID = 'in:apa:apia';
    if(window.location.host.indexOf("m.aami.com.au")>-1) s.siteID = 'in:ami:mobile';
    if(window.location.host.indexOf("suncorpbank.com.au")>-1) s.siteID = 'bk:sun';
 
    // Set the Page Name using the plug-in
    if(!s.pageType && !s.pageName){
        s.pageName=s.getPageName();
        s.pageName=s.pageName.toLowerCase();
    }

    /* append quote start to the page name */
    if(scEventExists("event8")){
        if(s.pageName.indexOf(":quote_started") < 0) s.pageName=s.pageName+":quote_started";
    }
    
    if(typeof(s_doPluginsExtension) == "function"){
        s_doPluginsExtension(); //when terrischeer is included, will override this function from terrischeer-sitecat.js
    }
    
    /* pagename clean up code */
    pathArray=s.pageName.split(':');
    var pathLength=pathArray.length;
    s.channel=pathArray[0]+":"+pathArray[1]+":"+pathArray[2]; //Site Section
    if(pathArray[3]){
        s.prop1=pathArray[0]+":"+pathArray[1]+":"+pathArray[2]+":"+pathArray[3]; //Site Sub Section
    }else{
        s.prop1=s.channel;  
    }
    s.prop2=pathArray[0]; //Line of Business
    s.prop3=pathArray[1]; //Brand
    if(!s.hier1){   
        s.hier1=s.pageName.replace(new RegExp(/:/g),"|");   
    }
    
    /* Automate events based on page names */
    if(s.pageName == 'bk:sun:savings:term-deposits:enquiry'){
        s.events=s.apl(s.events,s.serializeEvent("event3"),",",1);
        s.products = ';termdeposit';
    }
    if(s.pageName == 'bk:sun:secapp:agribusiness_enquiry:form:form_started' || s.pageName == 'bk:sun:secapp:merchants_enquiry:form:form_started'
        || s.pageName == 'bk:sun:home-loans:enquiry' || s.pageName == 'bk:sun:business:enquire') {
        s.events=s.apl(s.events,s.serializeEvent("event3"),",",1);
    } else if(s.pageName == 'bk:sun:secapp:termdeposit_enquiry:form:form_completed' || s.pageName == 'bk:sun:secapp:agribusiness_enquiry:form:form_completed' || s.pageName == 'bk:sun:secapp:merchants_enquiry:form:form_completed'
        || s.pageName == 'bk:sun:home-loans:enquiry:submit' || s.pageName == 'bk:sun:business-banking:thankyou') {
        s.events=s.apl(s.events,s.serializeEvent("event4"),",",1);
    }
    if(s.pageName=='in:gio:workers-compensation-insurance:quote-request'){
        s.events=s.apl(s.events,s.serializeEvent("event3"),",",1);
        s.products='workers_compenstation';
    } else if(s.pageName == 'in:gio:workers-compensation-insurance:quote-request:thank-you') {
        s.events=s.apl(s.events,s.serializeEvent("event4"),",",1);
        s.products='workers_compenstation';
    }
    if(s.pageName=="in:ami:secapp:selfservice:claim:lodgement:landingpage"){
        s.events=s.apl(s.events,"event46",",",1);
        s.eVar9="Claim_lodgement";
    }
    if(s.pageName=="in:ami:secapp:selfservice:claim:lodgement:claimlodged:motor"){
        s.events=s.apl(s.events,"event1",",",1);
        s.eVar9="Claim_lodgement";
    }
    if(s.pageName=="in:ami:secapp:selfservice:claim:lodgement:claimlodged:motorcycle"){
        s.events=s.apl(s.events,"event1",",",1);
        s.eVar9="Claim_lodgement";
    }
    if(s.pageName=="in:ami:secapp:selfservice:claim:lodgement:claimlodged:caravan"){
        s.events=s.apl(s.events,"event1",",",1);
        s.eVar9="Claim_lodgement";
    }
    if(s.pageName=="in:ami:secapp:selfservice:claim:lodgement:claimlodged:home"){
        s.events=s.apl(s.events,"event1",",",1);
        s.eVar9="Claim_lodgement";
    }
    if(s.pageName=="in:ami:secapp:selfservice:claim:lodgement:yourpolicy:motor"){
        s.events=s.apl(s.events, s.serializeEvent("event71"), ",",1);
        s.eVar71="lodged_claim_motor";
    }
    if(s.pageName=="in:ami:secapp:selfservice:claim:lodgement:yourpolicy:home"){
        s.events=s.apl(s.events, s.serializeEvent("event71"), ",",1);
        s.eVar71="lodged_claim_home";
    }
    if(s.pageName=="in:ami:secapp:paymentonline:selfservice:paymentcomplete"){
        s.events=s.apl(s.events, s.serializeEvent("event71"), ",",1);
        s.eVar71="renewal_payment";
    }
    if(s.pageName=="in:ami:secapp:selfservice:policy:renew:renewal_payment:car"){
        s.events=s.apl(s.events, s.serializeEvent("event71"), ",",1);
        s.eVar71="renewal_payment_motor";
    }
    if(s.pageName=="in:ami:secapp:selfservice:policy:renew:renewal_payment:home"){
        s.events=s.apl(s.events, s.serializeEvent("event71"), ",",1);
        s.eVar71="renewal_payment_home";
    }
    if(s.pageName=="in:ami:secapp:selfservice:policy:find_policy:find_policy_completed"){
        s.events=s.apl(s.events, s.serializeEvent("event71"), ",",1);
        s.eVar71="find_policy";
    }
    if(s.pageName=="in:ami:secapp:selfservice:policy:dashboard:dashboard"){
        s.events=s.apl(s.events, s.serializeEvent("event71"), ",",1);
        s.eVar71="login_new";
    }
    if(s.pageName=="in:ami:secapp:selfservice:authentication:registration:registration_completed"){
        s.events=s.apl(s.events, s.serializeEvent("event71"), ",",1);
        s.eVar71="registration_new";
    }
    if(s.pageName=="in:ami:secapp:mypolicymanager:selfservice:login_completed"){
        s.events=s.apl(s.events, s.serializeEvent("event71"), ",",1);
        s.eVar71="login_old";
    }
    if(s.pageName=="in:ami:secapp:mypolicymanager:selfservice:registration_enter_policy_number"){
        s.events=s.apl(s.events, s.serializeEvent("event71"), ",",1);
        s.eVar71="registration_old";
    }
    if(s.pageName=="in:apa:secapp::selfservice:regoconfirm"){
        s.events=s.events.replace("event1,","");
        s.events=s.apl(s.events, s.serializeEvent("event1"), ",",1);
        s.eVar9="registration";
    } else if (s.pageName=="in:apa:secapp::selfservice:portfolio"){
        s.events=s.events.replace("event1,","");
        s.events=s.apl(s.events, s.serializeEvent("event1"), ",",1);
        s.eVar9="logon";
    } 
    if(scEventExists('event18') && (s.siteID == "in:sun" || s.siteID == "in:ami")
        && (s.products.indexOf("home_") > -1 || s.products.indexOf("car_") > -1)){
        s.events = s.apl(s.events, s.serializeEvent("event1"), ",", 1);
        s.eVar9 = "in_selfservice_nb_unableregister_3rdparty";
        var typeMap = {
            elements: ["registrationOutcomeNew", 
                    "registrationOutcomeExistingMatched", 
                    "registrationOutcomeExistingUnmatched",
                    "registrationOutcomeBusinessCustomerNotRegistered",
                    "registrationOutcomeSystemError"],
            serviceTypes: ["in_selfservice_nb_register",
                    "in_selfservice_nb_Addpolicy",
                    "in_selfservice_nb_unableregister_notmatched", //TODO unsure
                    "in_selfservice_unableregister_business",
                    "in_selfservice_nb_unableregister"]
        };
        for (var i = 0; i < typeMap.elements.length; i++) {
            var element = document.getElementById(typeMap.elements[i]);
            if (element && element.getAttribute("class") == "") {
                s.eVar9 = typeMap.serviceTypes[i];
                break;
            }
        }
    }
    // CIL Request a Quote Form Tracking
    if(s.pageName=="in:cil:request-a-quote"){
        var sid=s.getQueryParam('sid');
        s.events=s.apl(s.events,"event47",",",1); // tool start
        s.events=s.apl(s.events,"event3",",",1); // lead start
        s.eVar5="request-a-quote";  
    }
    //CIL Request a Quote Complete Tracking
    if(s.pageName=="in:cil:request-a-quote-confirmation") {
        s.events=s.apl(s.events,"event4",",",1); // lead complete
        s.prop8="request-a-quote";
    }
    // CIL Contact us Form Tracking
    if(s.pageName=="in:cil:contact-us"){
        s.events=s.apl(s.events,"event47",",",1); // tool start
        s.eVar5="contact-us";
    }
    if(s.pageName=="in:cil:node:15:done"){
        s.prop8="contact-us";
    }
    // Shannons Club Lead Tracking
    if(s.pageName=="in:shn:club:club:register"){
        s.events=s.apl(s.events,"event3",",",1); // lead start
    }
    if(s.pageName=="in:shn:club:club:register:thanks"){
        s.events=s.apl(s.events,"event4",",",1); // lead complete
    }
    //Bingle Motor But Start
    if(s.pageName=="in:bin:secapp:motor:buy:car_summary"){
        s.events=s.apl(s.events,"event17:" + s.getAndPersistValue(null,'BingleQuoteNumber')+"MOT",",",1);
    }
    //Apia Dynamic Numbers Tracking
    if(s.siteID == 'in:apa:apia') {
        var telEle = d.getElementsByClassName('dynamic-phone');
        if(telEle && telEle.length > 0) {
            s.eVar56 = d.getInnerText(telEle[0]);
        }
        var date = new Date();
        var month = (date.getMonth() + 1).toString();
        var day = date.getDate().toString();
        s.prop56 = date.getFullYear().toString() + (month[1] ? month : '0' + month[0]) + (day[1] ? day : '0' + day[0]);
        s.eVar26 = s.prop42 = s.getSessionID();
    }   
    //Fix payment type in LSP Apps
    if(s.prop26 && s.products != ';business_market_stall_public_liability' && s.products != ';ami_business') {
        s.prop26 = s.prop26.toLowerCase().indexOf('m') > -1 ? 'monthly' : 'annually';
    }
    //Quote counter for LSP
    if(scEventExists('event9') && /car|motor|home|landlord/i.test(s.products)) {
        s.events = s.apl(s.events, 'event40', ',', 1);
        if(s.getAndPersistValue(null, 's_page_refreshed') != s.pageName) s.eVar41 = '+1';
        s.eVar67 = s.eVar30;
    }
    if(s.eVar28) {
        var payMethod = s.eVar28.toLowerCase();
        s.eVar28 = (payMethod.indexOf('credit') > -1 || payMethod.indexOf('pay_now') > -1) ? 'credit_card' : payMethod.indexOf('later') > -1 ? 'pay_later' : 'direct_debit';
    }

    /* Set internal search automatically */ 
    if(s.prop5&&!s.eVar3){
        s.events=s.apl(s.events,"event2",",",2);
        s.prop5=s.eVar3=s.prop5.toLowerCase();      
    }   
    if(s.pageName=="in:ami:skilled-drivers"){
        s.events=s.apl(s.events,"event4",",",1);
        s.eVar4="Skilled Drivers-Info View";
    }

    /* Capture internal promotion id*/
    if(!s.eVar2){
        s.eVar2=s.getQueryParam('intcmp');
    }
    if(s.eVar2){
        //s.eVar2=s.getValOnce(s.getQueryParam('intcmp'),'s_eVar2',0)
        s.events=s.apl(s.events,"event35",",",1);
    }

    /* Capture Campaign ID */
    // Prioritise SEM CMPID, over session value
    s.campaign=s.getQueryParam('cmpid').toLowerCase();

    if (s.campaign) {
        s.prop4=s.campaign+"|"+s.pageName; //campaign pathing
    }else{
        s.prop4= s.pageName;
    }

    /* s.crossVisitParticipation */
    /* Campaign Stacking */
    if(/google|yahoo|bing/i.test(document.referrer) && !s.campaign) {
        s.seobrand = s.siteID.replace('in', 'SEO');
        s.eVar1 = s.crossVisitParticipation(s.seobrand,'s_cpm','90','5','>','purchase');
    } else if(!document.referrer && !s.campaign) {
        s.eVar1 = s.crossVisitParticipation('DIRECT','s_cpm','90','5','>','purchase');
    } else if (s.campaign) {
        s.eVar1 = s.crossVisitParticipation(s.campaign,'s_cpm','90','5','>','purchase');
    }
    s.prop28 = s.getValOnce('T', 'prop_28', 0); /*Populate the unified sources flag*/

    /* Capture Campaign Email ID */
    if(s.getQueryParam('cmpid').toLowerCase().indexOf('edm') != -1){
        s.eVar42=s.getQueryParam('cmpid'); 
        s.eVar44=s.crossVisitParticipation(s.eVar42,'s_v44','365','5','>');}
    else if(!document.referrer && !s.campaign){
        s.eVar44=s.crossVisitParticipation('DIRECT','s_v44','365','5','>');
    }

    /* getTimeToComplete */
    if(s.eVar1) s.prop27='start';
    if(s.events.indexOf('event12')>-1) s.prop27='stop';
    s.prop27=s.getTimeToComplete(s.prop27,'ttc',0);

    /*Tool Usage*/
    if(s.prop8){
        s.events=s.apl(s.events,"event5",",",1);
        s.eVar5=s.prop8;
    }

    /*Self Service Transactions*/
    if(s.prop11){
        s.events=s.apl(s.events,"event1",",",1);
        s.eVar9=s.prop11;
    }

    /*Branch Search*/
    if(s.prop20){
        s.events=s.apl(s.events,"event16",",",1);
        s.eVar18=s.prop20 //branch location
    }

    /* Time Parting */
    s.prop9 = s.getTimeParting('s','+10');
    s.eVar8 = 'D=c9';

    /*socialPlatforms v1.0 - used for SocialAnalytics*/
    s.socialPlatforms('eVar68');

    /*Jeopardy*/
    if(s.prop19){
        s.events=s.apl(s.events,"event15",",",1);
        s.eVar17=s.prop19
    }
    s.prop49='D=g';
    //automatically set variables
    s.eVar10=s.prop12; //age
    s.eVar11=s.prop13; //gender
    s.eVar12=s.prop14; //Postcode
    s.eVar13=s.prop15; //State
    s.eVar14=s.prop16; //Existing Customer
    s.eVar15=s.prop17; //Year of Manufacture
    s.eVar16=s.prop18; //Make of Car
    s.eVar19=s.prop21; //Initial Sum Insured
    s.eVar20=s.prop22; //Claim History
    s.eVar21=s.prop23; //Previous Insurer Code
    s.eVar24=s.prop26; //Payment Term
    s.eVar32=s.prop32; //Subclass
    s.eVar33=s.prop33; //Customer Income
    s.eVar34=s.prop34; //Customer Product Purpose
    s.eVar36=s.prop24; //Click
    
    scInternalRef=false;
    for(i=0;i<scInternalDomains.length;i++){
        if(_dGetHostName(document.referrer).toLowerCase().indexOf(scInternalDomains[i].toLowerCase())>=0) scInternalRef=true;
    }
    if(scCount==0 && (!scInternalRef)){
        /* Datalicious PurchasePath */
        var scSEM = false;
        var originalCampaign = '';
        _dBrandTerms = scBrandTerms;
        if(s.campaign){
            _dCompaignCode=s.campaign;
            _dCompaignCode=_dCompaignCode.toLowerCase();
            if(_dCompaignCode.indexOf(':edm:')>=0) _dCompaignCode = 'em'; // eDM
            if(_dCompaignCode.indexOf(':dis:')>=0) _dCompaignCode = 'ds'; // Display
            if(_dCompaignCode.indexOf(':van:')>=0) _dCompaignCode = 'vn'; // Vanity
            if(_dCompaignCode.indexOf(':van:')>=0) _dCompaignCode = 'vn'; // Vanity
            if(_dCompaignCode.indexOf(':aff:')>=0) _dCompaignCode = 'af'; // Affiliate
            if(_dCompaignCode.indexOf(':com:')>=0) _dCompaignCode = 'cm'; // Comparison
            if(_dCompaignCode.indexOf(':sem:')>=0){
                originalCampaign = s.campaign;
                s.campaign = '';
                _dCompaignCode = '';
                scSEM = true;
            }
        }
        _dOmniturePurchasePath();
        if(scSEM){
            if(s.eVar61.indexOf('seo:') == 0){
                if(s.eVar64.length==2){
                    if(s.eVar61.indexOf('branded') > -1){
                        s.eVar64 = 'cb';
                    }else{
                        s.eVar64 = 'cg';
                    }
                }else{
                    var scFirstTouch = s.eVar64.substr(0,3);
                    var scMiddleTouches = '';
                    if(s.eVar64.length>5){
                        scMiddleTouches = s.eVar64.substr(5);
                    }
                    if(s.eVar61.indexOf('branded') > -1){
                        s.eVar64 = scFirstTouch + 'cb' + scMiddleTouches;
                    }else{
                        s.eVar64 = scFirstTouch + 'cg' + scMiddleTouches;
                    }
                }
            }else{
                if(s.eVar64.length==2){
                    s.eVar64 = 'ps'; // paid search without keyword detected
                }else{
                    var scFirstTouch = s.eVar64.substr(0,3);
                    var scMiddleTouches = '';
                    if(s.eVar64.length>5){
                        scMiddleTouches = s.eVar64.substr(5);
                    }
                    s.eVar64 = scFirstTouch + 'ps' + scMiddleTouches;
                }
            }
            s.campaign=s.eVar61=originalCampaign;
            _dSetCookie("__ppFullPath", s.eVar64, _dExpireDays);
        }
        if(s.eVar62){
            var scKeywordStack = '';
            if(scSEM){
                scKeywordStack = 'paid:';
            }else{
                scKeywordStack = 'organic:';
            }
            scKeywordStack = scKeywordStack + s.eVar62;
            s.eVar63=s.crossVisitParticipation(scKeywordStack,'s_evar63','30','10','>',''); // Keyword Stacking
        }
    }

    /* Product Selection Change */
    if(scEventExists("event9") && s.un != 'sunbiziprod' && s.un != 'sunbizidev'){
        var scPSC = d.getCookie("__psc");
        var quoteNumber = d.getCookie("QuoteNumber");
        if(scPSC != '' && quoteNumber != ''){
            if(scPSC!=scGetProducts() && quoteNumber == scGetQuoteNumber()){
                s.events=d.replaceAll(s.events, "event9", "event54");
            }
        }else{
            scPSC=scGetProducts();
            d.setCookie("__psc", scPSC);
            quoteNumber = scGetQuoteNumber();
            d.setCookie("QuoteNumber", quoteNumber);
        }
    }

    /* Bounce Rate */
    if (s.getAndPersistValue(null, 's_page_refreshed') == s.pageName) {
        s.events = s.apl(s.events, "event32", ",", 1);
    } else if (s.eVar61) {
        s.eVar50 = s.pageName;
        s.events = s.apl(s.events, "event31", ",", 1);
    }
    
    /* New vs Repeat */
    s.prop51=s.eVar51=s.getNewRepeat().toLowerCase();
    
    /* Time to Complete Quote */
    if(s.events.indexOf('event8')>-1) s.prop46='start';
    if(s.events.indexOf('event9')>-1) s.prop46='stop';
    s.prop46=s.getTimeToComplete(s.prop46,'ttcq',0);

    /* Time to Complete Quote */
    if(s.events.indexOf('event17')>-1) s.prop47='start';
    if(s.events.indexOf('event18')>-1) s.prop47='stop';
    s.prop47=s.getTimeToComplete(s.prop47,'ttcb',0);
    
    /* Copy product to prop and define product category */
    if(s.products && (s.events.indexOf('event9')>-1 || s.events.indexOf('event18')>-1)) s.prop48=scGetProducts();
    
    /* For 25k campaign (To be removed after campaign) */
    var campaignSegment = '';
    campaignSegment = s.getQueryParam('cst');
    if(campaignSegment != '') s.eVar73 = campaignSegment;
    if(s.pageName.indexOf('suncorp:win25k') > 0){
        cachebuster = Math.floor(Math.random()*11111111111);
        if(s.pageName.indexOf('win25k:refer') >= 0){
            // refer page after enter competition
            s.events=s.apl(s.events,"event29",",",1); // enter competition
            if(scCount<1) d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco482;ord=1;num='+cachebuster+'?'); // 1046479
        }else if(s.pageName.indexOf('win25k:thanks') >= 0){
            // thank you page
        }else{
            // email landing page
            if(scCount<1) d.iframeTag('//fls.doubleclick.net/activityi;src=848893;type=datalic;cat=sunco437;ord=1;num='+cachebuster+'?'); // 1046478
        }
        
    }
    
    /* Add calls to plugins here */
    s.tnt=s.trackTNT();
    
    //SiteCatalyst to Test&Target Integration (Bingle, AAMI, and GIO)
        var SCPluginSites = {
            aami: true,
            apia: true,
            bingle: true,
            gio: true,
            imr: true,
            jci: true,
            sun: true
                }
    if (typeof(mboxLoadSCPlugin) != "undefined" && 
        (
        (s.un=="sunaamiprod" && SCPluginSites.aami && s.products != ";ami_business" && (s.prop1.indexOf("in:ami:secapp:business") < 0)) || 
        (s.un=="sunapia" && SCPluginSites.apia) ||
        (s.un=="sunbingleprod" && SCPluginSites.bingle) || 
        (s.un=="sungioprod" && SCPluginSites.gio) || 
        (s.un=="suninsuremyrideprod" && SCPluginSites.imr) ||
        (s.un=="sunjustcarprod" && SCPluginSites.jci) ||
        (s.un=="sunprod" && SCPluginSites.sun)
             ) && (
            scEventExists("event1") ||
            scEventExists("event3") ||
            scEventExists("event4") || 
            scEventExists("event6") ||
            scEventExists("event7") ||
            scEventExists("event8") || 
            scEventExists("event9") || 
            scEventExists("event11") || 
            scEventExists("event12") || 
            scEventExists("event14") || 
            scEventExists("event17") ||
            scEventExists("event18") ||  
            scEventExists("event19") ||
            scEventExists("event71") ||
            s.eVar4 ||
            s.eVar9 ||
            s.eVar10 ||
            s.eVar14 || 
            s.eVar21 ||
            s.eVar13 || 
            s.prop15 ||
            s.eVar71)) {
        mboxLoadSCPlugin(s);
    }
    
    
    //survey
    if(s.pageName && s.pageName=="in:bin:secapp:motor:quote:car_selection:quote_started"){s.c_w('s_bin_qs',true);}
    if(s.pageName && s.pageName=="in:bin:secapp:motor:quote:vehicle_accessories"){ s.c_w('s_bin_qs','',-1);} //delete cookie
    if(s.pageName && s.pageName=="in:bin:secapp:selfservice:claim:lodgement:landingpage"){s.c_w('s_bin_ss',true);}
    if(s.pageName && s.pageName=="in:bin:secapp:selfservice:claim:lodgement:claimlodged:motor"){s.c_w('s_bin_ss','',-1);} //delete cookie
    if(s.pageName && s.pageName=="in:ami:secapp:sales:directlife:buy:buy_completed:income_protection"){s.c_w('s_ami_income_qc','',-1);} //delete cookie
    if(s.pageName && s.pageName=="in:sun:secapp:sales:directlife:buy:buy_completed:life_protect"){s.c_w('s_sun_life_qc','',-1);} //delete cookie
    if(s.pageName && s.pageName=="in:sun:secapp:motor:quote:quote_completed") s.c_w('s_sun_motor_qs',true);
    if(s.pageName && s.pageName=="in:sun:secapp:motor:buy:buy_completed") s.c_w('s_sun_motor_qs','',-1);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:motor:quote:quote_completed:car_comprehensive") s.c_w('s_gio_motor_qsp',true);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:motor:buy:buy_started:car_comprehensive") s.c_w('s_gio_motor_qsp','', -1);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:motor:quote:quote_completed:car_platinum") s.c_w('s_gio_motor_qsp',true);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:motor:buy:buy_started:car_platinum") s.c_w('s_gio_motor_qsp','', -1);

    if(s.pageName && s.pageName=="in:sun:secapp:home_classic:quote:quote_completed") s.c_w('s_sun_home_qsp',true);
    if(s.pageName && s.pageName=="in:sun:secapp:home_classic:buy:buy_started") s.c_w('s_sun_home_qsp','', -1);
    if(s.pageName && s.pageName=="in:sun:secapp:home_extras:quote:quote_completed") s.c_w('s_sun_home_qsp',true);
    if(s.pageName && s.pageName=="in:sun:secapp:home_extras:buy:buy_started") s.c_w('s_sun_home_qsp','', -1);
    if(s.pageName && s.pageName=="in:sun:secapp:home_advantages:quote:quote_completed") s.c_w('s_sun_home_qsp',true);
    if(s.pageName && s.pageName=="in:sun:secapp:home_advantages:buy:buy_started") s.c_w('s_sun_home_qsp','', -1);

    if(s.pageName && s.pageName=="in:sun:secapp:home_classic:buy:buy_started") s.c_w('s_sun_home_bsp',true);
    if(s.pageName && s.pageName=="in:sun:secapp:home_classic:buy:completed") s.c_w('s_sun_home_bsp','', -1);
    if(s.pageName && s.pageName=="in:sun:secapp:home_extras:buy:buy_started") s.c_w('s_sun_home_bsp',true);
    if(s.pageName && s.pageName=="in:sun:secapp:home_extras:buy:buy_completed") s.c_w('s_sun_home_bsp','', -1);
    if(s.pageName && s.pageName=="in:sun:secapp:home_advantages:buy:buy_started") s.c_w('s_sun_home_bsp',true);
    if(s.pageName && s.pageName=="in:sun:secapp:home_advantages:buy:buy_completed") s.c_w('s_sun_home_bsp','', -1);

    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:quote:quote_completed:home_classic_building_only") s.c_w('s_gio_home_qsp',true);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:buy:buy_started:home_classic_building_only") s.c_w('s_gio_home_qsp','', -1);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:quote:quote_completed:home_classic_contents_only") s.c_w('s_gio_home_qsp',true);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:buy:buy_started:home_classic_contents_only") s.c_w('s_gio_home_qsp','', -1);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:quote:quote_completed:home_classic_building_&_contents") s.c_w('s_gio_home_qsp',true);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:buy:buy_started:home_classic_building_&_contents") s.c_w('s_gio_home_qsp','', -1);

    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:quote:quote_completed:home_advantages_building_&_contents") s.c_w('s_gio_home_qsp',true);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:buy:buy_started:home_advantages_building_&_contents") s.c_w('s_gio_home_qsp','', -1);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:quote:quote_completed:home_advantages_building_only") s.c_w('s_gio_home_qsp',true);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:buy:buy_started:home_advantages_building_only") s.c_w('s_gio_home_qsp','', -1);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:quote:quote_completed:home_advantages_contents_only") s.c_w('s_gio_home_qsp',true);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:buy:buy_started:home_advantages_contents_only") s.c_w('s_gio_home_qsp','', -1);

    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:quote:quote_completed:home_extras_contents_only") s.c_w('s_gio_home_qsp',true);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:buy:buy_started:home_extras_contents_only") s.c_w('s_gio_home_qsp','', -1);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:quote:quote_completed:home_extras_building_only") s.c_w('s_gio_home_qsp',true);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:buy:buy_started:home_extras_building_only") s.c_w('s_gio_home_qsp','', -1);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:quote:quote_completed:home_extras_building_&_contents") s.c_w('s_gio_home_qsp',true);
    if(s.pageName && s.pageName=="in:gio:secapp:sales:home:buy:buy_started:home_extras_building_&_contents") s.c_w('s_gio_home_qsp','', -1);

    if(s.pageName && s.pageName=="sp:sun:secapp:sales:superonline:apply:account_type") s.c_w('s_everdaysuper_qsp','', true);
    if(s.pageName && s.pageName=="sp:sun:secapp:eds:manage:dashboard") s.c_w('s_everdaysuper_qsp','', -1);
    if(s.pageName && s.pageName=="sp:sun:secapp:sales:superonline:apply:application_completed:everydaysuper_new") s.c_w('s_everdaysuper_qsp','', -1);

    if(s.pageName && s.pageName=="in:ami:secapp:sales:home:quote:quote_completed:home_building_&_contents") s.c_w('s_ami_home_qsp',true);
    if(s.pageName && s.pageName=="in:ami:secapp:sales:home:buy:buy_started:home_building_&_contents") s.c_w('s_ami_home_qsp','', -1);
    if(s.pageName && s.pageName=="in:ami:secapp:sales:home:quote:quote_completed:home_building_only") s.c_w('s_ami_home_qsp',true);
    if(s.pageName && s.pageName=="in:ami:secapp:sales:home:buy:buy_started:home_building_only") s.c_w('s_ami_home_qsp','', -1);
    if(s.pageName && s.pageName=="in:ami:secapp:sales:home:quote:quote_completed:home_contents_only") s.c_w('s_ami_home_qsp',true);
    if(s.pageName && s.pageName=="in:ami:secapp:sales:home:buy:buy_started:home_contents_only") s.c_w('s_ami_home_qsp','', -1);

    if(s.pageName && s.pageName == "in:apa:secapp:motor:quote:completed") s.c_w('s_apia_car_bsp',true)
    if(s.pageName && s.pageName == "in:apa:secapp:motor:buy:buy_started") s.c_w('s_apia_car_bsp','', -1);

    if(s.pageName && s.pageName == "in:apa:secapp:home:quote:completed") s.c_w('s_apia_car_bsp',true)
    if(s.pageName && s.pageName == "in:apa:secapp:home:buy:buy_started") s.c_w('s_apia_home_bsp','', -1);

    //Survey respondent ID
    if(s.pev3 && s.pev3.indexOf(':')>-1){
        s.prop53=s.pev3.substring(0,s.pev3.indexOf(':'));
        s.Survey.trackVars+=',prop53';
    }
    

    //seriailized events

    if(scEventExists('event1')){
        if(s.eVar9){
            scSelfService = s.eVar9.toLowerCase();
            if(scSelfService == 'registration' && !scEventExists('event7')){
                s.events=s.apl(s.events,"event7",",",1);
            }
            if(scSelfService == 'login' && !scEventExists('event6')){
                s.events=s.apl(s.events,"event6",",",1);
            }
            if(scSelfService == 'update address' && !scEventExists('event43')){
                s.events=s.apl(s.events,"event43",",",1);
            }
            if(scSelfService == 'online billing' && !scEventExists('event42')){
                s.events=s.apl(s.events,"event42",",",1);
            }
            if(scSelfService == 'online renew' && !scEventExists('event44')){
                s.events=s.apl(s.events,"event44",",",1);
            }
        }
    }
    
    /* bizi tracking code */
    if(s.pageName=='sg:biz2:wizard'){
        var leadStartEvent = s.serializeEvent("event3");
        s.events=s.apl(s.events,leadStartEvent,",",1);
    }
    
    scCount++;
    s.getAndPersistValue(s.pageName, 's_page_refreshed');
    
    // the final page load time function call
    s.prop57 = s_getLoadTime();
    
     /* Set transactionID for Shannon and Apia*/
    if((s.siteID == 'in:shn' || s.siteID == 'in:apa:apia') && s.pageName.indexOf('secapp') == -1 && s.prop42) {
        s.transactionID = s.prop42;
    }

    /* DATALICIOUS: event36 or event72 - Fire Datacollector when Quote is Saved  */
    d.triggerQuoteSaved();

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
        d.triggerDataCollectorAdserver(true, undefined, undefined, s.eVar61, 'engagement');
        superT.setCookie('dl_fired', 'true', '',superT.getTopDomain());
    }
}


s.doPlugins=s_doPlugins;
s.eVar22='';
s.eVar23=''
s.eVar62='';
s.eVar61='';
scCount=0;

/************************** PLUGINS SECTION *************************/
/* You may insert any plugins you wish to use here.                 */

/* Plugin: Event ID Serialization */
s.serializeEvent = function(sEvent) {
    if (sEvent != null && sEvent.indexOf(":") == -1) {
        s.eVar26 = s.getSessionID();
        sEvent = sEvent + ":" + s.eVar26;
    }
    return sEvent;
}

/* Plugin: Session ID */
s.getSessionID = function() {
    if (s.getAndPersistValue(null, "s_serialization_id") == "") {
        s.getAndPersistValue(new Date().getTime() + Math.random(), "s_serialization_id");
    }
    return s.getAndPersistValue(null, "s_serialization_id");
}
/* Plugin:Internal Search */
function trackSearchTerm(e,t){if(s&&e&&e.length>0){s.usePlugins=false;var n=new Object;n.linkTrackEvents="event2";n.linkTrackVars="eVar3,prop5,prop6,events";n.events="event2";n.eVar3=n.prop5=e.toLowerCase();n.prop6=t;s.tl(this,"o","Internal Searches",n);s.usePlugins=true}}
function internalSearchTrackUsingGoogle(){var e=10;var t=function(){if(typeof _searchObj!="undefined"){_searchObj.setSearchCompleteCallback(this,n)}else if(typeof customSearchControl!="undefined"){customSearchControl.setSearchCompleteCallback(this,n)}else if(e>0){setTimeout(t,100);e--}};var n=function(e,t){if(t&&t.results&&t.results.length>0){searchResult=t.cursor.resultCount;var n=document.getElementById("search-input")!=null?document.getElementById("search-input"):document.getElementById("gsc-i-id1");if(n&&n.value){searchTerm=n.value}else if(typeof parseQueryFromUrl=="function"){searchTerm=parseQueryFromUrl()}trackSearchTerm(searchTerm,searchResult)}};var r=function(){if(typeof google!="undefined"){google.setOnLoadCallback(t)}else if(e>0){setTimeout(r,100);e--}};r()}
function internalSearchTrackWithoutGoogle(){function getSearchResult(){var totalCount='0';var itemsPerPage=10;var pagerEle=document.getElementsByClassName("pager");var searchResultEle=document.getElementsByClassName('search-results');if(pagerEle&&pagerEle.length>0){var pagesEle=pagerEle[0];var lastPageEle=pagesEle.children[pagesEle.childElementCount-1];var lastPageURL=lastPageEle.childNodes[0].href;var totalPageNumber=lastPageURL.substring(lastPageURL.indexOf("=")+1);totalCount=(parseInt(totalPageNumber)+1)*itemsPerPage}else if(searchResultEle&&searchResultEle.length>0){var resultSet=searchResultEle[0].children;totalCount=resultSet.length/2}return totalCount}function getSearchResultForApia(){var totalCount=0;var itemsPerPage=10;var pageNumberArr=document.getElementsByClassName('gsc-cursor-page');var pageItemArr=document.getElementsByClassName('gsc-table-cell-snippet-close');if(pageNumberArr&&pageNumberArr.length>1){totalCount=itemsPerPage*pageNumberArr.length}else if(pageItemArr&&pageItemArr.length>0){totalCount=pageItemArr.length}return totalCount+''}function internalSearchHandler(){var searchTerm='',searchResult='0';if(s.siteID.indexOf('in:apa')>=0){d.attachEvent('readystatechange',function(){if(document.readyState=='complete'){searchTerm=s.getQueryParam('search');searchResult=getSearchResultForApia();trackSearchTerm(searchTerm,searchResult)}})}else if(s.siteID.indexOf('in:ver')>=0||s.siteID.indexOf('sg:biz2')>=0){searchTerm=document.getElementById('edit-keys')?document.getElementById('edit-keys').value:'';searchResult=getSearchResult()}else if(s.siteID.indexOf('in:shn:club')>=0){var elements=document.getElementsByClassName("filter-button");if(elements&&elements.length==1){searchTerm=elements[0].innerText}elements=document.getElementsByClassName('counter');if(elements&&elements.length>0){var temResult=0;for(var i=elements.length-1;i>=0;i--){temResult=temResult+parseInt(elements[i].innerText)}if(temResult>0){searchResult=temResult}}}trackSearchTerm(searchTerm,searchResult)}var count=10;if(s.siteID=="none"&&count>0){setTimeout(internalSearchHandler,100);count--}else{internalSearchHandler()}}
/* Plugin: Page Load Time */
function s_getLoadTime(){if(!window.s_loadT){var b=new Date().getTime(),o=window.performance?performance.timing:0,a=o?o.requestStart:window.inHeadTS||0;s_loadT=a?Math.round((b-a)/100):''}return s_loadT}

/* Plugin: TNT Integration v1.0 */
s.trackTNT=new Function("v","p","b",""
+"var s=this,n='s_tnt',p=p?p:n,v=v?v:n,r='',pm=false,b=b?b:true;if(s."
+"getQueryParam){pm=s.getQueryParam(p);}if(pm){r+=(pm+',');}if(s.wd[v"
+"]!=undefined){r+=s.wd[v];}if(b){s.wd[v]='';}return r;");

/*
 * Datalicious PurchasePath
 */

if(typeof _dReplaceAll=="undefined"){function _dReplaceAll(e,t,n){myRegExp=new RegExp(t,"g");return e.replace(myRegExp,n)}}if(typeof _dGetHostName=="undefined"){function _dGetHostName(e){if(e.indexOf("://")>=0)e=e.substring(e.indexOf("://")+3,e.length);if(e.indexOf("/")>=0)e=e.substring(0,e.indexOf("/"));return e}}if(typeof _dGParameterValue=="undefined"){function _dGParameterValue(e,t){t=t.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var n="[\\?&]"+t+"=([^&#]*)";var r=new RegExp(n);var i=r.exec(e);return i&&i[1]}}if(typeof _dGetCookie=="undefined"){function _dGetCookie(e){if(document.cookie.length>0){c_start=document.cookie.indexOf(e+"=");if(c_start!=-1){c_start=c_start+e.length+1;c_end=document.cookie.indexOf(";",c_start);if(c_end==-1)c_end=document.cookie.length;return unescape(document.cookie.substring(c_start,c_end))}}return""}}if(typeof _dSetCookie=="undefined"){function _dSetCookie(e,t,n){var r=new Date;r.setDate(r.getDate()+n);document.cookie=e+"="+escape(t)+";domain=."+_dReplaceAll(_dGetHostName(window.location.href.toLowerCase()),"www.","")+";path=/"+(n==null?"":";expires="+r.toGMTString())}}if(typeof _dOmniturePurchasePath=="undefined"){if(!d.ref){d.ref=document.referrer}function _dOmniturePurchasePath(){trafficSource="";searchKeyword="";currentMedium="";referrerHostName=_dGetHostName(d.ref);referrerHostName=_dReplaceAll(referrerHostName.toLowerCase(),"www.","");seKeyString="daum:q,eniro:search_word,naver:query,images.google:q,google:q,yahoo:p,msn:q,bing:q,aol:query,aol:encquery,lycos:query,ask:q,altavista:q,netscape:query,cnn:query,about:terms,mamma:query,alltheweb:q,voila:rdata,virgilio:qs,live:q,baidu:wd,alice:qs,yandex:text,najdi:q,aol:q,mama:query,seznam:q,search:q,wp:szukaj,onet:qt,szukacz:q,yam:k,pchome:q,kvasir:q,sesam:q,ozu:q,terra:query,mynet:q,ekolay:q,rambler:words";if(_dCompaignCode!=""){medium=_dCompaignCode;medium=medium.substr(0,2);if(medium=="di"||medium=="ob"||medium=="og"||medium=="cb"||medium=="cg"||medium=="re"||medium=="sm"){currentMedium="ca"}else{currentMedium=medium}trafficSource=s.campaign;seKey=seKeyString.split(",");for(i=0;i<seKey.length;i++){se=seKey[i].substring(0,seKey[i].indexOf(":"));kp=seKey[i].substring(seKey[i].indexOf(":")+1,seKey[i].length);if(referrerHostName.indexOf(se)>=0){seKeywords=_dGParameterValue(d.ref,kp)||"";seKeywords=seKeywords.toLowerCase();searchKeyword=seKeywords}}}else{if(d.ref!=""&&_dGetHostName(window.location.href.toLowerCase())!=_dGetHostName(d.ref.toLowerCase())){seTraffic=false;seGeneric=true;seKey=seKeyString.split(",");for(i=0;i<seKey.length;i++){se=seKey[i].substring(0,seKey[i].indexOf(":"));kp=seKey[i].substring(seKey[i].indexOf(":")+1,seKey[i].length);if(referrerHostName.indexOf(se)>=0){seKeywords=_dGParameterValue(d.ref,kp);searchKeyword=seKeywords||"";if(seKeywords!==null){seKeywords=seKeywords.toLowerCase();scSearchTerm=seKeywords;seTraffic=true;if(_dBrandTerms!=""){brands=_dBrandTerms.split(",");for(j=0;j<brands.length;j++){brand=brands[j];brand=brand.toLowerCase();if(seKeywords.indexOf(brand)>=0)seGeneric=false}}}else if(/https?:\/\/www\.google\.[^/]+\/$/.test(d.ref)){scSearchTerm="";seTraffic=true}}}if(seTraffic){if(seGeneric){if(_dGParameterValue(window.location.href,"gclid")!==null||_dGParameterValue(window.location.href,"s_kwcid")!==null){currentMedium="cg";trafficSource="sem:generic:"+referrerHostName}else if(seKeywords==null){currentMedium="ou";trafficSource="seo:unk:"+referrerHostName}else{currentMedium="og";trafficSource="seo:generic:"+referrerHostName}}else{if(_dGParameterValue(window.location.href,"gclid")!==null||_dGParameterValue(window.location.href,"s_kwcid")!==null){currentMedium="cb";trafficSource="sem:branded:"+referrerHostName}else{if(referrerHostName.indexOf("google.")>=0){currentMedium="cb";trafficSource="sem:branded:"+referrerHostName}else{currentMedium="ob";trafficSource="seo:branded:"+referrerHostName}}}}else{soc=false;socialMediaDomain="";socialMediaDomains="12seconds.tv,backtype.com,bebo.com,blogspot.com,brightkite.com,cafemom.com,classmates.com,dailymotion.com,delicious.com,digg.com,diigo.com,disqus.com,facebook.com,flickr.com,flixster.com,fotolog.com,friendfeed.com,friendster.com,hi5.com,identi.ca,imeem.com,intensedebate.com,jaiku.com,linkedin.com,livejournal.com,mister-wong.com,mixx.com,mylife.com,myspace.com,myyearbook.com,netvibes.com,ning.com,orkut.com,photobucket.com,plurk.com,reddit.com,slideshare.net,smugmug.com,stumbleupon.com,tagged.com,tumblr.com,twine.com,twitter.com,vimeo.com,wordpress.com,xanga.com,yelp.com,youtube.com,yuku.com,zooomr.com";socDomains=socialMediaDomains.split(",");for(i=0;i<socDomains.length;i++){if(referrerHostName.indexOf(socDomains[i])>=0){soc=true;socialMediaDomain=socDomains[i]}}if(soc){currentMedium="sm";trafficSource="social:"+referrerHostName}else{currentMedium="ot";trafficSource="others:"+referrerHostName}}}else{if(d.ref==""){currentMedium="di";trafficSource="direct"}}}if(currentMedium!=""){fullPath=_dGetCookie("__ppFullPath");if(fullPath==""){fullPath=currentMedium}else{visits=fullPath.split("-");if(visits.length==1){fullPath=fullPath+"-"+currentMedium}else{lastVisit=visits[1];secLastVisit=visits[visits.length-1];if(secLastVisit.length==2){visits.push(lastVisit+"1")}else{if(lastVisit==secLastVisit.substr(0,2)){numOfVisits=secLastVisit.substr(2);numOfVisits++;visits[visits.length-1]=lastVisit+numOfVisits}else{visits.push(lastVisit+"1")}}visits[1]=currentMedium;fullPath="";for(i=0;i<visits.length;i++){if(i>0)fullPath=fullPath+"-";fullPath=fullPath+visits[i]}}}_dSetCookie("__ppFullPath",fullPath,_dExpireDays);if(trafficSource!=""&&_dTrafficSourceVariable!="")s[_dTrafficSourceVariable]=trafficSource;if(searchKeyword!=""&&_dKeywordVariable!="")s[_dKeywordVariable]=searchKeyword;if(_dStackingVariable!="")s[_dStackingVariable]=fullPath}}};

/* Plugin: getNewRepeat 1.0 */

s.getNewRepeat=new Function(""
+"var s=this,e=new Date(),cval,ct=e.getTime(),y=e.getYear();e.setTime"
+"(ct+30*24*60*60*1000);cval=s.c_r('s_nr');if(cval.length==0){s.c_w("
+"'s_nr',ct,e);return 'New';}if(cval.length!=0&&ct-cval<30*60*1000){s"
+".c_w('s_nr',ct,e);return 'New';}if(cval<1123916400001){e.setTime(cv"
+"al+30*24*60*60*1000);s.c_w('s_nr',ct,e);return 'Repeat';}else retur"
+"n 'Repeat';");


s.p_gpv=new Function("k","u",""
+"var s=this,v='',i=u.indexOf('?'),q;if(k&&i>-1){q=u.substring(i+1);v"
+"=s.pt(q,'&','p_gvf',k)}return v");
s.p_gvf=new Function("t","k",""
+"if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T"
+"rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s."
+"epa(v)}return ''");

/* Plugin: getQueryParam v2.4 */
s.getQueryParam=new Function("p","d","u","h",""
+"var s=this,v='',i,j,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.loca"
+"tion);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0"
+"?p.length:i;t=s.p_gpv(p.substring(0,i),u+'',h);if(t){t=t.indexOf('#"
+"')>-1?t.substring(0,t.indexOf('#')):t;}if(t)v+=v?d+t:t;p=p.substrin"
+"g(i==p.length?i:i+1)}return v");
s.p_gpv=new Function("k","u","h",""
+"var s=this,v='',q;j=h==1?'#':'?';i=u.indexOf(j);if(k&&i>-1){q=u.sub"
+"string(i+1);v=s.pt(q,'&','p_gvf',k)}return v");
s.p_gvf=new Function("t","k",""
+"if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T"
+"rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s."
+"epa(v)}return''");

/*
 * Plugin: getValOnce 0.2 - get a value once per session or number of days
 */
s.getValOnce=new Function("v","c","e",""
+"var s=this,k=s.c_r(c),a=new Date;e=e?e:0;if(v){a.setTime(a.getTime("
+")+e*86400000);s.c_w(c,v,e?a:0);}return v==k?'':v");

/*
 * Plugin: getAndPersistValue 0.3 - get a value on every page
 */
s.getAndPersistValue=new Function("v","c","e",""
+"var s=this,a=new Date;e=e?e:0;a.setTime(a.getTime()+e*86400000);if("
+"v)s.c_w(c,v,e?a:0);return s.c_r(c);");

/*
 * Plugin: getPreviousPage_v1.1 - return previous page based on event list
 */
s.getPreviousPage=new Function("el",""
+"var s=this,pid,i,j,e;if(el){if(s.events){while(el){if(pid){break;}i"
+"=el.indexOf(',');i=i<0?el.length:i;e=s.events;while(e){j=e.indexOf("
+"',');j=j<0?e.length:j;if(e.substring(0,j)==el.substring(0,i)){pid=s"
+".p_gpp();}e=e.substring(j==e.length?j:j+1);}el=el.substring(i==el.l"
+"ength?i:i+1);}}}else{pid=s.p_gpp();}return pid;");

/*
 * Utility Function: p_gpp
 */
s.p_gpp=new Function(""
+"var s=this,p,i;p=s.rq(s.un);i=p.indexOf('pid=')+4;p=p.substring(i,p"
+".length);i=p.indexOf('&');p=p.substring(0,i);p=unescape(p);return p"
+";");

/*
 * Plugin: linkHandler 0.5 - identify and report custom links
 */
s.linkHandler=new Function("p","t",""
+"var s=this,h=s.p_gh(),i,l;t=t?t:'o';if(!h||(s.linkType&&(h||s.linkN"
+"ame)))return '';i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h."
+"substring(0,i);l=s.pt(p,'|','p_gn',h.toLowerCase());if(l){s.linkNam"
+"e=l=='[['?'':l;s.linkType=t;return h;}return '';");
s.p_gn=new Function("t","h",""
+"var i=t?t.indexOf('~'):-1,n,x;if(t&&h){n=i<0?'':t.substring(0,i);x="
+"t.substring(i+1);if(h.indexOf(x.toLowerCase())>-1)return n?n:'[[';}"
+"return 0;");
s.p_gh=new Function(""
+"var s=this;if(!s.eo&&!s.lnk)return '';var o=s.eo?s.eo:s.lnk,y=s.ot("
+"o),n=s.oid(o),x=o.s_oidt;if(s.eo&&o==s.eo){while(o&&!n&&y!='BODY'){"
+"o=o.parentElement?o.parentElement:o.parentNode;if(!o)return '';y=s."
+"ot(o);n=s.oid(o);x=o.s_oidt}}return o.href?o.href:'';");

/*
 * Plugin: getPageName v2.1 - parse URL and return
 */
s.getPageName=new Function("u",""
+"var s=this,v=u?u:''+s.wd.location,x=v.indexOf(':'),y=v.indexOf('/',"
+"x+4),z=v.indexOf('?'),c=s.pathConcatDelim,e=s.pathExcludeDelim,g=s."
+"queryVarsList,d=s.siteID,n=d?d:'',q=z<0?'':v.substring(z+1),p=v.sub"
+"string(y+1,q?z:v.length);z=p.indexOf('#');p=z<0?p:s.fl(p,z);x=e?p.i"
+"ndexOf(e):-1;p=x<0?p:s.fl(p,x);p+=!p||p.charAt(p.length-1)=='/'?s.d"
+"efaultPage:'';y=c?c:'/';while(p){x=p.indexOf('/');x=x<0?p.length:x;"
+"z=s.fl(p,x);if(!s.pt(s.pathExcludeList,',','p_c',z))n+=n?y+z:z;p=p."
+"substring(x+1)}y=c?c:'?';while(g){x=g.indexOf(',');x=x<0?g.length:x"
+";z=s.fl(g,x);z=s.pt(q,'&','p_c',z);if(z){n+=n?y+z:z;y=c?c:'&'}g=g.s"
+"ubstring(x+1)}return n");

/*
 * Plugin: getTimeParting 3.4 
 */
s.getTimeParting=new Function("h","z",""
+"var s=this,od;od=new Date('1/1/2000');if(od.getDay()!=6||od.getMont"
+"h()!=0){return'Data Not Available';}else{var H,M,D,U,ds,de,tm,da=['"
+"Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturda"
+"y'],d=new Date();z=z?z:0;z=parseFloat(z);if(s._tpDST){var dso=s._tp"
+"DST[d.getFullYear()].split(/,/);ds=new Date(dso[0]+'/'+d.getFullYea"
+"r());de=new Date(dso[1]+'/'+d.getFullYear());if(h=='n'&&d>ds&&d<de)"
+"{z=z+1;}else if(h=='s'&&(d>de||d<ds)){z=z+1;}}d=d.getTime()+(d.getT"
+"imezoneOffset()*60000);d=new Date(d+(3600000*z));H=d.getHours();M=d"
+".getMinutes();M=(M<10)?'0'+M:M;D=d.getDay();U=' AM';if(H>=12){U=' P"
+"M';H=H-12;}if(H==0){H=12;}D=da[D];tm=H+':'+M+U;return(tm+'|'+D);}");

/*
 *  Plug-in: crossVisitParticipation v1.5 - stacks values from
 *  specified variable in cookie and returns value
 */
s.crossVisitParticipation=new Function("v","cn","ex","ct","dl","ev","dv",""
+"var s=this,ce;if(typeof(dv)==='undefined')dv=0;if(s.events&&ev){var"
+" ay=s.split(ev,',');var ea=s.split(s.events,',');for(var u=0;u<ay.l"
+"ength;u++){for(var x=0;x<ea.length;x++){if(ay[u]==ea[x]){ce=1;}}}}i"
+"f(!v||v=='')return '';v=escape(v);var arry=new Array(),a=new Array("
+"),c=s.c_r(cn),g=0,h=new Array();if(c&&c!='')arry=eval(c);var e=new "
+"Date();e.setFullYear(e.getFullYear()+5);if(dv==0 && arry.length>0 &"
+"& arry[arry.length-1][0]==v)arry[arry.length-1]=[v, new Date().getT"
+"ime()];else arry[arry.length]=[v, new Date().getTime()];var start=a"
+"rry.length-ct<0?0:arry.length-ct;var td=new Date();for(var x=start;"
+"x<arry.length;x++){var diff=Math.round((td.getTime()-arry[x][1])/86"
+"400000);if(diff<ex){h[g]=unescape(arry[x][0]);a[g]=[arry[x][0],arry"
+"[x][1]];g++;}}var data=s.join(a,{delim:',',front:'[',back:']',wrap:"
+"\"'\"});s.c_w(cn,data,e);var r=s.join(h,{delim:dl});if(ce) s.c_w(cn"
+",'');return r;");

/*
 * Plugin Utility: apl v1.1
 */
s.apl=new Function("l","v","d","u",""
+"var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a."
+"length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas"
+"e()));}}if(!m)l=l?l+d+v:v;return l");

/*
 * Utility Function: Split a string (compatible with Javascript 1.0)
 */
s.split=new Function("str","sep",""
//declare a new array variable sa; string index variable si
//look through the str variable passed in for occurances of
//the sep substring
+"var si=0,sa=new Array(),i;while((str.length>0)&&(sep.length>0)){"
+"i=str.indexOf(sep);if((!i)&&(sep!=str.substring(0,sep.length)))"
//add all sub-pieces to the array
+"break;if(i==-1){sa[si++] = str;break;}sa[si++]=str.substring(0,i);"
//return the new array object
+"str=str.substring(i+sep.length,str.length)}return sa");

/*
 * s.join: 1.0 - s.join(v,p)
 *
 *  v - Array (may also be array of array)
 *  p - formatting parameters (front, back, delim, wrap)
 *
 */
s.join = new Function("v","p",""
+"var s = this;var f,b,d,w;if(p){f=p.front?p.front:'';b=p.back?p.back"
+":'';d=p.delim?p.delim:'';w=p.wrap?p.wrap:'';}var str='';for(var x=0"
+";x<v.length;x++){if(typeof(v[x])=='object' )str+=s.join( v[x],p);el"
+"se str+=w+v[x]+w;if(x<v.length-1)str+=d;}return f+str+b;");

/*
 * Plugin: getTimeToComplete 0.4 - return the time from start to stop
 */
s.getTimeToComplete=new Function("v","cn","e",""
+"var s=this,d=new Date,x=d,k;if(!s.ttcr){e=e?e:0;if(v=='start'||v=='"
+"stop')s.ttcr=1;x.setTime(x.getTime()+e*86400000);if(v=='start'){s.c"
+"_w(cn,d.getTime(),e?x:0);return '';}if(v=='stop'){k=s.c_r(cn);if(!s"
+".c_w(cn,'',d)||!k)return '';v=(d.getTime()-k)/1000;var td=86400,th="
+"3600,tm=60,r=5,u,un;if(v>td){u=td;un='days';}else if(v>th){u=th;un="
+"'hours';}else if(v>tm){r=2;u=tm;un='minutes';}else{r=.2;u=1;un='sec"
+"onds';}v=v*r/u;return (Math.round(v)/r)+' '+un;}}return '';");

/*
* Plugin: Form Analysis 2.1 (Success, Error, Abandonment)
*/
s.setupFormAnalysis=new Function(""
+"var s=this;if(!s.fa){s.fa=new Object;var f=s.fa;f.ol=s.wd.onload;s."
+"wd.onload=s.faol;f.uc=s.useCommerce;f.vu=s.varUsed;f.vl=f.uc?s.even"
+"tList:'';f.tfl=s.trackFormList;f.fl=s.formList;f.va=new Array('',''"
+",'','')}");
s.sendFormEvent=new Function("t","pn","fn","en",""
+"var s=this,f=s.fa;t=t=='s'?t:'e';f.va[0]=pn;f.va[1]=fn;f.va[3]=t=='"
+"s'?'Success':en;s.fasl(t);f.va[1]='';f.va[3]='';");
s.faol=new Function("e",""
+"var s=s_c_il["+s._in+"],f=s.fa,r=true,fo,fn,i,en,t,tf;if(!e)e=s.wd."
+"event;f.os=new Array;if(f.ol)r=f.ol(e);if(s.d.forms&&s.d.forms.leng"
+"th>0){for(i=s.d.forms.length-1;i>=0;i--){fo=s.d.forms[i];fn=fo.name"
+";tf=f.tfl&&s.pt(f.fl,',','ee',fn)||!f.tfl&&!s.pt(f.fl,',','ee',fn);"
+"if(tf){f.os[fn]=fo.onsubmit;fo.onsubmit=s.faos;f.va[1]=fn;f.va[3]='"
+"No Data Entered';for(en=0;en<fo.elements.length;en++){el=fo.element"
+"s[en];t=el.type;if(t&&t.toUpperCase){t=t.toUpperCase();var md=el.on"
+"mousedown,kd=el.onkeydown,omd=md?md.toString():'',okd=kd?kd.toStrin"
+"g():'';if(omd.indexOf('.fam(')<0&&okd.indexOf('.fam(')<0){el.s_famd"
+"=md;el.s_fakd=kd;el.onmousedown=s.fam;el.onkeydown=s.fam}}}}}f.ul=s"
+".wd.onunload;s.wd.onunload=s.fasl;}return r;");
s.faos=new Function("e",""
+"var s=s_c_il["+s._in+"],f=s.fa,su;if(!e)e=s.wd.event;if(f.vu){s[f.v"
+"u]='';f.va[1]='';f.va[3]='';}su=f.os[this.name];return su?su(e):tru"
+"e;");
s.fasl=new Function("e",""
+"var s=s_c_il["+s._in+"],f=s.fa,a=f.va,l=s.wd.location,ip=s.trackPag"
+"eName,p=s.pageName;if(a[1]!=''&&a[3]!=''){a[0]=!p&&ip?l.host+l.path"
+"name:a[0]?a[0]:p;if(!f.uc&&a[3]!='No Data Entered'){if(e=='e')a[2]="
+"'Error';else if(e=='s')a[2]='Success';else a[2]='Abandon'}else a[2]"
+"='';var tp=ip?a[0]+':':'',t3=e!='s'?':('+a[3]+')':'',ym=!f.uc&&a[3]"
+"!='No Data Entered'?tp+a[1]+':'+a[2]+t3:tp+a[1]+t3,ltv=s.linkTrackV"
+"ars,lte=s.linkTrackEvents,up=s.usePlugins;if(f.uc){s.linkTrackVars="
+"ltv=='None'?f.vu+',events':ltv+',events,'+f.vu;s.linkTrackEvents=lt"
+"e=='None'?f.vl:lte+','+f.vl;f.cnt=-1;if(e=='e')s.events=s.pt(f.vl,'"
+",','fage',2);else if(e=='s')s.events=s.pt(f.vl,',','fage',1);else s"
+".events=s.pt(f.vl,',','fage',0)}else{s.linkTrackVars=ltv=='None'?f."
+"vu:ltv+','+f.vu}s[f.vu]=ym;s.usePlugins=false;var faLink=new Object"
+"();faLink.href='#';s.tl(faLink,'o','Form Analysis');s[f.vu]='';s.us"
+"ePlugins=up}return f.ul&&e!='e'&&e!='s'?f.ul(e):true;");
s.fam=new Function("e",""
+"var s=s_c_il["+s._in+"],f=s.fa;if(!e) e=s.wd.event;var o=s.trackLas"
+"tChanged,et=e.type.toUpperCase(),t=this.type.toUpperCase(),fn=this."
+"form.name,en=this.name,sc=false;if(document.layers){kp=e.which;b=e."
+"which}else{kp=e.keyCode;b=e.button}et=et=='MOUSEDOWN'?1:et=='KEYDOW"
+"N'?2:et;if(f.ce!=en||f.cf!=fn){if(et==1&&b!=2&&'BUTTONSUBMITRESETIM"
+"AGERADIOCHECKBOXSELECT-ONEFILE'.indexOf(t)>-1){f.va[1]=fn;f.va[3]=e"
+"n;sc=true}else if(et==1&&b==2&&'TEXTAREAPASSWORDFILE'.indexOf(t)>-1"
+"){f.va[1]=fn;f.va[3]=en;sc=true}else if(et==2&&kp!=9&&kp!=13){f.va["
+"1]=fn;f.va[3]=en;sc=true}if(sc){nface=en;nfacf=fn}}if(et==1&&this.s"
+"_famd)return this.s_famd(e);if(et==2&&this.s_fakd)return this.s_fak"
+"d(e);");
s.ee=new Function("e","n",""
+"return n&&n.toLowerCase?e.toLowerCase()==n.toLowerCase():false;");
s.fage=new Function("e","a",""
+"var s=this,f=s.fa,x=f.cnt;x=x?x+1:1;f.cnt=x;return x==a?e:'';");

/*
 * Plugin: YouTube plugin SC14.9/15 v1.8
 * Created by Justina Chen [13/11/2013]
 */
var s_YTO={};s_YTO.v=new Object;s_YTO.ya=s_YTisa()?2:0;s_YTO.ut=s_YTO.uf=0;s_YTO.vp="YouTube Player";if(document.loaded){s_YTp()}else if(window.addEventListener){window.addEventListener("load",s_YTp,false)}else if(window.attachEvent){window.attachEvent("onload",s_YTp)}else{s_YTp()}function onYouTubePlayerReady(e){if(e&&typeof e=="string"){var t=document.getElementById(e);if(t&&!s_YTO.v[e])s_YTO.v[e]=new s_YTv(e,1)}}function s_YTp(){try{var e=document.getElementsByTagName("iframe");if(s_YTisa())s_YTO.ya=2;for(var t=0;t<e.length;t++){var n=s_YTgk(e[t].src),r=e[t].id;if(ie){e[t].attachEvent("onload",s_YTp)}else{e[t].addEventListener("load",s_YTp,false)}if(!r){r="ytplayer"}if(n){if(!s_YTO.ya){s_YTO.ya=1;var i=document.createElement("script"),e;i.src="//www.youtube.com/player_api";e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(i,e);i=document.createElement("script");i.src="//www.youtube.com/iframe_api";e.parentNode.insertBefore(i,e)}else if(s_YTO.ya==2&&(!s_YTO.v[r]||s_YTO.v[r]&&s_YTO.v[r].videoId!=n)){if(s_YTO.v[r]&&s_YTO.v[r].videoId!=n){s_YTO.v[r].cueVideoById(n);s_YTO.v[r].b.a.videoId=s_YTO.v[r].videoId=n}else{s_YTO.v["media"]=new s_YTv(r,n);try{var s=new Object;s.videoId=n;s_YTO.v[r]=new YT.Player(r,s);s_YTO.v[r].videoId=n}catch(o){s_YTdv(e);s_YTO.v[r]=null;return}}s_YTO.v[r].addEventListener("onStateChange","s_YTisc",false)}}}}catch(u){}}function s_YTisc(e){s_YTO.v["media"].ys=e.data;s_YTO.v["media"].vg(e.target);s_YTO.v["media"].ve()}function s_YTisa(){return typeof window.YT=="object"&&typeof YT.Player}function s_YTism(){return typeof window.s=="object"&&typeof s.Media=="object"&&s.Media.open}function s_YTgk(e){var t="";try{var n,r,i,s;if(e.indexOf("//www.youtube.com/watch")>-1){n=e.indexOf("?");if(n>-1){r="&"+e.substring(n+1);i=r.indexOf("&v=");if(i>-1){t=r.substring(i+3);s=t.indexOf("&");if(s>-1)t=t.substring(0,s)}}}if(e.indexOf("//www.youtube.com/embed/")>-1){n=e.indexOf("/embed/")+7;t=e.substring(n);s=t.indexOf("?");if(s>-1)t=t.substring(0,s)}}catch(o){}return t}function onYouTubePlayerAPIReady(){try{s_YTO.ya=2;if(s_YTO.ut)clearTimeout(s_YTO.ut);s_YTp()}catch(e){}}function s_YTdi(){try{if(!s_YTism())return;if(typeof s.Media.trackWhilePlaying!="undefined"){s_YTO.twp=s.Media.trackWhilePlaying;s.Media.trackWhilePlaying=false}if(typeof s.Media.trackSeconds!="undefined"){s_YTO.ts=s.Media.trackSeconds;delete s.Media.trackSeconds}}catch(e){}}function s_YTei(){try{if(!s_YTism())return;if(typeof s_YTO.twp!="undefined"){s.Media.trackWhilePlaying=s_YTO.twp;delete s_YTO.twp}if(typeof s_YTO.ts!="undefined"){s.Media.trackSeconds=s_YTO.ts;delete s_YTO.ts}}catch(e){}}function s_YTut(){try{s_YTO.uf=0;s_YTei()}catch(e){}}function s_YTdv(e){try{if(!e)return;var t=s_YTO.v[e]||0;if(t){if(t.ss){if(s.Media)s.Media.close(t.sv);t.ss=0}}t.vc()}catch(n){}}function s_YTv(e,t){try{var n=this;n.vc=function(){var e=this;e.id=e.st=e.sv=e.sl="";e.yt=e.yp=e.ys=e.ss=e.ts=e.ql=e.qs=0};n.vg=function(e){try{var t=this,n="function",r="object",i="number",o="string",u="",a=u,f=u,l=typeof e;if(l==r||l==n){if(typeof e.getVideoUrl==n)u=e.getVideoUrl();if(typeof e.getVideoData==n){a=e.getVideoData();if(typeof a==r){if(typeof a.video_id==o)f=a.video_id;if(typeof a.title==o)s.st=a.title}}if(!f&&u)f=s_YTgk(u);t.sv="YouTube";t.sv+="|"+(f?f:t.videoId);if(t.st)t.sv+="|"+t.st;if(typeof e.getPlayerState==n){a=e.getPlayerState();if(typeof a==i)t.ys=a}t.qs=0;if(typeof e.getCurrentTime==n){a=e.getCurrentTime();t.qs=typeof a==i?Math.round(a):0}t.ts=0;if(typeof e.getDuration==n){a=e.getDuration();t.ts=typeof a==i?Math.round(a):0}}}catch(c){}};n.ve=function(){try{var e=this;if(!s_YTism()||!e.sv)return;if(e.sv!=e.sl&&e.ss){if(e.ss==2){s.Media.stop(e.sl,e.ql);e.ss=1}s.Media.close(e.sl);e.sl=e.sv;e.ss=e.ql=0}switch(e.ys){case 1:if(e.ss==2){if(e.qs>=e.ql&&Math.abs(e.qs-e.ql)<1)return;s.Media.stop(e.sl,e.ql)}if(!e.ss){s.Media.open(e.sv,e.ts,s_YTO.vp);e.qs=e.ql=0;e.sl=e.sv;e.ss=1}s.Media.play(e.sv,e.qs);e.ql=e.qs;e.ss=2;break;case 0:if(e.ss){if(e.ss!=1){if(Math.abs(e.qs-e.ts)<=1)e.qs=e.ts;s.Media.stop(e.sv,e.qs);e.ql=e.qs;e.ss=1}s.Media.close(e.sv);e.ss=e.qs=e.ql=0;e.sv=e.sl=""}break;case 2:if(!e.ss){s.Media.open(e.sv,e.ts,s_YTO.vp);e.ss=1;e.sl=e.sv}if(e.ss!=1){s.Media.stop(e.sv,e.qs);e.ql=e.qs;e.ss=1}break;case 3:if(s_YTO.uf){clearTimeout(s_YTO.uf)}else{s_YTdi()}s_YTO.uf=setTimeout("s_YTut()",3e3);break;case 5:e.qs=e.ql=0;e.sl=e.sv;e.ss=0;break;case-1:e.qs=e.ql=0;e.sl=e.sv;e.ss=0;break;default:break}}catch(t){}};n.fsc=function(e){n.ys=e;n.vg(n.yp);setTimeout('s_YTO.v["'+n.id+'"].ve()',10)};n.isc=function(e){n.ys=e.data;n.vg(e.target);n.ve()};if(!t)return null;n.vc();n.id=e;var i=arguments;if(i.length>1&&i[1]==1){n.yt=1;n.yp=r;if(window.addEventListener){n.yp.addEventListener("onStateChange","s_YTO.v."+e+".fsc",false)}else if(window.attachEvent){window.attachEvent("onStateChange","s_YTO.v."+e+".fsc")}}else{n.yt=2}return n}catch(o){return null}}

/* Plugin: YouTube plugin SC14.9/15 v1.4
 */
 /*
 * deleted by Justina Chen [7/8/2013]
 var s_YTO={};s_YTO.v=new Object;s_YTO.ya=s_YTisa()?2:0;s_YTO.ut=s_YTO.uf=0;s_YTO.vp='YouTube Player';if(document.loaded){s_YTp()}else if(window.addEventListener){window.addEventListener('load',s_YTp,false)}else if(window.attachEvent){window.attachEvent('onload',s_YTp)}else{s_YTp()}function onYouTubePlayerReady(id){if(id&&typeof id=='string'){var p=document.getElementById(id);if(p&&!s_YTO.v[id])s_YTO.v[id]=new s_YTv(id,1)}}function s_YTp(){try{var f=document.getElementsByTagName('iframe');if(s_YTisa())s_YTO.ya=2;for(var i=0;i<f.length;i++){var k=s_YTgk(f[i].src),id=f[i].id;if(k){if(!s_YTO.ya){s_YTO.ya=1;var t=document.createElement('script'),f;t.src='//www.youtube.com/player_api';f=document.getElementsByTagName('script')[0];f.parentNode.insertBefore(t,f)}else if(s_YTO.ya==2&&!s_YTO.v[id]){s_YTO.v[id]=new s_YTv(id)}}}}catch(e){};s_YTO.ut=setTimeout('s_YTp()',1000)}function s_YTisa(){return typeof window.YT=='object'&&typeof YT.Player}function s_YTism(){return typeof window.s=='object'&&typeof s.Media=='object'&&s.Media.open}function s_YTgk(u){var r='';try{var a,b,c,d;if(u.indexOf('//www.youtube.com/watch')>-1){a=u.indexOf('?');if(a>-1){b='&'+u.substring(a+1);c=b.indexOf('&v=');if(c>-1){r=b.substring(c+3);d=r.indexOf('&');if(d>-1)r=r.substring(0,d)}}}if(u.indexOf('//www.youtube.com/embed/')>-1){a=u.indexOf('/embed/')+7;r=u.substring(a+7);d=r.indexOf('?');if(d>-1)r=r.substring(0,d)}}catch(e){};return r}function onYouTubePlayerAPIReady(){try{s_YTO.ya=2;if(s_YTO.ut)clearTimeout(s_YTO.ut);s_YTp()}catch(e){}}function s_YTdi(){try{if(!s_YTism())return;if(typeof s.Media.trackWhilePlaying!='undefined'){s_YTO.twp=s.Media.trackWhilePlaying;s.Media.trackWhilePlaying=false}if(typeof s.Media.trackSeconds!='undefined'){s_YTO.ts=s.Media.trackSeconds;delete s.Media.trackSeconds}}catch(e){}}function s_YTei(){try{if(!s_YTism())return;if(typeof s_YTO.twp!='undefined'){s.Media.trackWhilePlaying=s_YTO.twp;delete s_YTO.twp}if(typeof s_YTO.ts!='undefined'){s.Media.trackSeconds=s_YTO.ts;delete s_YTO.ts}}catch(e){}}function s_YTut(){try{s_YTO.uf=0;s_YTei()}catch(e){}}function s_YTdv(id){try{if(!id)return;var v=s_YTO.v[id]||0;if(v){if(v.ss){if(s.Media)s.Media.close(v.sv);v.ss=0}}v.vc()}catch(e){}}function s_YTv(id){try{var t=this;t.vc=function(){var t=this;t.id=t.st=t.sv=t.sl='';t.yt=t.yp=t.ys=t.ss=t.ts=t.ql=t.qs=0};t.vg=function(yp){try{var t=this,F='function',O='object',N='number',S='string',u='',x=u,y=u,pt=typeof yp;if(pt==O||pt==F){if(typeof yp.getVideoUrl==F)u=yp.getVideoUrl();if(typeof yp.getVideoData==F){x=yp.getVideoData();if(typeof x==O){if(typeof x.video_id==S)y=x.video_id;if(typeof x.title==S)s.st=x.title}}if(!y&&u)y=s_YTgk(u);t.sv='YouTube';t.sv+='|'+(y?y:t.id);if(t.st)t.sv+='|'+t.st;if((typeof yp.getPlayerState)==F){x=yp.getPlayerState();if(typeof x==N)t.ys=x}t.qs=0;if((typeof yp.getCurrentTime)==F){x=yp.getCurrentTime();t.qs=(typeof x==N)?Math.round(x):0}t.ts=0;if((typeof yp.getDuration)==F){x=yp.getDuration();t.ts=(typeof x==N)?Math.round(x):0}}}catch(e){}};t.ve=function(){try{var t=this;if(!s_YTism()||!t.sv)return;t.vg(t.yp);if(t.sv!=t.sl&&t.ss){if(t.ss==2){s.Media.stop(t.sl,t.ql);t.ss=1}s.Media.close(t.sl);t.sl=t.sv;t.ss=t.ql=0}switch(t.ys){case 1:if(t.ss==2){if(t.qs>=t.ql&&Math.abs(t.qs-t.ql)<1.0)return;s.Media.stop(t.sl,t.ql)}if(!t.ss){s.Media.open(t.sv,t.ts,s_YTO.vp);t.qs=t.ql=0;t.sl=t.sv;t.ss=1}s.Media.play(t.sv,t.qs);t.ql=t.qs;t.ss=2;break;case 0:if(t.ss){if(t.ss!=1){if(Math.abs(t.qs-t.ts)<=1)t.qs=t.ts;s.Media.stop(t.sv,t.qs);t.ql=t.qs;t.ss=1}s.Media.close(t.sv);t.ss=t.qs=t.ql=0;t.sv=t.sl=''}break;case 2:if(!t.ss){s.Media.open(t.sv,t.ts,s_YTO.vp);t.ss=1;t.sl=t.sv}if(t.ss!=1){s.Media.stop(t.sv,t.qs);t.ql=t.qs;t.ss=1}break;case 3:if(s_YTO.uf){clearTimeout(s_YTO.uf)}else{s_YTdi()}s_YTO.uf=setTimeout('s_YTut()',3000);break;case 5:break;case-1:s.Media.open(t.sv,t.ts,s_YTO.vp);t.ss=1;t.sl=t.sv;break;default:break}}catch(e){}};t.fsc=function(ye){t.ys=ye;t.vg(t.yp);setTimeout('s_YTO.v["'+t.id+'"].ve()',10)};t.isc=function(ye){t.ys=ye.data;t.vg(ye.target);setTimeout('s_YTO.v["'+t.id+'"].ve()',10)};var o=id&&typeof id=='string'?document.getElementById(id):'';if(!o)return null;t.vc();t.id=id;var ar=arguments;if(ar.length>1&&ar[1]==1){t.yt=1;t.yp=o;if(window.addEventListener){t.yp.addEventListener('onStateChange','s_YTO.v.'+id+'.fsc',false)}else if(window.attachEvent){window.attachEvent('onStateChange','s_YTO.v.'+id+'.fsc')}}else{t.yt=2;var a=new Object();if(ar.length>1)a.videoId=ar[1];if(ar.length>3){a.width=w;a.height=h}a.events=new Object();a.events.onStateChange=t.isc;try{t.yp=new YT.Player(id,a)}catch(e){s_YTdv(id);t=null}}return t}catch(e){return null}}
*/

/* 
 * socialAuthors v1.4
 */
s.socialAuthors=new Function("",""
+"var s=this,g,tco;g=s.referrer?s.referrer:document.referrer;if(g.ind"
+"exOf('t.co/')!=-1){s.tco=escape(s.split(g,'/')[3]);s.Integrate.add("
+"'SocialAuthor');s.Integrate.SocialAuthor.tEvar='eVar69';s.Integrate"
+".SocialAuthor.get('search.twitter.com/search.json?var=[VAR]&"
+"callback=s.twitterSearch&q=http%3A%2F%2Ft.co%2F'+s.tco);s.Integrate"
+".SocialAuthor.delay();s.Integrate.SocialAuthor.setVars=function(s,p"
+"){s[p.tEvar]=s.user;}}");
s.twitterSearch=new Function("obj",""
+"var s=this,txt,txtRT,txtEnd,txtAuthor;if(typeof obj=='undefined'||o"
+"bj.results.length==0){s.user='Not Found';s.Integrate.SocialAuthor.r"
+"eady();return;}else{txt=obj.results[0].text;txtRT=txt.indexOf('RT @"
+"');if(txtRT!=-1){txtEnd=txt.indexOf(' ',txtRT+4);txtAuthor=txt.subs"
+"tring(txtRT+4,txtEnd);s.user=txtAuthor.replace(':','');}else{s.user"
+"=obj.results[0].from_user;}s.Integrate.SocialAuthor.ready();}");

/*
 * Plugin: socialPlatforms v1.0
 */
s.socialPlatforms=new Function("a",""
+"var s=this,g,K,D,E,F;g=s.referrer?s.referrer:document.referrer;g=g."
+"toLowerCase();K=s.split(s.socPlatList,'|');for(i=0;i<K.length;i++){"
+"D=s.split(K[i],'>');if(g.indexOf(D[0])!=-1){if(a){s[a]=D[1];}}}");
s.socPlatList="facebook.com>Facebook|twitter.com>Twitter|t.co/>Twitter|youtube.com>Youtube|clipmarks.com>Clipmarks|dailymotion.com>Dailymotion|delicious.com>Delicious|digg.com>Digg|diigo.com>Diigo|flickr.com>Flickr|flixster.com>Flixster|fotolog.com>Fotolog|friendfeed.com>FriendFeed|google.com/buzz>Google Buzz|buzz.googleapis.com>Google Buzz|plus.google.com>Google+|hulu.com>Hulu|identi.ca>identi.ca|ilike.com>iLike|intensedebate.com>IntenseDebate|myspace.com>MySpace|newsgator.com>Newsgator|photobucket.com>Photobucket|plurk.com>Plurk|slideshare.net>SlideShare|smugmug.com>SmugMug|stumbleupon.com>StumbleUpon|tumblr.com>Tumblr|vimeo.com>Vimeo|wordpress.com>WordPress|xanga.com>Xanga|metacafe.com>Metacafe";

if(screen.width > 768) {
    s.loadModule("Survey")
    var s_sv_dynamic_root = "survey.122.2o7.net/survey/dynamic"
    var s_sv_gather_root = "survey.122.2o7.net/survey/gather"
}

s.maxDelay='1000';  //max time to wait for 3rd party api response in milliseconds
s.loadModule("Integrate")

s.Integrate.onLoad=function(s,m){
    s.socialAuthors();
    /* BEGIN: ClickTale */
    s.Integrate.add("ClickTale");
    s.Integrate.ClickTale.sessionVar="eVar75";
    s.Integrate.ClickTale.setVars=function(s){
        if(typeof ClickTaleGetUID=='function'){
            s[s.Integrate.ClickTale.sessionVar]=ClickTaleGetUID()
        }
    }
    /* END: ClickTale */
};

/* Internal search */
internalSearchTrackUsingGoogle();
internalSearchTrackWithoutGoogle();

/* WARNING: Changing any of the below variables will cause drastic
changes to how your visitor data is collected.  Changes should only be
made when instructed to do so by your account manager.*/
s.visitorNamespace="suncorp"
s.trackingServer="metrics.suncorp.com.au"
s.trackingServerSecure="smetrics.suncorp.com.au"
s.vmk="4BD129AD"
s.dc="122"

/****************************** MODULES *****************************/
/* Module: Integrate */
s.m_Integrate_c="var m=s.m_i('Integrate');m.add=function(n,o){var m=this,p;if(!o)o='s_Integrate_'+n;if(!m.s.wd[o])m.s.wd[o]=new Object;m[n]=new Object;p=m[n];p._n=n;p._m=m;p._c=0;p._d=0;p.disable=0;p"
+".get=m.get;p.delay=m.delay;p.ready=m.ready;p.beacon=m.beacon;p.script=m.script;m.l[m.l.length]=n};m._g=function(t){var m=this,s=m.s,i,p,f=(t?'use':'set')+'Vars',tcf;for(i=0;i<m.l.length;i++){p=m[m."
+"l[i]];if(p&&!p.disable&&p[f]){if(s.apv>=5&&(!s.isopera||s.apv>=7)){tcf=new Function('s','p','f','var e;try{p[f](s,p)}catch(e){}');tcf(s,p,f)}else p[f](s,p)}}};m._t=function(){this._g(1)};m._fu=func"
+"tion(p,u){var m=this,s=m.s,v,x,y,z,tm=new Date;if(u.toLowerCase().substring(0,4) != 'http')u='http://'+u;if(s.ssl)u=s.rep(u,'http:','https:');p.RAND=Math&&Math.random?Math.floor(Math.random()*10000"
+"000000000):tm.getTime();p.RAND+=Math.floor(tm.getTime()/10800000)%10;x=0;while(x>=0){x=u.indexOf('[',x);if(x>=0){y=u.indexOf(']',x);if(y>x){z=u.substring(x+1,y);if(z.length>2&&z.substring(0,2)=='s."
+"'){v=s[z.substring(2)];if(!v)v=''}else{v=''+p[z];if(!(v==p[z]||parseFloat(v)==p[z]))z=0}if(z) {u=u.substring(0,x)+s.rep(escape(v),'+','%2B')+u.substring(y+1);x=y-(z.length-v.length+1)} else {x=y}}}"
+"}return u};m.get=function(u,v){var p=this,m=p._m;if(!p.disable){if(!v)v='s_'+m._in+'_Integrate_'+p._n+'_get_'+p._c;p._c++;p.VAR=v;p._d++;m.s.loadModule('Integrate:'+v,m._fu(p,u),0,1,p._n)}};m.delay"
+"=function(){var p=this;if(p._d<=0)p._d=1};m.ready=function(){var p=this,m=p._m;p._d=0;if(!p.disable)m.s.dlt()};m._d=function(){var m=this,i,p;for(i=0;i<m.l.length;i++){p=m[m.l[i]];if(p&&!p.disable&"
+"&p._d>0)return 1}return 0};m._x=function(d,n){var p=this[n],x;if(!p.disable){for(x in d)if(x&&(!Object||!Object.prototype||!Object.prototype[x]))p[x]=d[x];p._d--}};m.beacon=function(u){var p=this,m"
+"=p._m,s=m.s,imn='s_i_'+m._in+'_Integrate_'+p._n+'_'+p._c,im;if(!p.disable&&s.d.images&&s.apv>=3&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){p._c++;im=s.wd[imn]=new Image;im.src=m._fu(p,u)}};m.s"
+"cript=function(u){var p=this,m=p._m;if(!p.disable)m.s.loadModule(0,m._fu(p,u),0,1)};m.l=new Array;if(m.onLoad)m.onLoad(s,m)";
s.m_i("Integrate");

/****************************** MODULES *****************************/
/* Module: Survey */
s.m_Survey_c="var m=s.m_i(\"Survey\");m.launch=function(i,e,c,o,f){this._boot();var m=this,g=window.s_sv_globals||{},l,j;if(g.unloaded||m._blocked())return 0;i=i&&i.constructor&&i.constructor==Array?"
+"i:[i];l=g.manualTriggers;for(j=0;j<i.length;++j)l[l.length]={l:m._suites,i:i[j],e:e||0,c:c||0,o:o||0,f:f||0};m._execute();return 1;};m.version = 10001;m._t=function(){this._boot();var m=this,s=m.s,"
+"g=window.s_sv_globals||{},l,impr,i,k,impr={};if(m._blocked())return;for(i=0;i<s.va_t.length;i++){k=s.va_t[i];if(s[k]) impr[k]=s[k];}impr[\"l\"]=m._suites;impr[\"n\"]=impr[\"pageName\"]||\"\";impr["
+"\"u\"]=impr[\"pageURL\"]||\"\";impr[\"c\"]=impr[\"campaign\"]||\"\";impr[\"r\"]=impr[\"referrer\"]||\"\";l=g.pageImpressions;if(l.length > 4) l[l.length - 4]=null;l[l.length]=impr;m._execute();};m."
+"_rr=function(){var g=window.s_sv_globals||{},f=g.onScQueueEmpty||0;if(f)f();};m._blocked=function(){var m=this,g=window.s_sv_globals||{};return !m._booted||g.stop||!g.pending&&!g.triggerRequested;}"
+";m._execute=function(){if(s_sv_globals.execute)setTimeout(\"s_sv_globals.execute();\",0);};m._boot=function(){var m=this,s=m.s,w=window,g,c,d=s.dc,e=s.visitorNamespace,n=navigator.appName.toLowerCa"
+"se(),a=navigator.userAgent,v=navigator.appVersion,h,i,j,k,l,b;if(w.s_sv_globals)return;if(!((b=v.match(/AppleWebKit\\/([0-9]+)/))?521<b[1]:n==\"netscape\"?a.match(/gecko\\//i):(b=a.match(/opera[ \\"
+"/]?([0-9]+).[0-9]+/i))?7<b[1]:n==\"microsoft internet explorer\"&&!v.match(/macintosh/i)&&(b=v.match(/msie ([0-9]+).([0-9]+)/i))&&(5<b[1]||b[1]==5&&4<b[2])))return;g=w.s_sv_globals={};g.module=m;g."
+"pending=0;g.incomingLists=[];g.pageImpressions=[];g.manualTriggers=[];e=\"survey\";c=g.config={};m._param(c,\"dynamic_root\",(e?e+\".\":\"\")+d+\".2o7.net/survey/dynamic\");m._param(c,\"gather_root"
+"\",(e?e+\".\":\"\")+d+\".2o7.net/survey/gather\");g.url=location.protocol+\"//\"+c.dynamic_root;g.gatherUrl=location.protocol+\"//\"+c.gather_root;g.dataCenter=d;g.onListLoaded=new Function(\"r\","
+"\"b\",\"d\",\"i\",\"l\",\"s_sv_globals.module._loaded(r,b,d,i,l);\");m._suites=(m.suites||s.un).toLowerCase().split(\",\");l=m._suites;b={};for(j=0;j<l.length;++j){i=l[j];if(i&&!b[i]){h=i.length;fo"
+"r(k=0;k<i.length;++k)h=(h&0x03ffffff)<<5^h>>26^i.charCodeAt(k);b[i]={url:g.url+\"/suites/\"+(h%251+100)+\"/\"+encodeURIComponent(i.replace(/\\|/,\"||\").replace(/\\//,\"|-\"))};++g.pending;}}g.suit"
+"es=b;setTimeout(\"s_sv_globals.module._load();\",0);m._booted=1;};m._param=function(c,n,v){var p=\"s_sv_\",w=window,u=\"undefined\";if(typeof c[n]==u)c[n]=typeof w[p+n]==u?v:w[p+n];};m._load=functi"
+"on(){var m=this,g=s_sv_globals,q=g.suites,r,i,n=\"s_sv_sid\",b=m.s.c_r(n);if(!b){b=parseInt((new Date()).getTime()*Math.random());m.s.c_w(n,b);}for(i in q){r=q[i];if((!Object||!Object.prototype||!O"
+"bject.prototype[i]) && !r.requested){r.requested=1;m._script(r.url+\"/list.js?\"+b);}}};m._loaded=function(r,b,d,i,l){var m=this,g=s_sv_globals,n=g.incomingLists;--g.pending;if(!g.commonRevision){g"
+".bulkRevision=b;g.commonRevision=r;g.commonUrl=g.url+\"/common/\"+b;}else if(g.commonRevision!=r)return;if(!l.length)return;n[n.length]={r:i,l:l};if(g.execute)g.execute();else if(!g.triggerRequeste"
+"d){g.triggerRequested=1;m._script(g.commonUrl+\"/trigger.js\");}};m._script=function(u){var d=document,e=d.createElement(\"script\");e.type=\"text/javascript\";e.src=u;d.getElementsByTagName(\"head"
+"\")[0].appendChild(e);};if(m.onLoad)m.onLoad(s,m)";
s.m_i("Survey");

/****************************** MODULES *****************************/
/* Module: Media */
s.m_Media_c="var m=s.m_i('Media');if(m.completeByCloseOffset==undefined)m.completeByCloseOffset=1;if(m.completeCloseOffsetThreshold==undefined)m.completeCloseOffsetThreshold=1;m.cn=function(n){var m="
+"this;return m.s.rep(m.s.rep(m.s.rep(n,\"\\n\",''),\"\\r\",''),'--**--','')};m.open=function(n,l,p,b){var m=this,i=new Object,tm=new Date,a='',x;n=m.cn(n);if(!l)l=-1;if(n&&p){if(!m.l)m.l=new Object;"
+"if(m.l[n])m.close(n);if(b&&b.id)a=b.id;if(a)for (x in m.l)if(m.l[x]&&m.l[x].a==a)m.close(m.l[x].n);i.n=n;i.l=l;i.o=0;i.x=0;i.p=m.cn(m.playerName?m.playerName:p);i.a=a;i.t=0;i.ts=0;i.s=Math.floor(tm"
+".getTime()/1000);i.lx=0;i.lt=i.s;i.lo=0;i.e='';i.to=-1;i.tc=0;i.fel=new Object;i.vt=0;i.sn=0;i.sx=\"\";i.sl=0;i.sg=0;i.sc=0;i.us=0;i.co=0;i.cot=0;i.lm=0;i.lom=0;m.l[n]=i}};m._delete=function(n){var"
+" m=this,i;n=m.cn(n);i=m.l[n];m.l[n]=0;if(i&&i.m)clearTimeout(i.m.i)};m.close=function(n){this.e(n,0,-1)};m.play=function(n,o,sn,sx,sl){var m=this,i;i=m.e(n,1,o,sn,sx,sl);if(i&&!i.m){i.m=new Object;"
+"i.m.m=new Function('var m=s_c_il['+m._in+'],i;if(m.l){i=m.l[\"'+m.s.rep(i.n,'\"','\\\\\"')+'\"];if(i){if(i.lx==1)m.e(i.n,3,-1);i.m.i=setTimeout(i.m.m,1000)}}');i.m.m()}};m.complete=function(n,o){th"
+"is.e(n,5,o)};m.stop=function(n,o){this.e(n,2,o)};m.track=function(n){this.e(n,4,-1)};m.bcd=function(vo,i){var m=this,ns='a.media.',v=vo.linkTrackVars,e=vo.linkTrackEvents,pe='m_i',pev3,c=vo.context"
+"Data,x;c['a.contentType']='video';c[ns+'channel']=m.channel;c[ns+'name']=i.n;c[ns+'playerName']=i.p;if(i.l>0){c[ns+'length']=i.l;}c[ns+'timePlayed']=Math.floor(i.ts);if(!i.vt){c[ns+'view']=true;pe="
+"'m_s';i.vt=1}if(i.sx){c[ns+'segmentNum']=i.sn;c[ns+'segment']=i.sx;if(i.sl>0)c[ns+'segmentLength']=i.sl;if(i.sc&&i.ts>0)c[ns+'segmentView']=true}if(!i.cot&&i.co){c[ns+\"complete\"]=true;i.cot=1}if("
+"i.lm>0)c[ns+'milestone']=i.lm;if(i.lom>0)c[ns+'offsetMilestone']=i.lom;if(v)for(x in c)v+=',contextData.'+x;pev3='video';vo.pe=pe;vo.pev3=pev3;var d=m.contextDataMapping,y,a,l,n;if(d){vo.events2=''"
+";if(v)v+=',events';for(x in d){if(x.substring(0,ns.length)==ns)y=x.substring(ns.length);else y=\"\";a=d[x];if(typeof(a)=='string'){l=m.s.sp(a,',');for(n=0;n<l.length;n++){a=l[n];if(x==\"a.contentTy"
+"pe\"){if(v)v+=','+a;vo[a]=c[x]}else if(y){if(y=='view'||y=='segmentView'||y=='complete'||y=='timePlayed'){if(e)e+=','+a;if(c[x]){if(y=='timePlayed'){if(c[x])vo.events2+=(vo.events2?',':'')+a+'='+c["
+"x];}else if(c[x])vo.events2+=(vo.events2?',':'')+a}}else if(y=='segment'&&c[x+'Num']){if(v)v+=','+a;vo[a]=c[x+'Num']+':'+c[x]}else{if(v)v+=','+a;vo[a]=c[x]}}}}else if(y=='milestones'||y=='offsetMil"
+"estones'){x=x.substring(0,x.length-1);if(c[x]&&d[x+'s'][c[x]]){if(e)e+=','+d[x+'s'][c[x]];vo.events2+=(vo.events2?',':'')+d[x+'s'][c[x]]}}}vo.contextData=0}vo.linkTrackVars=v;vo.linkTrackEvents=e};"
+"m.bpe=function(vo,i,x,o){var m=this,pe='m_o',pev3,d='--**--';pe='m_o';if(!i.vt){pe='m_s';i.vt=1}else if(x==4)pe='m_i';pev3=m.s.ape(i.n)+d+Math.floor(i.l>0?i.l:1)+d+m.s.ape(i.p)+d+Math.floor(i.t)+d+"
+"i.s+d+(i.to>=0?'L'+Math.floor(i.to):'')+i.e+(x!=0&&x!=2?'L'+Math.floor(o):'');vo.pe=pe;vo.pev3=pev3};m.e=function(n,x,o,sn,sx,sl,pd){var m=this,i,tm=new Date,ts=Math.floor(tm.getTime()/1000),c,l,v="
+"m.trackVars,e=m.trackEvents,ti=m.trackSeconds,tp=m.trackMilestones,to=m.trackOffsetMilestones,sm=m.segmentByMilestones,so=m.segmentByOffsetMilestones,z=new Array,j,t=1,w=new Object,x,ek,tc,vo=new O"
+"bject;if(!m.channel)m.channel=m.s.wd.location.hostname;n=m.cn(n);i=n&&m.l&&m.l[n]?m.l[n]:0;if(i){if(o<0){if(i.lx==1&&i.lt>0)o=(ts-i.lt)+i.lo;else o=i.lo}if(i.l>0)o=o<i.l?o:i.l;if(o<0)o=0;i.o=o;if(i"
+".l>0){i.x=(i.o/i.l)*100;i.x=i.x>100?100:i.x}if(i.lo<0)i.lo=o;tc=i.tc;w.name=n;w.length=i.l;w.openTime=new Date;w.openTime.setTime(i.s*1000);w.offset=i.o;w.percent=i.x;w.playerName=i.p;if(i.to<0)w.m"
+"ediaEvent=w.event='OPEN';else w.mediaEvent=w.event=(x==1?'PLAY':(x==2?'STOP':(x==3?'MONITOR':(x==4?'TRACK':(x==5?'COMPLETE':('CLOSE'))))));if(!pd){if(i.pd)pd=i.pd}else i.pd=pd;w.player=pd;if(x>2||("
+"x!=i.lx&&(x!=2||i.lx==1))) {if(!sx){sn=i.sn;sx=i.sx;sl=i.sl}if(x){if(x==1)i.lo=o;if((x<=3||x==5)&&i.to>=0){t=0;v=e=\"None\";if(i.to!=o){l=i.to;if(l>o){l=i.lo;if(l>o)l=o}z=tp?m.s.sp(tp,','):0;if(i.l"
+">0&&z&&o>=l)for(j=0;j<z.length;j++){c=z[j]?parseFloat(''+z[j]):0;if(c&&(l/i.l)*100<c&&i.x>=c){t=1;j=z.length;w.mediaEvent=w.event='MILESTONE';i.lm=w.milestone=c}}z=to?m.s.sp(to,','):0;if(z&&o>=l)fo"
+"r(j=0;j<z.length;j++){c=z[j]?parseFloat(''+z[j]):0;if(c&&l<c&&o>=c){t=1;j=z.length;w.mediaEvent=w.event='OFFSET_MILESTONE';i.lom=w.offsetMilestone=c}}}}if(i.sg||!sx){if(sm&&tp&&i.l>0){z=m.s.sp(tp,'"
+",');if(z){z[z.length]='100';l=0;for(j=0;j<z.length;j++){c=z[j]?parseFloat(''+z[j]):0;if(c){if(i.x<c){sn=j+1;sx='M:'+l+'-'+c;j=z.length}l=c}}}}else if(so&&to){z=m.s.sp(to,',');if(z){z[z.length]=''+("
+"i.l>0?i.l:'E');l=0;for(j=0;j<z.length;j++){c=z[j]?parseFloat(''+z[j]):0;if(c||z[j]=='E'){if(o<c||z[j]=='E'){sn=j+1;sx='O:'+l+'-'+c;j=z.length}l=c}}}}if(sx)i.sg=1}if((sx||i.sx)&&sx!=i.sx){i.us=1;if("
+"!i.sx){i.sn=sn;i.sx=sx}if(i.to>=0)t=1}if((x>=2||i.x>=100)&&i.lo<o){i.t+=o-i.lo;i.ts+=o-i.lo}if(x<=2||(x==3&&!i.lx)){i.e+=(x==1||x==3?'S':'E')+Math.floor(o);i.lx=(x==3?1:x)}if(!t&&i.to>=0&&x<=3){ti="
+"ti?ti:0;if(ti&&i.ts>=ti){t=1;w.mediaEvent=w.event='SECONDS'}}i.lt=ts;i.lo=o}if(!x||(x<=3&&i.x>=100)){if(i.lx!=2)i.e+='E'+Math.floor(o);x=0;v=e=\"None\";w.mediaEvent=w.event=\"CLOSE\"}if(x==5||(m.co"
+"mpleteByCloseOffset&&(!x||i.x>=100)&&i.l>0&&o>=i.l-m.completeCloseOffsetThreshold)){w.complete=i.co=1;t=1}ek=w.mediaEvent;if(ek=='MILESTONE')ek+='_'+w.milestone;else if(ek=='OFFSET_MILESTONE')ek+='"
+"_'+w.offsetMilestone;if(!i.fel[ek]) {w.eventFirstTime=true;i.fel[ek]=1}else w.eventFirstTime=false;w.timePlayed=i.t;w.segmentNum=i.sn;w.segment=i.sx;w.segmentLength=i.sl;if(m.monitor&&x!=4)m.monito"
+"r(m.s,w);if(x==0)m._delete(n);if(t&&i.tc==tc){vo=new Object;vo.contextData=new Object;vo.linkTrackVars=v;vo.linkTrackEvents=e;if(!vo.linkTrackVars)vo.linkTrackVars='';if(!vo.linkTrackEvents)vo.link"
+"TrackEvents='';if(m.trackUsingContextData)m.bcd(vo,i);else m.bpe(vo,i,x,o);m.s.t(vo);if(i.us){i.sn=sn;i.sx=sx;i.sc=1;i.us=0}else if(i.ts>0)i.sc=0;i.e=\"\";i.lm=i.lom=0;i.ts-=Math.floor(i.ts);i.to=o"
+";i.tc++}}}return i};m.ae=function(n,l,p,x,o,sn,sx,sl,pd,b){var m=this,r=0;if(n&&(!m.autoTrackMediaLengthRequired||(length&&length>0)) &&p){if(!m.l||!m.l[n]){if(x==1||x==3){m.open(n,l,p,b);r=1}}else"
+" r=1;if(r)m.e(n,x,o,sn,sx,sl,pd)}};m.a=function(o,t){var m=this,i=o.id?o.id:o.name,n=o.name,p=0,v,c,c1,c2,xc=m.s.h,x,e,f1,f2='s_media_'+m._in+'_oc',f3='s_media_'+m._in+'_t',f4='s_media_'+m._in+'_s'"
+",f5='s_media_'+m._in+'_l',f6='s_media_'+m._in+'_m',f7='s_media_'+m._in+'_c',tcf,w;if(!i){if(!m.c)m.c=0;i='s_media_'+m._in+'_'+m.c;m.c++}if(!o.id)o.id=i;if(!o.name)o.name=n=i;if(!m.ol)m.ol=new Objec"
+"t;if(m.ol[i])return;m.ol[i]=o;if(!xc)xc=m.s.b;tcf=new Function('o','var e,p=0;try{if(o.versionInfo&&o.currentMedia&&o.controls)p=1}catch(e){p=0}return p');p=tcf(o);if(!p){tcf=new Function('o','var "
+"e,p=0,t;try{t=o.GetQuickTimeVersion();if(t)p=2}catch(e){p=0}return p');p=tcf(o);if(!p){tcf=new Function('o','var e,p=0,t;try{t=o.GetVersionInfo();if(t)p=3}catch(e){p=0}return p');p=tcf(o)}}v=\"var "
+"m=s_c_il[\"+m._in+\"],o=m.ol['\"+i+\"']\";if(p==1){p='Windows Media Player '+o.versionInfo;c1=v+',n,p,l,x=-1,cm,c,mn;if(o){cm=o.currentMedia;c=o.controls;if(cm&&c){mn=cm.name?cm.name:c.URL;l=cm.dur"
+"ation;p=c.currentPosition;n=o.playState;if(n){if(n==8)x=0;if(n==3)x=1;if(n==1||n==2||n==4||n==5||n==6)x=2;}';c2='if(x>=0)m.ae(mn,l,\"'+p+'\",x,x!=2?p:-1,0,\"\",0,0,o)}}';c=c1+c2;if(m.s.isie&&xc){x="
+"m.s.d.createElement('script');x.language='jscript';x.type='text/javascript';x.htmlFor=i;x.event='PlayStateChange(NewState)';x.defer=true;x.text=c;xc.appendChild(x);o[f6]=new Function(c1+'if(n==3){x"
+"=3;'+c2+'}setTimeout(o.'+f6+',5000)');o[f6]()}}if(p==2){p='QuickTime Player '+(o.GetIsQuickTimeRegistered()?'Pro ':'')+o.GetQuickTimeVersion();f1=f2;c=v+',n,x,t,l,p,p2,mn;if(o){mn=o.GetMovieName()?"
+"o.GetMovieName():o.GetURL();n=o.GetRate();t=o.GetTimeScale();l=o.GetDuration()/t;p=o.GetTime()/t;p2=o.'+f5+';if(n!=o.'+f4+'||p<p2||p-p2>5){x=2;if(n!=0)x=1;else if(p>=l)x=0;if(p<p2||p-p2>5)m.ae(mn,l"
+",\"'+p+'\",2,p2,0,\"\",0,0,o);m.ae(mn,l,\"'+p+'\",x,x!=2?p:-1,0,\"\",0,0,o)}if(n>0&&o.'+f7+'>=10){m.ae(mn,l,\"'+p+'\",3,p,0,\"\",0,0,o);o.'+f7+'=0}o.'+f7+'++;o.'+f4+'=n;o.'+f5+'=p;setTimeout(\"'+v+"
+"';o.'+f2+'(0,0)\",500)}';o[f1]=new Function('a','b',c);o[f4]=-1;o[f7]=0;o[f1](0,0)}if(p==3){p='RealPlayer '+o.GetVersionInfo();f1=n+'_OnPlayStateChange';c1=v+',n,x=-1,l,p,mn;if(o){mn=o.GetTitle()?o"
+".GetTitle():o.GetSource();n=o.GetPlayState();l=o.GetLength()/1000;p=o.GetPosition()/1000;if(n!=o.'+f4+'){if(n==3)x=1;if(n==0||n==2||n==4||n==5)x=2;if(n==0&&(p>=l||p==0))x=0;if(x>=0)m.ae(mn,l,\"'+p+"
+"'\",x,x!=2?p:-1,0,\"\",0,0,o)}if(n==3&&(o.'+f7+'>=10||!o.'+f3+')){m.ae(mn,l,\"'+p+'\",3,p,0,\"\",0,0,o);o.'+f7+'=0}o.'+f7+'++;o.'+f4+'=n;';c2='if(o.'+f2+')o.'+f2+'(o,n)}';if(m.s.wd[f1])o[f2]=m.s.wd"
+"[f1];m.s.wd[f1]=new Function('a','b',c1+c2);o[f1]=new Function('a','b',c1+'setTimeout(\"'+v+';o.'+f1+'(0,0)\",o.'+f3+'?500:5000);'+c2);o[f4]=-1;if(m.s.isie)o[f3]=1;o[f7]=0;o[f1](0,0)}};m.as=new Fun"
+"ction('e','var m=s_c_il['+m._in+'],l,n;if(m.autoTrack&&m.s.d.getElementsByTagName){l=m.s.d.getElementsByTagName(m.s.isie?\"OBJECT\":\"EMBED\");if(l)for(n=0;n<l.length;n++)m.a(l[n]);}');if(s.wd.atta"
+"chEvent)s.wd.attachEvent('onload',m.as);else if(s.wd.addEventListener)s.wd.addEventListener('load',m.as,false);if(m.onLoad)m.onLoad(s,m)";
s.m_i("Media");

/************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
var s_code='',s_objectID;function s_gi(un,pg,ss){var c="s.version='H.25.4';s.an=s_an;s.logDebug=function(m){var s=this,tcf=new Function('var e;try{console.log(\"'+s.rep(s.rep(s.rep(m,\"\\\\\",\"\\\\"
+"\\\\\"),\"\\n\",\"\\\\n\"),\"\\\"\",\"\\\\\\\"\")+'\");}catch(e){}');tcf()};s.cls=function(x,c){var i,y='';if(!c)c=this.an;for(i=0;i<x.length;i++){n=x.substring(i,i+1);if(c.indexOf(n)>=0)y+=n}retur"
+"n y};s.fl=function(x,l){return x?(''+x).substring(0,l):x};s.co=function(o){return o};s.num=function(x){x=''+x;for(var p=0;p<x.length;p++)if(('0123456789').indexOf(x.substring(p,p+1))<0)return 0;ret"
+"urn 1};s.rep=s_rep;s.sp=s_sp;s.jn=s_jn;s.ape=function(x){var s=this,h='0123456789ABCDEF',f=\"+~!*()'\",i,c=s.charSet,n,l,e,y='';c=c?c.toUpperCase():'';if(x){x=''+x;if(s.em==3){x=encodeURIComponent("
+"x);for(i=0;i<f.length;i++) {n=f.substring(i,i+1);if(x.indexOf(n)>=0)x=s.rep(x,n,\"%\"+n.charCodeAt(0).toString(16).toUpperCase())}}else if(c=='AUTO'&&('').charCodeAt){for(i=0;i<x.length;i++){c=x.su"
+"bstring(i,i+1);n=x.charCodeAt(i);if(n>127){l=0;e='';while(n||l<4){e=h.substring(n%16,n%16+1)+e;n=(n-n%16)/16;l++}y+='%u'+e}else if(c=='+')y+='%2B';else y+=escape(c)}x=y}else x=s.rep(escape(''+x),'+"
+"','%2B');if(c&&c!='AUTO'&&s.em==1&&x.indexOf('%u')<0&&x.indexOf('%U')<0){i=x.indexOf('%');while(i>=0){i++;if(h.substring(8).indexOf(x.substring(i,i+1).toUpperCase())>=0)return x.substring(0,i)+'u00"
+"'+x.substring(i);i=x.indexOf('%',i)}}}return x};s.epa=function(x){var s=this,y,tcf;if(x){x=s.rep(''+x,'+',' ');if(s.em==3){tcf=new Function('x','var y,e;try{y=decodeURIComponent(x)}catch(e){y=unesc"
+"ape(x)}return y');return tcf(x)}else return unescape(x)}return y};s.pt=function(x,d,f,a){var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r"
+";z+=y+d.length;t=x.substring(z,x.length);t=z<x.length?t:''}return ''};s.isf=function(t,a){var c=a.indexOf(':');if(c>=0)a=a.substring(0,c);c=a.indexOf('=');if(c>=0)a=a.substring(0,c);if(t.substring("
+"0,2)=='s_')t=t.substring(2);return (t!=''&&t==a)};s.fsf=function(t,a){var s=this;if(s.pt(a,',','isf',t))s.fsg+=(s.fsg!=''?',':'')+t;return 0};s.fs=function(x,f){var s=this;s.fsg='';s.pt(x,',','fsf'"
+",f);return s.fsg};s.mpc=function(m,a){var s=this,c,l,n,v;v=s.d.visibilityState;if(!v)v=s.d.webkitVisibilityState;if(v&&v=='prerender'){if(!s.mpq){s.mpq=new Array;l=s.sp('webkitvisibilitychange,visi"
+"bilitychange',',');for(n=0;n<l.length;n++){s.d.addEventListener(l[n],new Function('var s=s_c_il['+s._in+'],c,v;v=s.d.visibilityState;if(!v)v=s.d.webkitVisibilityState;if(s.mpq&&v==\"visible\"){whil"
+"e(s.mpq.length>0){c=s.mpq.shift();s[c.m].apply(s,c.a)}s.mpq=0}'),false)}}c=new Object;c.m=m;c.a=a;s.mpq.push(c);return 1}return 0};s.si=function(){var s=this,i,k,v,c=s_gi+'var s=s_gi(\"'+s.oun+'\")"
+";s.sa(\"'+s.un+'\");';for(i=0;i<s.va_g.length;i++){k=s.va_g[i];v=s[k];if(v!=undefined){if(typeof(v)!='number')c+='s.'+k+'=\"'+s_fe(v)+'\";';else c+='s.'+k+'='+v+';'}}c+=\"s.lnk=s.eo=s.linkName=s.li"
+"nkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';\";return c};s.c_d='';s.c_gdf=function(t,a){var s=this;if(!s.num(t))return 1;return 0};s.c_gd=function(){var s=this,d=s.wd.location.hostnam"
+"e,n=s.fpCookieDomainPeriods,p;if(!n)n=s.cookieDomainPeriods;if(d&&!s.c_d){n=n?parseInt(n):2;n=n>2?n:2;p=d.lastIndexOf('.');if(p>=0){while(p>=0&&n>1){p=d.lastIndexOf('.',p-1);n--}s.c_d=p>0&&s.pt(d,'"
+".','c_gdf',0)?d.substring(p):d}}return s.c_d};s.c_r=function(k){var s=this;k=s.ape(k);var c=' '+s.d.cookie,i=c.indexOf(' '+k+'='),e=i<0?i:c.indexOf(';',i),v=i<0?'':s.epa(c.substring(i+2+k.length,e<"
+"0?c.length:e));return v!='[[B]]'?v:''};s.c_w=function(k,v,e){var s=this,d=s.c_gd(),l=s.cookieLifetime,t;v=''+v;l=l?(''+l).toUpperCase():'';if(e&&l!='SESSION'&&l!='NONE'){t=(v!=''?parseInt(l?l:0):-6"
+"0);if(t){e=new Date;e.setTime(e.getTime()+(t*1000))}}if(k&&l!='NONE'){s.d.cookie=k+'='+s.ape(v!=''?v:'[[B]]')+'; path=/;'+(e&&l!='SESSION'?' expires='+e.toGMTString()+';':'')+(d?' domain='+d+';':''"
+");return s.c_r(k)==v}return 0};s.eh=function(o,e,r,f){var s=this,b='s_'+e+'_'+s._in,n=-1,l,i,x;if(!s.ehl)s.ehl=new Array;l=s.ehl;for(i=0;i<l.length&&n<0;i++){if(l[i].o==o&&l[i].e==e)n=i}if(n<0){n=i"
+";l[n]=new Object}x=l[n];x.o=o;x.e=e;f=r?x.b:f;if(r||f){x.b=r?0:o[e];x.o[e]=f}if(x.b){x.o[b]=x.b;return b}return 0};s.cet=function(f,a,t,o,b){var s=this,r,tcf;if(s.apv>=5&&(!s.isopera||s.apv>=7)){tc"
+"f=new Function('s','f','a','t','var e,r;try{r=s[f](a)}catch(e){r=s[t](e)}return r');r=tcf(s,f,a,t)}else{if(s.ismac&&s.u.indexOf('MSIE 4')>=0)r=s[b](a);else{s.eh(s.wd,'onerror',0,o);r=s[f](a);s.eh(s"
+".wd,'onerror',1)}}return r};s.gtfset=function(e){var s=this;return s.tfs};s.gtfsoe=new Function('e','var s=s_c_il['+s._in+'],c;s.eh(window,\"onerror\",1);s.etfs=1;c=s.t();if(c)s.d.write(c);s.etfs=0"
+";return true');s.gtfsfb=function(a){return window};s.gtfsf=function(w){var s=this,p=w.parent,l=w.location;s.tfs=w;if(p&&p.location!=l&&p.location.host==l.host){s.tfs=p;return s.gtfsf(s.tfs)}return "
+"s.tfs};s.gtfs=function(){var s=this;if(!s.tfs){s.tfs=s.wd;if(!s.etfs)s.tfs=s.cet('gtfsf',s.tfs,'gtfset',s.gtfsoe,'gtfsfb')}return s.tfs};s.mrq=function(u){var s=this,l=s.rl[u],n,r;s.rl[u]=0;if(l)fo"
+"r(n=0;n<l.length;n++){r=l[n];s.mr(0,0,r.r,r.t,r.u)}};s.flushBufferedRequests=function(){};s.mr=function(sess,q,rs,ta,u){var s=this,dc=s.dc,t1=s.trackingServer,t2=s.trackingServerSecure,tb=s.trackin"
+"gServerBase,p='.sc',ns=s.visitorNamespace,un=s.cls(u?u:(ns?ns:s.fun)),r=new Object,l,imn='s_i_'+(un),im,b,e;if(!rs){if(t1){if(t2&&s.ssl)t1=t2}else{if(!tb)tb='2o7.net';if(dc)dc=(''+dc).toLowerCase()"
+";else dc='d1';if(tb=='2o7.net'){if(dc=='d1')dc='112';else if(dc=='d2')dc='122';p=''}t1=un+'.'+dc+'.'+p+tb}rs='http'+(s.ssl?'s':'')+'://'+t1+'/b/ss/'+s.un+'/'+(s.mobile?'5.1':'1')+'/'+s.version+(s.t"
+"cn?'T':'')+'/'+sess+'?AQB=1&ndh=1'+(q?q:'')+'&AQE=1';if(s.isie&&!s.ismac)rs=s.fl(rs,2047)}if(s.d.images&&s.apv>=3&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){if(!s.rc)s.rc=new Object;if(!s.rc[u"
+"n]){s.rc[un]=1;if(!s.rl)s.rl=new Object;s.rl[un]=new Array;setTimeout('if(window.s_c_il)window.s_c_il['+s._in+'].mrq(\"'+un+'\")',750)}else{l=s.rl[un];if(l){r.t=ta;r.u=un;r.r=rs;l[l.length]=r;retur"
+"n ''}imn+='_'+s.rc[un];s.rc[un]++}if(s.debugTracking){var d='AppMeasurement Debug: '+rs,dl=s.sp(rs,'&'),dln;for(dln=0;dln<dl.length;dln++)d+=\"\\n\\t\"+s.epa(dl[dln]);s.logDebug(d)}im=s.wd[imn];if("
+"!im)im=s.wd[imn]=new Image;im.s_l=0;im.onload=new Function('e','this.s_l=1;var wd=window,s;if(wd.s_c_il){s=wd.s_c_il['+s._in+'];s.bcr();s.mrq(\"'+un+'\");s.nrs--;if(!s.nrs)s.m_m(\"rr\")}');if(!s.nr"
+"s){s.nrs=1;s.m_m('rs')}else s.nrs++;im.src=rs;if(s.useForcedLinkTracking||s.bcf){if(!s.forcedLinkTrackingTimeout)s.forcedLinkTrackingTimeout=250;setTimeout('if(window.s_c_il)window.s_c_il['+s._in+'"
+"].bcr()',s.forcedLinkTrackingTimeout);}else if((s.lnk||s.eo)&&(!ta||ta=='_self'||ta=='_top'||(s.wd.name&&ta==s.wd.name))){b=e=new Date;while(!im.s_l&&e.getTime()-b.getTime()<500)e=new Date}return '"
+"'}return '<im'+'g sr'+'c=\"'+rs+'\" width=1 height=1 border=0 alt=\"\">'};s.gg=function(v){var s=this;if(!s.wd['s_'+v])s.wd['s_'+v]='';return s.wd['s_'+v]};s.glf=function(t,a){if(t.substring(0,2)=="
+"'s_')t=t.substring(2);var s=this,v=s.gg(t);if(v)s[t]=v};s.gl=function(v){var s=this;if(s.pg)s.pt(v,',','glf',0)};s.rf=function(x){var s=this,y,i,j,h,p,l=0,q,a,b='',c='',t;if(x&&x.length>255){y=''+x"
+";i=y.indexOf('?');if(i>0){q=y.substring(i+1);y=y.substring(0,i);h=y.toLowerCase();j=0;if(h.substring(0,7)=='http://')j+=7;else if(h.substring(0,8)=='https://')j+=8;i=h.indexOf(\"/\",j);if(i>0){h=h."
+"substring(j,i);p=y.substring(i);y=y.substring(0,i);if(h.indexOf('google')>=0)l=',q,ie,start,search_key,word,kw,cd,';else if(h.indexOf('yahoo.co')>=0)l=',p,ei,';if(l&&q){a=s.sp(q,'&');if(a&&a.length"
+">1){for(j=0;j<a.length;j++){t=a[j];i=t.indexOf('=');if(i>0&&l.indexOf(','+t.substring(0,i)+',')>=0)b+=(b?'&':'')+t;else c+=(c?'&':'')+t}if(b&&c)q=b+'&'+c;else c=''}i=253-(q.length-c.length)-y.lengt"
+"h;x=y+(i>0?p.substring(0,i):'')+'?'+q}}}}return x};s.s2q=function(k,v,vf,vfp,f){var s=this,qs='',sk,sv,sp,ss,nke,nk,nf,nfl=0,nfn,nfm;if(k==\"contextData\")k=\"c\";if(v){for(sk in v)if((!f||sk.subst"
+"ring(0,f.length)==f)&&v[sk]&&(!vf||vf.indexOf(','+(vfp?vfp+'.':'')+sk+',')>=0)&&(!Object||!Object.prototype||!Object.prototype[sk])){nfm=0;if(nfl)for(nfn=0;nfn<nfl.length;nfn++)if(sk.substring(0,nf"
+"l[nfn].length)==nfl[nfn])nfm=1;if(!nfm){if(qs=='')qs+='&'+k+'.';sv=v[sk];if(f)sk=sk.substring(f.length);if(sk.length>0){nke=sk.indexOf('.');if(nke>0){nk=sk.substring(0,nke);nf=(f?f:'')+nk+'.';if(!n"
+"fl)nfl=new Array;nfl[nfl.length]=nf;qs+=s.s2q(nk,v,vf,vfp,nf)}else{if(typeof(sv)=='boolean'){if(sv)sv='true';else sv='false'}if(sv){if(vfp=='retrieveLightData'&&f.indexOf('.contextData.')<0){sp=sk."
+"substring(0,4);ss=sk.substring(4);if(sk=='transactionID')sk='xact';else if(sk=='channel')sk='ch';else if(sk=='campaign')sk='v0';else if(s.num(ss)){if(sp=='prop')sk='c'+ss;else if(sp=='eVar')sk='v'+"
+"ss;else if(sp=='list')sk='l'+ss;else if(sp=='hier'){sk='h'+ss;sv=sv.substring(0,255)}}}qs+='&'+s.ape(sk)+'='+s.ape(sv)}}}}}if(qs!='')qs+='&.'+k}return qs};s.hav=function(){var s=this,qs='',l,fv='',"
+"fe='',mn,i,e;if(s.lightProfileID){l=s.va_m;fv=s.lightTrackVars;if(fv)fv=','+fv+','+s.vl_mr+','}else{l=s.va_t;if(s.pe||s.linkType){fv=s.linkTrackVars;fe=s.linkTrackEvents;if(s.pe){mn=s.pe.substring("
+"0,1).toUpperCase()+s.pe.substring(1);if(s[mn]){fv=s[mn].trackVars;fe=s[mn].trackEvents}}}if(fv)fv=','+fv+','+s.vl_l+','+s.vl_l2;if(fe){fe=','+fe+',';if(fv)fv+=',events,'}if (s.events2)e=(e?',':'')+"
+"s.events2}for(i=0;i<l.length;i++){var k=l[i],v=s[k],b=k.substring(0,4),x=k.substring(4),n=parseInt(x),q=k;if(!v)if(k=='events'&&e){v=e;e=''}if(v&&(!fv||fv.indexOf(','+k+',')>=0)&&k!='linkName'&&k!="
+"'linkType'){if(k=='timestamp')q='ts';else if(k=='dynamicVariablePrefix')q='D';else if(k=='visitorID')q='vid';else if(k=='pageURL'){q='g';if(v.length>255){s.pageURLRest=v.substring(255);v=v.substrin"
+"g(0,255);}}else if(k=='pageURLRest')q='-g';else if(k=='referrer'){q='r';v=s.fl(s.rf(v),255)}else if(k=='vmk'||k=='visitorMigrationKey')q='vmt';else if(k=='visitorMigrationServer'){q='vmf';if(s.ssl&"
+"&s.visitorMigrationServerSecure)v=''}else if(k=='visitorMigrationServerSecure'){q='vmf';if(!s.ssl&&s.visitorMigrationServer)v=''}else if(k=='charSet'){q='ce';if(v.toUpperCase()=='AUTO')v='ISO8859-1"
+"';else if(s.em==2||s.em==3)v='UTF-8'}else if(k=='visitorNamespace')q='ns';else if(k=='cookieDomainPeriods')q='cdp';else if(k=='cookieLifetime')q='cl';else if(k=='variableProvider')q='vvp';else if(k"
+"=='currencyCode')q='cc';else if(k=='channel')q='ch';else if(k=='transactionID')q='xact';else if(k=='campaign')q='v0';else if(k=='resolution')q='s';else if(k=='colorDepth')q='c';else if(k=='javascri"
+"ptVersion')q='j';else if(k=='javaEnabled')q='v';else if(k=='cookiesEnabled')q='k';else if(k=='browserWidth')q='bw';else if(k=='browserHeight')q='bh';else if(k=='connectionType')q='ct';else if(k=='h"
+"omepage')q='hp';else if(k=='plugins')q='p';else if(k=='events'){if(e)v+=(v?',':'')+e;if(fe)v=s.fs(v,fe)}else if(k=='events2')v='';else if(k=='contextData'){qs+=s.s2q('c',s[k],fv,k,0);v=''}else if(k"
+"=='lightProfileID')q='mtp';else if(k=='lightStoreForSeconds'){q='mtss';if(!s.lightProfileID)v=''}else if(k=='lightIncrementBy'){q='mti';if(!s.lightProfileID)v=''}else if(k=='retrieveLightProfiles')"
+"q='mtsr';else if(k=='deleteLightProfiles')q='mtsd';else if(k=='retrieveLightData'){if(s.retrieveLightProfiles)qs+=s.s2q('mts',s[k],fv,k,0);v=''}else if(s.num(x)){if(b=='prop')q='c'+n;else if(b=='eV"
+"ar')q='v'+n;else if(b=='list')q='l'+n;else if(b=='hier'){q='h'+n;v=s.fl(v,255)}}if(v)qs+='&'+s.ape(q)+'='+(k.substring(0,3)!='pev'?s.ape(v):v)}}return qs};s.ltdf=function(t,h){t=t?t.toLowerCase():'"
+"';h=h?h.toLowerCase():'';var qi=h.indexOf('?');h=qi>=0?h.substring(0,qi):h;if(t&&h.substring(h.length-(t.length+1))=='.'+t)return 1;return 0};s.ltef=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLow"
+"erCase():'';if(t&&h.indexOf(t)>=0)return 1;return 0};s.lt=function(h){var s=this,lft=s.linkDownloadFileTypes,lef=s.linkExternalFilters,lif=s.linkInternalFilters;lif=lif?lif:s.wd.location.hostname;h"
+"=h.toLowerCase();if(s.trackDownloadLinks&&lft&&s.pt(lft,',','ltdf',h))return 'd';if(s.trackExternalLinks&&h.indexOf('#')!=0&&h.indexOf('about:')!=0&&h.indexOf('javascript:')!=0&&(lef||lif)&&(!lef||"
+"s.pt(lef,',','ltef',h))&&(!lif||!s.pt(lif,',','ltef',h)))return 'e';return ''};s.lc=new Function('e','var s=s_c_il['+s._in+'],b=s.eh(this,\"onclick\");s.lnk=this;s.t();s.lnk=0;if(b)return this[b](e"
+");return true');s.bcr=function(){var s=this;if(s.bct&&s.bce)s.bct.dispatchEvent(s.bce);if(s.bcf){if(typeof(s.bcf)=='function')s.bcf();else if(s.bct&&s.bct.href)s.d.location=s.bct.href}s.bct=s.bce=s"
+".bcf=0};s.bc=new Function('e','if(e&&e.s_fe)return;var s=s_c_il['+s._in+'],f,tcf,t,n,nrs,a,h;if(s.d&&s.d.all&&s.d.all.cppXYctnr)return;if(!s.bbc)s.useForcedLinkTracking=0;else if(!s.useForcedLinkTr"
+"acking){s.b.removeEventListener(\"click\",s.bc,true);s.bbc=s.useForcedLinkTracking=0;return}else s.b.removeEventListener(\"click\",s.bc,false);s.eo=e.srcElement?e.srcElement:e.target;nrs=s.nrs;s.t("
+");s.eo=0;if(s.nrs>nrs&&s.useForcedLinkTracking&&e.target){a=e.target;while(a&&a!=s.b&&a.tagName.toUpperCase()!=\"A\"&&a.tagName.toUpperCase()!=\"AREA\")a=a.parentNode;if(a){h=a.href;if(h.indexOf(\""
+"#\")==0||h.indexOf(\"about:\")==0||h.indexOf(\"javascript:\")==0)h=0;t=a.target;if(e.target.dispatchEvent&&h&&(!t||t==\"_self\"||t==\"_top\"||(s.wd.name&&t==s.wd.name))){e.stopPropagation();e.stopI"
+"mmediatePropagation();e.preventDefault();n=s.d.createEvent(\"MouseEvents\");n.initMouseEvent(\"click\",e.bubbles,e.cancelable,e.view,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.alt"
+"Key,e.shiftKey,e.metaKey,e.button,e.relatedTarget);n.s_fe=1;s.bct=e.target;s.bce=n}}}');s.oh=function(o){var s=this,l=s.wd.location,h=o.href?o.href:'',i,j,k,p;i=h.indexOf(':');j=h.indexOf('?');k=h."
+"indexOf('/');if(h&&(i<0||(j>=0&&i>j)||(k>=0&&i>k))){p=o.protocol&&o.protocol.length>1?o.protocol:(l.protocol?l.protocol:'');i=l.pathname.lastIndexOf('/');h=(p?p+'//':'')+(o.host?o.host:(l.host?l.ho"
+"st:''))+(h.substring(0,1)!='/'?l.pathname.substring(0,i<0?0:i)+'/':'')+h}return h};s.ot=function(o){var t=o.tagName;if(o.tagUrn||(o.scopeName&&o.scopeName.toUpperCase()!='HTML'))return '';t=t&&t.to"
+"UpperCase?t.toUpperCase():'';if(t=='SHAPE')t='';if(t){if((t=='INPUT'||t=='BUTTON')&&o.type&&o.type.toUpperCase)t=o.type.toUpperCase();else if(!t&&o.href)t='A';}return t};s.oid=function(o){var s=thi"
+"s,t=s.ot(o),p,c,n='',x=0;if(t&&!o.s_oid){p=o.protocol;c=o.onclick;if(o.href&&(t=='A'||t=='AREA')&&(!c||!p||p.toLowerCase().indexOf('javascript')<0))n=s.oh(o);else if(c){n=s.rep(s.rep(s.rep(s.rep(''"
+"+c,\"\\r\",''),\"\\n\",''),\"\\t\",''),' ','');x=2}else if(t=='INPUT'||t=='SUBMIT'){if(o.value)n=o.value;else if(o.innerText)n=o.innerText;else if(o.textContent)n=o.textContent;x=3}else if(o.src&&t"
+"=='IMAGE')n=o.src;if(n){o.s_oid=s.fl(n,100);o.s_oidt=x}}return o.s_oid};s.rqf=function(t,un){var s=this,e=t.indexOf('='),u=e>=0?t.substring(0,e):'',q=e>=0?s.epa(t.substring(e+1)):'';if(u&&q&&(','+u"
+"+',').indexOf(','+un+',')>=0){if(u!=s.un&&s.un.indexOf(',')>=0)q='&u='+u+q+'&u=0';return q}return ''};s.rq=function(un){if(!un)un=this.un;var s=this,c=un.indexOf(','),v=s.c_r('s_sq'),q='';if(c<0)re"
+"turn s.pt(v,'&','rqf',un);return s.pt(un,',','rq',0)};s.sqp=function(t,a){var s=this,e=t.indexOf('='),q=e<0?'':s.epa(t.substring(e+1));s.sqq[q]='';if(e>=0)s.pt(t.substring(0,e),',','sqs',q);return "
+"0};s.sqs=function(un,q){var s=this;s.squ[un]=q;return 0};s.sq=function(q){var s=this,k='s_sq',v=s.c_r(k),x,c=0;s.sqq=new Object;s.squ=new Object;s.sqq[q]='';s.pt(v,'&','sqp',0);s.pt(s.un,',','sqs',"
+"q);v='';for(x in s.squ)if(x&&(!Object||!Object.prototype||!Object.prototype[x]))s.sqq[s.squ[x]]+=(s.sqq[s.squ[x]]?',':'')+x;for(x in s.sqq)if(x&&(!Object||!Object.prototype||!Object.prototype[x])&&"
+"s.sqq[x]&&(x==q||c<2)){v+=(v?'&':'')+s.sqq[x]+'='+s.ape(x);c++}return s.c_w(k,v,0)};s.wdl=new Function('e','var s=s_c_il['+s._in+'],r=true,b=s.eh(s.wd,\"onload\"),i,o,oc;if(b)r=this[b](e);for(i=0;i"
+"<s.d.links.length;i++){o=s.d.links[i];oc=o.onclick?\"\"+o.onclick:\"\";if((oc.indexOf(\"s_gs(\")<0||oc.indexOf(\".s_oc(\")>=0)&&oc.indexOf(\".tl(\")<0)s.eh(o,\"onclick\",0,s.lc);}return r');s.wds=f"
+"unction(){var s=this;if(s.apv>3&&(!s.isie||!s.ismac||s.apv>=5)){if(s.b&&s.b.attachEvent)s.b.attachEvent('onclick',s.bc);else if(s.b&&s.b.addEventListener){if(s.n&&s.n.userAgent.indexOf('WebKit')>=0"
+"&&s.d.createEvent){s.bbc=1;s.useForcedLinkTracking=1;s.b.addEventListener('click',s.bc,true)}s.b.addEventListener('click',s.bc,false)}else s.eh(s.wd,'onload',0,s.wdl)}};s.vs=function(x){var s=this,"
+"v=s.visitorSampling,g=s.visitorSamplingGroup,k='s_vsn_'+s.un+(g?'_'+g:''),n=s.c_r(k),e=new Date,y=e.getYear();e.setYear(y+10+(y<1900?1900:0));if(v){v*=100;if(!n){if(!s.c_w(k,x,e))return 0;n=x}if(n%"
+"10000>v)return 0}return 1};s.dyasmf=function(t,m){if(t&&m&&m.indexOf(t)>=0)return 1;return 0};s.dyasf=function(t,m){var s=this,i=t?t.indexOf('='):-1,n,x;if(i>=0&&m){var n=t.substring(0,i),x=t.subst"
+"ring(i+1);if(s.pt(x,',','dyasmf',m))return n}return 0};s.uns=function(){var s=this,x=s.dynamicAccountSelection,l=s.dynamicAccountList,m=s.dynamicAccountMatch,n,i;s.un=s.un.toLowerCase();if(x&&l){if"
+"(!m)m=s.wd.location.host;if(!m.toLowerCase)m=''+m;l=l.toLowerCase();m=m.toLowerCase();n=s.pt(l,';','dyasf',m);if(n)s.un=n}i=s.un.indexOf(',');s.fun=i<0?s.un:s.un.substring(0,i)};s.sa=function(un){v"
+"ar s=this;if(s.un&&s.mpc('sa',arguments))return;s.un=un;if(!s.oun)s.oun=un;else if((','+s.oun+',').indexOf(','+un+',')<0)s.oun+=','+un;s.uns()};s.m_i=function(n,a){var s=this,m,f=n.substring(0,1),r"
+",l,i;if(!s.m_l)s.m_l=new Object;if(!s.m_nl)s.m_nl=new Array;m=s.m_l[n];if(!a&&m&&m._e&&!m._i)s.m_a(n);if(!m){m=new Object,m._c='s_m';m._in=s.wd.s_c_in;m._il=s._il;m._il[m._in]=m;s.wd.s_c_in++;m.s=s"
+";m._n=n;m._l=new Array('_c','_in','_il','_i','_e','_d','_dl','s','n','_r','_g','_g1','_t','_t1','_x','_x1','_rs','_rr','_l');s.m_l[n]=m;s.m_nl[s.m_nl.length]=n}else if(m._r&&!m._m){r=m._r;r._m=m;l="
+"m._l;for(i=0;i<l.length;i++)if(m[l[i]])r[l[i]]=m[l[i]];r._il[r._in]=r;m=s.m_l[n]=r}if(f==f.toUpperCase())s[n]=m;return m};s.m_a=new Function('n','g','e','if(!g)g=\"m_\"+n;var s=s_c_il['+s._in+'],c="
+"s[g+\"_c\"],m,x,f=0;if(s.mpc(\"m_a\",arguments))return;if(!c)c=s.wd[\"s_\"+g+\"_c\"];if(c&&s_d)s[g]=new Function(\"s\",s_ft(s_d(c)));x=s[g];if(!x)x=s.wd[\\'s_\\'+g];if(!x)x=s.wd[g];m=s.m_i(n,1);if("
+"x&&(!m._i||g!=\"m_\"+n)){m._i=f=1;if((\"\"+x).indexOf(\"function\")>=0)x(s);else s.m_m(\"x\",n,x,e)}m=s.m_i(n,1);if(m._dl)m._dl=m._d=0;s.dlt();return f');s.m_m=function(t,n,d,e){t='_'+t;var s=this,"
+"i,x,m,f='_'+t,r=0,u;if(s.m_l&&s.m_nl)for(i=0;i<s.m_nl.length;i++){x=s.m_nl[i];if(!n||x==n){m=s.m_i(x);u=m[t];if(u){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t](d,e);else if(d)u=m[t](d);else u=m"
+"[t]()}}if(u)r=1;u=m[t+1];if(u&&!m[f]){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t+1](d,e);else if(d)u=m[t+1](d);else u=m[t+1]()}}m[f]=1;if(u)r=1}}return r};s.m_ll=function(){var s=this,g=s.m_dl"
+",i,o;if(g)for(i=0;i<g.length;i++){o=g[i];if(o)s.loadModule(o.n,o.u,o.d,o.l,o.e,1);g[i]=0}};s.loadModule=function(n,u,d,l,e,ln){var s=this,m=0,i,g,o=0,f1,f2,c=s.h?s.h:s.b,b,tcf;if(n){i=n.indexOf(':'"
+");if(i>=0){g=n.substring(i+1);n=n.substring(0,i)}else g=\"m_\"+n;m=s.m_i(n)}if((l||(n&&!s.m_a(n,g)))&&u&&s.d&&c&&s.d.createElement){if(d){m._d=1;m._dl=1}if(ln){if(s.ssl)u=s.rep(u,'http:','https:');"
+"i='s_s:'+s._in+':'+n+':'+g;b='var s=s_c_il['+s._in+'],o=s.d.getElementById(\"'+i+'\");if(s&&o){if(!o.l&&s.wd.'+g+'){o.l=1;if(o.i)clearTimeout(o.i);o.i=0;s.m_a(\"'+n+'\",\"'+g+'\"'+(e?',\"'+e+'\"':'"
+"')+')}';f2=b+'o.c++;if(!s.maxDelay)s.maxDelay=250;if(!o.l&&o.c<(s.maxDelay*2)/100)o.i=setTimeout(o.f2,100)}';f1=new Function('e',b+'}');tcf=new Function('s','c','i','u','f1','f2','var e,o=0;try{o=s"
+".d.createElement(\"script\");if(o){o.type=\"text/javascript\";'+(n?'o.id=i;o.defer=true;o.onload=o.onreadystatechange=f1;o.f2=f2;o.l=0;':'')+'o.src=u;c.appendChild(o);'+(n?'o.c=0;o.i=setTimeout(f2,"
+"100)':'')+'}}catch(e){o=0}return o');o=tcf(s,c,i,u,f1,f2)}else{o=new Object;o.n=n+':'+g;o.u=u;o.d=d;o.l=l;o.e=e;g=s.m_dl;if(!g)g=s.m_dl=new Array;i=0;while(i<g.length&&g[i])i++;g[i]=o}}else if(n){m"
+"=s.m_i(n);m._e=1}return m};s.voa=function(vo,r){var s=this,l=s.va_g,i,k,v,x;for(i=0;i<l.length;i++){k=l[i];v=vo[k];if(v||vo['!'+k]){if(!r&&(k==\"contextData\"||k==\"retrieveLightData\")&&s[k])for(x"
+" in s[k])if(!v[x])v[x]=s[k][x];s[k]=v}}};s.vob=function(vo){var s=this,l=s.va_g,i,k;for(i=0;i<l.length;i++){k=l[i];vo[k]=s[k];if(!vo[k])vo['!'+k]=1}};s.dlt=new Function('var s=s_c_il['+s._in+'],d=n"
+"ew Date,i,vo,f=0;if(s.dll)for(i=0;i<s.dll.length;i++){vo=s.dll[i];if(vo){if(!s.m_m(\"d\")||d.getTime()-vo._t>=s.maxDelay){s.dll[i]=0;s.t(vo)}else f=1}}if(s.dli)clearTimeout(s.dli);s.dli=0;if(f){if("
+"!s.dli)s.dli=setTimeout(s.dlt,s.maxDelay)}else s.dll=0');s.dl=function(vo){var s=this,d=new Date;if(!vo)vo=new Object;s.vob(vo);vo._t=d.getTime();if(!s.dll)s.dll=new Array;s.dll[s.dll.length]=vo;if"
+"(!s.maxDelay)s.maxDelay=250;s.dlt()};s.gfid=function(){var s=this,d='0123456789ABCDEF',k='s_fid',fid=s.c_r(k),h='',l='',i,j,m=8,n=4,e=new Date,y;if(!fid||fid.indexOf('-')<0){for(i=0;i<16;i++){j=Mat"
+"h.floor(Math.random()*m);h+=d.substring(j,j+1);j=Math.floor(Math.random()*n);l+=d.substring(j,j+1);m=n=16}fid=h+'-'+l;}y=e.getYear();e.setYear(y+2+(y<1900?1900:0));if(!s.c_w(k,fid,e))fid=0;return f"
+"id};s.applyADMS=function(){var s=this,vb=new Object;if(s.wd.ADMS&&!s.visitorID&&!s.admsc){if(!s.adms)s.adms=ADMS.getDefault();if(!s.admsq){s.visitorID=s.adms.getVisitorID(new Function('v','var s=s_"
+"c_il['+s._in+'],l=s.admsq,i;if(v==-1)v=0;if(v)s.visitorID=v;s.admsq=0;if(l){s.admsc=1;for(i=0;i<l.length;i++)s.t(l[i]);s.admsc=0;}'));if(!s.visitorID)s.admsq=new Array}if(s.admsq){s.vob(vb);vb['!vi"
+"sitorID']=0;s.admsq.push(vb);return 1}else{if(s.visitorID==-1)s.visitorID=0}}return 0};s.track=s.t=function(vo){var s=this,trk=1,tm=new Date,sed=Math&&Math.random?Math.floor(Math.random()*100000000"
+"00000):tm.getTime(),sess='s'+Math.floor(tm.getTime()/10800000)%10+sed,y=tm.getYear(),vt=tm.getDate()+'/'+tm.getMonth()+'/'+(y<1900?y+1900:y)+' '+tm.getHours()+':'+tm.getMinutes()+':'+tm.getSeconds("
+")+' '+tm.getDay()+' '+tm.getTimezoneOffset(),tcf,tfs=s.gtfs(),ta=-1,q='',qs='',code='',vb=new Object;if(s.mpc('t',arguments))return;s.gl(s.vl_g);s.uns();s.m_ll();if(!s.td){var tl=tfs.location,a,o,i"
+",x='',c='',v='',p='',bw='',bh='',j='1.0',k=s.c_w('s_cc','true',0)?'Y':'N',hp='',ct='',pn=0,ps;if(String&&String.prototype){j='1.1';if(j.match){j='1.2';if(tm.setUTCDate){j='1.3';if(s.isie&&s.ismac&&"
+"s.apv>=5)j='1.4';if(pn.toPrecision){j='1.5';a=new Array;if(a.forEach){j='1.6';i=0;o=new Object;tcf=new Function('o','var e,i=0;try{i=new Iterator(o)}catch(e){}return i');i=tcf(o);if(i&&i.next){j='1"
+".7';if(a.reduce){j='1.8';if(j.trim){j='1.8.1';if(Date.parse){j='1.8.2';if(Object.create)j='1.8.5'}}}}}}}}}if(s.apv>=4)x=screen.width+'x'+screen.height;if(s.isns||s.isopera){if(s.apv>=3){v=s.n.javaE"
+"nabled()?'Y':'N';if(s.apv>=4){c=screen.pixelDepth;bw=s.wd.innerWidth;bh=s.wd.innerHeight}}s.pl=s.n.plugins}else if(s.isie){if(s.apv>=4){v=s.n.javaEnabled()?'Y':'N';c=screen.colorDepth;if(s.apv>=5){"
+"bw=s.d.documentElement.offsetWidth;bh=s.d.documentElement.offsetHeight;if(!s.ismac&&s.b){tcf=new Function('s','tl','var e,hp=0;try{s.b.addBehavior(\"#default#homePage\");hp=s.b.isHomePage(tl)?\"Y\""
+":\"N\"}catch(e){}return hp');hp=tcf(s,tl);tcf=new Function('s','var e,ct=0;try{s.b.addBehavior(\"#default#clientCaps\");ct=s.b.connectionType}catch(e){}return ct');ct=tcf(s)}}}else r=''}if(s.pl)whi"
+"le(pn<s.pl.length&&pn<30){ps=s.fl(s.pl[pn].name,100)+';';if(p.indexOf(ps)<0)p+=ps;pn++}s.resolution=x;s.colorDepth=c;s.javascriptVersion=j;s.javaEnabled=v;s.cookiesEnabled=k;s.browserWidth=bw;s.bro"
+"wserHeight=bh;s.connectionType=ct;s.homepage=hp;s.plugins=p;s.td=1}if(vo){s.vob(vb);s.voa(vo)}s.fid=s.gfid();if(s.applyADMS())return '';if((vo&&vo._t)||!s.m_m('d')){if(s.usePlugins)s.doPlugins(s);i"
+"f(!s.abort){var l=s.wd.location,r=tfs.document.referrer;if(!s.pageURL)s.pageURL=l.href?l.href:l;if(!s.referrer&&!s._1_referrer){s.referrer=r;s._1_referrer=1}s.m_m('g');if(s.lnk||s.eo){var o=s.eo?s."
+"eo:s.lnk,p=s.pageName,w=1,t=s.ot(o),n=s.oid(o),x=o.s_oidt,h,l,i,oc;if(s.eo&&o==s.eo){while(o&&!n&&t!='BODY'){o=o.parentElement?o.parentElement:o.parentNode;if(o){t=s.ot(o);n=s.oid(o);x=o.s_oidt}}if"
+"(!n||t=='BODY')o='';if(o){oc=o.onclick?''+o.onclick:'';if((oc.indexOf('s_gs(')>=0&&oc.indexOf('.s_oc(')<0)||oc.indexOf('.tl(')>=0)o=0}}if(o){if(n)ta=o.target;h=s.oh(o);i=h.indexOf('?');h=s.linkLeav"
+"eQueryString||i<0?h:h.substring(0,i);l=s.linkName;t=s.linkType?s.linkType.toLowerCase():s.lt(h);if(t&&(h||l)){s.pe='lnk_'+(t=='d'||t=='e'?t:'o');s.pev1=(h?s.ape(h):'');s.pev2=(l?s.ape(l):'')}else t"
+"rk=0;if(s.trackInlineStats){if(!p){p=s.pageURL;w=0}t=s.ot(o);i=o.sourceIndex;if(o.dataset&&o.dataset.sObjectId){s.wd.s_objectID=o.dataset.sObjectId;}else if(o.getAttribute&&o.getAttribute('data-s-o"
+"bject-id')){s.wd.s_objectID=o.getAttribute('data-s-object-id');}else if(s.useForcedLinkTracking){s.wd.s_objectID='';oc=o.onclick?''+o.onclick:'';if(oc){var ocb=oc.indexOf('s_objectID'),oce,ocq,ocx;"
+"if(ocb>=0){ocb+=10;while(ocb<oc.length&&(\"= \\t\\r\\n\").indexOf(oc.charAt(ocb))>=0)ocb++;if(ocb<oc.length){oce=ocb;ocq=ocx=0;while(oce<oc.length&&(oc.charAt(oce)!=';'||ocq)){if(ocq){if(oc.charAt("
+"oce)==ocq&&!ocx)ocq=0;else if(oc.charAt(oce)==\"\\\\\")ocx=!ocx;else ocx=0;}else{ocq=oc.charAt(oce);if(ocq!='\"'&&ocq!=\"'\")ocq=0}oce++;}oc=oc.substring(ocb,oce);if(oc){o.s_soid=new Function('s','"
+"var e;try{s.wd.s_objectID='+oc+'}catch(e){}');o.s_soid(s)}}}}}if(s.gg('objectID')){n=s.gg('objectID');x=1;i=1}if(p&&n&&t)qs='&pid='+s.ape(s.fl(p,255))+(w?'&pidt='+w:'')+'&oid='+s.ape(s.fl(n,100))+("
+"x?'&oidt='+x:'')+'&ot='+s.ape(t)+(i?'&oi='+i:'')}}else trk=0}if(trk||qs){s.sampled=s.vs(sed);if(trk){if(s.sampled)window.s_prop60=scGetISODateString();code=s.mr(sess,(vt?'&t='+s.ape(vt)+'&c60='+s_prop60:'')+s.hav()+q+(qs?qs:s.rq()),0,ta);qs='';s.m_m('"
+"t');if(s.p_r)s.p_r();s.referrer=s.lightProfileID=s.retrieveLightProfiles=s.deleteLightProfiles=''}s.sq(qs)}}}else s.dl(vo);if(vo)s.voa(vb,1);s.abort=0;s.pageURLRest=s.lnk=s.eo=s.linkName=s.linkType"
+"=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';if(s.pg)s.wd.s_lnk=s.wd.s_eo=s.wd.s_linkName=s.wd.s_linkType='';return code};s.trackLink=s.tl=function(o,t,n,vo,f){var s=this;s.lnk=o;s.linkType="
+"t;s.linkName=n;if(f){s.bct=o;s.bcf=f}s.t(vo)};s.trackLight=function(p,ss,i,vo){var s=this;s.lightProfileID=p;s.lightStoreForSeconds=ss;s.lightIncrementBy=i;s.t(vo)};s.setTagContainer=function(n){va"
+"r s=this,l=s.wd.s_c_il,i,t,x,y;s.tcn=n;if(l)for(i=0;i<l.length;i++){t=l[i];if(t&&t._c=='s_l'&&t.tagContainerName==n){s.voa(t);if(t.lmq)for(i=0;i<t.lmq.length;i++){x=t.lmq[i];y='m_'+x.n;if(!s[y]&&!s"
+"[y+'_c']){s[y]=t[y];s[y+'_c']=t[y+'_c']}s.loadModule(x.n,x.u,x.d)}if(t.ml)for(x in t.ml)if(s[x]){y=s[x];x=t.ml[x];for(i in x)if(!Object.prototype[i]){if(typeof(x[i])!='function'||(''+x[i]).indexOf("
+"'s_c_il')<0)y[i]=x[i]}}if(t.mmq)for(i=0;i<t.mmq.length;i++){x=t.mmq[i];if(s[x.m]){y=s[x.m];if(y[x.f]&&typeof(y[x.f])=='function'){if(x.a)y[x.f].apply(y,x.a);else y[x.f].apply(y)}}}if(t.tq)for(i=0;i"
+"<t.tq.length;i++)s.t(t.tq[i]);t.s=s;return}}};s.wd=window;s.ssl=(s.wd.location.protocol.toLowerCase().indexOf('https')>=0);s.d=document;s.b=s.d.body;if(s.d.getElementsByTagName){s.h=s.d.getElements"
+"ByTagName('HEAD');if(s.h)s.h=s.h[0]}s.n=navigator;s.u=s.n.userAgent;s.ns6=s.u.indexOf('Netscape6/');var apn=s.n.appName,v=s.n.appVersion,ie=v.indexOf('MSIE '),o=s.u.indexOf('Opera '),i;if(v.indexOf"
+"('Opera')>=0||o>0)apn='Opera';s.isie=(apn=='Microsoft Internet Explorer');s.isns=(apn=='Netscape');s.isopera=(apn=='Opera');s.ismac=(s.u.indexOf('Mac')>=0);if(o>0)s.apv=parseFloat(s.u.substring(o+6"
+"));else if(ie>0){s.apv=parseInt(i=v.substring(ie+5));if(s.apv>3)s.apv=parseFloat(i)}else if(s.ns6>0)s.apv=parseFloat(s.u.substring(s.ns6+10));else s.apv=parseFloat(v);s.em=0;if(s.em.toPrecision)s.e"
+"m=3;else if(String.fromCharCode){i=escape(String.fromCharCode(256)).toUpperCase();s.em=(i=='%C4%80'?2:(i=='%U0100'?1:0))}if(s.oun)s.sa(s.oun);s.sa(un);s.vl_l='timestamp,dynamicVariablePrefix,visito"
+"rID,fid,vmk,visitorMigrationKey,visitorMigrationServer,visitorMigrationServerSecure,ppu,charSet,visitorNamespace,cookieDomainPeriods,cookieLifetime,pageName,pageURL,referrer,contextData,currencyCod"
+"e,lightProfileID,lightStoreForSeconds,lightIncrementBy,retrieveLightProfiles,deleteLightProfiles,retrieveLightData';s.va_l=s.sp(s.vl_l,',');s.vl_mr=s.vl_m='timestamp,charSet,visitorNamespace,cookie"
+"DomainPeriods,cookieLifetime,contextData,lightProfileID,lightStoreForSeconds,lightIncrementBy';s.vl_t=s.vl_l+',variableProvider,channel,server,pageType,transactionID,purchaseID,campaign,state,zip,e"
+"vents,events2,products,linkName,linkType';var n;for(n=1;n<=75;n++){s.vl_t+=',prop'+n+',eVar'+n;s.vl_m+=',prop'+n+',eVar'+n}for(n=1;n<=5;n++)s.vl_t+=',hier'+n;for(n=1;n<=3;n++)s.vl_t+=',list'+n;s.va"
+"_m=s.sp(s.vl_m,',');s.vl_l2=',tnt,pe,pev1,pev2,pev3,resolution,colorDepth,javascriptVersion,javaEnabled,cookiesEnabled,browserWidth,browserHeight,connectionType,homepage,pageURLRest,plugins';s.vl_t"
+"+=s.vl_l2;s.va_t=s.sp(s.vl_t,',');s.vl_g=s.vl_t+',trackingServer,trackingServerSecure,trackingServerBase,fpCookieDomainPeriods,disableBufferedRequests,mobile,visitorSampling,visitorSamplingGroup,dy"
+"namicAccountSelection,dynamicAccountList,dynamicAccountMatch,trackDownloadLinks,trackExternalLinks,trackInlineStats,linkLeaveQueryString,linkDownloadFileTypes,linkExternalFilters,linkInternalFilter"
+"s,linkTrackVars,linkTrackEvents,linkNames,lnk,eo,lightTrackVars,_1_referrer,un';s.va_g=s.sp(s.vl_g,',');s.pg=pg;s.gl(s.vl_g);s.contextData=new Object;s.retrieveLightData=new Object;if(!ss)s.wds();i"
+"f(pg){s.wd.s_co=function(o){return o};s.wd.s_gs=function(un){s_gi(un,1,1).t()};s.wd.s_dc=function(un){s_gi(un,1).t()}}",
w=window,l=w.s_c_il,n=navigator,u=n.userAgent,v=n.appVersion,e=v.indexOf('MSIE '),m=u.indexOf('Netscape6/'),a,i,j,x,s;if(un){un=un.toLowerCase();if(l)for(j=0;j<2;j++)for(i=0;i<l.length;i++){s=l[i];x=s._c;if((!x||x=='s_c'||(j>0&&x=='s_l'))&&(s.oun==un||(s.fs&&s.sa&&s.fs(s.oun,un)))){if(s.sa)s.sa(un);if(x=='s_c')return s}else s=0}}w.s_an='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
w.s_sp=new Function("x","d","var a=new Array,i=0,j;if(x){if(x.split)a=x.split(d);else if(!d)for(i=0;i<x.length;i++)a[a.length]=x.substring(i,i+1);else while(i>=0){j=x.indexOf(d,i);a[a.length]=x.subst"
+"ring(i,j<0?x.length:j);i=j;if(i>=0)i+=d.length}}return a");
w.s_jn=new Function("a","d","var x='',i,j=a.length;if(a&&j>0){x=a[0];if(j>1){if(a.join)x=a.join(d);else for(i=1;i<j;i++)x+=d+a[i]}}return x");
w.s_rep=new Function("x","o","n","return s_jn(s_sp(x,o),n)");
w.s_d=new Function("x","var t='`^@$#',l=s_an,l2=new Object,x2,d,b=0,k,i=x.lastIndexOf('~~'),j,v,w;if(i>0){d=x.substring(0,i);x=x.substring(i+2);l=s_sp(l,'');for(i=0;i<62;i++)l2[l[i]]=i;t=s_sp(t,'');d"
+"=s_sp(d,'~');i=0;while(i<5){v=0;if(x.indexOf(t[i])>=0) {x2=s_sp(x,t[i]);for(j=1;j<x2.length;j++){k=x2[j].substring(0,1);w=t[i]+k;if(k!=' '){v=1;w=d[b+l2[k]]}x2[j]=w+x2[j].substring(1)}}if(v)x=s_jn("
+"x2,'');else{w=t[i]+' ';if(x.indexOf(w)>=0)x=s_rep(x,w,t[i]);i++;b+=62}}}return x");
w.s_fe=new Function("c","return s_rep(s_rep(s_rep(c,'\\\\','\\\\\\\\'),'\"','\\\\\"'),\"\\n\",\"\\\\n\")");
w.s_fa=new Function("f","var s=f.indexOf('(')+1,e=f.indexOf(')'),a='',c;while(s>=0&&s<e){c=f.substring(s,s+1);if(c==',')a+='\",\"';else if((\"\\n\\r\\t \").indexOf(c)<0)a+=c;s++}return a?'\"'+a+'\"':"
+"a");
w.s_ft=new Function("c","c+='';var s,e,o,a,d,q,f,h,x;s=c.indexOf('=function(');while(s>=0){s++;d=1;q='';x=0;f=c.substring(s);a=s_fa(f);e=o=c.indexOf('{',s);e++;while(d>0){h=c.substring(e,e+1);if(q){i"
+"f(h==q&&!x)q='';if(h=='\\\\')x=x?0:1;else x=0}else{if(h=='\"'||h==\"'\")q=h;if(h=='{')d++;if(h=='}')d--}if(d>0)e++}c=c.substring(0,s)+'new Function('+(a?a+',':'')+'\"'+s_fe(c.substring(o+1,e))+'\")"
+"'+c.substring(e+1);s=c.indexOf('=function(')}return c;");
c=s_d(c);if(e>0){a=parseInt(i=v.substring(e+5));if(a>3)a=parseFloat(i)}else if(m>0)a=parseFloat(u.substring(m+10));else a=parseFloat(v);if(a<5||v.indexOf('Opera')>=0||u.indexOf('Opera')>=0)c=s_ft(c);if(!s){s=new Object;if(!w.s_c_in){w.s_c_il=new Array;w.s_c_in=0}s._il=w.s_c_il;s._in=w.s_c_in;s._il[s._in]=s;w.s_c_in++;}s._c='s_c';(new Function("s","un","pg","ss",c))(s,un,pg,ss);return s}
function s_giqf(){var w=window,q=w.s_giq,i,t,s;if(q)for(i=0;i<q.length;i++){t=q[i];s=s_gi(t.oun);s.sa(t.un);s.setTagContainer(t.tagContainerName)}w.s_giq=0}s_giqf()

// Audience Manager
if("function"!=typeof DIL)DIL=function(a,d){var b=[],c,e;a!==Object(a)&&(a={});var f,g,i,o,r,p,j,t,u,E,y;f=a.partner;g=a.containerNSID;i=a.iframeAttachmentDelay;o=!!a.disableDestinationPublishingIframe;r=a.iframeAkamaiHTTPS;p=a.mappings;j=a.uuidCookie;t=!0===a.enableErrorReporting;u=a.visitorService;E=a.declaredId;y=!0===a.removeFinishedScriptsAndCallbacks;var F,G,B;F=!0===a.disableScriptAttachment;G=!0===a.disableDefaultRequest;B=a.afterResultForDefaultRequest;t&&DIL.errorModule.activate();var H=
!0===window._dil_unit_tests;(c=d)&&b.push(c+"");if(!f||"string"!=typeof f)return c="DIL partner is invalid or not specified in initConfig",DIL.errorModule.handleError({name:"error",message:c,filename:"dil.js"}),Error(c);c="DIL containerNSID is invalid or not specified in initConfig, setting to default of 0";if(g||"number"==typeof g)g=parseInt(g,10),!isNaN(g)&&0<=g&&(c="");c&&(g=0,b.push(c),c="");e=DIL.getDil(f,g);if(e instanceof DIL&&e.api.getPartner()==f&&e.api.getContainerNSID()==g)return e;if(this instanceof
DIL)DIL.registerDil(this,f,g);else return new DIL(a,"DIL was not instantiated with the 'new' operator, returning a valid instance with partner = "+f+" and containerNSID = "+g);var v={IS_HTTPS:"https:"==document.location.protocol,POST_MESSAGE_ENABLED:!!window.postMessage,COOKIE_MAX_EXPIRATION_DATE:"Tue, 19 Jan 2038 03:14:07 UTC"},C={stuffed:{}},k={},m={firingQueue:[],fired:[],firing:!1,sent:[],errored:[],reservedKeys:{sids:!0,pdata:!0,logdata:!0,callback:!0,postCallbackFn:!0,useImageRequest:!0},callbackPrefix:"demdexRequestCallback",
firstRequestHasFired:!1,useJSONP:!0,abortRequests:!1,num_of_jsonp_responses:0,num_of_jsonp_errors:0,num_of_img_responses:0,num_of_img_errors:0,toRemove:[],removed:[],readyToRemove:!1,adms:{TIME_TO_CATCH_ALL_REQUESTS_RELEASE:2E3,calledBack:!1,uuid:null,noVisitorAPI:!1,instance:null,releaseType:"no VisitorAPI",admsProcessingStarted:!1,process:function(h){try{if(!this.admsProcessingStarted){var a=this,l,s,c,d,b;if("function"==typeof h&&"function"==typeof h.getInstance){if(u===Object(u)&&(l=u.namespace)&&
"string"==typeof l)s=h.getInstance(l);else{this.releaseType="no namespace";this.releaseRequests();return}if(s===Object(s)&&"function"==typeof s.isAllowed&&"function"==typeof s.getGlobalVisitorID){if(!s.isAllowed()){this.releaseType="VisitorAPI not allowed";this.releaseRequests();return}this.instance=s;this.admsProcessingStarted=!0;c=function(h){if("VisitorAPI"!=a.releaseType)a.uuid=h,a.releaseType="VisitorAPI",a.releaseRequests()};if(H&&(d=u.server)&&"string"==typeof d)s.server=d;b=s.getGlobalVisitorID(c);
if("string"==typeof b&&b.length){c(b);return}setTimeout(function(){if("VisitorAPI"!=a.releaseType)a.releaseType="timeout",a.releaseRequests()},this.TIME_TO_CATCH_ALL_REQUESTS_RELEASE);return}this.releaseType="invalid instance"}else this.noVisitorAPI=!0;this.releaseRequests()}}catch(f){this.releaseRequests()}},releaseRequests:function(){this.calledBack=!0;m.registerRequest()},getGlobalVisitorID:function(){return this.instance?this.instance.getGlobalVisitorID():null}},declaredId:{uuid:null,declaredId:{init:null,
request:null},declaredIdCombos:{},dIdAlwaysOn:!1,dIdInRequest:!1,setDeclaredId:function(h,a){var l=q.isPopulatedString,c=encodeURIComponent;if(h===Object(h)&&l(a)){var b=h.dpid,d=h.dpuuid,f=null;if(l(b)&&l(d)){f=c(b)+"$"+c(d);if(!0===this.declaredIdCombos[f])return"setDeclaredId: combo exists for type '"+a+"'";this.declaredIdCombos[f]=!0;this.declaredId[a]={dpid:b,dpuuid:d};if("init"==a)this.dIdAlwaysOn=!0;else if("request"==a)this.dIdInRequest=!0;return"setDeclaredId: succeeded for type '"+a+"'"}}return"setDeclaredId: failed for type '"+
a+"'"},getDeclaredIdQueryString:function(){var h=this.declaredId.request,a=this.declaredId.init,l="";null!==h?l="&d_dpid="+h.dpid+"&d_dpuuid="+h.dpuuid:null!==a&&(l="&d_dpid="+a.dpid+"&d_dpuuid="+a.dpuuid);return l},getUUIDQueryString:function(){var h=m.adms,a=q.isPopulatedString,l=!1,b=m.adms.getGlobalVisitorID();if(a(this.uuid)){if(a(b)&&this.uuid!=b)this.uuid=b}else this.uuid=b||h.uuid;if(this.dIdAlwaysOn||this.dIdInRequest)l=!0,this.dIdInRequest=!1;return a(this.uuid)&&l?"d_uuid="+this.uuid+"&":
""}},registerRequest:function(h){var a=this.firingQueue;h===Object(h)&&a.push(h);if(!this.firing&&a.length)if(this.adms.calledBack){if(h=a.shift(),h.src=h.src.replace(/demdex.net\/event\?d_nsid=/,"demdex.net/event?"+this.declaredId.getUUIDQueryString()+"d_nsid="),w.fireRequest(h),!this.firstRequestHasFired&&"script"==h.tag)this.firstRequestHasFired=!0}else this.processVisitorAPI()},processVisitorAPI:function(){this.adms.process(window.Visitor)},requestRemoval:function(h){if(!y)return"removeFinishedScriptsAndCallbacks is not boolean true";
var a=this.toRemove,l,b;if(h===Object(h))l=h.script,b=h.callbackName,(l===Object(l)&&"SCRIPT"==l.nodeName||"no script created"==l)&&"string"==typeof b&&b.length&&a.push(h);if(this.readyToRemove&&a.length){b=a.shift();l=b.script;b=b.callbackName;"no script created"!=l?(h=l.src,l.parentNode.removeChild(l)):h=l;window[b]=null;try{delete window[b]}catch(c){}this.removed.push({scriptSrc:h,callbackName:b});DIL.variables.scriptsRemoved.push(h);DIL.variables.callbacksRemoved.push(b);return this.requestRemoval()}return"requestRemoval() processed"}};
e=function(){var h="http://fast.";v.IS_HTTPS&&(h=!0===r?"https://fast.":"https://");return h+f+".demdex.net/dest4.html?d_nsid="+g+"#"+encodeURIComponent(document.location.href)};var x={THROTTLE_START:3E4,throttleTimerSet:!1,id:"destination_publishing_iframe_"+f+"_"+g,url:e(),iframe:null,iframeHasLoaded:!1,sendingMessages:!1,messages:[],messagesPosted:[],messageSendingInterval:v.POST_MESSAGE_ENABLED?15:100,jsonProcessed:[],attachIframe:function(){var h=this,a=document.createElement("iframe");a.id=
this.id;a.style.cssText="display: none; width: 0; height: 0;";a.src=this.url;n.addListener(a,"load",function(){h.iframeHasLoaded=!0;h.requestToProcess()});document.body.appendChild(a);this.iframe=a},requestToProcess:function(h,a){var b=this;h&&!q.isEmptyObject(h)&&this.process(h,a);if(this.iframeHasLoaded&&this.messages.length&&!this.sendingMessages){if(!this.throttleTimerSet)this.throttleTimerSet=!0,setTimeout(function(){b.messageSendingInterval=v.POST_MESSAGE_ENABLED?15:150},this.THROTTLE_START);
this.sendingMessages=!0;this.sendMessages()}},process:function(h,a){var b=encodeURIComponent,c,d,f,e,g,j;a===Object(a)&&(j=n.encodeAndBuildRequest([m.declaredId.uuid||"",a.dpid||"",a.dpuuid||""],","));if((c=h.dests)&&c instanceof Array&&(d=c.length))for(f=0;f<d;f++)e=c[f],e=[b("dests"),b(e.id||""),b(e.y||""),b(e.c||"")],this.addMessage(e.join("|"));if((c=h.ibs)&&c instanceof Array&&(d=c.length))for(f=0;f<d;f++)e=c[f],e=[b("ibs"),b(e.id||""),b(e.tag||""),n.encodeAndBuildRequest(e.url||[],","),b(e.ttl||
""),"",j],this.addMessage(e.join("|"));if((c=h.dpcalls)&&c instanceof Array&&(d=c.length))for(f=0;f<d;f++)e=c[f],g=e.callback||{},g=[g.obj||"",g.fn||"",g.key||"",g.tag||"",g.url||""],e=[b("dpm"),b(e.id||""),b(e.tag||""),n.encodeAndBuildRequest(e.url||[],","),b(e.ttl||""),n.encodeAndBuildRequest(g,","),j],this.addMessage(e.join("|"));this.jsonProcessed.push(h)},addMessage:function(h){var a=encodeURIComponent;this.messages.push((t?a("---destpub-debug---"):a("---destpub---"))+h)},sendMessages:function(){var h=
this,a;this.messages.length?(a=this.messages.shift(),DIL.xd.postMessage(a,this.url,this.iframe.contentWindow),this.messagesPosted.push(a),setTimeout(function(){h.sendMessages()},this.messageSendingInterval)):this.sendingMessages=!1}},D={traits:function(h){if(q.isValidPdata(h)){if(!(k.sids instanceof Array))k.sids=[];n.extendArray(k.sids,h)}return this},pixels:function(h){if(q.isValidPdata(h)){if(!(k.pdata instanceof Array))k.pdata=[];n.extendArray(k.pdata,h)}return this},logs:function(h){if(q.isValidLogdata(h)){if(k.logdata!==
Object(k.logdata))k.logdata={};n.extendObject(k.logdata,h)}return this},customQueryParams:function(h){q.isEmptyObject(h)||n.extendObject(k,h,m.reservedKeys);return this},signals:function(h,a){var b,c=h;if(!q.isEmptyObject(c)){if(a&&"string"==typeof a)for(b in c={},h)h.hasOwnProperty(b)&&(c[a+b]=h[b]);n.extendObject(k,c,m.reservedKeys)}return this},declaredId:function(h){m.declaredId.setDeclaredId(h,"request");return this},result:function(h){if("function"==typeof h)k.callback=h;return this},afterResult:function(h){if("function"==
typeof h)k.postCallbackFn=h;return this},useImageRequest:function(){k.useImageRequest=!0;return this},clearData:function(){k={};return this},submit:function(){w.submitRequest(k);k={};return this},getPartner:function(){return f},getContainerNSID:function(){return g},getEventLog:function(){return b},getState:function(){var h={},a={};n.extendObject(h,m,{callbackPrefix:!0,useJSONP:!0,registerRequest:!0});n.extendObject(a,x,{attachIframe:!0,requestToProcess:!0,process:!0,sendMessages:!0});return{pendingRequest:k,
otherRequestInfo:h,destinationPublishingInfo:a}},idSync:function(a){if(a!==Object(a)||"string"!=typeof a.dpid||!a.dpid.length)return"Error: config or config.dpid is empty";if("string"!=typeof a.url||!a.url.length)return"Error: config.url is empty";var b=a.url,c=a.minutesToLive,d=encodeURIComponent,e=m.declaredId,b=b.replace(/^https:/,"").replace(/^http:/,"");if("undefined"==typeof c)c=20160;else if(c=parseInt(c,10),isNaN(c)||0>=c)return"Error: config.minutesToLive needs to be a positive number";e=
n.encodeAndBuildRequest([m.adms.getGlobalVisitorID()||e.uuid||"",a.dpid,a.dpuuid||""],",");a=["ibs",d(a.dpid),"img",d(b),c,"",e];x.addMessage(a.join("|"));m.firstRequestHasFired&&x.requestToProcess();return"Successfully queued"},aamIdSync:function(a){if(a!==Object(a)||"string"!=typeof a.dpuuid||!a.dpuuid.length)return"Error: config or config.dpuuid is empty";a.url="//dpm.demdex.net/ibs:dpid="+a.dpid+"&dpuuid="+a.dpuuid;return this.idSync(a)},passData:function(a){if(q.isEmptyObject(a))return"Error: json is empty or not an object";
w.defaultCallback(a);return"json submitted for processing"}},w={submitRequest:function(a){m.registerRequest(w.createQueuedRequest(a));return!0},createQueuedRequest:function(a){var b=m,c,d=a.callback,e="img";if(!q.isEmptyObject(p)){var z,j,i;for(z in p)if(p.hasOwnProperty(z)&&(j=p[z],!(null==j||""===j)&&z in a&&!(j in a)&&!(j in m.reservedKeys)))i=a[z],null==i||""===i||(a[j]=i)}if(!q.isValidPdata(a.sids))a.sids=[];if(!q.isValidPdata(a.pdata))a.pdata=[];if(!q.isValidLogdata(a.logdata))a.logdata={};
a.logdataArray=n.convertObjectToKeyValuePairs(a.logdata,"=",!0);a.logdataArray.push("_ts="+(new Date).getTime());if("function"!=typeof d)d=this.defaultCallback;if(b.useJSONP=!a.useImageRequest||"boolean"!=typeof a.useImageRequest)e="script",c=b.callbackPrefix+"_"+f+"_"+g+"_"+(new Date).getTime();return{tag:e,src:w.makeRequestSrc(a,c),internalCallbackName:c,callbackFn:d,postCallbackFn:a.postCallbackFn,useImageRequest:a.useImageRequest,requestData:a}},defaultCallback:function(a,b){var c,d,e,f,g,i,r,
k,p;if((c=a.stuff)&&c instanceof Array&&(d=c.length))for(e=0;e<d;e++)if((f=c[e])&&f===Object(f)){g=f.cn;i=f.cv;r=f.ttl;if("undefined"==typeof r||""===r)r=Math.floor(n.getMaxCookieExpiresInMinutes()/60/24);k=f.dmn||"."+document.domain.replace(/^www\./,"");p=f.type;if(g&&(i||"number"==typeof i))"var"!=p&&(r=parseInt(r,10))&&!isNaN(r)&&n.setCookie(g,i,1440*r,"/",k,!1),C.stuffed[g]=i}c=a.uuid;d=m.declaredId;e=q.isPopulatedString;if(e(c)){if(!e(d.uuid))d.uuid=c;if(!q.isEmptyObject(j)){d=j.path;if("string"!=
typeof d||!d.length)d="/";e=parseInt(j.days,10);isNaN(e)&&(e=100);n.setCookie(j.name||"aam_did",c,1440*e,d,j.domain||"."+document.domain.replace(/^www\./,""),!0===j.secure)}}!o&&!m.abortRequests&&x.requestToProcess(a,b)},makeRequestSrc:function(a,b){a.sids=q.removeEmptyArrayValues(a.sids||[]);a.pdata=q.removeEmptyArrayValues(a.pdata||[]);var c=m,d=n.encodeAndBuildRequest(a.sids,","),e=n.encodeAndBuildRequest(a.pdata,","),j=(a.logdataArray||[]).join("&");delete a.logdataArray;var i=v.IS_HTTPS?"https://":
"http://",r=c.declaredId.getDeclaredIdQueryString(),o;o=[];var k,p,t,u;for(k in a)if(!(k in c.reservedKeys)&&a.hasOwnProperty(k))if(p=a[k],k=encodeURIComponent(k),p instanceof Array)for(t=0,u=p.length;t<u;t++)o.push(k+"="+encodeURIComponent(p[t]));else o.push(k+"="+encodeURIComponent(p));o=o.length?"&"+o.join("&"):"";return i+f+".demdex.net/event?d_nsid="+g+r+(d.length?"&d_sid="+d:"")+(e.length?"&d_px="+e:"")+(j.length?"&d_ld="+encodeURIComponent(j):"")+o+(c.useJSONP?"&d_rtbd=json&d_jsonv="+DIL.jsonVersion+
"&d_dst=1&d_cts=1&d_cb="+(b||""):"")},fireRequest:function(a){if("img"==a.tag)this.fireImage(a);else if("script"==a.tag){var b=m.declaredId,b=b.declaredId.request||b.declaredId.init||{};this.fireScript(a,{dpid:b.dpid||"",dpuuid:b.dpuuid||""})}},fireImage:function(a){var d=m,e,f;if(!d.abortRequests)d.firing=!0,e=new Image(0,0),d.sent.push(a),e.onload=function(){d.firing=!1;d.fired.push(a);d.num_of_img_responses++;d.registerRequest()},f=function(e){c="imgAbortOrErrorHandler received the event of type "+
e.type;b.push(c);d.abortRequests=!0;d.firing=!1;d.errored.push(a);d.num_of_img_errors++;d.registerRequest()},e.addEventListener?(e.addEventListener("error",f,!1),e.addEventListener("abort",f,!1)):e.attachEvent&&(e.attachEvent("onerror",f),e.attachEvent("onabort",f)),e.src=a.src},fireScript:function(a,d){var e=this,g=m,j,i,o=a.src,r=a.postCallbackFn,k="function"==typeof r,p=a.internalCallbackName;if(!g.abortRequests)g.firing=!0,window[p]=function(e){try{e!==Object(e)&&(e={});var l=a.callbackFn;g.firing=
!1;g.fired.push(a);g.num_of_jsonp_responses++;l(e,d);k&&r(e,d)}catch(j){j.message="DIL jsonp callback caught error with message "+j.message;c=j.message;b.push(c);j.filename=j.filename||"dil.js";j.partner=f;DIL.errorModule.handleError(j);try{l({error:j.name+"|"+j.message}),k&&r({error:j.name+"|"+j.message})}catch(o){}}finally{g.requestRemoval({script:i,callbackName:p}),g.registerRequest()}},F?(g.firing=!1,g.requestRemoval({script:"no script created",callbackName:p})):(i=document.createElement("script"),
i.addEventListener&&i.addEventListener("error",function(b){g.requestRemoval({script:i,callbackName:p});c="jsonp script tag error listener received the event of type "+b.type+" with src "+o;e.handleScriptError(c,a)},!1),i.type="text/javascript",i.src=o,j=DIL.variables.scriptNodeList[0],j.parentNode.insertBefore(i,j)),g.sent.push(a),g.declaredId.declaredId.request=null},handleScriptError:function(a,c){var d=m;b.push(a);d.abortRequests=!0;d.firing=!1;d.errored.push(c);d.num_of_jsonp_errors++;d.registerRequest()}},
q={isValidPdata:function(a){return a instanceof Array&&this.removeEmptyArrayValues(a).length?!0:!1},isValidLogdata:function(a){return!this.isEmptyObject(a)},isEmptyObject:function(a){if(a!==Object(a))return!0;for(var b in a)if(a.hasOwnProperty(b))return!1;return!0},removeEmptyArrayValues:function(a){for(var b=0,d=a.length,c,e=[],b=0;b<d;b++)c=a[b],"undefined"!=typeof c&&null!=c&&e.push(c);return e},isPopulatedString:function(a){return"string"==typeof a&&a.length}},n={addListener:function(){if(document.addEventListener)return function(a,
b,d){a.addEventListener(b,function(a){"function"==typeof d&&d(a)},!1)};if(document.attachEvent)return function(a,b,d){a.attachEvent("on"+b,function(a){"function"==typeof d&&d(a)})}}(),convertObjectToKeyValuePairs:function(a,b,d){var c=[],b=b||"=",e,f;for(e in a)f=a[e],"undefined"!=typeof f&&null!=f&&c.push(e+b+(d?encodeURIComponent(f):f));return c},encodeAndBuildRequest:function(a,b){return this.map(a,function(a){return encodeURIComponent(a)}).join(b)},map:function(a,b){if(Array.prototype.map)return a.map(b);
if(void 0===a||null===a)throw new TypeError;var d=Object(a),c=d.length>>>0;if("function"!==typeof b)throw new TypeError;for(var e=Array(c),f=0;f<c;f++)f in d&&(e[f]=b.call(b,d[f],f,d));return e},filter:function(a,b){if(!Array.prototype.filter){if(void 0===a||null===a)throw new TypeError;var d=Object(a),c=d.length>>>0;if("function"!==typeof b)throw new TypeError;for(var e=[],f=0;f<c;f++)if(f in d){var g=d[f];b.call(b,g,f,d)&&e.push(g)}return e}return a.filter(b)},getCookie:function(a){var a=a+"=",
b=document.cookie.split(";"),d,c,e;for(d=0,c=b.length;d<c;d++){for(e=b[d];" "==e.charAt(0);)e=e.substring(1,e.length);if(0==e.indexOf(a))return decodeURIComponent(e.substring(a.length,e.length))}return null},setCookie:function(a,b,d,c,e,f){var g=new Date;d&&(d*=6E4);document.cookie=a+"="+encodeURIComponent(b)+(d?";expires="+(new Date(g.getTime()+d)).toUTCString():"")+(c?";path="+c:"")+(e?";domain="+e:"")+(f?";secure":"")},extendArray:function(a,b){return a instanceof Array&&b instanceof Array?(Array.prototype.push.apply(a,
b),!0):!1},extendObject:function(a,b,d){var c;if(a===Object(a)&&b===Object(b)){for(c in b)if(b.hasOwnProperty(c)&&(q.isEmptyObject(d)||!(c in d)))a[c]=b[c];return!0}return!1},getMaxCookieExpiresInMinutes:function(){return((new Date(v.COOKIE_MAX_EXPIRATION_DATE)).getTime()-(new Date).getTime())/1E3/60}};"error"==f&&0==g&&n.addListener(window,"load",function(){DIL.windowLoaded=!0});var A=function(){J();!o&&!m.abortRequests&&x.attachIframe();m.readyToRemove=!0;m.requestRemoval()},J=function(){o||setTimeout(function(){!G&&
!m.firstRequestHasFired&&!m.adms.admsProcessingStarted&&!m.adms.calledBack&&("function"==typeof B?D.afterResult(B).submit():D.submit())},DIL.constants.TIME_TO_DEFAULT_REQUEST)},I=document;"error"!=f&&(DIL.windowLoaded?A():"complete"!=I.readyState&&"loaded"!=I.readyState?n.addListener(window,"load",A):DIL.isAddedPostWindowLoadWasCalled?n.addListener(window,"load",A):(i="number"==typeof i?parseInt(i,10):0,0>i&&(i=0),setTimeout(A,i||DIL.constants.TIME_TO_CATCH_ALL_DP_IFRAME_ATTACHMENT)));m.declaredId.setDeclaredId(E,
"init");this.api=D;this.getStuffedVariable=function(a){var b=C.stuffed[a];!b&&"number"!=typeof b&&(b=n.getCookie(a),!b&&"number"!=typeof b&&(b=""));return b};this.validators=q;this.helpers=n;this.constants=v;this.log=b;if(H)this.pendingRequest=k,this.requestController=m,this.setDestinationPublishingUrl=e,this.destinationPublishing=x,this.requestProcs=w,this.variables=C},function(){var a=document,d;if(null==a.readyState&&a.addEventListener)a.readyState="loading",a.addEventListener("DOMContentLoaded",
d=function(){a.removeEventListener("DOMContentLoaded",d,!1);a.readyState="complete"},!1)}(),DIL.extendStaticPropertiesAndMethods=function(a){var d;if(a===Object(a))for(d in a)a.hasOwnProperty(d)&&(this[d]=a[d])},DIL.extendStaticPropertiesAndMethods({version:"4.5",jsonVersion:1,constants:{TIME_TO_DEFAULT_REQUEST:50,TIME_TO_CATCH_ALL_DP_IFRAME_ATTACHMENT:500},variables:{scriptNodeList:document.getElementsByTagName("script"),scriptsRemoved:[],callbacksRemoved:[]},windowLoaded:!1,dils:{},isAddedPostWindowLoadWasCalled:!1,
isAddedPostWindowLoad:function(a){this.isAddedPostWindowLoadWasCalled=!0;this.windowLoaded="function"==typeof a?!!a():"boolean"==typeof a?a:!0},create:function(a){try{return new DIL(a)}catch(d){return(new Image(0,0)).src="http://error.demdex.net/event?d_nsid=0&d_px=14137&d_ld=name%3Derror%26filename%3Ddil.js%26partner%3Dno_partner%26message%3DError%2520in%2520attempt%2520to%2520create%2520DIL%2520instance%2520with%2520DIL.create()%26_ts%3D"+(new Date).getTime(),Error("Error in attempt to create DIL instance with DIL.create()")}},
registerDil:function(a,d,b){d=d+"$"+b;d in this.dils||(this.dils[d]=a)},getDil:function(a,d){var b;"string"!=typeof a&&(a="");d||(d=0);b=a+"$"+d;return b in this.dils?this.dils[b]:Error("The DIL instance with partner = "+a+" and containerNSID = "+d+" was not found")},dexGetQSVars:function(a,d,b){d=this.getDil(d,b);return d instanceof this?d.getStuffedVariable(a):""},xd:{postMessage:function(a,d,b){var c=1;if(d)if(window.postMessage)b.postMessage(a,d.replace(/([^:]+:\/\/[^\/]+).*/,"$1"));else if(d)b.location=
d.replace(/#.*$/,"")+"#"+ +new Date+c++ +"&"+a}}}),DIL.errorModule=function(){var a=DIL.create({partner:"error",containerNSID:0,disableDestinationPublishingIframe:!0}),d={harvestererror:14138,destpuberror:14139,dpmerror:14140,generalerror:14137,error:14137,noerrortypedefined:15021,evalerror:15016,rangeerror:15017,referenceerror:15018,typeerror:15019,urierror:15020},b=!1;return{activate:function(){b=!0},handleError:function(c){if(!b)return"DIL error module has not been activated";c!==Object(c)&&(c=
{});var e=c.name?(new String(c.name)).toLowerCase():"",f=[],c={name:e,filename:c.filename?c.filename+"":"",partner:c.partner?c.partner+"":"no_partner",site:c.site?c.site+"":document.location.href,message:c.message?c.message+"":""};f.push(e in d?d[e]:d.noerrortypedefined);a.api.pixels(f).logs(c).useImageRequest().submit();return"DIL error report sent"},pixelMap:d}}(),DIL.tools={},DIL.modules={helpers:{handleModuleError:function(a,d,b){var c="",d=d||"Error caught in DIL module/submodule: ";a===Object(a)?
c=d+(a.message||"err has no message"):(c=d+"err is not a valid object",a={});a.message=c;if(b instanceof DIL)a.partner=b.api.getPartner();DIL.errorModule.handleError(a);return this.errorMessage=c}}};
DIL.tools.getSearchReferrer=function(a,d){var b=DIL.getDil("error"),c=DIL.tools.decomposeURI(a||document.referrer),e="",f="",g={queryParam:"q"},e=b.helpers.filter([d===Object(d)?d:{},{hostPattern:/aol\./},{hostPattern:/ask\./},{hostPattern:/bing\./},{hostPattern:/google\./},{hostPattern:/yahoo\./,queryParam:"p"}],function(a){return!(!a.hasOwnProperty("hostPattern")||!c.hostname.match(a.hostPattern))}).shift();return!e?{valid:!1,name:"",keywords:""}:{valid:!0,name:c.hostname,keywords:(b.helpers.extendObject(g,
e),f=g.queryPattern?(e=(""+c.search).match(g.queryPattern))?e[1]:"":c.uriParams[g.queryParam],decodeURIComponent(f||"").replace(/\+|%20/g," "))}};
DIL.tools.decomposeURI=function(a){var d=DIL.getDil("error"),b=document.createElement("a");b.href=a||document.referrer;return{hash:b.hash,host:b.host.split(":").shift(),hostname:b.hostname,href:b.href,pathname:b.pathname.replace(/^\//,""),protocol:b.protocol,search:b.search,uriParams:function(a,b){d.helpers.map(b.split("&"),function(b){b=b.split("=");a[b.shift()]=b.shift()});return a}({},b.search.replace(/^(\/|\?)?|\/$/g,""))}};
DIL.tools.getMetaTags=function(){var a={},d=document.getElementsByTagName("meta"),b,c,e,f,g;for(b=0,e=arguments.length;b<e;b++)if(f=arguments[b],null!==f)for(c=0;c<d.length;c++)if(g=d[c],g.name==f){a[f]=g.content;break}return a};
DIL.modules.siteCatalyst={dil:null,handle:DIL.modules.helpers.handleModuleError,init:function(a,d,b){try{var c=this,e={name:"DIL Site Catalyst Module Error"},f=function(a){e.message=a;DIL.errorModule.handleError(e);return a};this.dil=null;if(d instanceof DIL)this.dil=d;else return f("dilInstance is not a valid instance of DIL");e.partner=d.api.getPartner();if(a!==Object(a))return f("siteCatalystReportingSuite is not an object");if("function"!=typeof a.m_i||"function"!=typeof a.loadModule)return f("s.m_i is not a function or s.loadModule is not a function");
a.m_DIL=function(a){a=a.m_i("DIL");if(a!==Object(a))return f("m is not an object");a.trackVars=c.constructTrackVars(b);a.d=0;a._t=function(){var a,b,d=","+this.trackVars+",",c=this.s,e,g=[];e=[];var i={},y=!1;if(c!==Object(c)||!(c.va_t instanceof Array))return f("Error in m._t function: s is not an object or s.va_t is not an array");if(this.d){if(c.lightProfileID)(a=c.lightTrackVars)&&(a=","+a+","+c.vl_mr+",");else if(c.pe||c.linkType){a=c.linkTrackVars;if(c.pe&&(b=c.pe.substring(0,1).toUpperCase()+
c.pe.substring(1),c[b]))a=c[b].trackVars;a&&(a=","+a+","+c.vl_l+","+c.vl_l2+",")}if(a){for(b=0,g=a.split(",");b<g.length;b++)0<=d.indexOf(","+g[b]+",")&&e.push(g[b]);e.length&&(d=","+e.join(",")+",")}for(e=0,b=c.va_t.length;e<b;e++)a=c.va_t[e],0<=d.indexOf(","+a+",")&&null!=c[a]&&""!==c[a]&&(i[a]=c[a],y=!0);y&&this.d.api.signals(i,"c_").submit()}};a.setup=function(){this.d=d}};a.loadModule("DIL");if(a.DIL!==Object(a.DIL)||"function"!=typeof a.DIL.setup)return f("s.DIL is not an object or s.DIL.setup is not a function");
a.DIL.setup();if(e.message)return e.message}catch(g){return this.handle(g,"DIL.modules.siteCatalyst.init() caught error with message ",this.dil)}},constructTrackVars:function(a){var d=[],b,c,e,f,g;if(a===Object(a)){b=a.names;if(b instanceof Array&&(e=b.length))for(c=0;c<e;c++)f=b[c],"string"==typeof f&&f.length&&d.push(f);a=a.iteratedNames;if(a instanceof Array&&(e=a.length))for(c=0;c<e;c++)if(b=a[c],b===Object(b)&&(f=b.name,g=parseInt(b.maxIndex,10),"string"==typeof f&&f.length&&!isNaN(g)&&0<=g))for(b=
0;b<=g;b++)d.push(f+b);if(d.length)return d.join(",")}return this.constructTrackVars({names:"pageName,channel,campaign,products,events,pe,pev1,pev2,pev3".split(","),iteratedNames:[{name:"prop",maxIndex:75},{name:"eVar",maxIndex:75}]})}};
DIL.modules.GA={dil:null,arr:null,tv:null,errorMessage:"",defaultTrackVars:["_setAccount","_setCustomVar","_addItem","_addTrans","_trackSocial"],defaultTrackVarsObj:null,signals:{},hasSignals:!1,handle:DIL.modules.helpers.handleModuleError,init:function(a,d,b){try{this.tv=this.arr=this.dil=null;this.errorMessage="";this.signals={};this.hasSignals=!1;var c={name:"DIL GA Module Error"},e="";d instanceof DIL?(this.dil=d,c.partner=this.dil.api.getPartner()):(e="dilInstance is not a valid instance of DIL",
c.message=e,DIL.errorModule.handleError(c));!(a instanceof Array)||!a.length?(e="gaArray is not an array or is empty",c.message=e,DIL.errorModule.handleError(c)):this.arr=a;this.tv=this.constructTrackVars(b);this.errorMessage=e}catch(f){this.handle(f,"DIL.modules.GA.init() caught error with message ",this.dil)}finally{return this}},constructTrackVars:function(a){var d=[],b,c,e,f;if(this.defaultTrackVarsObj!==Object(this.defaultTrackVarsObj)){e=this.defaultTrackVars;f={};for(b=0,c=e.length;b<c;b++)f[e[b]]=
!0;this.defaultTrackVarsObj=f}else f=this.defaultTrackVarsObj;if(a===Object(a)){a=a.names;if(a instanceof Array&&(c=a.length))for(b=0;b<c;b++)e=a[b],"string"==typeof e&&e.length&&e in f&&d.push(e);if(d.length)return d}return this.defaultTrackVars},constructGAObj:function(a){var d={},a=a instanceof Array?a:this.arr,b,c,e,f;for(b=0,c=a.length;b<c;b++)e=a[b],e instanceof Array&&e.length&&(e=[],f=a[b],e instanceof Array&&f instanceof Array&&Array.prototype.push.apply(e,f),f=e.shift(),"string"==typeof f&&
f.length&&(d[f]instanceof Array||(d[f]=[]),d[f].push(e)));return d},addToSignals:function(a,d){if("string"!=typeof a||""===a||null==d||""===d)return!1;this.signals[a]instanceof Array||(this.signals[a]=[]);this.signals[a].push(d);return this.hasSignals=!0},constructSignals:function(){var a=this.constructGAObj(),d={_setAccount:function(a){this.addToSignals("c_accountId",a)},_setCustomVar:function(a,b,c){"string"==typeof b&&b.length&&this.addToSignals("c_"+b,c)},_addItem:function(a,b,c,d,e,f){this.addToSignals("c_itemOrderId",
a);this.addToSignals("c_itemSku",b);this.addToSignals("c_itemName",c);this.addToSignals("c_itemCategory",d);this.addToSignals("c_itemPrice",e);this.addToSignals("c_itemQuantity",f)},_addTrans:function(a,b,c,d,e,f,g,i){this.addToSignals("c_transOrderId",a);this.addToSignals("c_transAffiliation",b);this.addToSignals("c_transTotal",c);this.addToSignals("c_transTax",d);this.addToSignals("c_transShipping",e);this.addToSignals("c_transCity",f);this.addToSignals("c_transState",g);this.addToSignals("c_transCountry",
i)},_trackSocial:function(a,b,c,d){this.addToSignals("c_socialNetwork",a);this.addToSignals("c_socialAction",b);this.addToSignals("c_socialTarget",c);this.addToSignals("c_socialPagePath",d)}},b=this.tv,c,e,f,g,i,o;for(c=0,e=b.length;c<e;c++)if(f=b[c],a.hasOwnProperty(f)&&d.hasOwnProperty(f)&&(o=a[f],o instanceof Array))for(g=0,i=o.length;g<i;g++)d[f].apply(this,o[g])},submit:function(){try{if(""!==this.errorMessage)return this.errorMessage;this.constructSignals();return this.hasSignals?(this.dil.api.signals(this.signals).submit(),
"Signals sent: "+this.dil.helpers.convertObjectToKeyValuePairs(this.signals,"=",!0)+this.dil.log):"No signals present"}catch(a){return this.handle(a,"DIL.modules.GA.submit() caught error with message ",this.dil)}},Stuffer:{LIMIT:5,dil:null,cookieName:null,delimiter:null,errorMessage:"",handle:DIL.modules.helpers.handleModuleError,callback:null,v:function(){return!1},init:function(a,d,b){try{this.callback=this.dil=null,this.errorMessage="",a instanceof DIL?(this.dil=a,this.v=this.dil.validators.isPopulatedString,
this.cookieName=this.v(d)?d:"aam_ga",this.delimiter=this.v(b)?b:"|"):this.handle({message:"dilInstance is not a valid instance of DIL"},"DIL.modules.GA.Stuffer.init() error: ")}catch(c){this.handle(c,"DIL.modules.GA.Stuffer.init() caught error with message ",this.dil)}finally{return this}},process:function(a){var d,b,c,e,f,g;g=!1;var i=1;if(a===Object(a)&&(d=a.stuff)&&d instanceof Array&&(b=d.length))for(a=0;a<b;a++)if((c=d[a])&&c===Object(c))if(e=c.cn,f=c.cv,e==this.cookieName&&this.v(f)){g=!0;break}if(g){d=
f.split(this.delimiter);if("undefined"==typeof window._gaq)window._gaq=[];c=window._gaq;for(a=0,b=d.length;a<b&&!(g=d[a].split("="),f=g[0],g=g[1],this.v(f)&&this.v(g)&&c.push(["_setCustomVar",i++,f,g,1]),i>this.LIMIT);a++);this.errorMessage=1<i?"No errors - stuffing successful":"No valid values to stuff"}else this.errorMessage="Cookie name and value not found in json";if("function"==typeof this.callback)return this.callback()},submit:function(){try{var a=this;if(""!==this.errorMessage)return this.errorMessage;
this.dil.api.afterResult(function(b){a.process(b)}).submit();return"DIL.modules.GA.Stuffer.submit() successful"}catch(d){return this.handle(d,"DIL.modules.GA.Stuffer.submit() caught error with message ",this.dil)}}}};
DIL.modules.Peer39={aid:"",dil:null,optionals:null,errorMessage:"",calledBack:!1,script:null,scriptsSent:[],returnedData:[],handle:DIL.modules.helpers.handleModuleError,init:function(a,d,b){try{this.dil=null;this.errorMessage="";this.calledBack=!1;this.optionals=b===Object(b)?b:{};var b={name:"DIL Peer39 Module Error"},c=[],e="";if(this.isSecurePageButNotEnabled(document.location.protocol))e="Module has not been enabled for a secure page",c.push(e),b.message=e,DIL.errorModule.handleError(b);d instanceof
DIL?(this.dil=d,b.partner=this.dil.api.getPartner()):(e="dilInstance is not a valid instance of DIL",c.push(e),b.message=e,DIL.errorModule.handleError(b));"string"!=typeof a||!a.length?(e="aid is not a string or is empty",c.push(e),b.message=e,DIL.errorModule.handleError(b)):this.aid=a;this.errorMessage=c.join("\n")}catch(f){this.handle(f,"DIL.modules.Peer39.init() caught error with message ",this.dil)}finally{return this}},isSecurePageButNotEnabled:function(a){return"https:"==a&&!0!==this.optionals.enableHTTPS?
!0:!1},constructSignals:function(){var a=this,d=this.constructScript(),b=DIL.variables.scriptNodeList[0];window["afterFinished_"+this.aid]=function(){try{var b=a.processData(p39_KVP_Short("c_p","|").split("|"));b.hasSignals&&a.dil.api.signals(b.signals).submit()}catch(d){}finally{a.calledBack=!0,"function"==typeof a.optionals.afterResult&&a.optionals.afterResult()}};b.parentNode.insertBefore(d,b);this.scriptsSent.push(d);return"Request sent to Peer39"},processData:function(a){var d,b,c,e,f={},g=!1;
this.returnedData.push(a);if(a instanceof Array)for(d=0,b=a.length;d<b;d++)c=a[d].split("="),e=c[0],c=c[1],e&&isFinite(c)&&!isNaN(parseInt(c,10))&&(f[e]instanceof Array||(f[e]=[]),f[e].push(c),g=!0);return{hasSignals:g,signals:f}},constructScript:function(){var a=document.createElement("script"),d=this.optionals,b=d.scriptId,c=d.scriptSrc,d=d.scriptParams;a.id="string"==typeof b&&b.length?b:"peer39ScriptLoader";a.type="text/javascript";"string"==typeof c&&c.length?a.src=c:(a.src=(this.dil.constants.IS_HTTPS?
"https:":"http:")+"//stags.peer39.net/"+this.aid+"/trg_"+this.aid+".js","string"==typeof d&&d.length&&(a.src+="?"+d));return a},submit:function(){try{return""!==this.errorMessage?this.errorMessage:this.constructSignals()}catch(a){return this.handle(a,"DIL.modules.Peer39.submit() caught error with message ",this.dil)}}};

var suncorpDil = DIL.create({
 partner : "suncorp",
      containerNSID : 0
});

var _scDilObj = s_gi(s_account);
DIL.modules.siteCatalyst.init(_scDilObj, suncorpDil, {
names: ['pageName', 'channel', 'campaign', 'products', 'events', 'pe', 'referrer', 'server', 'purchaseID', 'zip', 'state'],
            iteratedNames: [{
               name: 'eVar',
               maxIndex: 75
            }, {
               name: 'prop',
               maxIndex: 75
            }, {
               name: 'pev',
               maxIndex: 3
            }, {
               name: 'hier',
               maxIndex: 4
            }]
});

/* You may give each page an identifying name, server, and channel on
the next lines. */
s.pageName = ""
s.server = ""
s.channel = ""
s.pageType = ""
s.prop1 = ""
s.prop2 = ""
s.prop3 = ""
s.prop4 = ""
s.prop5 = ""

/* Conversion Variables */
s.campaign = ""
s.state = ""
s.zip = ""
s.events = ""
s.products = ""
s.purchaseID = ""
s.eVar1 = ""
s.eVar2 = ""
s.eVar3 = ""
s.eVar4 = ""
s.eVar5 = ""

/* Hierarchy Variables */
s.hier1 = ""
