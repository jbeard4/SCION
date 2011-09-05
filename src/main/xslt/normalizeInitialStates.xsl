<?xml version="1.0"?>
<!--
Copyright (C) 2011 Jacob Beard
Released under GNU LGPL, read the file 'COPYING' for more information
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

	<xsl:template match="s:*[@initial]">
		<xsl:copy>
			<xsl:apply-templates select="@*[not(local-name() = 'initial')]"/>

			<initial>
				<transition target="{@initial}"/>
			</initial>
			<xsl:apply-templates select="node()"/>

		</xsl:copy>	
	</xsl:template>

</xsl:stylesheet>

