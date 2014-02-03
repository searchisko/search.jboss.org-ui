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
 * @fileoverview System variables that can vary depending on target deployment.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */
goog.provide('org.jboss.core.Variables');

org.jboss.core.Variables = {

	/**
	 * Short date format.
	 * @type {string}
	 * @const
	 */
//	SHORT_DATE_FORMAT : "MM/dd/yyyy",
	SHORT_DATE_FORMAT : "yyyy-MM-dd",

	/**
	 * Medium date format.
	 * @type {string}
	 * @const
	 */
	MEDIUM_DATE_FORMAT : "yyyy-M-d, h:mma"

};