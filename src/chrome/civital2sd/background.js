chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == 'getClipboardText') {
    getValue(function (value) {
      sendResponse({ clipboardText: value });
    });
    return true;
  }
});

function getValue(callback) {
  var input = document.createElement('textarea');
  input.style.position = 'fixed';
  input.style.opacity = 0;
  document.body.appendChild(input);
  input.focus();
  document.execCommand('Paste');
  setTimeout(() => {
    var value = input.value;
    callback(value);
    document.body.removeChild(input);
  }, 1000);
}
