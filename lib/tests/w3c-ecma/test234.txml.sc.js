//Generated on 2018-10-16 14:28:49 by the SCION SCXML compiler
function rootConstructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';
    var Var1, Var2;

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
        Var2 = $serializedDatamodel["Var2"];
    }

    function $serializeDatamodel() {
        return {
            "Var1": Var1,
            "Var2": Var2
        };
    }

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
            delay: getDelayInMs("3s"),
        });
    };
    $send_l10_c5.tagname = 'send';
    $send_l10_c5.line = 10;
    $send_l10_c5.column = 5;

    function $expr_l28_c38(_event) {
        return _event.data.aParam
    };
    $expr_l28_c38.tagname = 'undefined';
    $expr_l28_c38.line = 28;
    $expr_l28_c38.column = 38;

    function $assign_l28_c9(_event) {
        Var1 = $expr_l28_c38.apply(this, arguments);
    };
    $assign_l28_c9.tagname = 'assign';
    $assign_l28_c9.line = 28;
    $assign_l28_c9.column = 9;

    function $invoke_l15_c5(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l15_c5.id,
            "constructorFunction": $invoke_l15_c5Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test234.txml.scxml"
        });
    };
    $invoke_l15_c5.tagname = 'invoke';
    $invoke_l15_c5.line = 15;
    $invoke_l15_c5.column = 5;

    $invoke_l15_c5.autoforward = false;

    $invoke_l15_c5.id = "p01.invokeid_0";

    $invoke_l15_c5.finalize = $assign_l28_c9;

    function $cond_l32_c46(_event) {
        return Var1 == 2
    };
    $cond_l32_c46.tagname = 'undefined';
    $cond_l32_c46.line = 32;
    $cond_l32_c46.column = 46;

    function $expr_l50_c38(_event) {
        return _event.data.aParam
    };
    $expr_l50_c38.tagname = 'undefined';
    $expr_l50_c38.line = 50;
    $expr_l50_c38.column = 38;

    function $assign_l50_c9(_event) {
        Var2 = $expr_l50_c38.apply(this, arguments);
    };
    $assign_l50_c9.tagname = 'assign';
    $assign_l50_c9.line = 50;
    $assign_l50_c9.column = 9;

    function $invoke_l37_c6(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l37_c6.id,
            "constructorFunction": $invoke_l37_c6Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test234.txml.scxml"
        });
    };
    $invoke_l37_c6.tagname = 'invoke';
    $invoke_l37_c6.line = 37;
    $invoke_l37_c6.column = 6;

    $invoke_l37_c6.autoforward = false;

    $invoke_l37_c6.id = "p02.invokeid_1";

    $invoke_l37_c6.finalize = $assign_l50_c9;

    function $cond_l59_c20(_event) {
        return Var2 == 1
    };
    $cond_l59_c20.tagname = 'undefined';
    $cond_l59_c20.line = 59;
    $cond_l59_c20.column = 20;

    function $expr_l63_c53(_event) {
        return 'pass'
    };
    $expr_l63_c53.tagname = 'undefined';
    $expr_l63_c53.line = 63;
    $expr_l63_c53.column = 53;

    function $log_l63_c27(_event) {
        this.log("Outcome", $expr_l63_c53.apply(this, arguments));
    };
    $log_l63_c27.tagname = 'log';
    $log_l63_c27.line = 63;
    $log_l63_c27.column = 27;

    function $expr_l64_c53(_event) {
        return 'fail'
    };
    $expr_l64_c53.tagname = 'undefined';
    $expr_l64_c53.line = 64;
    $expr_l64_c53.column = 53;

    function $log_l64_c27(_event) {
        this.log("Outcome", $expr_l64_c53.apply(this, arguments));
    };
    $log_l64_c27.tagname = 'log';
    $log_l64_c27.line = 64;
    $log_l64_c27.column = 27;

    function $data_l5_c24(_event) {
        return 1
    };
    $data_l5_c24.tagname = 'undefined';
    $data_l5_c24.line = 5;
    $data_l5_c24.column = 24;

    function $data_l6_c24(_event) {
        return 1
    };
    $data_l6_c24.tagname = 'undefined';
    $data_l6_c24.line = 6;
    $data_l6_c24.column = 24;

    function $datamodel_l4_c1(_event) {
        if (typeof Var1 === "undefined") Var1 = $data_l5_c24.apply(this, arguments);
        if (typeof Var2 === "undefined") Var2 = $data_l6_c24.apply(this, arguments);
    };
    $datamodel_l4_c1.tagname = 'datamodel';
    $datamodel_l4_c1.line = 4;
    $datamodel_l4_c1.column = 1;
    return {
        "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
        "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
        "initial": "p0",
        "$type": "scxml",
        "id": "$generated-scxml-0",
        "states": [{
                "id": "p0",
                "$type": "parallel",
                "onEntry": [
                    $send_l10_c5
                ],
                "transitions": [{
                    "event": "timeout",
                    "target": "fail",
                    "$closeLine": 12,
                    "$closeColumn": 46
                }],
                "states": [{
                        "id": "p01",
                        "$type": "state",
                        "invokes": $invoke_l15_c5,
                        "transitions": [{
                                "event": "childToParent",
                                "cond": $cond_l32_c46,
                                "target": "s1",
                                "$closeLine": 32,
                                "$closeColumn": 67
                            },
                            {
                                "event": "childToParent",
                                "target": "fail",
                                "$closeLine": 33,
                                "$closeColumn": 55
                            }
                        ],
                        "$closeLine": 34,
                        "$closeColumn": 6
                    },
                    {
                        "id": "p02",
                        "$type": "state",
                        "invokes": $invoke_l37_c6,
                        "$closeLine": 53,
                        "$closeColumn": 4
                    }
                ],
                "$closeLine": 55,
                "$closeColumn": 2
            },
            {
                "id": "s1",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l59_c20,
                        "target": "pass",
                        "$closeLine": 59,
                        "$closeColumn": 43
                    },
                    {
                        "target": "fail",
                        "$closeLine": 60,
                        "$closeColumn": 28
                    }
                ],
                "$closeLine": 61,
                "$closeColumn": 4
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l63_c27
                ],
                "$closeLine": 63,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l64_c27
                ],
                "$closeLine": 64,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 65,
        "$closeColumn": 2,
        "onEntry": [
            $datamodel_l4_c1
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test234.txml.scxml"
    };
}

