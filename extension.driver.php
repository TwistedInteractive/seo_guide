<?php

Class extension_seo_guide extends Extension
{
    /**
     * About this extension
     * @return array
     */
    public function about()
    {
        return array(
            'name' => 'SEO Guide',
            'version' => '1.0',
            'release-date' => '2011-08-15',
            'author' => array(
                'name' => 'Giel Berkers',
                'website' => 'http://www.gielberkers.com',
                'email' => 'info@gielberkers.com'
            )
        );
    }


    /**
     * Return an array with delegates
     * @return array
     */

    public function getSubscribedDelegates() {
        return array(
            // Delegates
            array(
                'page'      => '/backend/',
                'delegate'  => 'InitaliseAdminPageHead',
                'callback'  => 'addScriptToHead'
            )
        );
    }

    public function addScriptToHead($context)
    {
        $context['parent']->Page->addScriptToHead(URL.'/extensions/seo_guide/assets/seo_guide.js');
        $context['parent']->Page->addStyleSheetToHead(URL.'/extensions/seo_guide/assets/seo_guide.css');
    }

    /**
     * Installation script
     * @return void
     */
    public function install()
    {
        Symphony::Database()->query("CREATE TABLE IF NOT EXISTS `tbl_fields_seo_guide` (
            `id` int(11) unsigned NOT NULL auto_increment,
            `field_id` int(11) unsigned NOT NULL,
            PRIMARY KEY  (`id`),
            KEY `field_id` (`field_id`)
        )");

        Symphony::Database()->query("CREATE TABLE IF NOT EXISTS `tbl_seo_guide_fields` (
            `id` int(11) unsigned NOT NULL auto_increment,
            `section_id` int(11) unsigned NOT NULL,
            `field_id` int(11) unsigned NOT NULL,
            `priority` int(11) unsigned NOT NULL,
            PRIMARY KEY  (`id`),
            KEY `section_id` (`section_id`),
            KEY `field_id` (`field_id`)
        )");
    }

    /**
     * Uninstallation script
     * @return void
     */
    public function uninstall()
    {
        Symphony::Database()->query('DROP TABLE `tbl_fields_seo_guide`');
        Symphony::Database()->query('DROP TABLE `tbl_seo_guide_fields`');
    }
}