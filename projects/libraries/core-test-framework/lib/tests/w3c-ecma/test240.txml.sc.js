//Generated on 2018-10-16 14:28:52 by the SCION SCXML compiler
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

    function $senddata_l15_c6(_event) {
        return {
            "Var1": Var1
        }
    };
    $senddata_l15_c6.tagname = 'invoke';
    $senddata_l15_c6.line = 15;
    $senddata_l15_c6.column = 6;

    function $invoke_l15_c6(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l15_c6.id,
            "constructorFunction": $invoke_l15_c6Constructor,

            "params": $senddata_l15_c6.apply(this, arguments),
            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test240.txml.scxml"
        });
    };
    $invoke_l15_c6.tagname = 'invoke';
    $invoke_l15_c6.line = 15;
    $invoke_l15_c6.column = 6;

    $invoke_l15_c6.autoforward = false;

    $invoke_l15_c6.id = "s01.invokeid_0";

    function $expr_l39_c35(_event) {
        return 1
    };
    $expr_l39_c35.tagname = 'undefined';
    $expr_l39_c35.line = 39;
    $expr_l39_c35.column = 35;

    function $senddata_l38_c7(_event) {
        return {
            "Var1": $expr_l39_c35.apply(this, arguments)
        }
    };
    $senddata_l38_c7.tagname = 'invoke';
    $senddata_l38_c7.line = 38;
    $senddata_l38_c7.column = 7;

    function $invoke_l38_c7(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l38_c7.id,
            "constructorFunction": $invoke_l38_c7Constructor,

            "params": $senddata_l38_c7.apply(this, arguments),
            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test240.txml.scxml"
        });
    };
    $invoke_l38_c7.tagname = 'invoke';
    $invoke_l38_c7.line = 38;
    $invoke_l38_c7.column = 7;

    $invoke_l38_c7.autoforward = false;

    $invoke_l38_c7.id = "s02.invokeid_1";

    function $expr_l64_c53(_event) {
        return 'pass'
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

    function $expr_l65_c53(_event) {
        return 'fail'
    };
    $expr_l65_c53.tagname = 'undefined';
    $expr_l65_c53.line = 65;
    $expr_l65_c53.column = 53;

    function $log_l65_c27(_event) {
        this.log("Outcome", $expr_l65_c53.apply(this, arguments));
    };
    $log_l65_c27.tagname = 'log';
    $log_l65_c27.line = 65;
    $log_l65_c27.column = 27;

    function $data_l5_c24(_event) {
        return 1
    };
    $data_l5_c24.tagname = 'undefined';
    $data_l5_c24.line = 5;
    $data_l5_c24.column = 24;

    function $datamodel_l4_c1(_event) {
        if (typeof Var1 === "undefined") Var1 = $data_l5_c24.apply(this, arguments);
    };
    $datamodel_l4_c1.tagname = 'datamodel';
    $datamodel_l4_c1.line = 4;
    $datamodel_l4_c1.column = 1;
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
                    "$closeLine": 12,
                    "$closeColumn": 46
                }],
                "states": [{
                        "id": "s01",
                        "$type": "state",
                        "invokes": $invoke_l15_c6,
                        "transitions": [{
                                "event": "success",
                                "target": "s02",
                                "$closeLine": 33,
                                "$closeColumn": 46
                            },
                            {
                                "event": "failure",
                                "target": "fail",
                                "$closeLine": 34,
                                "$closeColumn": 47
                            }
                        ],
                        "$closeLine": 35,
                        "$closeColumn": 5
                    },
                    {
                        "id": "s02",
                        "$type": "state",
                        "invokes": $invoke_l38_c7,
                        "transitions": [{
                                "event": "success",
                                "target": "pass",
                                "$closeLine": 58,
                                "$closeColumn": 47
                            },
                            {
                                "event": "failure",
                                "target": "fail",
                                "$closeLine": 59,
                                "$closeColumn": 47
                            }
                        ],
                        "$closeLine": 60,
                        "$closeColumn": 4
                    }
                ],
                "$closeLine": 62,
                "$closeColumn": 2
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l64_c27
                ],
                "$closeLine": 64,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l65_c27
                ],
                "$closeLine": 65,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 66,
        "$closeColumn": 2,
        "onEntry": [
            $datamodel_l4_c1
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test240.txml.scxml"
    };
}

