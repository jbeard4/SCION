//Generated on 2018-10-16 14:28:38 by the SCION SCXML compiler
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

    function $invoke_l11_c3(_event) {
        this.invoke({
            "autoforward": false,
            "type": "scxml",
            "src": null,
            "id": $invoke_l11_c3.id,
            "constructorFunction": $invoke_l11_c3Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test192.txml.scxml"
        });
    };
    $invoke_l11_c3.tagname = 'invoke';
    $invoke_l11_c3.line = 11;
    $invoke_l11_c3.column = 3;

    $invoke_l11_c3.autoforward = false;

    $invoke_l11_c3.id = "invokedChild";

    function $senddata_l8_c4(_event) {
        return {}
    };
    $senddata_l8_c4.tagname = 'send';
    $senddata_l8_c4.line = 8;
    $senddata_l8_c4.column = 4;

    function $send_l8_c4(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l8_c4.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("5s"),
        });
    };
    $send_l8_c4.tagname = 'send';
    $send_l8_c4.line = 8;
    $send_l8_c4.column = 4;

    function $senddata_l41_c10(_event) {
        return {}
    };
    $senddata_l41_c10.tagname = 'send';
    $senddata_l41_c10.line = 41;
    $senddata_l41_c10.column = 10;

    function $send_l41_c10(_event) {
        var _scionTargetRef = "#_invokedChild";
        this.send({
            target: _scionTargetRef,
            name: "parentToChild",
            data: $senddata_l41_c10.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l41_c10.tagname = 'send';
    $send_l41_c10.line = 41;
    $send_l41_c10.column = 10;

    function $expr_l51_c56(_event) {
        return 'pass'
    };
    $expr_l51_c56.tagname = 'undefined';
    $expr_l51_c56.line = 51;
    $expr_l51_c56.column = 56;

    function $log_l51_c30(_event) {
        this.log("Outcome", $expr_l51_c56.apply(this, arguments));
    };
    $log_l51_c30.tagname = 'log';
    $log_l51_c30.line = 51;
    $log_l51_c30.column = 30;

    function $expr_l52_c56(_event) {
        return 'fail'
    };
    $expr_l52_c56.tagname = 'undefined';
    $expr_l52_c56.line = 52;
    $expr_l52_c56.column = 56;

    function $log_l52_c30(_event) {
        this.log("Outcome", $expr_l52_c56.apply(this, arguments));
    };
    $log_l52_c30.tagname = 'log';
    $log_l52_c30.line = 52;
    $log_l52_c30.column = 30;
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
                    $send_l8_c4
                ],
                "invokes": $invoke_l11_c3,
                "transitions": [{
                        "event": "timeout",
                        "target": "fail",
                        "$closeLine": 36,
                        "$closeColumn": 44
                    },
                    {
                        "event": "done.invoke",
                        "target": "fail",
                        "$closeLine": 37,
                        "$closeColumn": 48
                    }
                ],
                "states": [{
                        "id": "s01",
                        "$type": "state",
                        "transitions": [{
                            "event": "childToParent",
                            "target": "s02",
                            "$closeLine": 42,
                            "$closeColumn": 7,
                            "onTransition": $send_l41_c10
                        }],
                        "$closeLine": 43,
                        "$closeColumn": 2
                    },
                    {
                        "id": "s02",
                        "$type": "state",
                        "transitions": [{
                            "event": "eventReceived",
                            "target": "pass",
                            "$closeLine": 46,
                            "$closeColumn": 50
                        }],
                        "$closeLine": 47,
                        "$closeColumn": 4
                    }
                ],
                "$closeLine": 49,
                "$closeColumn": 2
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l51_c30
                ],
                "$closeLine": 51,
                "$closeColumn": 77
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l52_c30
                ],
                "$closeLine": 52,
                "$closeColumn": 77
            }
        ],
        "$closeLine": 54,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test192.txml.scxml"
    };
}

function $invoke_l11_c3Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l19_c12(_event) {
        return {}
    };
    $senddata_l19_c12.tagname = 'send';
    $senddata_l19_c12.line = 19;
    $senddata_l19_c12.column = 12;

    function $send_l19_c12(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "childToParent",
            data: $senddata_l19_c12.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l19_c12.tagname = 'send';
    $send_l19_c12.line = 19;
    $send_l19_c12.column = 12;

    function $senddata_l20_c13(_event) {
        return {}
    };
    $senddata_l20_c13.tagname = 'send';
    $senddata_l20_c13.line = 20;
    $senddata_l20_c13.column = 13;

    function $send_l20_c13(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l20_c13.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("3s"),
        });
    };
    $send_l20_c13.tagname = 'send';
    $send_l20_c13.line = 20;
    $send_l20_c13.column = 13;

    function $senddata_l24_c11(_event) {
        return {}
    };
    $senddata_l24_c11.tagname = 'send';
    $senddata_l24_c11.line = 24;
    $senddata_l24_c11.column = 11;

    function $send_l24_c11(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "eventReceived",
            data: $senddata_l24_c11.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l24_c11.tagname = 'send';
    $send_l24_c11.line = 24;
    $send_l24_c11.column = 11;
    return {
        "initial": "sub0",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub0",
                "$type": "state",
                "onEntry": [
                    $send_l19_c12,
                    $send_l20_c13
                ],
                "transitions": [{
                        "event": "parentToChild",
                        "target": "subFinal",
                        "$closeLine": 25,
                        "$closeColumn": 11,
                        "onTransition": $send_l24_c11
                    },
                    {
                        "event": "timeout",
                        "target": "subFinal",
                        "$closeLine": 27,
                        "$closeColumn": 56
                    }
                ],
                "$closeLine": 28,
                "$closeColumn": 11
            },
            {
                "id": "subFinal",
                "$type": "final",
                "$closeLine": 30,
                "$closeColumn": 29
            }
        ],
        "$closeLine": 32,
        "$closeColumn": 11,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test192.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MTkyLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUk7QUFBQSxDQUFnQztBQUFBOzs7OztBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBZ0M7QUFBQTs7Ozs7QUFpQzFCO0FBQUEsQ0FBbUQ7QUFBQTs7Ozs7QUFBbkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQW1EO0FBQUE7Ozs7O0FBVUwsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFDUixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBakNwRDtBQUFBLENBQTZDO0FBQUE7Ozs7O0FBQTdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUE2QztBQUFBOzs7OztBQUM1QztBQUFBLENBQWdDO0FBQUE7Ozs7O0FBQWhDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFnQztBQUFBOzs7OztBQUlsQztBQUFBLENBQTZDO0FBQUE7Ozs7O0FBQTdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUE2QztBQUFBIn0=