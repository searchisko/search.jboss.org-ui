/*
    JBoss, Home of Professional Open Source
    Copyright 2012 Red Hat Inc. and/or its affiliates and other contributors
    as indicated by the @authors tag. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

goog.provide('LoggingWindow');

goog.require('goog.debug');
goog.require('goog.debug.FancyWindow');
goog.require('goog.debug.Logger');

/*
  The following require() is used to get rid of compilation error
  [Goog.ERROR]: JSC_TYPE_PARSE_ERROR. Bad type annotation. Unknown type goog.debug.ErrorHandle ...
  ... closure-library/closure/goog/events/events.js line 896 : 11

  Correct solution is described here:
  http://code.google.com/p/closure-library/wiki/FrequentlyAskedQuestions
*/
goog.require('goog.debug.ErrorHandler');

/**
 * @fileoverview This enables a standalone logging window.
 *
 * To use this, all you have to do is to add the following line into devClosureDepsBuilder.sh
 *
 *   --namespace="LoggingWindow"
 *
 * and run the script to produce updated testing-only.js
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */
{
    var debugWindow = new goog.debug.FancyWindow('main');
    debugWindow.setEnabled(true);
    debugWindow.init();
}