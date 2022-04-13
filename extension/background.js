// To help the screenshot button render on page load
function setButton() {    
    console.log('start')
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (!mutation.addedNodes) return
            
            for (let i = 0; i < mutation.addedNodes.length; i++) {
                let node = mutation.addedNodes[i]
                if(node.classList.contains("ytp-right-controls")) {
                    console.log('goin thru mutations')
                    var ytpRightControls = document.getElementsByClassName("ytp-right-controls")[0]
                    var cbContainer = document.getElementById("checkboxContainer")

                    if (ytpRightControls && !cbContainer) {
                        var screenshotButton = document.createElement("button");
                        screenshotButton.className = "screenshotButton ytp-button";
                        screenshotButton.style.width = "auto";
                        screenshotButton.innerHTML = "Screenshot";
                        screenshotButton.style.cssFloat = "left";
                        screenshotButton.onclick = CaptureScreenshot;

                        // Checkbox to enable the crop square
                        var checkboxContainer = document.createElement("div")
                        screenshotButton.id = "checkboxContainer"
                        checkboxContainer.style.cssFloat = "left";
                        checkboxContainer.style.zIndex = "100";

                        var cropCheckbox = document.createElement("input");
                        cropCheckbox.className = "center";
                        cropCheckbox.type = "checkbox"
                        cropCheckbox.id = "cropbox"
                        cropCheckbox.style.cssFloat = "left";
                        cropCheckbox.onclick = DisplaySquare;

                        var cropCheckboxLabel = document.createElement("label")
                        cropCheckboxLabel.htmlFor = "cropbox"
                        cropCheckboxLabel.innerText = "Crop"
                        cropCheckboxLabel.style.cssFloat = "left";

                        checkboxContainer.appendChild(cropCheckboxLabel)
                        checkboxContainer.appendChild(cropCheckbox)
                        
                        ytpRightControls.prepend(screenshotButton);
                        ytpRightControls.prepend(checkboxContainer);
                    }
                }
            }
        })
    })
    
    observer.observe(document.body, {
        childList: true
        , subtree: true
        , attributes: false
        , characterData: false
    })
    
      // stop watching using:
    //   observer.disconnect()
}

chrome.webNavigation.onHistoryStateUpdated.addListener(function(data) {
	chrome.tabs.get(data.tabId, function(tab) {
		// chrome.scripting.executeScript({
        //     target: {tabId: data.tabId},
        //     func: setButton
        // });
	});
}, {url: [{hostSuffix: '.youtube.com'}]});
