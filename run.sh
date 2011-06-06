#!/bin/sh
dn=`dirname $0`
abspath=`cd $dn; pwd`
mvn -q -f $abspath/pom.xml exec:java -DscxmlInputArgs="$*"
