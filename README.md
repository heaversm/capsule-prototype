### CAPSULE PROTOTYPE

**  LIBRARIES **

Contained in js/libs folder

* getusermedia - a shim to provide a flash fallback for getusermedia
* swfobject - allows for easy flash install for non-flash browsers. Currently not implemented.
* Blob.js - will allow cross-browser creation of blob objects. Currently not implemented.
* FileSaver.js - allows for cross-browser saving of blob objects captured through getusermedia
* jQuery - front end DOM manipulation
* MediaStreamRecorder - allows access to various methods of capturing video / audio from user's camera / mic depending on device. Have made a lot of edits to this library and need to strip out a lot of unused functionality.

** JAVASCRIPT **

* main.js - just kicks off the app at the moment by calling `intro.init`
* intro.js - there will be an introductory screen to this experience before users start answering questions / recording themselves. Once the user clicks get started, it calls `detection.init()`
* detection.js - needs work - but determines browser capabilities such as support of getusermedia (native, vendor-prefixed, or via flash shim), flash support, iOS vs Android, etc. Once detected, initializes `capture.js`.
* capture.js - houses all the recording functionality. Currently records still image and video via getusermedia or via file upload dialog (for mobile devices). Saves files as webm+wav (for mobile and desktop Chrome), webm (for Firefox 29), or mov (for iOS).
