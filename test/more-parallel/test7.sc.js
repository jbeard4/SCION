//Generated on Thursday, February 21, 2013 19:56:26 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "a22"
                        }
                    ],
                    "states": [
                        {
                            "id": "a1",
                            "states": [
                                {
                                    "id": "a11"
                                },
                                {
                                    "id": "a12"
                                }
                            ]
                        },
                        {
                            "id": "a2",
                            "states": [
                                {
                                    "id": "a21"
                                },
                                {
                                    "id": "a22"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "b",
                    "transitions": [
                        {
                            "event": "t",
                            "target": "b22"
                        }
                    ],
                    "states": [
                        {
                            "id": "b1",
                            "states": [
                                {
                                    "id": "b11"
                                },
                                {
                                    "id": "b12"
                                }
                            ]
                        },
                        {
                            "id": "b2",
                            "states": [
                                {
                                    "id": "b21"
                                },
                                {
                                    "id": "b22"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
