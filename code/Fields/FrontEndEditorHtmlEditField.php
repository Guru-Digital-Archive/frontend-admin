<?php

/**
 * A TinyMCE 4 powered WYSIWYG HTML editor field with image and link insertion and tracking capabilities. Editor fields
 * are created from <textarea> tags, which are then converted with JavaScript.
 *
 * @see HtmlEditorField
 * @todo ..... everything? Refactor HtmlEditorField and make nesscary changes to use with TinyMCE 4
 */
class FrontEndEditorHtmlEditField extends TextareaField {

    /**
     * @config
     * @var Boolean Use TinyMCE's GZIP compressor
     */
    private static $use_gzip = true;

    /**
     * @config
     * @var Integer Default insertion width for Images and Media
     */
    private static $insert_width = 600;

    /**
     * @config
     * @var bool Should we check the valid_elements (& extended_valid_elements) rules from HtmlEditorConfig server side?
     */
    private static $sanitise_server_side = false;
    protected $rows = 30;

    /**
     * Includes the JavaScript neccesary for this field to work using the {@link Requirements} system.
     */
    public static function include_js() {
        require_once 'tinymce/tiny_mce_gzip.php';

        $configObj = HtmlEditorConfig::get_active();

        if (Config::inst()->get('HtmlEditorField', 'use_gzip')) {
            $internalPlugins   = array();
            foreach ($configObj->getPlugins() as $plugin => $path)
                if (!$path)
                    $internalPlugins[] = $plugin;
            $tag               = TinyMCE_Compressor::renderTag(array(
                        'url'       => THIRDPARTY_DIR . '/tinymce/tiny_mce_gzip.php',
                        'plugins'   => implode(',', $internalPlugins),
                        'themes'    => 'advanced',
                        'languages' => $configObj->getOption('language')
                            ), true);
            preg_match('/src="([^"]*)"/', $tag, $matches);
            Requirements::javascript(html_entity_decode($matches[1]));
        } else {
            Requirements::javascript(MCE_ROOT . 'tiny_mce_src.js');
        }

        Requirements::customScript($configObj->generateJS(), 'htmlEditorConfig');
    }

    /**
     * @see TextareaField::__construct()
     */
    public function __construct($name, $title = null, $value = '') {
        parent::__construct($name, $title, $value);

        self::include_js();
    }

    /**
     * @return string
     */
    public function Field($properties = array()) {
        // mark up broken links
        $value = Injector::inst()->create('HTMLValue', $this->value);

        if ($links = $value->getElementsByTagName('a'))
            foreach ($links as $link) {
                $matches = array();

                if (preg_match('/\[sitetree_link(?:\s*|%20|,)?id=([0-9]+)\]/i', $link->getAttribute('href'), $matches)) {
                    if (!DataObject::get_by_id('SiteTree', $matches[1])) {
                        $class = $link->getAttribute('class');
                        $link->setAttribute('class', ($class ? "$class ss-broken" : 'ss-broken'));
                    }
                }

                if (preg_match('/\[file_link(?:\s*|%20|,)?id=([0-9]+)\]/i', $link->getAttribute('href'), $matches)) {
                    if (!DataObject::get_by_id('File', $matches[1])) {
                        $class = $link->getAttribute('class');
                        $link->setAttribute('class', ($class ? "$class ss-broken" : 'ss-broken'));
                    }
                }
            }

        $properties['Value'] = htmlentities($value->getContent(), ENT_COMPAT, 'UTF-8');
        $obj                 = $this->customise($properties);

        return $obj->renderWith($this->getTemplates());
    }

    public function getAttributes() {
        return array_merge(
                parent::getAttributes(), array(
            'tinymce' => 'true',
            'style'   => 'width: 97%; height: ' . ($this->rows * 16) . 'px', // prevents horizontal scrollbars
            'value'   => null,
                )
        );
    }

    public function saveInto(DataObjectInterface $record) {
        if ($record->hasField($this->name) && $record->escapeTypeForField($this->name) != 'xml') {
            throw new Exception(
            'HtmlEditorField->saveInto(): This field should save into a HTMLText or HTMLVarchar field.'
            );
        }

        $htmlValue = Injector::inst()->create('HTMLValue', $this->value);

        // Sanitise if requested
        if ($this->config()->sanitise_server_side) {
            $santiser = Injector::inst()->create('HtmlEditorSanitiser', HtmlEditorConfig::get_active());
            $santiser->sanitise($htmlValue);
        }

        // Resample images and add default attributes
        if ($images = $htmlValue->getElementsByTagName('img'))
            foreach ($images as $img) {
                // strip any ?r=n data from the src attribute
                $img->setAttribute('src', preg_replace('/([^\?]*)\?r=[0-9]+$/i', '$1', $img->getAttribute('src')));

                // Resample the images if the width & height have changed.
                if ($image = File::find(urldecode(Director::makeRelative($img->getAttribute('src'))))) {
                    $width  = $img->getAttribute('width');
                    $height = $img->getAttribute('height');

                    if ($width && $height && ($width != $image->getWidth() || $height != $image->getHeight())) {
                        //Make sure that the resized image actually returns an image:
                        $resized = $image->ResizedImage($width, $height);
                        if ($resized)
                            $img->setAttribute('src', $resized->getRelativePath());
                    }
                }

                // Add default empty title & alt attributes.
                if (!$img->getAttribute('alt'))
                    $img->setAttribute('alt', '');
                if (!$img->getAttribute('title'))
                    $img->setAttribute('title', '');
            }

        // Store into record
        $record->{$this->name} = $htmlValue->getContent();
    }

    /**
     * @return HtmlEditorField_Readonly
     */
    public function performReadonlyTransformation() {
        $field             = $this->castedCopy('HtmlEditorField_Readonly');
        $field->dontEscape = true;

        return $field;
    }

    public function performDisabledTransformation() {
        return $this->performReadonlyTransformation();
    }

}

//class FrontEndEditorHtmlEditField extends HtmlEditorField {
//    /**
//     * Includes the JavaScript neccesary for this field to work using the {@link Requirements} system.
//     */
//    public static function include_js() {
//        require_once './thirdparty/tinymce_compressor/tinymce.gzip.php';
//
//        $configObj = HtmlEditorConfig::get_active();
//
//        if (Config::inst()->get('HtmlEditorField', 'use_gzip')) {
//            $internalPlugins   = array();
//            foreach ($configObj->getPlugins() as $plugin => $path)
//                if (!$path)
//                    $internalPlugins[] = $plugin;
//            $tag               = TinyMCE_Compressor::renderTag(array(
//                        'url'       => THIRDPARTY_DIR . '/tinymce/tiny_mce_gzip.php',
//                        'plugins'   => implode(',', $internalPlugins),
//                        'themes'    => 'advanced',
//                        'languages' => $configObj->getOption('language')
//                            ), true);
//            preg_match('/src="([^"]*)"/', $tag, $matches);
//            Requirements::javascript(html_entity_decode($matches[1]));
//        } else {
//            Requirements::javascript(MCE_ROOT . 'tiny_mce_src.js');
//        }
//
//        Requirements::customScript($configObj->generateJS(), 'htmlEditorConfig');
//    }
//}
