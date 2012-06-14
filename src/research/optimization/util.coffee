module.exports.escapeEvent = (e) ->
    switch e
        when '\\'
            '\\\\'
        when "'"
            "\\'"
        else
            e
