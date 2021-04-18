//Generated on 2018-10-16 14:28:39 by the SCION SCXML compiler
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
            "type": "scxml",
            "src": null,
            "id": $invoke_l10_c3.id,
            "constructorFunction": $invoke_l10_c3Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test207.txml.scxml"
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

    function $delayexpr_l8_c37(_event) {
        return '2s'
    };
    $delayexpr_l8_c37.tagname = 'undefined';
    $delayexpr_l8_c37.line = 8;
    $delayexpr_l8_c37.column = 37;

    function $send_l8_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l8_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs($delayexpr_l8_c37.apply(this, arguments)),
        });
    };
    $send_l8_c5.tagname = 'send';
    $send_l8_c5.line = 8;
    $send_l8_c5.column = 5;

    function $cancel_l40_c7(_event) {
        this.cancel("foo");
    };
    $cancel_l40_c7.tagname = 'cancel';
    $cancel_l40_c7.line = 40;
    $cancel_l40_c7.column = 7;

    function $expr_l52_c53(_event) {
        return 'pass'
    };
    $expr_l52_c53.tagname = 'undefined';
    $expr_l52_c53.line = 52;
    $expr_l52_c53.column = 53;

    function $log_l52_c27(_event) {
        this.log("Outcome", $expr_l52_c53.apply(this, arguments));
    };
    $log_l52_c27.tagname = 'log';
    $log_l52_c27.line = 52;
    $log_l52_c27.column = 27;

    function $expr_l53_c53(_event) {
        return 'fail'
    };
    $expr_l53_c53.tagname = 'undefined';
    $expr_l53_c53.line = 53;
    $expr_l53_c53.column = 53;

    function $log_l53_c27(_event) {
        this.log("Outcome", $expr_l53_c53.apply(this, arguments));
    };
    $log_l53_c27.tagname = 'log';
    $log_l53_c27.line = 53;
    $log_l53_c27.column = 27;
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
                    $send_l8_c5
                ],
                "invokes": $invoke_l10_c3,
                "states": [{
                        "id": "s01",
                        "$type": "state",
                        "transitions": [{
                            "event": "childToParent",
                            "target": "s02",
                            "$closeLine": 41,
                            "$closeColumn": 8,
                            "onTransition": $cancel_l40_c7
                        }],
                        "$closeLine": 42,
                        "$closeColumn": 5
                    },
                    {
                        "id": "s02",
                        "$type": "state",
                        "transitions": [{
                                "event": "pass",
                                "target": "pass",
                                "$closeLine": 45,
                                "$closeColumn": 41
                            },
                            {
                                "event": "fail",
                                "target": "fail",
                                "$closeLine": 46,
                                "$closeColumn": 41
                            },
                            {
                                "event": "timeout",
                                "target": "fail",
                                "$closeLine": 47,
                                "$closeColumn": 44
                            }
                        ],
                        "$closeLine": 48,
                        "$closeColumn": 3
                    }
                ],
                "$closeLine": 50,
                "$closeColumn": 2
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l52_c27
                ],
                "$closeLine": 52,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l53_c27
                ],
                "$closeLine": 53,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 55,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test207.txml.scxml"
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

    function $senddata_l20_c14(_event) {
        return {}
    };
    $senddata_l20_c14.tagname = 'send';
    $senddata_l20_c14.line = 20;
    $senddata_l20_c14.column = 14;

    function $delayexpr_l20_c54(_event) {
        return '1s'
    };
    $delayexpr_l20_c54.tagname = 'undefined';
    $delayexpr_l20_c54.line = 20;
    $delayexpr_l20_c54.column = 54;

    function $send_l20_c14(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "event1",
            data: $senddata_l20_c14.apply(this, arguments),
            sendid: "foo",
            origin: _sessionid
        }, {
            delay: getDelayInMs($delayexpr_l20_c54.apply(this, arguments)),
        });
    };
    $send_l20_c14.tagname = 'send';
    $send_l20_c14.line = 20;
    $send_l20_c14.column = 14;

    function $senddata_l21_c15(_event) {
        return {}
    };
    $senddata_l21_c15.tagname = 'send';
    $senddata_l21_c15.line = 21;
    $senddata_l21_c15.column = 15;

    function $delayexpr_l21_c46(_event) {
        return '1.5s'
    };
    $delayexpr_l21_c46.tagname = 'undefined';
    $delayexpr_l21_c46.line = 21;
    $delayexpr_l21_c46.column = 46;

    function $send_l21_c15(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "event2",
            data: $senddata_l21_c15.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs($delayexpr_l21_c46.apply(this, arguments)),
        });
    };
    $send_l21_c15.tagname = 'send';
    $send_l21_c15.line = 21;
    $send_l21_c15.column = 15;

    function $senddata_l22_c15(_event) {
        return {}
    };
    $senddata_l22_c15.tagname = 'send';
    $senddata_l22_c15.line = 22;
    $senddata_l22_c15.column = 15;

    function $send_l22_c15(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "childToParent",
            data: $senddata_l22_c15.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l22_c15.tagname = 'send';
    $send_l22_c15.line = 22;
    $send_l22_c15.column = 15;

    function $senddata_l26_c20(_event) {
        return {}
    };
    $senddata_l26_c20.tagname = 'send';
    $senddata_l26_c20.line = 26;
    $senddata_l26_c20.column = 20;

    function $send_l26_c20(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "pass",
            data: $senddata_l26_c20.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l26_c20.tagname = 'send';
    $send_l26_c20.line = 26;
    $send_l26_c20.column = 20;

    function $senddata_l29_c23(_event) {
        return {}
    };
    $senddata_l29_c23.tagname = 'send';
    $senddata_l29_c23.line = 29;
    $senddata_l29_c23.column = 23;

    function $send_l29_c23(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "fail",
            data: $senddata_l29_c23.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l29_c23.tagname = 'send';
    $send_l29_c23.line = 29;
    $send_l29_c23.column = 23;
    return {
        "initial": "sub0",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub0",
                "$type": "state",
                "onEntry": [
                    $send_l20_c14,
                    $send_l21_c15,
                    $send_l22_c15
                ],
                "transitions": [{
                        "event": "event1",
                        "target": "subFinal",
                        "$closeLine": 27,
                        "$closeColumn": 21,
                        "onTransition": $send_l26_c20
                    },
                    {
                        "event": "*",
                        "target": "subFinal",
                        "$closeLine": 30,
                        "$closeColumn": 16,
                        "onTransition": $send_l29_c23
                    }
                ],
                "$closeLine": 32,
                "$closeColumn": 17
            },
            {
                "id": "subFinal",
                "$type": "final",
                "$closeLine": 33,
                "$closeColumn": 33
            }
        ],
        "$closeLine": 34,
        "$closeColumn": 13,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test207.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjA3LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUs7QUFBQSxDQUFzQztBQUFBOzs7OztBQUFOLFdBQUs7QUFBQTs7Ozs7QUFBckM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQXNDO0FBQUE7Ozs7O0FBZ0NwQyxtQkFBb0I7QUFBQTs7Ozs7QUFZMEIsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFDUixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWpDL0M7QUFBQSxDQUE4QztBQUFBOzs7OztBQUFOLFdBQUs7QUFBQTs7Ozs7QUFBN0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQThDO0FBQUE7Ozs7O0FBQzdDO0FBQUEsQ0FBdUM7QUFBQTs7Ozs7QUFBUixhQUFPO0FBQUE7Ozs7O0FBQXRDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUF1QztBQUFBOzs7OztBQUN2QztBQUFBLENBQTZDO0FBQUE7Ozs7O0FBQTdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUE2QztBQUFBOzs7OztBQUl4QztBQUFBLENBQW9DO0FBQUE7Ozs7O0FBQXBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFvQztBQUFBOzs7OztBQUdqQztBQUFBLENBQW9DO0FBQUE7Ozs7O0FBQXBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFvQztBQUFBIn0=