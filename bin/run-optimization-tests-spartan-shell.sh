dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`

if [ ! -e $basedir/build/spartanLoaderForAllTests.js ]; then
	echo Please run \"make scion gen-requirejs-test-loader-module\" before running this file.
	exit 1
fi;
	
defaultShell=spidermonkey-js
shell=${1-$defaultShell}
echo $shell

pushd $basedir/build
if [ -e main.js ]; then
	mv main.js /tmp/
fi;

ln -s scxml/test/spartan-optimization-harness.js main.js

$shell $basedir/lib/js/r.js 

#move original main.js back
rm main.js
if [ -e /tmp/main.js ]; then
	mv /tmp/main.js .
fi;

popd
