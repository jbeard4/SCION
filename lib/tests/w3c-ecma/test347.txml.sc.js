//Generated on 2018-10-16 14:29:03 by the SCION SCXML compiler
function rootConstructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';

    function getDelayInMs(delayString) {
        if (typeof delayString === 'string') {
            if (delayString.slice(-2) === "ms") {
                return parseFloat(delayString.slice(0, -2));
            } else if (delayString.slice(-1) === "s") {
                return parseFloat(delayString.slice(0, -1)) * 1000;
            } else if (delayString.slice(-1) === "m") {
                return parseFloat(delayString.slice(0, -1)) * 1000 * 60;
            } else {
                return parseFloat(delayString);
            }
        } else if (typeof delayString === 'number') {
            return delayString;
        } else {
            return 0;
        }
    }

    function $deserializeDatamodel($serializedDatamodel) {

    }

    function $serializeDatamodel() {
        return {

        };
    }

    function $invoke_l5_c6(_event) {
        this.invoke({
            "autoforward": false,
            "type": "scxml",
            "src": null,
            "id": $invoke_l5_c6.id,
            "constructorFunction": $invoke_l5_c6Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test347.txml.scxml"
        });
    };
    $invoke_l5_c6.tagname = 'invoke';
    $invoke_l5_c6.line = 5;
    $invoke_l5_c6.column = 6;

    $invoke_l5_c6.autoforward = false;

    $invoke_l5_c6.id = "child";

    function $senddata_l19_c6(_event) {
        return {}
    };
    $senddata_l19_c6.tagname = 'send';
    $senddata_l19_c6.line = 19;
    $senddata_l19_c6.column = 6;

    function $send_l19_c6(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l19_c6.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("20s"),
        });
    };
    $send_l19_c6.tagname = 'send';
    $send_l19_c6.line = 19;
    $send_l19_c6.column = 6;

    function $senddata_l29_c8(_event) {
        return {}
    };
    $senddata_l29_c8.tagname = 'send';
    $senddata_l29_c8.line = 29;
    $senddata_l29_c8.column = 8;

    function $send_l29_c8(_event) {
        var _scionTargetRef = "#_child";
        this.send({
            target: _scionTargetRef,
            name: "parentToChild",
            data: $senddata_l29_c8.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
            type: "http://www.w3.org/TR/scxml/#SCXMLEventProcessor",
        });
    };
    $send_l29_c8.tagname = 'send';
    $send_l29_c8.line = 29;
    $send_l29_c8.column = 8;

    function $expr_l36_c56(_event) {
        return 'pass'
    };
    $expr_l36_c56.tagname = 'undefined';
    $expr_l36_c56.line = 36;
    $expr_l36_c56.column = 56;

    function $log_l36_c30(_event) {
        this.log("Outcome", $expr_l36_c56.apply(this, arguments));
    };
    $log_l36_c30.tagname = 'log';
    $log_l36_c30.line = 36;
    $log_l36_c30.column = 30;

    function $expr_l37_c56(_event) {
        return 'fail'
    };
    $expr_l37_c56.tagname = 'undefined';
    $expr_l37_c56.line = 37;
    $expr_l37_c56.column = 56;

    function $log_l37_c30(_event) {
        this.log("Outcome", $expr_l37_c56.apply(this, arguments));
    };
    $log_l37_c30.tagname = 'log';
    $log_l37_c30.line = 37;
    $log_l37_c30.column = 30;
    return {
        "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
        "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
        "initial": "s0",
        "$type": "scxml",
        "id": "$generated-scxml-0",
        "states": [{
                "id": "s0",
                "initial": "s01",
                "$type": "state",
                "invokes": $invoke_l5_c6,
                "onEntry": [
                    $send_l19_c6
                ],
                "transitions": [{
                    "event": "timeout",
                    "target": "fail",
                    "$closeLine": 21,
                    "$closeColumn": 44
                }],
                "states": [{
                        "id": "s01",
                        "$type": "state",
                        "transitions": [{
                            "event": "childToParent",
                            "target": "s02",
                            "$closeLine": 24,
                            "$closeColumn": 53
                        }],
                        "$closeLine": 25,
                        "$closeColumn": 8
                    },
                    {
                        "id": "s02",
                        "$type": "state",
                        "onEntry": [
                            $send_l29_c8
                        ],
                        "transitions": [{
                                "event": "done.invoke",
                                "target": "pass",
                                "$closeLine": 31,
                                "$closeColumn": 49
                            },
                            {
                                "event": "error",
                                "target": "fail",
                                "$closeLine": 32,
                                "$closeColumn": 43
                            }
                        ],
                        "$closeLine": 33,
                        "$closeColumn": 5
                    }
                ],
                "$closeLine": 34,
                "$closeColumn": 2
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l36_c30
                ],
                "$closeLine": 36,
                "$closeColumn": 77
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l37_c30
                ],
                "$closeLine": 37,
                "$closeColumn": 77
            }
        ],
        "$closeLine": 39,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test347.txml.scxml"
    };
}

function $invoke_l5_c6Constructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'machineName';

    function getDelayInMs(delayString) {
        if (typeof delayString === 'string') {
            if (delayString.slice(-2) === "ms") {
                return parseFloat(delayString.slice(0, -2));
            } else if (delayString.slice(-1) === "s") {
                return parseFloat(delayString.slice(0, -1)) * 1000;
            } else if (delayString.slice(-1) === "m") {
                return parseFloat(delayString.slice(0, -1)) * 1000 * 60;
            } else {
                return parseFloat(delayString);
            }
        } else if (typeof delayString === 'number') {
            return delayString;
        } else {
            return 0;
        }
    }

    function $deserializeDatamodel($serializedDatamodel) {

    }

    function $serializeDatamodel() {
        return {

        };
    }

    function $senddata_l10_c14(_event) {
        return {}
    };
    $senddata_l10_c14.tagname = 'send';
    $senddata_l10_c14.line = 10;
    $senddata_l10_c14.column = 14;

    function $send_l10_c14(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "childToParent",
            data: $senddata_l10_c14.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
            type: "http://www.w3.org/TR/scxml/#SCXMLEventProcessor",
        });
    };
    $send_l10_c14.tagname = 'send';
    $send_l10_c14.line = 10;
    $send_l10_c14.column = 14;
    return {
        "initial": "sub0",
        "version": "1.0",
        "name": "machineName",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub0",
                "$type": "state",
                "onEntry": [
                    $send_l10_c14
                ],
                "transitions": [{
                    "event": "parentToChild",
                    "target": "subFinal",
                    "$closeLine": 12,
                    "$closeColumn": 58
                }],
                "$closeLine": 13,
                "$closeColumn": 7
            },
            {
                "id": "subFinal",
                "$type": "final",
                "$closeLine": 14,
                "$closeColumn": 26
            }
        ],
        "$closeLine": 15,
        "$closeColumn": 9,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test347.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MzQ3LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJNO0FBQUEsQ0FBaUM7QUFBQTs7Ozs7QUFBakM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQWlDO0FBQUE7Ozs7O0FBVS9CO0FBQUEsQ0FBbUc7QUFBQTs7Ozs7QUFBbkc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBbUc7QUFBQTs7Ozs7QUFPbkQsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFDUixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEzQmxEO0FBQUEsQ0FBb0c7QUFBQTs7Ozs7QUFBcEc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBb0c7QUFBQSJ9