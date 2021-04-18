//Generated on 2018-10-16 14:28:56 by the SCION SCXML compiler
function rootConstructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l11_c5(_event) {
        return {
            "Var2": Var2
        }
    };
    $senddata_l11_c5.tagname = 'invoke';
    $senddata_l11_c5.line = 11;
    $senddata_l11_c5.column = 5;

    function $invoke_l11_c5(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l11_c5.id,
            "constructorFunction": $invoke_l11_c5Constructor,

            "params": $senddata_l11_c5.apply(this, arguments),
            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test245.txml.scxml"
        });
    };
    $invoke_l11_c5.tagname = 'invoke';
    $invoke_l11_c5.line = 11;
    $invoke_l11_c5.column = 5;

    $invoke_l11_c5.autoforward = false;

    $invoke_l11_c5.id = "s0.invokeid_0";

    function $senddata_l9_c7(_event) {
        return {}
    };
    $senddata_l9_c7.tagname = 'send';
    $senddata_l9_c7.line = 9;
    $senddata_l9_c7.column = 7;

    function $send_l9_c7(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l9_c7.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("2s"),
        });
    };
    $send_l9_c7.tagname = 'send';
    $send_l9_c7.line = 9;
    $send_l9_c7.column = 7;

    function $expr_l31_c33(_event) {
        return 'pass'
    };
    $expr_l31_c33.tagname = 'undefined';
    $expr_l31_c33.line = 31;
    $expr_l31_c33.column = 33;

    function $log_l31_c7(_event) {
        this.log("Outcome", $expr_l31_c33.apply(this, arguments));
    };
    $log_l31_c7.tagname = 'log';
    $log_l31_c7.line = 31;
    $log_l31_c7.column = 7;

    function $expr_l36_c33(_event) {
        return 'fail'
    };
    $expr_l36_c33.tagname = 'undefined';
    $expr_l36_c33.line = 36;
    $expr_l36_c33.column = 33;

    function $log_l36_c7(_event) {
        this.log("Outcome", $expr_l36_c33.apply(this, arguments));
    };
    $log_l36_c7.tagname = 'log';
    $log_l36_c7.line = 36;
    $log_l36_c7.column = 7;

    function $data_l5_c26(_event) {
        return 3
    };
    $data_l5_c26.tagname = 'undefined';
    $data_l5_c26.line = 5;
    $data_l5_c26.column = 26;

    function $datamodel_l4_c3(_event) {
        if (typeof Var2 === "undefined") Var2 = $data_l5_c26.apply(this, arguments);
    };
    $datamodel_l4_c3.tagname = 'datamodel';
    $datamodel_l4_c3.line = 4;
    $datamodel_l4_c3.column = 3;
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
                    $send_l9_c7
                ],
                "invokes": $invoke_l11_c5,
                "transitions": [{
                        "event": "success",
                        "target": "pass",
                        "$closeLine": 26,
                        "$closeColumn": 46
                    },
                    {
                        "event": "*",
                        "target": "fail",
                        "$closeLine": 27,
                        "$closeColumn": 40
                    }
                ],
                "$closeLine": 28,
                "$closeColumn": 4
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l31_c7
                ],
                "$closeLine": 33,
                "$closeColumn": 4
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l36_c7
                ],
                "$closeLine": 38,
                "$closeColumn": 4
            }
        ],
        "$closeLine": 39,
        "$closeColumn": 2,
        "onEntry": [
            $datamodel_l4_c3
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test245.txml.scxml"
    };
}

function $invoke_l11_c5Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $send_l16_c15(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "failure",
            data: $senddata_l16_c15.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l16_c15.tagname = 'send';
    $send_l16_c15.line = 16;
    $send_l16_c15.column = 15;

    function $cond_l15_c30(_event) {
        return Var2
    };
    $cond_l15_c30.tagname = 'undefined';
    $cond_l15_c30.line = 15;
    $cond_l15_c30.column = 30;

    function $senddata_l19_c15(_event) {
        return {}
    };
    $senddata_l19_c15.tagname = 'send';
    $senddata_l19_c15.line = 19;
    $senddata_l19_c15.column = 15;

    function $send_l19_c15(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "success",
            data: $senddata_l19_c15.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l19_c15.tagname = 'send';
    $send_l19_c15.line = 19;
    $send_l19_c15.column = 15;
    return {
        "initial": "sub0",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub0",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l15_c30,
                        "target": "subFinal",
                        "$closeLine": 17,
                        "$closeColumn": 14,
                        "onTransition": $send_l16_c15
                    },
                    {
                        "target": "subFinal",
                        "$closeLine": 20,
                        "$closeColumn": 14,
                        "onTransition": $send_l19_c15
                    }
                ],
                "$closeLine": 21,
                "$closeColumn": 12
            },
            {
                "id": "subFinal",
                "$type": "final",
                "$closeLine": 22,
                "$closeColumn": 31
            }
        ],
        "$closeLine": 23,
        "$closeColumn": 10,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test245.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjQ1LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBV0s7QUFBQSxZQWNDO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWhCQztBQUFBLENBQWdDO0FBQUE7Ozs7O0FBQWhDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFnQztBQUFBOzs7OztBQXNCTixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7OztBQUtSLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7O0FBL0JmLFFBQUU7QUFBQTs7Ozs7QUFEekIsNEVBRUM7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVVztBQUFBLENBQXVDO0FBQUE7Ozs7O0FBQXZDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUF1QztBQUFBOzs7OztBQUR4QixXQUFLO0FBQUE7Ozs7O0FBSXBCO0FBQUEsQ0FBdUM7QUFBQTs7Ozs7QUFBdkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQXVDO0FBQUEifQ==