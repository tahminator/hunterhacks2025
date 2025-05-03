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
