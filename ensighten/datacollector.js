/* Dalicious */
window.d = {};

/* DATACOLLECTOR: CONFIG */
window.superT = {};

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

d.replaceAll = function(input,stringToFind,stringToReplaceWith){myRegExp=new RegExp(stringToFind, 'g');return input.replace(myRegExp, stringToReplaceWith);};

/* DATACOLLECTOR: Fire Datacollector when Quote is Saved  */
d.triggerQuoteSaved = function() {
    if((scEventExists("event36") || scEventExists("event72")) && d.getCookie('dl_qs') != 'true'){
       d.triggerDataCollectorAdserver(true, undefined, d.getAmount("event19"), s.eVar61, 'quote-saved');
       superT.setCookie('dl_qs', 'true', '', superT.getTopDomain());
    }
};

/* DATACOLLECTOR: FUNCTION TO FIRE PIXEL */
d.triggerDataCollector = function(conversion, event, premium, eVar61, eventType) {
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
};

d.iframeTag = function(url) {
    var divTag = document.createElement('div');
    randomID = 'iframeTag' + Math.floor(Math.random() * 10000000000000);
    divTag.id = randomID;
    divTag.style.display = 'none';
    divTag.innerHTML = '<iframe src="' + url + '" width="1" height="1" frameborder="0"></iframe>';
    document.body.appendChild(divTag);
};

d.maTag = function() {
    var u1 = ';u1=',
        u2 = ';u2=',
        u3 = ';u3=',
        u4 = ';u4=',
        u5 = ';u5=';

    var eventType = '';
    var events = dataLayer.events.join(',');
    if (/LEAD|QUOTE|BUY/i.test(events)) {
        if (dataLayer.events.indexOf('LEAD_STARTED') > -1) {
            eventType = 'lead-start';
        } else if (dataLayer.events.indexOf('LEAD_COMPLETED') > -1) {
            eventType = 'lead-complete';
        } else if (dataLayer.events.indexOf('QUOTE_STARTED') > -1) {
            eventType = 'quote-start';
        } else if (dataLayer.events.indexOf('QUOTE_COMPLETED') > -1) {
            eventType = 'quote-end';
            u2 += dataLayer.dataModel.premiumAmount;
        } else if (dataLayer.events.indexOf('BUY_STARTED') > -1) {
            eventType = 'buy-start';
        } else if (dataLayer.events.indexOf('BUY_COMPLETED') > -1) {
            eventType = 'buy-end';
            u2 += dataLayer.dataModel.premiumAmount;
        } 
        var pString = s.products || '';
        u1 += (dataLayer.siteID + ':' + eventType + d.replaceAll(pString, ';', ':'));
        u3 += s.eVar61;
        if (s.eVar62) u3 += ('|' + s.eVar62);
        u4 += escape(document.location.href);
        u5 += escape(document.referrer);
        var url = "//fls.doubleclick.net/activityi;src=875382;type=custo866;cat=singl081";
        url = url + u1 + u2 + u3 + u4 + u5 + ";ord=" + Math.floor(Math.random() * 11111111111) + "?";
        d.iframeTag(url);
        d.triggerDataCollector(true, u1, u2, u3, 'MA', eventType);
    } else {
        d.triggerDataCollector(false);
    }
};
