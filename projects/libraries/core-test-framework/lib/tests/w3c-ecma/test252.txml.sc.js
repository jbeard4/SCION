//Generated on 2018-10-16 14:28:59 by the SCION SCXML compiler
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

    function $senddata_l7_c5(_event) {
        return {}
    };
    $senddata_l7_c5.tagname = 'send';
    $senddata_l7_c5.line = 7;
    $senddata_l7_c5.column = 5;

    function $delayexpr_l7_c37(_event) {
        return '1s'
    };
    $delayexpr_l7_c37.tagname = 'undefined';
    $delayexpr_l7_c37.line = 7;
    $delayexpr_l7_c37.column = 37;

    function $send_l7_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l7_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs($delayexpr_l7_c37.apply(this, arguments)),
        });
    };
    $send_l7_c5.tagname = 'send';
    $send_l7_c5.line = 7;
    $send_l7_c5.column = 5;

    function $invoke_l19_c6(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l19_c6.id,
            "constructorFunction": $invoke_l19_c6Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test252.txml.scxml"
        });
    };
    $invoke_l19_c6.tagname = 'invoke';
    $invoke_l19_c6.line = 19;
    $invoke_l19_c6.column = 6;

    $invoke_l19_c6.autoforward = false;

    $invoke_l19_c6.id = "s01.invokeid_0";

    function $senddata_l16_c9(_event) {
        return {}
    };
    $senddata_l16_c9.tagname = 'send';
    $senddata_l16_c9.line = 16;
    $senddata_l16_c9.column = 9;

    function $send_l16_c9(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "foo",
            data: $senddata_l16_c9.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l16_c9.tagname = 'send';
    $send_l16_c9.line = 16;
    $send_l16_c9.column = 9;

    function $expr_l44_c53(_event) {
        return 'pass'
    };
    $expr_l44_c53.tagname = 'undefined';
    $expr_l44_c53.line = 44;
    $expr_l44_c53.column = 53;

    function $log_l44_c27(_event) {
        this.log("Outcome", $expr_l44_c53.apply(this, arguments));
    };
    $log_l44_c27.tagname = 'log';
    $log_l44_c27.line = 44;
    $log_l44_c27.column = 27;

    function $expr_l45_c53(_event) {
        return 'fail'
    };
    $expr_l45_c53.tagname = 'undefined';
    $expr_l45_c53.line = 45;
    $expr_l45_c53.column = 53;

    function $log_l45_c27(_event) {
        this.log("Outcome", $expr_l45_c53.apply(this, arguments));
    };
    $log_l45_c27.tagname = 'log';
    $log_l45_c27.line = 45;
    $log_l45_c27.column = 27;
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
                "onEntry": [
                    $send_l7_c5
                ],
                "transitions": [{
                        "event": "timeout",
                        "target": "pass",
                        "$closeLine": 10,
                        "$closeColumn": 46
                    },
                    {
                        "event": "childToParent",
                        "target": "fail",
                        "$closeLine": 11,
                        "$closeColumn": 52
                    },
                    {
                        "event": "done.invoke",
                        "target": "fail",
                        "$closeLine": 12,
                        "$closeColumn": 50
                    }
                ],
                "states": [{
                        "id": "s01",
                        "$type": "state",
                        "onEntry": [
                            $send_l16_c9
                        ],
                        "invokes": $invoke_l19_c6,
                        "transitions": [{
                            "event": "foo",
                            "target": "s02",
                            "$closeLine": 37,
                            "$closeColumn": 42
                        }],
                        "$closeLine": 38,
                        "$closeColumn": 5
                    },
                    {
                        "id": "s02",
                        "$type": "state",
                        "$closeLine": 40,
                        "$closeColumn": 19
                    }
                ],
                "$closeLine": 42,
                "$closeColumn": 2
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l44_c27
                ],
                "$closeLine": 44,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l45_c27
                ],
                "$closeLine": 45,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 46,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test252.txml.scxml"
    };
}

function $invoke_l19_c6Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l28_c16(_event) {
        return {}
    };
    $senddata_l28_c16.tagname = 'send';
    $senddata_l28_c16.line = 28;
    $senddata_l28_c16.column = 16;

    function $send_l28_c16(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "childToParent",
            data: $senddata_l28_c16.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l28_c16.tagname = 'send';
    $send_l28_c16.line = 28;
    $send_l28_c16.column = 16;

    function $senddata_l24_c14(_event) {
        return {}
    };
    $senddata_l24_c14.tagname = 'send';
    $senddata_l24_c14.line = 24;
    $senddata_l24_c14.column = 14;

    function $delayexpr_l24_c46(_event) {
        return '.5s'
    };
    $delayexpr_l24_c46.tagname = 'undefined';
    $delayexpr_l24_c46.line = 24;
    $delayexpr_l24_c46.column = 46;

    function $send_l24_c14(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l24_c14.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs($delayexpr_l24_c46.apply(this, arguments)),
        });
    };
    $send_l24_c14.tagname = 'send';
    $send_l24_c14.line = 24;
    $send_l24_c14.column = 14;
    return {
        "initial": "sub0",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub0",
                "$type": "state",
                "onEntry": [
                    $send_l24_c14
                ],
                "transitions": [{
                    "event": "timeout",
                    "target": "subFinal",
                    "$closeLine": 26,
                    "$closeColumn": 58
                }],
                "onExit": [
                    $send_l28_c16
                ],
                "$closeLine": 30,
                "$closeColumn": 12
            },
            {
                "id": "subFinal",
                "$type": "final",
                "$closeLine": 31,
                "$closeColumn": 31
            }
        ],
        "$closeLine": 32,
        "$closeColumn": 12,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test252.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjUyLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPSztBQUFBLENBQXNDO0FBQUE7Ozs7O0FBQU4sV0FBSztBQUFBOzs7OztBQUFyQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBc0M7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBU2xDO0FBQUEsQ0FBaUI7QUFBQTs7Ozs7QUFBakI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQWlCO0FBQUE7Ozs7O0FBNEIyQixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7OztBQUNSLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFqQjdDO0FBQUEsQ0FBNkM7QUFBQTs7Ozs7QUFBN0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQTZDO0FBQUE7Ozs7O0FBSi9DO0FBQUEsQ0FBdUM7QUFBQTs7Ozs7QUFBUCxZQUFNO0FBQUE7Ozs7O0FBQXRDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUF1QztBQUFBIn0=