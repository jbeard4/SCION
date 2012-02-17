<?xml version="1.0"?>
<!--
   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:s="http://www.w3.org/2005/07/scxml"
	xmlns="http://www.w3.org/2005/07/scxml"
	version="1.0">
	<xsl:output method="xml"/>

	<!-- identity transform -->
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>

	<!-- match only basic states -->
	<xsl:template match="s:state | s:parallel | s:history | s:final">

		<xsl:copy>
			<xsl:apply-templates select="@*"/>

			<xsl:if test="not(s:onentry)">
				<onentry>
					<log expr="'entering state {@id}'"/>
				</onentry>
			</xsl:if>

			<xsl:if test="not(s:onexit)">
				<onexit>
					<log expr="'exiting state {@id}'"/>
				</onexit>
			</xsl:if>

			<xsl:apply-templates select="node()"/>
		</xsl:copy>

	</xsl:template>

	<xsl:template match="s:onentry">
		<xsl:copy>
			<log expr="'entering state {../@id}'"/>

			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="s:onexit">
		<xsl:copy>
			<log expr="'exiting state {../@id}'"/>

			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>

