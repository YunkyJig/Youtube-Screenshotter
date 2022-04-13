'use strict';

var activePBRButton;
var screenshotKey = false;
var playbackSpeedButtons = false;
var randomizeFilenames = false
var screenshotFunctionality = 0;
var screenshotFormat = "png";
var extension = 'png';

function CaptureScreenshot() {

	var appendixTitle = "screenshot." + extension;

	var title;

	var headerEls = document.querySelectorAll("h1.title.ytd-video-primary-info-renderer");

	function SetTitle() {
		if (headerEls.length > 0) {
			title = headerEls[0].innerText.trim();
			return true;
		} else {
			return false;
		}
	}
	
	if (SetTitle() == false) {
		headerEls = document.querySelectorAll("h1.watch-title-container");

		if (SetTitle() == false)
			title = '';
	}

	var player = document.getElementsByClassName("video-stream")[0];

	var time = player.currentTime;

	title += " ";

	var minutes = Math.floor(time / 60)

	time = Math.floor(time - (minutes * 60));

	if (minutes > 60) {
		var hours = Math.floor(minutes / 60)
		minutes -= hours * 60;
		title += hours + "-";
	}

	title += minutes + "-" + time;

    title += " " + appendixTitle;
    
    if(randomizeFilenames) {
        title = getRandomFilename() + "." + extension
    }

    // if statement for without square
    var canvas = document.createElement("canvas");
    var square = document.querySelector(".square")

    if(square) {
        var scale = player.offsetWidth / player.videoWidth
        canvas.width = square.offsetWidth;
        canvas.height = square.offsetHeight;
        canvas.getContext('2d').drawImage(player, (square.offsetLeft - player.offsetLeft) / scale, square.offsetTop / scale, canvas.width / scale, canvas.height / scale, 0, 0, canvas.width, canvas.height);
    }
    else {
        canvas.width = player.videoWidth;
        canvas.height = player.videoHeight;
        canvas.getContext('2d').drawImage(player, 0, 0, canvas.width, canvas.height);
    }

	var downloadLink = document.createElement("a");
	downloadLink.download = title;

	function DownloadBlob(blob) {
		downloadLink.href = URL.createObjectURL(blob);
		downloadLink.click();
	}

	async function ClipboardBlob(blob) {
		var clipboardItemInput = new ClipboardItem({ "image/png": blob });
		await navigator.clipboard.write([clipboardItemInput]);
	}

	// If clipboard copy is needed generate png (clipboard only supports png)
	if (screenshotFunctionality == 1 || screenshotFunctionality == 2) {
		canvas.toBlob(async function (blob) {
			await ClipboardBlob(blob);
			// Also download it if it's needed and it's in the correct format
			if (screenshotFunctionality == 2 && screenshotFormat === 'png') {
				DownloadBlob(blob);
			}
		}, 'image/png');
	}

	// Create and download image in the selected format if needed
	if (screenshotFunctionality == 0 || (screenshotFunctionality == 2 && screenshotFormat !== 'png')) {
		canvas.toBlob(async function (blob) {
			DownloadBlob(blob);
		}, 'image/' + screenshotFormat);
	}
}

function DisplaySquare() {
    if(this.checked) {
        var video = document.getElementsByClassName("video-stream")[0];
        var dragCorner = document.createElement("div")
        dragCorner.className = "draggable-icon"
    
        var square = document.createElement("div")
        square.className = "square"
        square.style.left = video.offsetLeft + "px"
        square.appendChild(dragCorner)
        dragElement(square)
    
        var videoPlayerContainer = document.getElementsByClassName('html5-video-player')[0]
        videoPlayerContainer.appendChild(square)
    }
    else {
        var square = document.getElementsByClassName("square")[0]
        if(square) {
            square.remove()
        }
    }
}