function $invoke_l15_c6Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l23_c22(_event) {
        return {}
    };
    $senddata_l23_c22.tagname = 'send';
    $senddata_l23_c22.line = 23;
    $senddata_l23_c22.column = 22;

    function $send_l23_c22(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "success",
            data: $senddata_l23_c22.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l23_c22.tagname = 'send';
    $send_l23_c22.line = 23;
    $send_l23_c22.column = 22;

    function $cond_l22_c40(_event) {
        return Var1 === 1
    };
    $cond_l22_c40.tagname = 'undefined';
    $cond_l22_c40.line = 22;
    $cond_l22_c40.column = 40;

    function $senddata_l26_c18(_event) {
        return {}
    };
    $senddata_l26_c18.tagname = 'send';
    $senddata_l26_c18.line = 26;
    $senddata_l26_c18.column = 18;

    function $send_l26_c18(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "failure",
            data: $senddata_l26_c18.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l26_c18.tagname = 'send';
    $send_l26_c18.line = 26;
    $send_l26_c18.column = 18;

    function $data_l19_c35(_event) {
        return 0
    };
    $data_l19_c35.tagname = 'undefined';
    $data_l19_c35.line = 19;
    $data_l19_c35.column = 35;

    function $datamodel_l18_c12(_event) {
        if (typeof Var1 === "undefined") Var1 = $data_l19_c35.apply(this, arguments);
    };
    $datamodel_l18_c12.tagname = 'datamodel';
    $datamodel_l18_c12.line = 18;
    $datamodel_l18_c12.column = 12;
    return {
        "initial": "sub01",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub01",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l22_c40,
                        "target": "subFinal1",
                        "$closeLine": 24,
                        "$closeColumn": 23,
                        "onTransition": $send_l23_c22
                    },
                    {
                        "target": "subFinal1",
                        "$closeLine": 27,
                        "$closeColumn": 19,
                        "onTransition": $send_l26_c18
                    }
                ],
                "$closeLine": 28,
                "$closeColumn": 17
            },
            {
                "id": "subFinal1",
                "$type": "final",
                "$closeLine": 29,
                "$closeColumn": 31
            }
        ],
        "$closeLine": 30,
        "$closeColumn": 12,
        "onEntry": [
            $datamodel_l18_c12
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test240.txml.scxml"
    };
}

function $invoke_l38_c7Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l48_c22(_event) {
        return {}
    };
    $senddata_l48_c22.tagname = 'send';
    $senddata_l48_c22.line = 48;
    $senddata_l48_c22.column = 22;

    function $send_l48_c22(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "success",
            data: $senddata_l48_c22.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l48_c22.tagname = 'send';
    $send_l48_c22.line = 48;
    $send_l48_c22.column = 22;

    function $cond_l47_c40(_event) {
        return Var1 == 1
    };
    $cond_l47_c40.tagname = 'undefined';
    $cond_l47_c40.line = 47;
    $cond_l47_c40.column = 40;

    function $senddata_l51_c18(_event) {
        return {}
    };
    $senddata_l51_c18.tagname = 'send';
    $senddata_l51_c18.line = 51;
    $senddata_l51_c18.column = 18;

    function $send_l51_c18(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "failure",
            data: $senddata_l51_c18.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l51_c18.tagname = 'send';
    $send_l51_c18.line = 51;
    $send_l51_c18.column = 18;

    function $data_l43_c35(_event) {
        return 0
    };
    $data_l43_c35.tagname = 'undefined';
    $data_l43_c35.line = 43;
    $data_l43_c35.column = 35;

    function $datamodel_l42_c12(_event) {
        if (typeof Var1 === "undefined") Var1 = $data_l43_c35.apply(this, arguments);
    };
    $datamodel_l42_c12.tagname = 'datamodel';
    $datamodel_l42_c12.line = 42;
    $datamodel_l42_c12.column = 12;
    return {
        "initial": "sub02",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-2",
        "states": [{
                "id": "sub02",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l47_c40,
                        "target": "subFinal2",
                        "$closeLine": 49,
                        "$closeColumn": 23,
                        "onTransition": $send_l48_c22
                    },
                    {
                        "target": "subFinal2",
                        "$closeLine": 52,
                        "$closeColumn": 19,
                        "onTransition": $send_l51_c18
                    }
                ],
                "$closeLine": 53,
                "$closeColumn": 17
            },
            {
                "id": "subFinal2",
                "$type": "final",
                "$closeLine": 54,
                "$closeColumn": 31
            }
        ],
        "$closeLine": 55,
        "$closeColumn": 12,
        "onEntry": [
            $datamodel_l42_c12
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test240.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjQwLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVUs7QUFBQSxDQUFnQztBQUFBOzs7OztBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBZ0M7QUFBQTs7Ozs7QUFLL0I7QUFBQSxZQWlCSTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPeUIsUUFBRTtBQUFBOzs7OztBQUQ5QjtBQUFBLDRDQW1CRztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPMkMsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFDUixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7OztBQTVEckMsUUFBRTtBQUFBOzs7OztBQUR6Qiw0RUFFRztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCa0I7QUFBQSxDQUF1QztBQUFBOzs7OztBQUF2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBdUM7QUFBQTs7Ozs7QUFEckIsV0FBSSxHQUFHLENBQUU7QUFBQTs7Ozs7QUFJL0I7QUFBQSxDQUF1QztBQUFBOzs7OztBQUF2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBdUM7QUFBQTs7Ozs7QUFQdEIsUUFBRTtBQUFBOzs7OztBQUR6Qiw2RUFFSztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCSztBQUFBLENBQXVDO0FBQUE7Ozs7O0FBQXZDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUF1QztBQUFBOzs7OztBQURyQixXQUFJLEVBQUUsQ0FBRTtBQUFBOzs7OztBQUk5QjtBQUFBLENBQXVDO0FBQUE7Ozs7O0FBQXZDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUF1QztBQUFBOzs7OztBQVJ0QixRQUFFO0FBQUE7Ozs7O0FBRHpCLDZFQUVLO0FBQUEifQ==