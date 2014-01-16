# Cached Lists

When we need to load and cache some data upfront...

Typically, we need to load list of projects that is used to translate @sys_project@ to human readable value and keep it around.

When implementing any list/cache consider extending @goog.async.Deferred@ so that you can easily synchronize
using @goog.asynch.DeferredList@ when all the caches are loaded and ready for use. See [Project.js](project/Project.js)
for an example and [Project_test.js](../../../../../../test/javascript/org/jboss/search/list/project/Project_test.js).