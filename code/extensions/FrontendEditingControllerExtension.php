<?php

/**
 *
 */
class FrontendEditingControllerExtension extends Extension {

    private static $allowed_actions = array(
        'fesave'
    );

    /**
     * add requirements for frontend editing only when logged in
     * @todo Use TinyMCEs Compressor 4.0.2 PHP
     */
    public function onBeforeInit() {
        /* @var $controller Page_Controller */
        $controller = $this->owner;
        /* @var $page Page */
        $page       = $controller->data();
        if ($page->canEdit()) {
            Requirements::javascript(FRAMEWORK_DIR . '/thirdparty/jquery/jquery.js');
            Requirements::javascript(FRAMEWORK_DIR . '/thirdparty/jquery-ui/jquery-ui.js');
            Requirements::javascript(THIRDPARTY_DIR . '/jquery-entwine/dist/jquery.entwine-dist.js');
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/thirdparty/jquery.jeditable.js');
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/thirdparty/tinymce/js/tinymce/tinymce.min.js');
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/thirdparty/tinymce/js/tinymce/jquery.tinymce.min.js');

            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/thirdparty/tinymce_ssfebuttons/tinymce_ssfebuttons.js');
//                                          \frontend-admin\javascript\thirdparty\tinymce_ssfebuttons\tinymce_ssfebuttons.js


            Requirements::javascript(FRAMEWORK_ADMIN_DIR . '/javascript/ssui.core.js');
            Requirements::javascriptTemplate(FRONTEND_ADMIN_DIR . '/javascript/dist/FrontEndAdminTemplate.js', $this->getConfig($page));
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/dist/FrontEndAdmin.js');
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/dist/FrontEndEditor.js');
            Requirements::css(FRAMEWORK_DIR . '/thirdparty/jquery-ui-themes/smoothness/jquery-ui.css');
            Requirements::css(FRONTEND_ADMIN_DIR . '/css/frontend-admin.css');
            Requirements::css(FRONTEND_ADMIN_DIR . '/css/frontend-editing.css');
            Requirements::css(FRONTEND_ADMIN_DIR . '/css/frontend-editor.css');
//frontend-editing
        }
    }

    /**
     * saves the DBField value, called with an ajax request
     * @return bool
     */
    public function fesave() {
        if (Permission::check('ADMIN')) {
            $feclass = $_REQUEST['feclass'];
            $fefield = $_REQUEST['fefield'];
            $feid    = $_REQUEST['feid'];
            $value   = $_REQUEST['value'];

            if ($feclass::has_extension('Versioned')) {
                $record           = Versioned::get_by_stage($feclass, 'Live')->byID($feid);
                $record->$fefield = $value;
                $record->writeToStage('Stage');
                $record->publish('Stage', 'Live');
            } else {
                $obj           = DataObject::get_by_id($feclass, $feid);
                $obj->$fefield = $value;
                $obj->write();
            }
            return $value;
        }
        if (array_key_exists($_REQUEST, 'value')) {
            return $_REQUEST['value'];
        }
        return false;
    }

    protected function getConfig($page = null) {
        $themeDir      = $this->owner->ThemeDir();
        $baseDir       = Director::baseURL();
        $baseHref      = Director::protocolAndHost() . $baseDir;
        $editHref      = ($page) ? $baseHref . $page->CMSEditLink() : null;
        $pageHierarchy = [$page->ID];
        if ($page) {
            $parent = $page->Parent();
            while ($parent && $parent->exists()) {
                $pageHierarchy[] = $parent->ID;
                $parent          = $parent->Parent();
            }
        }
//        FrontEndEditorToolbar/LinkForm
        $jsConfig = [
            'linkURL'       => Controller::join_links(FrontEndEditorToolbar::create()->Link(), "LinkForm"),
            'mediaURL'      => Controller::join_links(FrontEndEditorToolbar::create()->Link(), "MediaForm"),
            'themeDir'      => $themeDir,
            'baseDir'       => $baseDir,
            'baseHref'      => $baseHref,
            'editHref'      => $editHref,
            'pageHierarchy' => Convert::raw2json(array_reverse($pageHierarchy))
        ];

        return $jsConfig;
    }

}
