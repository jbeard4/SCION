//Generated on 2018-10-16 14:29:04 by the SCION SCXML compiler
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

    function $invoke_l21_c6(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l21_c6.id,
            "constructorFunction": $invoke_l21_c6Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test422.txml.scxml"
        });
    };
    $invoke_l21_c6.tagname = 'invoke';
    $invoke_l21_c6.line = 21;
    $invoke_l21_c6.column = 6;

    $invoke_l21_c6.autoforward = false;

    $invoke_l21_c6.id = "s1.invokeid_0";

    function $senddata_l12_c5(_event) {
        return {}
    };
    $senddata_l12_c5.tagname = 'send';
    $senddata_l12_c5.line = 12;
    $senddata_l12_c5.column = 5;

    function $delayexpr_l12_c37(_event) {
        return '2s'
    };
    $delayexpr_l12_c37.tagname = 'undefined';
    $delayexpr_l12_c37.line = 12;
    $delayexpr_l12_c37.column = 37;

    function $send_l12_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l12_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs($delayexpr_l12_c37.apply(this, arguments)),
        });
    };
    $send_l12_c5.tagname = 'send';
    $send_l12_c5.line = 12;
    $send_l12_c5.column = 5;

    function $expr_l15_c36(_event) {
        return Var1 + 1
    };
    $expr_l15_c36.tagname = 'undefined';
    $expr_l15_c36.line = 15;
    $expr_l15_c36.column = 36;

    function $assign_l15_c7(_event) {
        Var1 = $expr_l15_c36.apply(this, arguments);
    };
    $assign_l15_c7.tagname = 'assign';
    $assign_l15_c7.line = 15;
    $assign_l15_c7.column = 7;

    function $cond_l19_c38(_event) {
        return Var1 == 2
    };
    $cond_l19_c38.tagname = 'undefined';
    $cond_l19_c38.line = 19;
    $cond_l19_c38.column = 38;

    function $invoke_l37_c5(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l37_c5.id,
            "constructorFunction": $invoke_l37_c5Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test422.txml.scxml"
        });
    };
    $invoke_l37_c5.tagname = 'invoke';
    $invoke_l37_c5.line = 37;
    $invoke_l37_c5.column = 5;

    $invoke_l37_c5.autoforward = false;

    $invoke_l37_c5.id = "s11.invokeid_1";

    function $invoke_l54_c4(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l54_c4.id,
            "constructorFunction": $invoke_l54_c4Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test422.txml.scxml"
        });
    };
    $invoke_l54_c4.tagname = 'invoke';
    $invoke_l54_c4.line = 54;
    $invoke_l54_c4.column = 4;

    $invoke_l54_c4.autoforward = false;

    $invoke_l54_c4.id = "s12.invokeid_2";

    function $expr_l72_c53(_event) {
        return 'pass'
    };
    $expr_l72_c53.tagname = 'undefined';
    $expr_l72_c53.line = 72;
    $expr_l72_c53.column = 53;

    function $log_l72_c27(_event) {
        this.log("Outcome", $expr_l72_c53.apply(this, arguments));
    };
    $log_l72_c27.tagname = 'log';
    $log_l72_c27.line = 72;
    $log_l72_c27.column = 27;

    function $expr_l73_c53(_event) {
        return 'fail'
    };
    $expr_l73_c53.tagname = 'undefined';
    $expr_l73_c53.line = 73;
    $expr_l73_c53.column = 53;

    function $log_l73_c27(_event) {
        this.log("Outcome", $expr_l73_c53.apply(this, arguments));
    };
    $log_l73_c27.tagname = 'log';
    $log_l73_c27.line = 73;
    $log_l73_c27.column = 27;

    function $data_l8_c24(_event) {
        return 0
    };
    $data_l8_c24.tagname = 'undefined';
    $data_l8_c24.line = 8;
    $data_l8_c24.column = 24;

    function $datamodel_l7_c1(_event) {
        if (typeof Var1 === "undefined") Var1 = $data_l8_c24.apply(this, arguments);
    };
    $datamodel_l7_c1.tagname = 'datamodel';
    $datamodel_l7_c1.line = 7;
    $datamodel_l7_c1.column = 1;
    return {
        "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
        "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
        "initial": "s1",
        "$type": "scxml",
        "id": "$generated-scxml-0",
        "states": [{
                "id": "s1",
                "initial": "s11",
                "$type": "state",
                "onEntry": [
                    $send_l12_c5
                ],
                "transitions": [{
                        "event": "invokeS1 invokeS12",
                        "$closeLine": 16,
                        "$closeColumn": 8,
                        "onTransition": $assign_l15_c7
                    },
                    {
                        "event": "invokeS11",
                        "target": "fail",
                        "$closeLine": 17,
                        "$closeColumn": 50
                    },
                    {
                        "event": "timeout",
                        "cond": $cond_l19_c38,
                        "target": "pass",
                        "$closeLine": 19,
                        "$closeColumn": 61
                    },
                    {
                        "event": "timeout",
                        "target": "fail",
                        "$closeLine": 20,
                        "$closeColumn": 46
                    }
                ],
                "invokes": $invoke_l21_c6,
                "states": [{
                        "id": "s11",
                        "$type": "state",
                        "invokes": $invoke_l37_c5,
                        "transitions": [{
                            "target": "s12",
                            "$closeLine": 51,
                            "$closeColumn": 31
                        }],
                        "$closeLine": 52,
                        "$closeColumn": 6
                    },
                    {
                        "id": "s12",
                        "$type": "state",
                        "invokes": $invoke_l54_c4,
                        "$closeLine": 68,
                        "$closeColumn": 5
                    }
                ],
                "$closeLine": 69,
                "$closeColumn": 3
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l72_c27
                ],
                "$closeLine": 72,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l73_c27
                ],
                "$closeLine": 73,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 74,
        "$closeColumn": 2,
        "onEntry": [
            $datamodel_l7_c1
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test422.txml.scxml"
    };
}

