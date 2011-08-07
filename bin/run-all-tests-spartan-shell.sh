dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`

for interpreter in spidermonkey-js v8-js webcore-js; do
$basedir/bin/run-tests-spartan-shell.sh $interpreter;
done;
