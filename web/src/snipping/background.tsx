chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'AllerFreeContextMenuOption',
    title: 'Aller-Free',
    contexts: ['all'],
  })
})

// Add listener for when the menu item is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) {
    return
  }

  if (info.menuItemId === 'AllerFreeContextMenuOption') {
    console.log('Context menu option clicked!')
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      files: ['snipping.js'],
    })
  }
})

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'capture') {
    chrome.tabs
      .captureVisibleTab(null!, { format: 'png' })
      .then(async (dataUrl) => {
        console.log('Sending data...', dataUrl)
        await chrome.action.openPopup()
        chrome.runtime
          .sendMessage({
            target: 'check-image',
            data: {
              dataUrl: dataUrl,
              x: message.x,
              y: message.y,
              w: message.w,
              h: message.h,
            },
          })
          .then(() => console.log('sent message sucessfully'))
          .catch(() => console.log('no receiver'))
      })
  }
})
