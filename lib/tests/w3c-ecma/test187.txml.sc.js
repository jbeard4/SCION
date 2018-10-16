//Generated on 2018-10-16 14:28:36 by the SCION SCXML compiler
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

    function $invoke_l10_c5(_event) {
        this.invoke({
            "autoforward": false,
            "type": "scxml",
            "src": null,
            "id": $invoke_l10_c5.id,
            "constructorFunction": $invoke_l10_c5Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test187.txml.scxml"
        });
    };
    $invoke_l10_c5.tagname = 'invoke';
    $invoke_l10_c5.line = 10;
    $invoke_l10_c5.column = 5;

    $invoke_l10_c5.autoforward = false;

    $invoke_l10_c5.id = "s0.invokeid_0";

    function $senddata_l8_c7(_event) {
        return {}
    };
    $senddata_l8_c7.tagname = 'send';
    $senddata_l8_c7.line = 8;
    $senddata_l8_c7.column = 7;

    function $delayexpr_l8_c39(_event) {
        return '1s'
    };
    $delayexpr_l8_c39.tagname = 'undefined';
    $delayexpr_l8_c39.line = 8;
    $delayexpr_l8_c39.column = 39;

    function $send_l8_c7(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l8_c7.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs($delayexpr_l8_c39.apply(this, arguments)),
        });
    };
    $send_l8_c7.tagname = 'send';
    $send_l8_c7.line = 8;
    $send_l8_c7.column = 7;

    function $expr_l29_c56(_event) {
        return 'pass'
    };
    $expr_l29_c56.tagname = 'undefined';
    $expr_l29_c56.line = 29;
    $expr_l29_c56.column = 56;

    function $log_l29_c30(_event) {
        this.log("Outcome", $expr_l29_c56.apply(this, arguments));
    };
    $log_l29_c30.tagname = 'log';
    $log_l29_c30.line = 29;
    $log_l29_c30.column = 30;

    function $expr_l30_c56(_event) {
        return 'fail'
    };
    $expr_l30_c56.tagname = 'undefined';
    $expr_l30_c56.line = 30;
    $expr_l30_c56.column = 56;

    function $log_l30_c30(_event) {
        this.log("Outcome", $expr_l30_c56.apply(this, arguments));
    };
    $log_l30_c30.tagname = 'log';
    $log_l30_c30.line = 30;
    $log_l30_c30.column = 30;
    return {
        "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
        "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
        "initial": "s0",
        "$type": "scxml",
        "id": "$generated-scxml-0",
        "states": [{
                "id": "s0",
                "$type": "state",
                "onEntry": [
                    $send_l8_c7
                ],
                "invokes": $invoke_l10_c5,
                "transitions": [{
                        "event": "childToParent",
                        "target": "fail",
                        "$closeLine": 25,
                        "$closeColumn": 52
                    },
                    {
                        "event": "timeout",
                        "target": "pass",
                        "$closeLine": 26,
                        "$closeColumn": 46
                    }
                ],
                "$closeLine": 27,
                "$closeColumn": 2
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l29_c30
                ],
                "$closeLine": 29,
                "$closeColumn": 77
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l30_c30
                ],
                "$closeLine": 30,
                "$closeColumn": 77
            }
        ],
        "$closeLine": 32,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test187.txml.scxml"
    };
}

function $invoke_l10_c5Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l16_c17(_event) {
        return {}
    };
    $senddata_l16_c17.tagname = 'send';
    $senddata_l16_c17.line = 16;
    $senddata_l16_c17.column = 17;

    function $delayexpr_l16_c73(_event) {
        return '.5s'
    };
    $delayexpr_l16_c73.tagname = 'undefined';
    $delayexpr_l16_c73.line = 16;
    $delayexpr_l16_c73.column = 73;

    function $send_l16_c17(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "childToParent",
            data: $senddata_l16_c17.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs($delayexpr_l16_c73.apply(this, arguments)),
        });
    };
    $send_l16_c17.tagname = 'send';
    $send_l16_c17.line = 16;
    $send_l16_c17.column = 17;
    return {
        "initial": "sub0",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub0",
                "$type": "state",
                "onEntry": [
                    $send_l16_c17
                ],
                "transitions": [{
                    "target": "subFinal",
                    "$closeLine": 18,
                    "$closeColumn": 40
                }],
                "$closeLine": 19,
                "$closeColumn": 12
            },
            {
                "id": "subFinal",
                "$type": "final",
                "$closeLine": 20,
                "$closeColumn": 27
            }
        ],
        "$closeLine": 21,
        "$closeColumn": 6,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test187.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MTg3LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUU87QUFBQSxDQUFzQztBQUFBOzs7OztBQUFOLFdBQUs7QUFBQTs7Ozs7QUFBckM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQXNDO0FBQUE7Ozs7O0FBcUJXLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7O0FBQ1IsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFkL0M7QUFBQSxDQUErRDtBQUFBOzs7OztBQUFQLFlBQU07QUFBQTs7Ozs7QUFBOUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQStEO0FBQUEifQ==