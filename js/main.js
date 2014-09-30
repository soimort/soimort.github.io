// block IE (versions before 9.0)
{
    var userAgent = navigator.userAgent.toLowerCase();
    var browser = {
        version: (userAgent.match(/(?:firefox|opera|safari|chrome|msie)[\/: ]([\d.]+)/))[1],
        safari: /version.+safari/.test(userAgent),
        chrome: /chrome/.test(userAgent),
        firefox: /firefox/.test(userAgent),
        ie: /msie/.test(userAgent),
        opera: /opera/.test(userAgent)
    }
    if (browser.ie && browser.version < 9) {
        alert("Sorry, but this site appears to be too cool for your web browser(>_<)\nPlease use one of these recommended browsers instead:\n\nGoogle Chrome\nApple Safari\nMozilla Firefox\nMicrosoft Internet Explorer 9.0 or later");
        window.location = "http://www.google.com/chrome";
    }
}

// add Google +1 button
{
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
}

// add Coderwall badges
(function(){
    var appendCoderwallBadge = function(){
        var coderwallJSONurl ="http://www.coderwall.com/soimort.json?callback=?"
          , size = 32
          ;

        $.getJSON(coderwallJSONurl, function(data) {
            $.each(data.data.badges, function(i, item){
                var a = $("<a>")
                    .attr("href", "http://www.coderwall.com/soimort/")
                    .attr("target", "_blank")
                    ;

                $("<img>").attr("src", item.badge)
                    .attr("float", "left")
                    .attr("title", item.name + ": " + item.description)
                    .attr("alt", item.name)
                    .attr("height", size)
                    .attr("width", size)
                    .hover(
                        function(){ $(this).css("opacity", "0.6"); }
                      , function(){ $(this).css("opacity", "1.0"); }
                    )
//                    .click( function(){ window.location = "http://www.coderwall.com/soimort/"; })
                    .appendTo(a)
                    ;
                $("#coderwall").append(a);
            });
        });
    };

    $(function(){
       appendCoderwallBadge();
    });

}());

function lock() {
    var divMask = document.createElement("div");
    divMask.id = "mask";

    var divMaskText = document.createElement("div");
    divMaskText.id = "maskText";

    var textMessage = document.createTextNode("啊拉拉，这篇文章包含的信息已经过时了(´д`;)"); 
    divMaskText.appendChild(textMessage);

    var br = document.createElement("br");
    divMaskText.appendChild(br);

    var aBack = document.createElement("a");
    aBack.href = "/";
    aBack.innerHTML = "< 去看点别的吧";
    divMaskText.appendChild(aBack);

    var p = document.createElement("p");
    p.innerHTML = "使用 <code>javascript:unlock()</code> 解锁归档页面。";
    //divMaskText.appendChild(p);

    document.getElementById("articlePost").appendChild(divMask);
    document.getElementById("articlePost").appendChild(divMaskText);
}

function unlock() {
    document.getElementById("articlePost").removeChild(document.getElementById("mask"));
    document.getElementById("articlePost").removeChild(document.getElementById("maskText"));
    return "Really?! So you wanna read me anyway?";
}
