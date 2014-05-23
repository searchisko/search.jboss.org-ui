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
 * @fileoverview LookUp implementation used for tests only.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.service.LookUpImplWithProjects');

goog.require('org.jboss.core.service.LookUpImpl');



/**
 * @extends {org.jboss.core.service.LookUpImpl}
 * @constructor
 * @final
 */
org.jboss.search.service.LookUpImplWithProjects = function() {
  org.jboss.core.service.LookUpImpl.call(this);
  /**
   * @type {Object}
   * @private
   */
  this.projectMap_;
};
goog.inherits(org.jboss.search.service.LookUpImplWithProjects, org.jboss.core.service.LookUpImpl);


/**
 * @return {Object}
 */
org.jboss.search.service.LookUpImplWithProjects.prototype.getProjectMap = function() {
  if (goog.isDefAndNotNull(this.projectMap_)) {
    return this.projectMap_;
  } else {
    throw new Error('ProjectMap hasn\'t been set yet!');
  }
};


/**
 * @param {Object} projectMap
 */
org.jboss.search.service.LookUpImplWithProjects.prototype.setProjectMap = function(projectMap) {
  this.projectMap_ = projectMap;
};
