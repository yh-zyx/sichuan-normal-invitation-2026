(() => {
  const diagnostic = location.hash === '#share-debug' || new URLSearchParams(location.search).has('wechat_debug');
  const status = window.invitationShareStatus = { version: '20261016-2', state: 'loading', sdk: 'loading', signature: 'loading' };
  if (diagnostic) {
    const box = document.getElementById('wechat-diagnostic') || document.createElement('pre');
    box.style.cssText = 'position:fixed;bottom:12px;left:10px;right:10px;z-index:99999;background:#fff;color:#111;padding:12px;font:12px/1.5 monospace;white-space:pre-wrap;max-height:45vh;overflow:auto;border:2px solid #27a';
    document.body.appendChild(box);
    const started = Date.now();
    const render = () => { box.textContent = '微信分享诊断（请截图）\n' + JSON.stringify(status, null, 2) + '\n已等待 ' + Math.floor((Date.now()-started)/1000) + ' 秒'; };
    render();
    const timer = setInterval(render, 500);
    setTimeout(() => { clearInterval(timer); render(); }, 60000);
    window.addEventListener('error', e => { status.runtimeError = e.message; render(); });
    window.addEventListener('unhandledrejection', e => { status.runtimeError = String(e.reason?.message || e.reason); render(); });
  }
  if (!/MicroMessenger/i.test(navigator.userAgent)) { status.state = 'not_wechat'; return; }
  const pageUrl = location.href.split('#')[0];
  const endpoint = 'https://portland-hearts-contains-safer.trycloudflare.com/sign';
  const data = {
    title: '四川师范大学伯明翰学院2026年开学典礼暨四川师范大学2026年国际教育交流月开幕式',
    desc: '2026年10月22日，四川师范大学成龙校区龙湖剧场。',
    link: 'https://invite.zmkj1.com/invitation.html',
    imgUrl: 'https://invite.zmkj1.com/assets/share-cover-20261015.jpg'
  };
  const sdk = new Promise((resolve, reject) => {
    if (window.wx) return resolve();
    const script = document.createElement('script');
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
    script.async = true;
    script.onload = () => { status.sdk = 'loaded'; resolve(); };
    script.onerror = () => reject(Error('sdk_load_failed'));
    document.head.appendChild(script);
  });
  Promise.all([sdk, fetch(endpoint + '?url=' + encodeURIComponent(pageUrl), {
    signal: AbortSignal.timeout(20000), cache: 'no-store'
  }).then(async r => { status.signature = 'http_' + r.status; if (!r.ok) throw Error('signature_http_' + r.status); return r.json(); })])
    .then(([, config]) => {
      status.state = 'config_pending';
      wx.error(e => { status.state = 'config_failed'; status.error = e.errMsg; });
      wx.ready(() => {
        status.state = 'config_ready';
        wx.updateAppMessageShareData({ ...data,
          success: () => { status.friends = 'ready'; },
          fail: e => { status.friends = e.errMsg; }
        });
        wx.updateTimelineShareData({ title: data.title, link: data.link, imgUrl: data.imgUrl,
          success: () => { status.timeline = 'ready'; },
          fail: e => { status.timeline = e.errMsg; }
        });
      });
      wx.config({ debug: false, appId: config.appId, timestamp: config.timestamp,
        nonceStr: config.nonceStr, signature: config.signature,
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'] });
    }).catch(e => { status.state = 'failed'; status.error = e.message; });
})();
