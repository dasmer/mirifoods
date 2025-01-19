document.getElementById('current-year').textContent = new Date().getFullYear();

// Mixpanel
(function(f, b){
  if(!b.__SV){
    var a, e, i, g; window.mixpanel = b; b._i = [];
    b.init = function(a, e, d){
      function f(b, h){
        var a = h.split("."); 
        if(a.length == 2) b = b[a[0]], h = a[1];
        b[h] = function(){ b.push([h].concat(Array.prototype.slice.call(arguments, 0))) };
      }
      var c = b; 
      if (typeof d !== "undefined") c = b[d] = []; 
      d = "mixpanel"; c.people = c.people || []; 
      c.toString = function(b){ 
        var a = "mixpanel"; 
        if (d !== "mixpanel") a += "." + d; 
        if(!b) a += " (stub)"; 
        return a; 
      }; 
      c.people.toString = function(){ return c.toString(1) + ".people (stub)"; };
      i = "disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
      for(g=0; g<i.length; g++) f(c, i[g]);
      b._i.push([a, e, d]);
    };
    b.__SV = 1.2; 
    a = f.createElement("script"); 
    a.type = "text/javascript"; 
    a.async = !0;
    a.src = "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
    e = f.getElementsByTagName("script")[0]; 
    e.parentNode.insertBefore(a, e);
  }
})(document, window.mixpanel || []);

// Track page view and link clicks
if (window.location.protocol !== 'file:' && window.location.hostname !== 'localhost') {
  mixpanel.init("14db4f18db54e5ccf3fb2a2336ab86ab");

  mixpanel.track("Home – Page View");

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        mixpanel.track("Home – Link Click", { href: link.href });
      });
    });
  });
}
