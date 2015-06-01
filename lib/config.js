'use strict';

var Error = require('./error');

// Available config options. Any option can be disabled by setting the value
// to false if not otherwise noted.
var config = {
    // first line should not start with \n
    // the optional body should be separated from title by exactly \n\n
    // capturing blocks: $1 - title, $2 - body
    // (\n\n between title and body and last \n, if any, are discarded)
    // this cannot be disabled, but you can change the pattern
    pattern: /^([^\n]+)(?:\n\n([^\n][\S\s]*[^\n]))?\n*$/,
    capitalized: {type: Error.ERROR},
    invalidCharsInTitle: {allowedChars: /[^\w(), '"`\-:\./~\[\]*$={}&;#]/, type: Error.ERROR},
    titlePreferredMaxLineLength: {length: 50, type: Error.WARNING},
    titleMaxLineLength: {length: 70, type: Error.ERROR},  // because GitHub adds an ellipsis after 70
    bodyMaxLineLength: {length: 72, type: Error.WARNING},
    // specify the types/components that can prefix the commit message
    // the type  will be removed from the title before all the other validations
    // eg: perf: Speed up page load
    // eg: fix: i18n: Change login button text for spanish
    // this cannot be disabled, but you can change the pattern to one that matches nothing
    allowedTypes: /^(fix|docs|feature|security|chore|refactor|test|config|perf|WIP):( [\w-.()]+:)? /,
    // remove any 'type: ' that precedes the commit message that is not valid
    // note that the pattern should be a capturing group
    // and should include the space also, as in 'i18n: '
    strictTypes: {invalidTypes: /(^[\w-.()]+:( [\w-.()]+:)? )/, type: Error.ERROR},
    // validate references:
    // GitHub issues refs https://help.github.com/articles/closing-issues-via-commit-messages/
    //   - should be placed in the last paragraph of the body
    references: {type: Error.ERROR},
    // check for non-imperative verbs in the commit subject
    // set 'alwaysCheck' to true to always run this validation;
    // default is false so this check will only run if there are no other errors
    imperativeVerbsInTitle: {alwaysCheck: false, type: Error.ERROR}
};

module.exports = function(cfg) {
    var overwrite = function(what, data) {
        if (data instanceof Object) {
            for (var i in data) {
                what[i] = overwrite(what[i], data[i]);
            }
        } else if (what instanceof RegExp && typeof(data) == 'string') {
            what = new RegExp(data);
        } else {
            what = data;
        }
        return what;
    }
    if (cfg) {
        // overwrite defaults
        for (var i in cfg) {
            if (cfg.hasOwnProperty(i) && typeof config[i] != 'undefined') {
                config[i] = overwrite(config[i], cfg[i]);
            }
        }
    }
    return config;
}