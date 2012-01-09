#!/bin/sh
#this script is copied from /usr/bin/rhino on Ubuntu 11.10
#we need a special script here because the stack gets really big in the optimization tests, so we need to set JVM option Xss
#really, I should fix this the optimization test runner to be less recursive.

dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`

if [ ! -e $basedir/build/tests/loaders/spartan-loader-for-all-tests.js ]; then
	echo Please run \"make interpreter tests test-loader\" before running this file.
	exit 1
fi;

JAVA_CMD="/usr/bin/java"
JAVA_OPTS=""
JAVA_CLASSPATH="/usr/share/java/js.jar:/usr/share/java/jline.jar"
JAVA_MAIN="org.mozilla.javascript.tools.shell.Main"
EXTRA_JVM_ARGUMENTS="-Xss10m"	#increase max heap size so we don't stackoverflow

## Fix for #512498
## Change Bootclasspath when using OpenJDK because OpenJDK6
## bundle his own release of Rhino.
## References:
## <https://bugs.launchpad.net/ubuntu/+source/openjdk-6/+bug/255149>
## <http://icedtea.classpath.org/bugzilla/show_bug.cgi?id=179>
## <http://www.openoffice.org/issues/show_bug.cgi?id=91641>
isOpenJDK=`$JAVA_CMD -version 2>&1 | grep -i "OpenJDK" | wc -l`
if [ $isOpenJDK -gt 0 ]
then
	JAVA_OPTS="-Xbootclasspath:/usr/lib/jvm/java-6-openjdk/jre/lib/rt.jar"
fi


$JAVA_CMD $JAVA_OPTS $EXTRA_JVM_ARGUMENTS -classpath $JAVA_CLASSPATH $JAVA_MAIN \
-debug $basedir/lib/js/r.js -lib $basedir/build/core/runner.js $basedir/build/core scxml/test/rhino-optimization-harness
