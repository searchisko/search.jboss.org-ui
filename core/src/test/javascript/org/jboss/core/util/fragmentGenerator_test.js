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

goog.require('goog.testing.jsunit');
goog.require('org.jboss.core.context.RequestParams');
goog.require('org.jboss.core.context.RequestParamsFactory');
goog.require('org.jboss.core.util.fragmentGenerator');

var testFragmentGenerator = function() {

  var requestParams, urlFragment;

  requestParams = org.jboss.core.context.RequestParamsFactory.getInstance().reset().setQueryString(null).build();
  urlFragment = org.jboss.core.util.fragmentGenerator.generate(requestParams);
  assertEquals('', urlFragment);

  requestParams = org.jboss.core.context.RequestParamsFactory.getInstance().reset().setQueryString('test').build();
  urlFragment = org.jboss.core.util.fragmentGenerator.generate(requestParams);
  assertEquals('q=test', urlFragment);

  requestParams = org.jboss.core.context.RequestParamsFactory.getInstance().reset().setQueryString('test').setPage(3)
      .build();
  urlFragment = org.jboss.core.util.fragmentGenerator.generate(requestParams);
  assertEquals('q=test&page=3', urlFragment);

  requestParams = org.jboss.core.context.RequestParamsFactory.getInstance().reset()
    .setQueryString('test').setContributors(['c1', 'c2', 'c3']).build();
  urlFragment = org.jboss.core.util.fragmentGenerator.generate(requestParams);
  assertEquals('q=test&people=c1&people=c2&people=c3', urlFragment);

  requestParams = org.jboss.core.context.RequestParamsFactory.getInstance().reset()
      .setQueryString('test').setContributors(['c1']).setProjects(['p1', 'p1', 'p2']).setContentTypes(['t1', 't2'])
      .build();
  urlFragment = org.jboss.core.util.fragmentGenerator.generate(requestParams);
  assertEquals('q=test&people=c1&tech=p1&tech=p2&type=t1&type=t2', urlFragment);
};

var testFragmentKeepLog = function() {

  var requestParams, requestParams_old, urlFragment;

  requestParams_old = org.jboss.core.context.RequestParamsFactory.getInstance().reset().setQueryString('test')
      .setLog('console').build();
  requestParams = org.jboss.core.context.RequestParamsFactory.getInstance().reset().setQueryString('test').build();
  urlFragment = org.jboss.core.util.fragmentGenerator.generate(requestParams, requestParams_old);
  assertEquals('q=test&log=console', urlFragment);
};