function $invoke_l15_c5Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $expr_l21_c39(_event) {
        return 2
    };
    $expr_l21_c39.tagname = 'undefined';
    $expr_l21_c39.line = 21;
    $expr_l21_c39.column = 39;

    function $senddata_l20_c13(_event) {
        return {
            "aParam": $expr_l21_c39.apply(this, arguments)
        }
    };
    $senddata_l20_c13.tagname = 'send';
    $senddata_l20_c13.line = 20;
    $senddata_l20_c13.column = 13;

    function $send_l20_c13(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "childToParent",
            data: $senddata_l20_c13.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l20_c13.tagname = 'send';
    $send_l20_c13.line = 20;
    $send_l20_c13.column = 13;
    return {
        "version": "1.0",
        "initial": "subFinal1",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
            "id": "subFinal1",
            "$type": "final",
            "onEntry": [
                $send_l20_c13
            ],
            "$closeLine": 24,
            "$closeColumn": 12
        }],
        "$closeLine": 25,
        "$closeColumn": 14,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test234.txml.scxml"
    };
}

function $invoke_l37_c6Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l42_c15(_event) {
        return {}
    };
    $senddata_l42_c15.tagname = 'send';
    $senddata_l42_c15.line = 42;
    $senddata_l42_c15.column = 15;

    function $send_l42_c15(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l42_c15.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("2s"),
        });
    };
    $send_l42_c15.tagname = 'send';
    $send_l42_c15.line = 42;
    $send_l42_c15.column = 15;
    return {
        "version": "1.0",
        "initial": "sub0",
        "$type": "scxml",
        "id": "$generated-scxml-2",
        "states": [{
                "id": "sub0",
                "$type": "state",
                "onEntry": [
                    $send_l42_c15
                ],
                "transitions": [{
                    "event": "timeout",
                    "target": "subFinal2",
                    "$closeLine": 44,
                    "$closeColumn": 60
                }],
                "$closeLine": 45,
                "$closeColumn": 15
            },
            {
                "id": "subFinal2",
                "$type": "final",
                "$closeLine": 46,
                "$closeColumn": 36
            }
        ],
        "$closeLine": 47,
        "$closeColumn": 16,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test234.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjM0LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVSztBQUFBLENBQWdDO0FBQUE7Ozs7O0FBQWhDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFnQztBQUFBOzs7OztBQWtCQyxhQUFNLENBQUMsSUFBSSxDQUFDLE1BQU87QUFBQTs7Ozs7QUFBaEQsNENBQWlEO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSVosV0FBSSxFQUFFLENBQUU7QUFBQTs7Ozs7QUFrQmhCLGFBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTztBQUFBOzs7OztBQUFoRCw0Q0FBaUQ7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFTdEMsV0FBSSxFQUFFLENBQUU7QUFBQTs7Ozs7QUFJeUIsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFDUixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7OztBQTNEckMsUUFBRTtBQUFBOzs7OztBQUNGLFFBQUU7QUFBQTs7Ozs7QUFGekI7QUFBQSw0RUFHRztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjbUMsUUFBRTtBQUFBOzs7OztBQUQ1QjtBQUFBLDhDQUVEO0FBQUE7Ozs7O0FBRkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBRUQ7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CRztBQUFBLENBQWdDO0FBQUE7Ozs7O0FBQWhDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFnQztBQUFBIn0=