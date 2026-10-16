if (new URLSearchParams(location.search).get('share_minimal') === '1') {
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => { link.disabled = true; });
  document.body.replaceChildren();
  document.body.style.cssText = 'margin:20px;background:white;color:#111;font:16px/1.6 sans-serif';
  const heading = document.createElement('h2');
  heading.textContent = '最小分享测试';
  const image = document.createElement('img');
  image.src = 'https://invite.zmkj1.com/assets/share-cover-20261015.jpg';
  image.width = image.height = 120;
  const text = document.createElement('p');
  text.textContent = '此页不运行动效、地图和音乐程序。等诊断结果出现后，用微信右上角发送给朋友。分享目标仍是原邀请函。';
  document.body.append(heading, image, text);
}
