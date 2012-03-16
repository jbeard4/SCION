#   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

define ->
    truncate = (list) -> if list.length > 100 then list[0...50] + "..." else list

    (report) ->
        """Summary:
        Tests Run: #{report.testCount}
        Tests Passed: #{report.testsPassed.length} - [ #{truncate report.testsPassed} ]
        Tests Failed: #{report.testsFailed.length} - [ #{truncate report.testsFailed} ]
        Tests Errored: #{report.testsErrored.length} - [ #{truncate report.testsErrored} ]"""
