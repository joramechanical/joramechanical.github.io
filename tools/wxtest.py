import asyncio,json
from playwright.async_api import async_playwright
U='http://localhost:8765/site-preview/index.html'
C=[('Toronto, ON',43.65,-79.38,63,8,1),('Mississauga, ON',43.59,-79.64,73,-2,1),('Calgary, AB',51.05,-114.07,0,-18,1),('Regina, SK',50.45,-104.6,1,-24,1),
   ('Vancouver, BC',49.28,-123.12,61,9,1),('Halifax, NS',44.65,-63.57,45,4,1),('Winnipeg, MB',49.9,-97.14,95,22,1),('Montreal, QC',45.5,-73.57,0,31,1),('Ottawa, ON (night)',45.42,-75.7,0,-5,0)]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for name,lat,lon,code,temp,day in C:
            ctx=await b.new_context(viewport={'width':1280,'height':800});seen={}
            def mk_geo(lat,lon,name):
             async def geo(r):
                await r.fulfill(status=200,content_type='application/json',headers={'Access-Control-Allow-Origin':'*'},body=json.dumps({'latitude':str(lat),'longitude':str(lon),'country_code':'CA','city':name.split(',')[0],'region':name.split(',')[1]}))
             return geo
            def mk_met(code,temp,day):
             async def met(r):
                seen['url']=r.request.url
                await r.fulfill(status=200,content_type='application/json',headers={'Access-Control-Allow-Origin':'*'},body=json.dumps({'current':{'temperature_2m':temp,'weather_code':code,'is_day':day}}))
             return met
            await ctx.route('**/get.geojs.io/**',mk_geo(lat,lon,name));await ctx.route('**/api.open-meteo.com/**',mk_met(code,temp,day));await ctx.route('**/fonts.g*/**',lambda r:r.abort())
            pg=await ctx.new_page();await pg.goto(U);await pg.wait_for_timeout(1500)
            cls=await pg.evaluate('document.body.className');mode=await pg.evaluate('document.getElementById("tMode").textContent')
            ok='latitude=%s'%lat in seen.get('url','')
            print(f'{name:22} code={code:3} {temp:4}°C -> {cls:28} thermostat={mode:5} weather-for-right-place={ok}')
            if name.startswith(('Calgary','Winnipeg','Vancouver','Ottawa')):await pg.screenshot(path='shots/wx_'+name.split(',')[0].split()[0]+'.png')
            # second page uses the cached weather
            await pg.goto('http://localhost:8765/site-preview/furnaces/index.html');await pg.wait_for_timeout(500)
            c2=await pg.evaluate('document.body.className')
            if c2!=cls: print('   cache mismatch on 2nd page:',c2)
            await ctx.close()
        await b.close()
asyncio.run(main())
