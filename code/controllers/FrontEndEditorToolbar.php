<?php

class FrontEndEditorToolbar extends Controller {

    private static $allowed_actions = array('MediaForm', 'LinkForm', 'EditorToolbar');
    public $fromType;

    public function init() {
        $this->GetIncludes();
        parent::init();
    }

    /**
     * Load required CSS and Javascript
     * @todo We probably go a bit overboard and include things we dont need here..... clean it up
     */
    protected function GetIncludes() {
        Requirements::combine_files(
                'lib.js', array(
            THIRDPARTY_DIR . '/jquery/jquery.js',
            FRAMEWORK_DIR . '/javascript/jquery-ondemand/jquery.ondemand.js',
            FRAMEWORK_ADMIN_DIR . '/javascript/lib.js',
            THIRDPARTY_DIR . '/jquery-ui/jquery-ui.js',
//            THIRDPARTY_DIR . '/json-js/json2.js',
            THIRDPARTY_DIR . '/jquery-entwine/dist/jquery.entwine-dist.js',
//            THIRDPARTY_DIR . '/jquery-cookie/jquery.cookie.js',
            THIRDPARTY_DIR . '/jquery-query/jquery.query.js',
            THIRDPARTY_DIR . '/jquery-form/jquery.form.js',
            FRAMEWORK_ADMIN_DIR . '/thirdparty/jquery-notice/jquery.notice.js',
//            FRAMEWORK_ADMIN_DIR . '/thirdparty/jsizes/lib/jquery.sizes.js',
            FRAMEWORK_ADMIN_DIR . '/thirdparty/jlayout/lib/jlayout.border.js',
            FRAMEWORK_ADMIN_DIR . '/thirdparty/jlayout/lib/jquery.jlayout.js',
//            FRAMEWORK_ADMIN_DIR . '/thirdparty/history-js/scripts/uncompressed/history.js',
//            FRAMEWORK_ADMIN_DIR . '/thirdparty/history-js/scripts/uncompressed/history.adapter.jquery.js',
//            FRAMEWORK_ADMIN_DIR . '/thirdparty/history-js/scripts/uncompressed/history.html4.js',
//            THIRDPARTY_DIR . '/jstree/jquery.jstree.js',
            FRAMEWORK_ADMIN_DIR . '/thirdparty/chosen/chosen/chosen.jquery.js',
            FRAMEWORK_ADMIN_DIR . '/thirdparty/jquery-hoverIntent/jquery.hoverIntent.js',
//            FRAMEWORK_ADMIN_DIR . '/javascript/jquery-changetracker/lib/jquery.changetracker.js',
            FRAMEWORK_DIR . '/javascript/i18n.js',
//            FRAMEWORK_DIR . '/javascript/TreeDropdownField.js',
//            FRAMEWORK_DIR . '/javascript/DateField.js',
            FRAMEWORK_DIR . '/javascript/HtmlEditorField.js',
//            FRAMEWORK_DIR . '/javascript/TabSet.js',
            FRAMEWORK_ADMIN_DIR . '/javascript/ssui.core.js',
//            FRAMEWORK_DIR . '/javascript/GridField.js',
                )
        );
        Requirements::combine_files(
                'cmsmain.js', array_merge(
                        array(
            CMS_DIR . '/javascript/CMSMain.js',
            CMS_DIR . '/javascript/CMSMain.EditForm.js',
            CMS_DIR . '/javascript/CMSMain.AddForm.js',
            CMS_DIR . '/javascript/CMSPageHistoryController.js',
            CMS_DIR . '/javascript/CMSMain.Tree.js',
            CMS_DIR . '/javascript/SilverStripeNavigator.js',
            CMS_DIR . '/javascript/SiteTreeURLSegmentField.js'
                        ), Requirements::add_i18n_javascript(CMS_DIR . '/javascript/lang', true, true)
                )
        );

        $leftAndMainIncludes = array_unique(array_merge(
                        array(
            FRAMEWORK_ADMIN_DIR . '/javascript/LeftAndMain.Layout.js',
            FRAMEWORK_ADMIN_DIR . '/javascript/LeftAndMain.js',
            FRAMEWORK_ADMIN_DIR . '/javascript/LeftAndMain.ActionTabSet.js',
            FRAMEWORK_ADMIN_DIR . '/javascript/LeftAndMain.Panel.js',
            FRAMEWORK_ADMIN_DIR . '/javascript/LeftAndMain.Tree.js',
            FRAMEWORK_ADMIN_DIR . '/javascript/LeftAndMain.Content.js',
            FRAMEWORK_ADMIN_DIR . '/javascript/LeftAndMain.EditForm.js',
            FRAMEWORK_ADMIN_DIR . '/javascript/LeftAndMain.Menu.js',
            FRAMEWORK_ADMIN_DIR . '/javascript/LeftAndMain.Preview.js',
            FRAMEWORK_ADMIN_DIR . '/javascript/LeftAndMain.BatchActions.js',
            FRAMEWORK_ADMIN_DIR . '/javascript/LeftAndMain.FieldHelp.js',
            FRAMEWORK_ADMIN_DIR . '/javascript/LeftAndMain.TreeDropdownField.js',
                        ), Requirements::add_i18n_javascript(FRAMEWORK_DIR . '/javascript/lang', true, true), Requirements::add_i18n_javascript(FRAMEWORK_ADMIN_DIR . '/javascript/lang', true, true)
        ));

        if ($this->config()->session_keepalive_ping) {
            $leftAndMainIncludes[] = FRAMEWORK_ADMIN_DIR . '/javascript/LeftAndMain.Ping.js';
        }

        $jsMin = (Director::isDev()) ? ".min" : "";
        Requirements::javascript('frontend-admin/javascript/dist/FrontEndEditorToolbar' . $jsMin . '.js');
        Requirements::css(FRAMEWORK_ADMIN_DIR . '/thirdparty/chosen/chosen/chosen.css');
        Requirements::css(FRAMEWORK_DIR . '/thirdparty/jquery-ui-themes/smoothness/jquery-ui.css');
        Requirements::css(FRAMEWORK_ADMIN_DIR . "/css/screen.css");
        Requirements::css(CMS_DIR . "/css/screen.css");
        Requirements::css(FRAMEWORK_DIR . '/css/AssetUploadField.css');
        Requirements::css(FRAMEWORK_DIR . '/css/UploadField.css');
    }

    public function MediaForm(SS_HTTPRequest $request) {
        $this->fromType = 'MediaForm';
        return $this->render();
    }

    public function LinkForm(SS_HTTPRequest $request) {
        $this->fromType = 'LinkForm';
        return $this->render();
    }

    public function EditorToolbar() {
        return HtmlEditorField_Toolbar::create($this, "EditorToolbar");
    }

}