function $invoke_l21_c6Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l27_c17(_event) {
        return {}
    };
    $senddata_l27_c17.tagname = 'send';
    $senddata_l27_c17.line = 27;
    $senddata_l27_c17.column = 17;

    function $send_l27_c17(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "invokeS1",
            data: $senddata_l27_c17.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l27_c17.tagname = 'send';
    $send_l27_c17.line = 27;
    $send_l27_c17.column = 17;
    return {
        "initial": "sub0",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub0",
                "$type": "state",
                "onEntry": [
                    $send_l27_c17
                ],
                "transitions": [{
                    "target": "subFinal0",
                    "$closeLine": 29,
                    "$closeColumn": 47
                }],
                "$closeLine": 30,
                "$closeColumn": 16
            },
            {
                "id": "subFinal0",
                "$type": "final",
                "$closeLine": 31,
                "$closeColumn": 33
            }
        ],
        "$closeLine": 32,
        "$closeColumn": 10,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test422.txml.scxml"
    };
}

function $invoke_l37_c5Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l43_c17(_event) {
        return {}
    };
    $senddata_l43_c17.tagname = 'send';
    $senddata_l43_c17.line = 43;
    $senddata_l43_c17.column = 17;

    function $send_l43_c17(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "invokeS11",
            data: $senddata_l43_c17.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l43_c17.tagname = 'send';
    $send_l43_c17.line = 43;
    $send_l43_c17.column = 17;
    return {
        "initial": "sub1",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-2",
        "states": [{
                "id": "sub1",
                "$type": "state",
                "onEntry": [
                    $send_l43_c17
                ],
                "transitions": [{
                    "target": "subFinal1",
                    "$closeLine": 45,
                    "$closeColumn": 47
                }],
                "$closeLine": 46,
                "$closeColumn": 16
            },
            {
                "id": "subFinal1",
                "$type": "final",
                "$closeLine": 47,
                "$closeColumn": 33
            }
        ],
        "$closeLine": 48,
        "$closeColumn": 14,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test422.txml.scxml"
    };
}

function $invoke_l54_c4Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l60_c17(_event) {
        return {}
    };
    $senddata_l60_c17.tagname = 'send';
    $senddata_l60_c17.line = 60;
    $senddata_l60_c17.column = 17;

    function $send_l60_c17(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "invokeS12",
            data: $senddata_l60_c17.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l60_c17.tagname = 'send';
    $send_l60_c17.line = 60;
    $send_l60_c17.column = 17;
    return {
        "initial": "sub2",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-3",
        "states": [{
                "id": "sub2",
                "$type": "state",
                "onEntry": [
                    $send_l60_c17
                ],
                "transitions": [{
                    "target": "subFinal2",
                    "$closeLine": 62,
                    "$closeColumn": 47
                }],
                "$closeLine": 63,
                "$closeColumn": 16
            },
            {
                "id": "subFinal2",
                "$type": "final",
                "$closeLine": 64,
                "$closeColumn": 33
            }
        ],
        "$closeLine": 65,
        "$closeColumn": 14,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test422.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0NDIyLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVlLO0FBQUEsQ0FBc0M7QUFBQTs7Ozs7QUFBTixXQUFLO0FBQUE7Ozs7O0FBQXJDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFzQztBQUFBOzs7OztBQUdQLFcsQ0FBSyxDLENBQUUsQ0FBRTtBQUFBOzs7OztBQUF0Qyw0Q0FBdUM7QUFBQTs7Ozs7QUFJUixXQUFJLEVBQUUsQ0FBRTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcURPLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7O0FBQ1IsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFqRXJDLFFBQUU7QUFBQTs7Ozs7QUFEekIsNEVBRUU7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JjO0FBQUEsQ0FBd0M7QUFBQTs7Ozs7QUFBeEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQXdDO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0J4QztBQUFBLENBQXlDO0FBQUE7Ozs7O0FBQXpDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUF5QztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCekM7QUFBQSxDQUF5QztBQUFBOzs7OztBQUF6QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBeUM7QUFBQSJ9