document.addEventListener('DOMContentLoaded', function () {
  var copyBtn = document.getElementById('copy');
  var insertBtn = document.getElementById('insert');

  // 点击Copy按钮，触发当前页id为qwe的按钮的点击事件
  copyBtn.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.executeScript(tabs[0].id, {
        code: "document.getElementById('qwe').click();"
      });
    });
  });
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
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
          code: `
                document.getElementById('asd').value=${clipboardText}
            `
        });
      });
    }
  );
}
