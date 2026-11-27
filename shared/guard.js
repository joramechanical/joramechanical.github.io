/* Jora guard: the website only runs on its own address and can't be shown inside another site */
(function(){try{var h=location.hostname,ok=["joramechanicalsystems.com","www.joramechanicalsystems.com","joramechanical.github.io","localhost","127.0.0.1"];
if(ok.indexOf(h)<0&&!/\.localhost$/.test(h)){document.documentElement.style.display="none";location.replace("https://joramechanicalsystems.com/");return}
if(window.top!==window.self){document.documentElement.style.display="none";try{window.top.location.replace(window.self.location.href)}catch(e){}}}catch(e){}})();
