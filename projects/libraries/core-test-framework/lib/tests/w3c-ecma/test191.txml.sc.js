//Generated on 2018-10-16 14:28:37 by the SCION SCXML compiler
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

    function $invoke_l9_c5(_event) {
        this.invoke({
            "autoforward": false,
            "type": "scxml",
            "src": null,
            "id": $invoke_l9_c5.id,
            "constructorFunction": $invoke_l9_c5Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test191.txml.scxml"
        });
    };
    $invoke_l9_c5.tagname = 'invoke';
    $invoke_l9_c5.line = 9;
    $invoke_l9_c5.column = 5;

    $invoke_l9_c5.autoforward = false;

    $invoke_l9_c5.id = "s0.invokeid_0";

    function $senddata_l7_c7(_event) {
        return {}
    };
    $senddata_l7_c7.tagname = 'send';
    $senddata_l7_c7.line = 7;
    $senddata_l7_c7.column = 7;

    function $send_l7_c7(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l7_c7.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("5s"),
        });
    };
    $send_l7_c7.tagname = 'send';
    $send_l7_c7.line = 7;
    $send_l7_c7.column = 7;

    function $expr_l27_c56(_event) {
        return 'pass'
    };
    $expr_l27_c56.tagname = 'undefined';
    $expr_l27_c56.line = 27;
    $expr_l27_c56.column = 56;

    function $log_l27_c30(_event) {
        this.log("Outcome", $expr_l27_c56.apply(this, arguments));
    };
    $log_l27_c30.tagname = 'log';
    $log_l27_c30.line = 27;
    $log_l27_c30.column = 30;

    function $expr_l28_c56(_event) {
        return 'fail'
    };
    $expr_l28_c56.tagname = 'undefined';
    $expr_l28_c56.line = 28;
    $expr_l28_c56.column = 56;

    function $log_l28_c30(_event) {
        this.log("Outcome", $expr_l28_c56.apply(this, arguments));
    };
    $log_l28_c30.tagname = 'log';
    $log_l28_c30.line = 28;
    $log_l28_c30.column = 30;
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
                    $send_l7_c7
                ],
                "invokes": $invoke_l9_c5,
                "transitions": [{
                        "event": "childToParent",
                        "target": "pass",
                        "$closeLine": 23,
                        "$closeColumn": 52
                    },
                    {
                        "event": "*",
                        "target": "fail",
                        "$closeLine": 24,
                        "$closeColumn": 40
                    }
                ],
                "$closeLine": 25,
                "$closeColumn": 2
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l27_c30
                ],
                "$closeLine": 27,
                "$closeColumn": 77
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l28_c30
                ],
                "$closeLine": 28,
                "$closeColumn": 77
            }
        ],
        "$closeLine": 30,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test191.txml.scxml"
    };
}

function $invoke_l9_c5Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l15_c14(_event) {
        return {}
    };
    $senddata_l15_c14.tagname = 'send';
    $senddata_l15_c14.line = 15;
    $senddata_l15_c14.column = 14;

    function $send_l15_c14(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "childToParent",
            data: $senddata_l15_c14.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l15_c14.tagname = 'send';
    $send_l15_c14.line = 15;
    $send_l15_c14.column = 14;
    return {
        "initial": "sub0",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub0",
                "$type": "state",
                "onEntry": [
                    $send_l15_c14
                ],
                "transitions": [{
                    "target": "subFinal",
                    "$closeLine": 17,
                    "$closeColumn": 40
                }],
                "$closeLine": 18,
                "$closeColumn": 11
            },
            {
                "id": "subFinal",
                "$type": "final",
                "$closeLine": 19,
                "$closeColumn": 28
            }
        ],
        "$closeLine": 20,
        "$closeColumn": 10,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test191.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MTkxLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT087QUFBQSxDQUFnQztBQUFBOzs7OztBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBZ0M7QUFBQTs7Ozs7QUFvQmlCLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7O0FBQ1IsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFibEQ7QUFBQSxDQUE2QztBQUFBOzs7OztBQUE3QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBNkM7QUFBQSJ9