//Generated on 2018-10-16 14:28:47 by the SCION SCXML compiler
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

    function $invoke_l7_c3(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l7_c3.id,
            "constructorFunction": $invoke_l7_c3Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test232.txml.scxml"
        });
    };
    $invoke_l7_c3.tagname = 'invoke';
    $invoke_l7_c3.line = 7;
    $invoke_l7_c3.column = 3;

    $invoke_l7_c3.autoforward = false;

    $invoke_l7_c3.id = "s0.invokeid_0";

    function $senddata_l5_c5(_event) {
        return {}
    };
    $senddata_l5_c5.tagname = 'send';
    $senddata_l5_c5.line = 5;
    $senddata_l5_c5.column = 5;

    function $send_l5_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l5_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("3s"),
        });
    };
    $send_l5_c5.tagname = 'send';
    $send_l5_c5.line = 5;
    $send_l5_c5.column = 5;

    function $expr_l36_c53(_event) {
        return 'pass'
    };
    $expr_l36_c53.tagname = 'undefined';
    $expr_l36_c53.line = 36;
    $expr_l36_c53.column = 53;

    function $log_l36_c27(_event) {
        this.log("Outcome", $expr_l36_c53.apply(this, arguments));
    };
    $log_l36_c27.tagname = 'log';
    $log_l36_c27.line = 36;
    $log_l36_c27.column = 27;

    function $expr_l37_c53(_event) {
        return 'fail'
    };
    $expr_l37_c53.tagname = 'undefined';
    $expr_l37_c53.line = 37;
    $expr_l37_c53.column = 53;

    function $log_l37_c27(_event) {
        this.log("Outcome", $expr_l37_c53.apply(this, arguments));
    };
    $log_l37_c27.tagname = 'log';
    $log_l37_c27.line = 37;
    $log_l37_c27.column = 27;
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
                    $send_l5_c5
                ],
                "invokes": $invoke_l7_c3,
                "transitions": [{
                    "event": "timeout",
                    "target": "fail",
                    "$closeLine": 19,
                    "$closeColumn": 44
                }],
                "states": [{
                        "id": "s01",
                        "$type": "state",
                        "transitions": [{
                            "event": "childToParent1",
                            "target": "s02",
                            "$closeLine": 23,
                            "$closeColumn": 50
                        }],
                        "$closeLine": 24,
                        "$closeColumn": 3
                    },
                    {
                        "id": "s02",
                        "$type": "state",
                        "transitions": [{
                            "event": "childToParent2",
                            "target": "s03",
                            "$closeLine": 27,
                            "$closeColumn": 51
                        }],
                        "$closeLine": 28,
                        "$closeColumn": 5
                    },
                    {
                        "id": "s03",
                        "$type": "state",
                        "transitions": [{
                            "event": "done.invoke",
                            "target": "pass",
                            "$closeLine": 31,
                            "$closeColumn": 48
                        }],
                        "$closeLine": 32,
                        "$closeColumn": 4
                    }
                ],
                "$closeLine": 34,
                "$closeColumn": 2
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l36_c27
                ],
                "$closeLine": 36,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l37_c27
                ],
                "$closeLine": 37,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 39,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test232.txml.scxml"
    };
}

function $invoke_l7_c3Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l12_c14(_event) {
        return {}
    };
    $senddata_l12_c14.tagname = 'send';
    $senddata_l12_c14.line = 12;
    $senddata_l12_c14.column = 14;

    function $send_l12_c14(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "childToParent1",
            data: $senddata_l12_c14.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l12_c14.tagname = 'send';
    $send_l12_c14.line = 12;
    $send_l12_c14.column = 14;

    function $senddata_l13_c16(_event) {
        return {}
    };
    $senddata_l13_c16.tagname = 'send';
    $senddata_l13_c16.line = 13;
    $senddata_l13_c16.column = 16;

    function $send_l13_c16(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "childToParent2",
            data: $senddata_l13_c16.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l13_c16.tagname = 'send';
    $send_l13_c16.line = 13;
    $send_l13_c16.column = 16;
    return {
        "initial": "subFinal",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
            "id": "subFinal",
            "$type": "final",
            "onEntry": [
                $send_l12_c14,
                $send_l13_c16
            ],
            "$closeLine": 15,
            "$closeColumn": 9
        }],
        "$closeLine": 16,
        "$closeColumn": 11,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test232.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjMyLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0s7QUFBQSxDQUFnQztBQUFBOzs7OztBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBZ0M7QUFBQTs7Ozs7QUErQmdCLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7O0FBQ1IsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF6Qi9DO0FBQUEsQ0FBOEM7QUFBQTs7Ozs7QUFBOUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQThDO0FBQUE7Ozs7O0FBQzVDO0FBQUEsQ0FBOEM7QUFBQTs7Ozs7QUFBOUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQThDO0FBQUEifQ==