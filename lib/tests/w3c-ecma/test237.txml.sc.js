//Generated on 2018-10-16 14:28:51 by the SCION SCXML compiler
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

    function $invoke_l10_c3(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l10_c3.id,
            "constructorFunction": $invoke_l10_c3Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test237.txml.scxml"
        });
    };
    $invoke_l10_c3.tagname = 'invoke';
    $invoke_l10_c3.line = 10;
    $invoke_l10_c3.column = 3;

    $invoke_l10_c3.autoforward = false;

    $invoke_l10_c3.id = "s0.invokeid_0";

    function $senddata_l8_c5(_event) {
        return {}
    };
    $senddata_l8_c5.tagname = 'send';
    $senddata_l8_c5.line = 8;
    $senddata_l8_c5.column = 5;

    function $delayexpr_l8_c38(_event) {
        return '1s'
    };
    $delayexpr_l8_c38.tagname = 'undefined';
    $delayexpr_l8_c38.line = 8;
    $delayexpr_l8_c38.column = 38;

    function $send_l8_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout1",
            data: $senddata_l8_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs($delayexpr_l8_c38.apply(this, arguments)),
        });
    };
    $send_l8_c5.tagname = 'send';
    $send_l8_c5.line = 8;
    $send_l8_c5.column = 5;

    function $senddata_l31_c5(_event) {
        return {}
    };
    $senddata_l31_c5.tagname = 'send';
    $senddata_l31_c5.line = 31;
    $senddata_l31_c5.column = 5;

    function $delayexpr_l31_c38(_event) {
        return '1.5s'
    };
    $delayexpr_l31_c38.tagname = 'undefined';
    $delayexpr_l31_c38.line = 31;
    $delayexpr_l31_c38.column = 38;

    function $send_l31_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout2",
            data: $senddata_l31_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs($delayexpr_l31_c38.apply(this, arguments)),
        });
    };
    $send_l31_c5.tagname = 'send';
    $send_l31_c5.line = 31;
    $send_l31_c5.column = 5;

    function $expr_l38_c53(_event) {
        return 'pass'
    };
    $expr_l38_c53.tagname = 'undefined';
    $expr_l38_c53.line = 38;
    $expr_l38_c53.column = 53;

    function $log_l38_c27(_event) {
        this.log("Outcome", $expr_l38_c53.apply(this, arguments));
    };
    $log_l38_c27.tagname = 'log';
    $log_l38_c27.line = 38;
    $log_l38_c27.column = 27;

    function $expr_l39_c53(_event) {
        return 'fail'
    };
    $expr_l39_c53.tagname = 'undefined';
    $expr_l39_c53.line = 39;
    $expr_l39_c53.column = 53;

    function $log_l39_c27(_event) {
        this.log("Outcome", $expr_l39_c53.apply(this, arguments));
    };
    $log_l39_c27.tagname = 'log';
    $log_l39_c27.line = 39;
    $log_l39_c27.column = 27;
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
                    $send_l8_c5
                ],
                "invokes": $invoke_l10_c3,
                "transitions": [{
                    "event": "timeout1",
                    "target": "s1",
                    "$closeLine": 25,
                    "$closeColumn": 43
                }],
                "$closeLine": 27,
                "$closeColumn": 2
            },
            {
                "id": "s1",
                "$type": "state",
                "onEntry": [
                    $send_l31_c5
                ],
                "transitions": [{
                        "event": "done.invoke",
                        "target": "fail",
                        "$closeLine": 34,
                        "$closeColumn": 48
                    },
                    {
                        "event": "*",
                        "target": "pass",
                        "$closeLine": 35,
                        "$closeColumn": 38
                    }
                ],
                "$closeLine": 36,
                "$closeColumn": 4
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l38_c27
                ],
                "$closeLine": 38,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l39_c27
                ],
                "$closeLine": 39,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 40,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test237.txml.scxml"
    };
}

function $invoke_l10_c3Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l16_c15(_event) {
        return {}
    };
    $senddata_l16_c15.tagname = 'send';
    $senddata_l16_c15.line = 16;
    $senddata_l16_c15.column = 15;

    function $delayexpr_l16_c47(_event) {
        return '2s'
    };
    $delayexpr_l16_c47.tagname = 'undefined';
    $delayexpr_l16_c47.line = 16;
    $delayexpr_l16_c47.column = 47;

    function $send_l16_c15(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l16_c15.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs($delayexpr_l16_c47.apply(this, arguments)),
        });
    };
    $send_l16_c15.tagname = 'send';
    $send_l16_c15.line = 16;
    $send_l16_c15.column = 15;
    return {
        "initial": "sub0",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub0",
                "$type": "state",
                "onEntry": [
                    $send_l16_c15
                ],
                "transitions": [{
                    "event": "timeout",
                    "target": "subFinal",
                    "$closeLine": 18,
                    "$closeColumn": 61
                }],
                "$closeLine": 19,
                "$closeColumn": 18
            },
            {
                "id": "subFinal",
                "$type": "final",
                "$closeLine": 20,
                "$closeColumn": 33
            }
        ],
        "$closeLine": 21,
        "$closeColumn": 11,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test237.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjM3LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUs7QUFBQSxDQUF1QztBQUFBOzs7OztBQUFOLFdBQUs7QUFBQTs7Ozs7QUFBdEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQXVDO0FBQUE7Ozs7O0FBdUJ2QztBQUFBLENBQXlDO0FBQUE7Ozs7O0FBQVIsYUFBTztBQUFBOzs7OztBQUF4QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBeUM7QUFBQTs7Ozs7QUFPTyxhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7OztBQUNSLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF2QjlDO0FBQUEsQ0FBc0M7QUFBQTs7Ozs7QUFBTixXQUFLO0FBQUE7Ozs7O0FBQXJDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFzQztBQUFBIn0=