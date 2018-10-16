//Generated on 2018-10-16 14:28:50 by the SCION SCXML compiler
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

    function $invoke_l9_c3(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l9_c3.id,
            "constructorFunction": $invoke_l9_c3Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test236.txml.scxml"
        });
    };
    $invoke_l9_c3.tagname = 'invoke';
    $invoke_l9_c3.line = 9;
    $invoke_l9_c3.column = 3;

    $invoke_l9_c3.autoforward = false;

    $invoke_l9_c3.id = "s0.invokeid_0";

    function $senddata_l7_c5(_event) {
        return {}
    };
    $senddata_l7_c5.tagname = 'send';
    $senddata_l7_c5.line = 7;
    $senddata_l7_c5.column = 5;

    function $delayexpr_l7_c37(_event) {
        return '2s'
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
                "$type": "state",
                "onEntry": [
                    $send_l7_c5
                ],
                "invokes": $invoke_l9_c3,
                "transitions": [{
                        "event": "childToParent",
                        "target": "s1",
                        "$closeLine": 21,
                        "$closeColumn": 48
                    },
                    {
                        "event": "done.invoke",
                        "target": "fail",
                        "$closeLine": 22,
                        "$closeColumn": 48
                    }
                ],
                "$closeLine": 23,
                "$closeColumn": 2
            },
            {
                "id": "s1",
                "$type": "state",
                "transitions": [{
                        "event": "done.invoke",
                        "target": "s2",
                        "$closeLine": 27,
                        "$closeColumn": 46
                    },
                    {
                        "event": "*",
                        "target": "fail",
                        "$closeLine": 28,
                        "$closeColumn": 38
                    }
                ],
                "$closeLine": 29,
                "$closeColumn": 4
            },
            {
                "id": "s2",
                "$type": "state",
                "transitions": [{
                        "event": "timeout",
                        "target": "pass",
                        "$closeLine": 32,
                        "$closeColumn": 44
                    },
                    {
                        "event": "*",
                        "target": "fail",
                        "$closeLine": 33,
                        "$closeColumn": 38
                    }
                ],
                "$closeLine": 34,
                "$closeColumn": 4
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
        "$closeLine": 38,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test236.txml.scxml"
    };
}

function $invoke_l9_c3Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l14_c12(_event) {
        return {}
    };
    $senddata_l14_c12.tagname = 'send';
    $senddata_l14_c12.line = 14;
    $senddata_l14_c12.column = 12;

    function $send_l14_c12(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "childToParent",
            data: $senddata_l14_c12.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l14_c12.tagname = 'send';
    $send_l14_c12.line = 14;
    $send_l14_c12.column = 12;
    return {
        "initial": "subFinal",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
            "id": "subFinal",
            "$type": "final",
            "onExit": [
                $send_l14_c12
            ],
            "$closeLine": 16,
            "$closeColumn": 13
        }],
        "$closeLine": 17,
        "$closeColumn": 11,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test236.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjM2LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0s7QUFBQSxDQUFzQztBQUFBOzs7OztBQUFOLFdBQUs7QUFBQTs7Ozs7QUFBckM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQXNDO0FBQUE7Ozs7O0FBNkJVLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7O0FBQ1IsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdkJqRDtBQUFBLENBQTZDO0FBQUE7Ozs7O0FBQTdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUE2QztBQUFBIn0=