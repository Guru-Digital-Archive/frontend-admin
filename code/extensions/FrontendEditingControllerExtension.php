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
        $editable   = FrontendEditing::editingEnabled() && $page->canEdit();
        $admin      = Permission::check('ADMIN');
        if ($editable || $admin) {

            //Flexslider imports easing, which breaks?
            Requirements::block('flexslider/javascript/jquery.easing.1.3.js');

            Requirements::javascript(FRAMEWORK_DIR . '/thirdparty/jquery/jquery.js');
            Requirements::javascript(FRAMEWORK_DIR . '/thirdparty/jquery-ui/jquery-ui.js');
            Requirements::javascript(FRAMEWORK_ADMIN_DIR . '/javascript/ssui.core.js');
            Requirements::javascript(THIRDPARTY_DIR . '/jquery-entwine/dist/jquery.entwine-dist.js');
            Requirements::javascriptTemplate(FRONTEND_ADMIN_DIR . '/javascript/dist/FrontEndAdminTemplate.js', $this->getConfig($page));
            Requirements::css(FRAMEWORK_DIR . '/thirdparty/jquery-ui-themes/smoothness/jquery-ui.css');
        }

        if ($admin && !Controller::curr()->getRequest()->offsetExists('stage')) {
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/dist/FrontEndAdmin.js');
            Requirements::css(FRONTEND_ADMIN_DIR . '/css/frontend-admin.css');
        }
        if (FrontendEditing::editingEnabled() && $page->canEdit()) {
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/thirdparty/jquery.jeditable.js');
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/thirdparty/tinymce/js/tinymce/tinymce.min.js');
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/thirdparty/tinymce/js/tinymce/jquery.tinymce.min.js');
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/thirdparty/tinymce_ssfebuttons/tinymce_ssfebuttons.js');
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/dist/FrontEndEditor.js');
            Requirements::css(FRONTEND_ADMIN_DIR . '/css/frontend-editor.css');
        }
    }

    /**
     * saves the DBField value, called with an ajax request
     * @return bool
     */
    public function fesave() {
        $response          = new stdClass();
        $response->content = "An unknown error has occured";
        $response->type    = "bad";

        /* @var $controller Controller */
        $controller  = Controller::curr();
        $feclass     = $controller->getRequest()->postVar('feclass');
        $fefield     = $controller->getRequest()->postVar('fefield');
        $feid        = $controller->getRequest()->postVar('feid');
        $value       = $controller->getRequest()->postVar('value');
        $isVersioned = $feclass::has_extension('Versioned');
        $result      = false;
        if (class_exists($feclass)) {
            $record = $isVersioned ? Versioned::get_by_stage($feclass, 'Live')->byID($feid) : DataObject::get_by_id($feclass, $feid);
            if (is_object($record)) {
                $canEdit    = Permission::check('ADMIN') || method_exists($record, 'canEdit') && $record->canEdit();
                $canPublish = Permission::check('ADMIN') || method_exists($record, 'canPublish') && $record->canPublish();
                if ($canEdit) {
                    $record->$fefield = $value;
                    if ($isVersioned) {
                        $result = $record->writeToStage('Stage');
                        if ($canPublish) {
                            $result = $record->publish('Stage', 'Live');
                        }
                    } else {
                        $result = $record->write();
                    }
                } else {
                    $response->content = "You do not have permision to edit this item";
                }
            } else {
                $response->content = "Unable to fetch " . $feclass . " with id " . $feid;
            }
        } else {
            $response->content = "Unable to find class " . $feclass;
        }

        if ($result) {
            $result            = $value;
            $response->content = $fefield . " saved successfully";
            $response->type    = "good";
        }
        if ($controller->getRequest()->isAjax()) {
            $controller->getResponse()->addHeader('Content-type', 'application/json');
            $response = Convert::raw2json($response);
        } else {
            $response = array("message" => $response->content);
        }
        return $response;
    }

    public function getConfig($page = null) {
        $themeDir      = $this->owner->ThemeDir();
        $baseDir       = Director::baseURL();
        $baseHref      = Director::protocolAndHost() . $baseDir;
        $editHref      = ($page) ? $baseHref . $page->CMSEditLink() : null;
        $pageHierarchy = array();
        if ($page) {
            $pageHierarchy = array($page->ID);
            $parent        = $page->Parent();
            while ($parent && $parent->exists()) {
                $pageHierarchy[] = $parent->ID;
                $parent          = $parent->Parent();
            }
        }
//        FrontEndEditorToolbar/LinkForm
        $jsConfig = array(
            'linkURL'       => Controller::join_links(FrontEndEditorToolbar::create()->Link(), "LinkForm"),
            'mediaURL'      => Controller::join_links(FrontEndEditorToolbar::create()->Link(), "MediaForm"),
            'themeDir'      => $themeDir,
            'baseDir'       => $baseDir,
            'baseHref'      => $baseHref,
            'editHref'      => $editHref,
            'pageHierarchy' => Convert::raw2json(array_reverse($pageHierarchy))
        );

        return $jsConfig;
    }

    public function AddEditingIncludes() {
        Requirements::javascriptTemplate(FRONTEND_ADMIN_DIR . '/javascript/dist/FrontEndAdminTemplate.js', $this->getConfig());
        Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/thirdparty/jquery.jeditable.js');
        Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/thirdparty/tinymce/js/tinymce/tinymce.min.js');
        Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/thirdparty/tinymce/js/tinymce/jquery.tinymce.min.js');
        Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/thirdparty/tinymce_ssfebuttons/tinymce_ssfebuttons.js');
        Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/dist/FrontEndEditor.js');
        Requirements::css(FRONTEND_ADMIN_DIR . '/css/frontend-editor.css');
    }

}