function AddPlaybackSpeedButton() {
	var ytpRightControls = document.getElementsByClassName("ytp-right-controls")[0];

	chrome.storage.sync.get('playbackSpeedButtons', function(result) {
		if (result.playbackSpeedButtons) {
			ytpRightControls.prepend(speed3xButton);
			ytpRightControls.prepend(speed25xButton);
			ytpRightControls.prepend(speed2xButton);
			ytpRightControls.prepend(speed15xButton);
			ytpRightControls.prepend(speed1xButton);

			var playbackRate = document.getElementsByTagName('video')[0].playbackRate;
			switch (playbackRate) {
				case 1:
					speed1xButton.classList.add('SYTactive');
					activePBRButton = speed1xButton;
					break;
				case 2:
					speed2xButton.classList.add('SYTactive');
					activePBRButton = speed2xButton;
					break;
				case 2.5:
					speed25xButton.classList.add('SYTactive');
					activePBRButton = speed25xButton;
					break;
				case 3:
					speed3xButton.classList.add('SYTactive');
					activePBRButton = speed3xButton;
					break;
			}
		}
	});
}

var speed1xButton = document.createElement("button");
speed1xButton.className = "ytp-button SYText";
speed1xButton.innerHTML = "1×";
speed1xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 1;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

var speed15xButton = document.createElement("button");
speed15xButton.className = "ytp-button SYText";
speed15xButton.innerHTML = "1.5×";
speed15xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 1.5;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

var speed2xButton = document.createElement("button");
speed2xButton.className = "ytp-button SYText";
speed2xButton.innerHTML = "2×";
speed2xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 2;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

var speed25xButton = document.createElement("button");
speed25xButton.className = "ytp-button SYText";
speed25xButton.innerHTML = "2.5×";
speed25xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 2.5;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

var speed3xButton = document.createElement("button");
speed3xButton.className = "ytp-button SYText";
speed3xButton.innerHTML = "3×";
speed3xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 3;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

activePBRButton = speed1xButton;

function getRandomFilename() {
    return + new Date()
}

chrome.storage.sync.get(['screenshotKey', 'playbackSpeedButtons', 'screenshotFunctionality', 'screenshotFileFormat', 'filenameRandomizer'], function(result) {
	screenshotKey = result.screenshotKey;
	playbackSpeedButtons = result.playbackSpeedButtons;
	if (result.screenshotFileFormat === undefined) {
		screenshotFormat = 'png'
	} else {
		screenshotFormat = result.screenshotFileFormat
	}

	if (result.screenshotFunctionality === undefined) {
		screenshotFunctionality = 0;
	} else {
    	screenshotFunctionality = result.screenshotFunctionality;
	}

	if (screenshotFormat === 'jpeg') {
		extension = 'jpg';
	} else {
		extension = screenshotFormat;
    }
    
    randomizeFilenames = result.filenameRandomizer
});

document.addEventListener('keydown', function(e) {
	if (document.activeElement.contentEditable === 'true' || document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.contentEditable === 'plaintext')
		return true;

	if (playbackSpeedButtons) {
		switch (e.key) {
			case 'q':
				speed1xButton.click();
				e.preventDefault();
				return false;
			case 's':
				speed15xButton.click();
				e.preventDefault();
				return false;
			case 'w':
				speed2xButton.click();
				e.preventDefault();
				return false;
			case 'e':
				speed25xButton.click();
				e.preventDefault();
				return false;
			case 'r':
				speed3xButton.click();
				e.preventDefault();
				return false;
		}
	}

	if (screenshotKey && e.key === 'p') {
		CaptureScreenshot();
		e.preventDefault();
		return false;
	}
});

