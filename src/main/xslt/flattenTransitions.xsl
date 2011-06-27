<?xml version="1.0"?>
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

	<!-- basic states -->
	<xsl:template match="*[self::s:state or self::s:final or self::s:initial or self::s:history][not(s:state or s:parallel or s:final or s:initial or s:history)]">

		<xsl:copy>
			<xsl:apply-templates select="@*"/>

			<!-- copy his transitions -->
			<xsl:apply-templates select="s:transition"/>

			<!-- copy his following siblings' transitions -->
			<xsl:if test="parent::s:parallel">
				<xsl:apply-templates select="following-sibling::*/s:transition"/>
			</xsl:if>

			<!-- copy his ancestors' transitions -->
			<xsl:for-each select="ancestor::*/s:transition">
				<!-- sort by depth, then document order -->
				<xsl:sort select="count(ancestor::*)"
					 data-type="number"
					 order="descending"/>

				<!-- copy the transition -->
				<xsl:apply-templates select="."/>

			</xsl:for-each>

		
			<xsl:apply-templates select="node()[not(self::s:transition)]"/>
		</xsl:copy>
	</xsl:template>

	<!-- composite states -->
	<xsl:template match="*[self::s:scxml or self::s:parallel or self::s:state or self::s:final or self::s:initial or self::s:history][s:state or s:parallel or s:final or s:initial or s:history]">

		<xsl:copy>
			<xsl:apply-templates select="@*"/>

			<!-- do not copy transitions of composite states -->
			<xsl:apply-templates select="node()[not(self::s:transition)]"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>
