



module.exports = {
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "*"
                },
                {
                    "target": "fail",
                    "event": "foo"
                }
            ]
        },
        {
            "id": "b"
        },
        {
            "id": "fail"
        }
    ]
};