function dragElement(elmnt) {
    var video = document.getElementsByClassName("video-stream")[0];
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;
  
  
    var isMaxDimensions = () => {
      if(elmnt.offsetWidth + elmnt.offsetLeft >= video.offsetWidth || elmnt.offsetHeight + elmnt.offsetTop >= video.offsetHeight) {
          return true
      }
      return false
    }
  
    function dragMouseDown(e) {
      console.log(e)
      e = e || window.event;
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      if(pos3 - elmnt.offsetLeft > elmnt.offsetWidth - 20 && pos4 - elmnt.offsetTop > elmnt.offsetHeight - 20) {
          if(isMaxDimensions()) {
              e.preventDefault()
          }
          return
      }
      e.preventDefault();
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      var newTopPosition = (elmnt.offsetTop - pos2)
      // in order it goes: top, left, bottom, right
      if(elmnt.offsetTop - pos2 >= 0 && elmnt.offsetLeft - video.offsetLeft - pos1 >= 0 && elmnt.offsetTop - pos2 <= (video.offsetHeight - elmnt.offsetHeight) && elmnt.offsetLeft - video.offsetLeft - pos1 <= (video.offsetWidth - elmnt.offsetWidth)) {
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }
  
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
    
}

AddPlaybackSpeedButton();

let observer = new MutationObserver((mutations) => {
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
        observer.disconnect()
    }
})

observer.observe(document.body, {
    childList: true
    , subtree: true
    , attributes: false
    , characterData: false
})

// // Could be useful for having a autoscaling and postion matching square. leaving it here for now
// // need to check porpotions of video
// window.addEventListener('load', function() {
//     var config = { attributes: true };
//     var callback = function(mutationsList, observer) {
//         // Use traditional 'for loops' for IE 11
//         // add counter to shift square at the last index
//         for(var mutation of mutationsList) {
//             // console.log('The ' + mutation.attributeName + ' attribute was modified.', mutation.target);
//             var square = document.getElementsByClassName('square')[0]

//             // resetting square position so it doesnt go out of bounds
//             if(square && mutation.attributeName === 'style' && prevVideoOffsetLeft != video.offsetLeft) {
//                 console.log(video)
//                 prevVideoOffsetLeft = video.offsetLeft
//                 prevVideoOffsetTop = video.offsetTop
//                 prevVideoOffsetHeight = video.offsetHeight
//                 prevVideoOffsetWidth = video.offsetWidth
//                 console.log('vid width', video.offsetWidth, video.videoHeight)
//                 continue
//                 var widthScale = prevVideoOffsetWidth / video.offsetWidth 
//                 var heightScale = prevVideoOffsetHeight / video.offsetHeight
//                 // var widthScale = prevVideoOffsetWidth / video.offsetWidth 
//                 // var widthScale = prevVideoOffsetWidth / video.offsetWidth 

//                 // maybe multiply the width and offset left by widthscale and mult height and offset right by heightscale

//                 // // video got smaller/moved to the right
//                 // if(prevVideoOffsetLeft > video.offsetLeft) {
//                 //     square.style.left = square.offsetLeft - prevVideoOffsetLeft + "px"
//                 //     prevVideoOffsetLeft = video.offsetLeft
//                 // }
//                 // // video got bigger/moved to the left
//                 // else {
//                 //     square.style.left = square.offsetLeft + video.offsetLeft + "px"
//                 //     prevVideoOffsetLeft = video.offsetLeft
//                 // }
//                 console.log(square.offsetLeft, prevVideoOffsetLeft, prevVideoOffsetWidth, video.offsetWidth, widthScale, heightScale)
//                 square.style.left = (square.offsetLeft / widthScale) + "px"
//                 // square.style.height = (square.offsetHeight / heightScale) + "px"
//                 // square.style.width = (square.offsetWidth / widthScale) + "px"
//                 console.log('squre shift', square.offsetLeft, video.offsetLeft)

//                 break
//             }
//         }
//     };

//     var observer = new MutationObserver(callback)
//     var videoPlayerContainer = document.getElementsByClassName('html5-video-player')[0]
//     console.log(videoPlayerContainer)
//     var video = document.getElementsByClassName("video-stream")[0];
//     console.log(video)
//     var prevVideoOffsetLeft = video.offsetLeft
//     var prevVideoOffsetTop = video.offsetTop
//     var prevVideoOffsetHeight = video.offsetHeight
//     var prevVideoOffsetWidth = video.offsetWidth

//     observer.observe(video, config)
// })