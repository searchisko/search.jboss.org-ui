/**
 * @fileoverview Externs fixing missing externs for v8.
 * This file should go away once the issue is fixed in Closure Library.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 * @externs
 */

/**
 * @interface
 */
function CallSite() {};
CallSite.prototype.getFunctionName;
CallSite.prototype.getFileName;
CallSite.prototype.getLineNumber;
CallSite.prototype.getColumnNumber;