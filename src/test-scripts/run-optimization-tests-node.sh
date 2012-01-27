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

dn=`dirname $0`
abspath=`cd $dn; pwd`
t=`dirname $abspath`
basedir=`dirname $t`

if [ ! -e $basedir/target/tests/loaders/spartan-loader-for-all-tests.js ]; then
	echo Please run \"make interpreter tests test-loader\" before running this file.
	exit 1
fi;

#these tests are highly recursive, so we increase the size of the nodejs stack. 
#same thing is done with the rhino tests running under the JVM
node --stack_size=4096 $basedir/lib/js/r.js -lib $basedir/target/core/runner.js $basedir/target/core test-harness/node-optimization-harness
