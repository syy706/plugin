document.addEventListener('DOMContentLoaded', function () {
  // var copyBtn = document.getElementById('copy');
  var insertBtn = document.getElementById('insert');

  // // 点击Copy按钮，触发当前页id为qwe的按钮的点击事件
  // copyBtn.addEventListener('click', function () {
  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     chrome.tabs.executeScript(tabs[0].id, {
  //       code: "document.getElementsByClassName('mantine-ScrollArea-root')[2].getElementsByClassName('mantine-Button-root')[3].click();"
  //     });
  //   });
  // });
  insertBtn.addEventListener('click', getClipboardText);
});

function getClipboardText() {
  chrome.runtime.sendMessage(
    { action: 'getClipboardText' },
    function (response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }
      var clipboardText = JSON.stringify(response.clipboardText);
      chrome.tabs.query({ url:'http://127.0.0.1:7860/*' }, function (tabs) {
       

        const list = ["Negative prompt:","Size:",", Seed:",", Model",", Steps:",", Sampler:",", CFG scale:",", Model hash:",", Face restoration:"]
        var a = tranformStr(clipboardText);
        const results = []
        list.map((item)=>{
          const text = a.split(item)[0];
          
          results.push(text)
          a = a.substring(a.indexOf(item) + item.length, a.length);
        })

        const [prompt, navi,size,seed, model, step, sampler, cfg, hash] = results;
        const [x, y ] = size.split("x");
        const fn = [ `document.getElementById("txt2img_prompt").querySelector("textarea").value = ${JSON.stringify(prompt)}`,
        `document.getElementById("txt2img_neg_prompt").querySelector("textarea").value = ${JSON.stringify(navi)}`,
        `document.getElementById("txt2img_width").querySelector("input").value = ${JSON.stringify(x.trim())}`,
        `document.getElementById("txt2img_height").querySelector("input").value = ${JSON.stringify(y)}`,
        `document.getElementById("txt2img_seed").querySelector("input").value = ${JSON.stringify(seed.trim())}`,
        `document.getElementById("txt2img_steps").querySelector("input").value = ${JSON.stringify(step.trim())}`,
        `document.getElementById("txt2img_cfg_scale").querySelector("input").value = ${JSON.stringify(cfg.trim())}`]
        fn.forEach((item)=>{
          chrome.tabs.executeScript(tabs[0].id, {
            code: item
          });
        })
      });
    }
  );
}

function tranformStr(str){
  return str.replace(/\n/g, '').replace(/['"]/g, '');
}