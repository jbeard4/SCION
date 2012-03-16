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
    if ((typeof readline) is 'undefined') and not ((typeof Packages) is 'undefined')
        do ->
            #closure around stdin
            stdin = new Packages.java.io.BufferedReader(
                    new Packages.java.io.InputStreamReader(Packages.java.lang.System.in))

            -> if (s = stdin.readLine()) is null then quit(true) else String(s)
    else
        #every other interpreters we test should have a readline function on the global object
        this.readline
