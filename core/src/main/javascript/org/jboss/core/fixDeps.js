/*
 * JBoss, Home of Professional Open Source
 * Copyright 2012 Red Hat Inc. and/or its affiliates and other contributors
 * as indicated by the @authors tag. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview The only purpose of this file is to get rid of
 * "[Goog.ERROR]: JSC_TYPE_PARSE_ERROR. Bad type annotation. Unknown type..."
 * messages during advanced compilation of core module.
 *
 * This file add nothing to compiled code, it is pruned by compiler.
 *
 * Correct solution is described here:
 * http://code.google.com/p/closure-library/wiki/FrequentlyAskedQuestions
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.require('goog.Uri');
goog.require('goog.debug.ErrorHandler');
goog.require('goog.events.EventWrapper');
