//Generated on 2018-10-16 14:28:53 by the SCION SCXML compiler
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
            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test241.txml.scxml"
        });
    };
    $invoke_l15_c6.tagname = 'invoke';
    $invoke_l15_c6.line = 15;
    $invoke_l15_c6.column = 6;

    $invoke_l15_c6.autoforward = false;

    $invoke_l15_c6.id = "s01.invokeid_0";

    function $expr_l41_c35(_event) {
        return 1
    };
    $expr_l41_c35.tagname = 'undefined';
    $expr_l41_c35.line = 41;
    $expr_l41_c35.column = 35;

    function $senddata_l40_c7(_event) {
        return {
            "Var1": $expr_l41_c35.apply(this, arguments)
        }
    };
    $senddata_l40_c7.tagname = 'invoke';
    $senddata_l40_c7.line = 40;
    $senddata_l40_c7.column = 7;

    function $invoke_l40_c7(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l40_c7.id,
            "constructorFunction": $invoke_l40_c7Constructor,

            "params": $senddata_l40_c7.apply(this, arguments),
            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test241.txml.scxml"
        });
    };
    $invoke_l40_c7.tagname = 'invoke';
    $invoke_l40_c7.line = 40;
    $invoke_l40_c7.column = 7;

    $invoke_l40_c7.autoforward = false;

    $invoke_l40_c7.id = "s02.invokeid_1";

    function $expr_l68_c35(_event) {
        return 1
    };
    $expr_l68_c35.tagname = 'undefined';
    $expr_l68_c35.line = 68;
    $expr_l68_c35.column = 35;

    function $senddata_l67_c7(_event) {
        return {
            "Var1": $expr_l68_c35.apply(this, arguments)
        }
    };
    $senddata_l67_c7.tagname = 'invoke';
    $senddata_l67_c7.line = 67;
    $senddata_l67_c7.column = 7;

    function $invoke_l67_c7(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l67_c7.id,
            "constructorFunction": $invoke_l67_c7Constructor,

            "params": $senddata_l67_c7.apply(this, arguments),
            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test241.txml.scxml"
        });
    };
    $invoke_l67_c7.tagname = 'invoke';
    $invoke_l67_c7.line = 67;
    $invoke_l67_c7.column = 7;

    $invoke_l67_c7.autoforward = false;

    $invoke_l67_c7.id = "s03.invokeid_2";

    function $expr_l95_c53(_event) {
        return 'pass'
    };
    $expr_l95_c53.tagname = 'undefined';
    $expr_l95_c53.line = 95;
    $expr_l95_c53.column = 53;

    function $log_l95_c27(_event) {
        this.log("Outcome", $expr_l95_c53.apply(this, arguments));
    };
    $log_l95_c27.tagname = 'log';
    $log_l95_c27.line = 95;
    $log_l95_c27.column = 27;

    function $expr_l96_c53(_event) {
        return 'fail'
    };
    $expr_l96_c53.tagname = 'undefined';
    $expr_l96_c53.line = 96;
    $expr_l96_c53.column = 53;

    function $log_l96_c27(_event) {
        this.log("Outcome", $expr_l96_c53.apply(this, arguments));
    };
    $log_l96_c27.tagname = 'log';
    $log_l96_c27.line = 96;
    $log_l96_c27.column = 27;

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
                                "$closeLine": 35,
                                "$closeColumn": 46
                            },
                            {
                                "event": "failure",
                                "target": "s03",
                                "$closeLine": 36,
                                "$closeColumn": 46
                            }
                        ],
                        "$closeLine": 37,
                        "$closeColumn": 5
                    },
                    {
                        "id": "s02",
                        "$type": "state",
                        "invokes": $invoke_l40_c7,
                        "transitions": [{
                                "event": "success",
                                "target": "pass",
                                "$closeLine": 62,
                                "$closeColumn": 47
                            },
                            {
                                "event": "failure",
                                "target": "fail",
                                "$closeLine": 63,
                                "$closeColumn": 47
                            }
                        ],
                        "$closeLine": 64,
                        "$closeColumn": 4
                    },
                    {
                        "id": "s03",
                        "$type": "state",
                        "invokes": $invoke_l67_c7,
                        "transitions": [{
                                "event": "failure",
                                "target": "pass",
                                "$closeLine": 89,
                                "$closeColumn": 47
                            },
                            {
                                "event": "success",
                                "target": "fail",
                                "$closeLine": 90,
                                "$closeColumn": 47
                            }
                        ],
                        "$closeLine": 91,
                        "$closeColumn": 4
                    }
                ],
                "$closeLine": 93,
                "$closeColumn": 2
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l95_c27
                ],
                "$closeLine": 95,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l96_c27
                ],
                "$closeLine": 96,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 97,
        "$closeColumn": 2,
        "onEntry": [
            $datamodel_l4_c1
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test241.txml.scxml"
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

    function $senddata_l24_c19(_event) {
        return {}
    };
    $senddata_l24_c19.tagname = 'send';
    $senddata_l24_c19.line = 24;
    $senddata_l24_c19.column = 19;

    function $send_l24_c19(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "success",
            data: $senddata_l24_c19.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l24_c19.tagname = 'send';
    $send_l24_c19.line = 24;
    $send_l24_c19.column = 19;

    function $cond_l23_c32(_event) {
        return Var1 == 1
    };
    $cond_l23_c32.tagname = 'undefined';
    $cond_l23_c32.line = 23;
    $cond_l23_c32.column = 32;

    function $senddata_l27_c21(_event) {
        return {}
    };
    $senddata_l27_c21.tagname = 'send';
    $senddata_l27_c21.line = 27;
    $senddata_l27_c21.column = 21;

    function $send_l27_c21(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "failure",
            data: $senddata_l27_c21.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l27_c21.tagname = 'send';
    $send_l27_c21.line = 27;
    $send_l27_c21.column = 21;

    function $data_l19_c37(_event) {
        return 0
    };
    $data_l19_c37.tagname = 'undefined';
    $data_l19_c37.line = 19;
    $data_l19_c37.column = 37;

    function $datamodel_l18_c14(_event) {
        if (typeof Var1 === "undefined") Var1 = $data_l19_c37.apply(this, arguments);
    };
    $datamodel_l18_c14.tagname = 'datamodel';
    $datamodel_l18_c14.line = 18;
    $datamodel_l18_c14.column = 14;
    return {
        "initial": "sub01",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub01",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l23_c32,
                        "target": "subFinal1",
                        "$closeLine": 25,
                        "$closeColumn": 22,
                        "onTransition": $send_l24_c19
                    },
                    {
                        "target": "subFinal1",
                        "$closeLine": 28,
                        "$closeColumn": 18,
                        "onTransition": $send_l27_c21
                    }
                ],
                "$closeLine": 29,
                "$closeColumn": 16
            },
            {
                "id": "subFinal1",
                "$type": "final",
                "$closeLine": 31,
                "$closeColumn": 34
            }
        ],
        "$closeLine": 32,
        "$closeColumn": 14,
        "onEntry": [
            $datamodel_l18_c14
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test241.txml.scxml"
    };
}

