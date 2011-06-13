#!/bin/sh
dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`
mvn -q -o -f $basedir/pom.xml exec:java -DscxmlArgs="$*"
