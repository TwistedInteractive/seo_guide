<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <!--
        This is the template used on the publish page for the SEO guide
    -->

    <xsl:template match="/">
		<div class="frame collapsible">
        <ol>
            <li class="instance field-input expanded">
				<header>
					<h4>General</h4>
				</header>
                <div class="content">
                    <dl class="general">
                        <dt class="first">Total words:</dt>
                        <dd class="first" id="total-words"></dd>
                        <dt>Unique words:</dt>
                        <dd id="unique-words"></dd>
                        <dt>SEO strength:</dt>
                        <dd id="seo-strength">
                            0%
                        </dd>
                        <dt>Execution time:</dt>
                        <dd id="execution-time">

                        </dd>
                    </dl>
<!--                    <xsl:if test="data/value = ''">
                        <p>
                            You have not entered any <a href="#" class="keywords">keywords</a> for this content.
                        </p>
                    </xsl:if>-->
                </div>
            </li>
            <li class="instance field-input collapsed">
				<header>
					<h4>Words and Importance</h4>
				</header>
                <div class="content">
                    <dl class="importance">
                        <dt class="first">Most important words:</dt>
                        <dd class="first">
                            <ol id="most-important-one">
                                <li>One</li>
                                <li>Two</li>
                                <li>Three</li>
                                <li>Two</li>
                                <li>Three</li>
                            </ol>
                        </dd>
                        <dt>Most important two-words:</dt>
                        <dd>
                            <ol id="most-important-two">
                                <li>One</li>
                                <li>Two</li>
                                <li>Three</li>
                                <li>Two</li>
                                <li>Three</li>
                            </ol>
                        </dd>
                        <dt>Most important three-words:</dt>
                        <dd>
                            <ol id="most-important-three">
                                <li>One</li>
                                <li>Two</li>
                                <li>Three</li>
                                <li>Two</li>
                                <li>Three</li>
                            </ol>
                        </dd>
                    </dl>
                </div>
            </li>
            <li class="instance field-input collapsed">
				<header>
					<h4>SEO Analysis</h4>
				</header>
                <div class="content">
                    <dl class="analysis">
                        <dt class="first">Keywords usage:</dt>
                        <dd class="first">
                            <span id="keywords-usage"></span>
                            <a href="#" class="help" title="This is determined by if you used all keywords. Higher is better">?</a>
                        </dd>
                        <dt>Keywords importance:</dt>
                        <dd>
                            <span id="keywords-importance"></span>
                            <a href="#" class="help" title="This is determined by how high you keywords are at 'Words and Importance'. Higher is better">?</a>
                        </dd>
                        <dt>Keywords saturation:</dt>
                        <dd>
                            <span id="keywords-saturation"></span>
                            <a href="#" class="help" title="This is determined by how much you used your keywords (don't overdo it!). 3% is the best.">?</a>
                        </dd>
                    </dl>
                </div>
            </li>
<!--            <li class="keywords instance field-input collapsed">
				<header>
					<h4>Your keywords</h4>
				</header>
                <div class="content">
                    <p>
                        Please enter some keywords which are relevant for this content. Use space to seperate the
                        different keywords.
                        Try not to target for more than 5 keywords.
                    </p>
                    <input type="text" value="{data/value}" name="fields[{data/element-name}]" />
                    <br />
                    <br />
                </div>
            </li>-->

        </ol>
		</div>
        <!-- Variables: -->
        <script type="text/javascript">
            <xsl:for-each select="data/fields/field">
                seoGuideFields.push([<xsl:value-of select="@id"/>, <xsl:value-of select="@priority"/>]);
            </xsl:for-each>
        </script>
    </xsl:template>

</xsl:stylesheet>