function $invoke_l40_c7Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l50_c19(_event) {
        return {}
    };
    $senddata_l50_c19.tagname = 'send';
    $senddata_l50_c19.line = 50;
    $senddata_l50_c19.column = 19;

    function $send_l50_c19(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "success",
            data: $senddata_l50_c19.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l50_c19.tagname = 'send';
    $send_l50_c19.line = 50;
    $send_l50_c19.column = 19;

    function $cond_l49_c32(_event) {
        return Var1 == 1
    };
    $cond_l49_c32.tagname = 'undefined';
    $cond_l49_c32.line = 49;
    $cond_l49_c32.column = 32;

    function $senddata_l53_c21(_event) {
        return {}
    };
    $senddata_l53_c21.tagname = 'send';
    $senddata_l53_c21.line = 53;
    $senddata_l53_c21.column = 21;

    function $send_l53_c21(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "failure",
            data: $senddata_l53_c21.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l53_c21.tagname = 'send';
    $send_l53_c21.line = 53;
    $send_l53_c21.column = 21;

    function $data_l45_c37(_event) {
        return 0
    };
    $data_l45_c37.tagname = 'undefined';
    $data_l45_c37.line = 45;
    $data_l45_c37.column = 37;

    function $datamodel_l44_c14(_event) {
        if (typeof Var1 === "undefined") Var1 = $data_l45_c37.apply(this, arguments);
    };
    $datamodel_l44_c14.tagname = 'datamodel';
    $datamodel_l44_c14.line = 44;
    $datamodel_l44_c14.column = 14;
    return {
        "initial": "sub02",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-2",
        "states": [{
                "id": "sub02",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l49_c32,
                        "target": "subFinal2",
                        "$closeLine": 51,
                        "$closeColumn": 22,
                        "onTransition": $send_l50_c19
                    },
                    {
                        "target": "subFinal2",
                        "$closeLine": 54,
                        "$closeColumn": 18,
                        "onTransition": $send_l53_c21
                    }
                ],
                "$closeLine": 55,
                "$closeColumn": 16
            },
            {
                "id": "subFinal2",
                "$type": "final",
                "$closeLine": 57,
                "$closeColumn": 34
            }
        ],
        "$closeLine": 58,
        "$closeColumn": 14,
        "onEntry": [
            $datamodel_l44_c14
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test241.txml.scxml"
    };
}

