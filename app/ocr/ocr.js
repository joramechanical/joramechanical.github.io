/* Jora document reader: Tesseract OCR running inside the browser (nothing is uploaded anywhere) */
var M=null,api=null,ready=null;
function init(){if(ready)return ready;ready=(async function(){
  var simd=false;try{simd=WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]))}catch(e){}
  importScripts(simd?"tesseract-core-simd-lstm.wasm.js":"tesseract-core-lstm.wasm.js");
  M=await TesseractCore();var r=await fetch("eng.traineddata");if(!r.ok)throw new Error("language file "+r.status);
  M.FS.writeFile("/eng.traineddata",new Uint8Array(await r.arrayBuffer()));api=new M.TessBaseAPI();if(api.Init(null,"eng"))throw new Error("init failed")})();
  ready.catch(function(){ready=null});return ready}
onmessage=async function(e){var d=e.data;try{await init();M.FS.writeFile("/input",new Uint8Array(d.img));api.SetImageFile(1,0);api.Recognize(null);postMessage({id:d.id,text:api.GetUTF8Text()})}catch(err){postMessage({id:d.id,error:String(err&&err.message||err)})}};
