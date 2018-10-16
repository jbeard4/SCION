//Generated on 2018-10-16 14:28:59 by the SCION SCXML compiler
function rootConstructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';
    var Var1;

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
        Var1 = $serializedDatamodel["Var1"];
    }

    function $serializeDatamodel() {
        return {
            "Var1": Var1
        };
    }

    function $invoke_l15_c5(_event) {
        this.invoke({
            "autoforward": false,
            "type": "scxml",
            "src": null,
            "id": $invoke_l15_c5.id,
            "constructorFunction": $invoke_l15_c5Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test253.txml.scxml"
        });
    };
    $invoke_l15_c5.tagname = 'invoke';
    $invoke_l15_c5.line = 15;
    $invoke_l15_c5.column = 5;

    $invoke_l15_c5.autoforward = false;

    $invoke_l15_c5.id = "foo";

    function $senddata_l10_c5(_event) {
        return {}
    };
    $senddata_l10_c5.tagname = 'send';
    $senddata_l10_c5.line = 10;
    $senddata_l10_c5.column = 5;

    function $send_l10_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l10_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("2s"),
        });
    };
    $send_l10_c5.tagname = 'send';
    $send_l10_c5.line = 10;
    $send_l10_c5.column = 5;

    function $expr_l50_c37(_event) {
        return _event.origintype
    };
    $expr_l50_c37.tagname = 'undefined';
    $expr_l50_c37.line = 50;
    $expr_l50_c37.column = 37;

    function $assign_l50_c8(_event) {
        Var1 = $expr_l50_c37.apply(this, arguments);
    };
    $assign_l50_c8.tagname = 'assign';
    $assign_l50_c8.line = 50;
    $assign_l50_c8.column = 8;

    function $senddata_l57_c9(_event) {
        return {}
    };
    $senddata_l57_c9.tagname = 'send';
    $senddata_l57_c9.line = 57;
    $senddata_l57_c9.column = 9;

    function $send_l57_c9(_event) {
        var _scionTargetRef = "#_foo";
        this.send({
            target: _scionTargetRef,
            name: "parentToChild",
            data: $senddata_l57_c9.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l57_c9.tagname = 'send';
    $send_l57_c9.line = 57;
    $send_l57_c9.column = 9;

    function $cond_l56_c23(_event) {
        return Var1 == 'http://www.w3.org/TR/scxml/#SCXMLEventProcessor'
    };
    $cond_l56_c23.tagname = 'undefined';
    $cond_l56_c23.line = 56;
    $cond_l56_c23.column = 23;

    function $senddata_l60_c9(_event) {
        return {}
    };
    $senddata_l60_c9.tagname = 'send';
    $senddata_l60_c9.line = 60;
    $senddata_l60_c9.column = 9;

    function $send_l60_c9(_event) {
        var _scionTargetRef = "#_foo";
        this.send({
            target: _scionTargetRef,
            name: "parentToChild",
            data: $senddata_l60_c9.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l60_c9.tagname = 'send';
    $send_l60_c9.line = 60;
    $send_l60_c9.column = 9;

    function $cond_l59_c22(_event) {
        return Var1 == 'scxml'
    };
    $cond_l59_c22.tagname = 'undefined';
    $cond_l59_c22.line = 59;
    $cond_l59_c22.column = 22;

    function $expr_l76_c53(_event) {
        return 'pass'
    };
    $expr_l76_c53.tagname = 'undefined';
    $expr_l76_c53.line = 76;
    $expr_l76_c53.column = 53;

    function $log_l76_c27(_event) {
        this.log("Outcome", $expr_l76_c53.apply(this, arguments));
    };
    $log_l76_c27.tagname = 'log';
    $log_l76_c27.line = 76;
    $log_l76_c27.column = 27;

    function $expr_l77_c53(_event) {
        return 'fail'
    };
    $expr_l77_c53.tagname = 'undefined';
    $expr_l77_c53.line = 77;
    $expr_l77_c53.column = 53;

    function $log_l77_c27(_event) {
        this.log("Outcome", $expr_l77_c53.apply(this, arguments));
    };
    $log_l77_c27.tagname = 'log';
    $log_l77_c27.line = 77;
    $log_l77_c27.column = 27;
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
                    $send_l10_c5
                ],
                "transitions": [{
                    "event": "timeout",
                    "target": "fail",
                    "$closeLine": 13,
                    "$closeColumn": 46
                }],
                "invokes": $invoke_l15_c5,
                "states": [{
                        "id": "s01",
                        "$type": "state",
                        "transitions": [{
                            "event": "childRunning",
                            "target": "s02",
                            "$closeLine": 51,
                            "$closeColumn": 9,
                            "onTransition": $assign_l50_c8
                        }],
                        "$closeLine": 52,
                        "$closeColumn": 5
                    },
                    {
                        "id": "s02",
                        "$type": "state",
                        "transitions": [{
                                "cond": $cond_l56_c23,
                                "target": "s03",
                                "$closeLine": 58,
                                "$closeColumn": 10,
                                "onTransition": $send_l57_c9
                            },
                            {
                                "cond": $cond_l59_c22,
                                "target": "s03",
                                "$closeLine": 61,
                                "$closeColumn": 10,
                                "onTransition": $send_l60_c9
                            },
                            {
                                "target": "fail",
                                "$closeLine": 63,
                                "$closeColumn": 30
                            }
                        ],
                        "$closeLine": 65,
                        "$closeColumn": 6
                    },
                    {
                        "id": "s03",
                        "$type": "state",
                        "transitions": [{
                                "event": "success",
                                "target": "pass",
                                "$closeLine": 69,
                                "$closeColumn": 49
                            },
                            {
                                "event": "fail",
                                "target": "fail",
                                "$closeLine": 70,
                                "$closeColumn": 46
                            }
                        ],
                        "$closeLine": 72,
                        "$closeColumn": 7
                    }
                ],
                "$closeLine": 74,
                "$closeColumn": 2
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l76_c27
                ],
                "$closeLine": 76,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l77_c27
                ],
                "$closeLine": 77,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 78,
        "$closeColumn": 2,
        "onEntry": [],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test253.txml.scxml"
    };
}

function $invoke_l15_c5Constructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';
    var Var2;

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
        Var2 = $serializedDatamodel["Var2"];
    }

    function $serializeDatamodel() {
        return {
            "Var2": Var2
        };
    }

    function $senddata_l25_c16(_event) {
        return {}
    };
    $senddata_l25_c16.tagname = 'send';
    $senddata_l25_c16.line = 25;
    $senddata_l25_c16.column = 16;

    function $send_l25_c16(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "childRunning",
            data: $senddata_l25_c16.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l25_c16.tagname = 'send';
    $send_l25_c16.line = 25;
    $send_l25_c16.column = 16;

    function $expr_l29_c41(_event) {
        return _event.origintype
    };
    $expr_l29_c41.tagname = 'undefined';
    $expr_l29_c41.line = 29;
    $expr_l29_c41.column = 41;

    function $assign_l29_c12(_event) {
        Var2 = $expr_l29_c41.apply(this, arguments);
    };
    $assign_l29_c12.tagname = 'assign';
    $assign_l29_c12.line = 29;
    $assign_l29_c12.column = 12;

    function $senddata_l34_c14(_event) {
        return {}
    };
    $senddata_l34_c14.tagname = 'send';
    $senddata_l34_c14.line = 34;
    $senddata_l34_c14.column = 14;

    function $send_l34_c14(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "success",
            data: $senddata_l34_c14.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l34_c14.tagname = 'send';
    $send_l34_c14.line = 34;
    $send_l34_c14.column = 14;

    function $cond_l33_c30(_event) {
        return Var2 == 'http://www.w3.org/TR/scxml/#SCXMLEventProcessor'
    };
    $cond_l33_c30.tagname = 'undefined';
    $cond_l33_c30.line = 33;
    $cond_l33_c30.column = 30;

    function $senddata_l37_c14(_event) {
        return {}
    };
    $senddata_l37_c14.tagname = 'send';
    $senddata_l37_c14.line = 37;
    $senddata_l37_c14.column = 14;

    function $send_l37_c14(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "success",
            data: $senddata_l37_c14.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l37_c14.tagname = 'send';
    $send_l37_c14.line = 37;
    $send_l37_c14.column = 14;

    function $cond_l36_c30(_event) {
        return Var2 == 'scxml'
    };
    $cond_l36_c30.tagname = 'undefined';
    $cond_l36_c30.line = 36;
    $cond_l36_c30.column = 30;

    function $senddata_l40_c17(_event) {
        return {}
    };
    $senddata_l40_c17.tagname = 'send';
    $senddata_l40_c17.line = 40;
    $senddata_l40_c17.column = 17;

    function $send_l40_c17(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "failure",
            data: $senddata_l40_c17.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l40_c17.tagname = 'send';
    $send_l40_c17.line = 40;
    $send_l40_c17.column = 17;
    return {
        "initial": "sub0",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub0",
                "$type": "state",
                "onEntry": [
                    $send_l25_c16
                ],
                "transitions": [{
                    "event": "parentToChild",
                    "target": "sub1",
                    "$closeLine": 30,
                    "$closeColumn": 12,
                    "onTransition": $assign_l29_c12
                }],
                "$closeLine": 31,
                "$closeColumn": 11
            },
            {
                "id": "sub1",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l33_c30,
                        "target": "subFinal",
                        "$closeLine": 35,
                        "$closeColumn": 18,
                        "onTransition": $send_l34_c14
                    },
                    {
                        "cond": $cond_l36_c30,
                        "target": "subFinal",
                        "$closeLine": 38,
                        "$closeColumn": 16,
                        "onTransition": $send_l37_c14
                    },
                    {
                        "target": "subFinal",
                        "$closeLine": 41,
                        "$closeColumn": 15,
                        "onTransition": $send_l40_c17
                    }
                ],
                "$closeLine": 42,
                "$closeColumn": 13
            },
            {
                "id": "subFinal",
                "$type": "final",
                "$closeLine": 43,
                "$closeColumn": 31
            }
        ],
        "$closeLine": 44,
        "$closeColumn": 14,
        "onEntry": [],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test253.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjUzLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVVLO0FBQUEsQ0FBZ0M7QUFBQTs7Ozs7QUFBaEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQWdDO0FBQUE7Ozs7O0FBd0NBLGFBQU0sQ0FBQyxVQUFXO0FBQUE7Ozs7O0FBQS9DLDRDQUFnRDtBQUFBOzs7OztBQU8vQztBQUFBLENBQTBDO0FBQUE7Ozs7O0FBQTFDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUEwQztBQUFBOzs7OztBQUQ1QixXQUFJLEVBQUUsaURBQWtEO0FBQUE7Ozs7O0FBSXRFO0FBQUEsQ0FBMEM7QUFBQTs7Ozs7QUFBMUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQTBDO0FBQUE7Ozs7O0FBRDdCLFdBQUksRUFBRSxPQUFRO0FBQUE7Ozs7O0FBaUJpQixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7OztBQUNSLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXBEN0M7QUFBQSxDQUE0QztBQUFBOzs7OztBQUE1QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBNEM7QUFBQTs7Ozs7QUFJbkIsYUFBTSxDQUFDLFVBQVc7QUFBQTs7Ozs7QUFBL0MsNENBQWdEO0FBQUE7Ozs7O0FBSzlDO0FBQUEsQ0FBdUM7QUFBQTs7Ozs7QUFBdkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQXVDO0FBQUE7Ozs7O0FBRHZCLFdBQUksRUFBRSxpREFBa0Q7QUFBQTs7Ozs7QUFJeEU7QUFBQSxDQUF1QztBQUFBOzs7OztBQUF2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBdUM7QUFBQTs7Ozs7QUFEdkIsV0FBSSxFQUFFLE9BQVE7QUFBQTs7Ozs7QUFJM0I7QUFBQSxDQUF1QztBQUFBOzs7OztBQUF2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBdUM7QUFBQSJ9