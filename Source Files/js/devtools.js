// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// roshan : start
console.log('LOG : devetools.js');
chrome.devtools.panels.create("BlueKai Debugger",
    "icon32.png",
    "Panel.html",
    function(panel) {

        // code invoked on panel creation      
        console.log('LOG : panel callback');

        // Code to show panel loading
        panel.onShown.addListener(function(extPanelWindow) {
            
            // Callback to run when panel made (if required)
        });



    }
);