function $invoke_l67_c7Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l77_c19(_event) {
        return {}
    };
    $senddata_l77_c19.tagname = 'send';
    $senddata_l77_c19.line = 77;
    $senddata_l77_c19.column = 19;

    function $send_l77_c19(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "success",
            data: $senddata_l77_c19.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l77_c19.tagname = 'send';
    $send_l77_c19.line = 77;
    $send_l77_c19.column = 19;

    function $cond_l76_c32(_event) {
        return Var1 == 1
    };
    $cond_l76_c32.tagname = 'undefined';
    $cond_l76_c32.line = 76;
    $cond_l76_c32.column = 32;

    function $senddata_l80_c21(_event) {
        return {}
    };
    $senddata_l80_c21.tagname = 'send';
    $senddata_l80_c21.line = 80;
    $senddata_l80_c21.column = 21;

    function $send_l80_c21(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "failure",
            data: $senddata_l80_c21.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l80_c21.tagname = 'send';
    $send_l80_c21.line = 80;
    $send_l80_c21.column = 21;

    function $data_l72_c37(_event) {
        return 0
    };
    $data_l72_c37.tagname = 'undefined';
    $data_l72_c37.line = 72;
    $data_l72_c37.column = 37;

    function $datamodel_l71_c14(_event) {
        if (typeof Var1 === "undefined") Var1 = $data_l72_c37.apply(this, arguments);
    };
    $datamodel_l71_c14.tagname = 'datamodel';
    $datamodel_l71_c14.line = 71;
    $datamodel_l71_c14.column = 14;
    return {
        "initial": "sub03",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-3",
        "states": [{
                "id": "sub03",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l76_c32,
                        "target": "subFinal3",
                        "$closeLine": 78,
                        "$closeColumn": 22,
                        "onTransition": $send_l77_c19
                    },
                    {
                        "target": "subFinal3",
                        "$closeLine": 81,
                        "$closeColumn": 18,
                        "onTransition": $send_l80_c21
                    }
                ],
                "$closeLine": 82,
                "$closeColumn": 16
            },
            {
                "id": "subFinal3",
                "$type": "final",
                "$closeLine": 84,
                "$closeColumn": 34
            }
        ],
        "$closeLine": 85,
        "$closeColumn": 14,
        "onEntry": [
            $datamodel_l71_c14
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test241.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjQxLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVUs7QUFBQSxDQUFnQztBQUFBOzs7OztBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBZ0M7QUFBQTs7Ozs7QUFLL0I7QUFBQSxZQW1CRztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPMEIsUUFBRTtBQUFBOzs7OztBQUQ5QjtBQUFBLDRDQW9CRztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFReUIsUUFBRTtBQUFBOzs7OztBQUQ5QjtBQUFBLDRDQW9CRztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRMkMsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFDUixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7OztBQTNGckMsUUFBRTtBQUFBOzs7OztBQUR6Qiw0RUFFRztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCZTtBQUFBLENBQXVDO0FBQUE7Ozs7O0FBQXZDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUF1QztBQUFBOzs7OztBQUQxQixXQUFJLEVBQUUsQ0FBRTtBQUFBOzs7OztBQUluQjtBQUFBLENBQXVDO0FBQUE7Ozs7O0FBQXZDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUF1QztBQUFBOzs7OztBQVJ2QixRQUFFO0FBQUE7Ozs7O0FBRHpCLDZFQUVJO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOEJDO0FBQUEsQ0FBdUM7QUFBQTs7Ozs7QUFBdkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQXVDO0FBQUE7Ozs7O0FBRDFCLFdBQUksRUFBRSxDQUFFO0FBQUE7Ozs7O0FBSW5CO0FBQUEsQ0FBdUM7QUFBQTs7Ozs7QUFBdkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQXVDO0FBQUE7Ozs7O0FBUnZCLFFBQUU7QUFBQTs7Ozs7QUFEekIsNkVBRUk7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQkM7QUFBQSxDQUF1QztBQUFBOzs7OztBQUF2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBdUM7QUFBQTs7Ozs7QUFEMUIsV0FBSSxFQUFFLENBQUU7QUFBQTs7Ozs7QUFJbkI7QUFBQSxDQUF1QztBQUFBOzs7OztBQUF2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBdUM7QUFBQTs7Ozs7QUFSdkIsUUFBRTtBQUFBOzs7OztBQUR6Qiw2RUFFSTtBQUFBIn0=