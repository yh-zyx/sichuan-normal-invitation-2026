(() => {
  if (!/MicroMessenger/i.test(navigator.userAgent)) return;
  const pageUrl = location.href.split('#')[0];
  const endpoint = 'https://portland-hearts-contains-safer.trycloudflare.com/sign';
  const data = {
    title: '四川师范大学伯明翰学院2026年开学典礼暨四川师范大学2026年国际教育交流月开幕式',
    desc: '2026年10月22日，四川师范大学成龙校区龙湖剧场。',
    link: 'https://invite.zmkj1.com/invitation.html',
    imgUrl: 'https://invite.zmkj1.com/assets/share-cover-20261015.jpg'
  };
  const status = window.invitationShareStatus = { state: 'loading' };
  const sdk = new Promise((resolve, reject) => {
    if (window.wx) return resolve();
    const script = document.createElement('script');
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(Error('sdk_load_failed'));
    document.head.appendChild(script);
  });
  Promise.all([sdk, fetch(endpoint + '?url=' + encodeURIComponent(pageUrl), {
    signal: AbortSignal.timeout(20000), cache: 'no-store'
  }).then(async r => { if (!r.ok) throw Error('signature_http_' + r.status); return r.json(); })])
    .then(([, config]) => {
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
