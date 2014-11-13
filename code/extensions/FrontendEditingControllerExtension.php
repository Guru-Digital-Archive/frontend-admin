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
        if ($editable || Permission::check('ADMIN')) {
            //Flexslider imports easing, which breaks?
            Requirements::block('flexslider/javascript/jquery.easing.1.3.js');

            Requirements::javascript(FRAMEWORK_DIR . '/thirdparty/jquery/jquery.js');
            Requirements::javascript(FRAMEWORK_DIR . '/thirdparty/jquery-ui/jquery-ui.js');
            Requirements::javascript(FRAMEWORK_ADMIN_DIR . '/javascript/ssui.core.js');
            Requirements::javascript(THIRDPARTY_DIR . '/jquery-entwine/dist/jquery.entwine-dist.js');
            Requirements::javascriptTemplate(FRONTEND_ADMIN_DIR . '/javascript/dist/FrontEndAdminTemplate.js', $this->getConfig($page));
            Requirements::css(FRAMEWORK_DIR . '/thirdparty/jquery-ui-themes/smoothness/jquery-ui.css');
        }

        if (Permission::check('ADMIN') && !Controller::curr()->getRequest()->offsetExists('stage')) {
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/dist/FrontEndAdmin.js');
            Requirements::css(FRONTEND_ADMIN_DIR . '/css/frontend-admin.css');
        }
        if ($editable) {
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/thirdparty/tinymce/js/tinymce/jquery.tinymce.min.js');
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/dist/FrontEndEditor.js');
            Requirements::css(FRONTEND_ADMIN_DIR . '/css/frontend-editor.css');
        }
    }

    /**
     * saves the DBField value, called with an ajax request
     * @return bool
     */
    public function fesave() {
        $response        = StatusMessage::create("An unknown error has occured", StatusMessageTypes::DANGER);
        $response->model = new stdClass();
        $item            = FrontEndEditItem::createFromRequest();
        if ($item->exists()) {
            $record = $item->getRecord();
            if ($item->canEdit()) {
                if ($item->saveValue()) {
                    $response->setContent($item->field . " saved ")->setType(StatusMessageTypes::SUCCESS);
                    $response->model = $record->toMap();
                } else {
                    $response->setContent("Error occurred while trying to save " . $item->field)->setType(StatusMessageTypes::DANGER);
                }
            } else {
                $response->setContent("You do not have permision to edit this item " . $item->field)->setType(StatusMessageTypes::DANGER);
            }
        } else {
            $response->setContent("Unable to locate " . $item->class . " with id " . $item->id)->setType(StatusMessageTypes::DANGER);
        }
        /* @var $controller Controller */
        $controller = Controller::curr();
        if ($controller->getRequest()->isAjax()) {
            $controller->getResponse()->addHeader('Content-type', 'application/json');
            $response = Convert::raw2json($response);
        } else {
            $response = array("StatusMessage" => $response);
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
        Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/thirdparty/tinymce/js/tinymce/jquery.tinymce.min.js');
        Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/dist/FrontEndEditor.js');
        Requirements::css(FRONTEND_ADMIN_DIR . '/css/frontend-editor.css');
    }

}

class FrontEndEditItem extends Object {

    public $class;
    public $field;
    public $id;
    public $value;
    private $record;

    /**
     *
     * @param SS_HTTPRequest $request
     * @return FrontEndEditItem
     */
    public static function createFromRequest(SS_HTTPRequest $request = null) {
        if (is_null($request)) {
            $request = Controller::curr()->getRequest();
        }
        return self::create($request->postVar('feclass'), $request->postVar('fefield'), $request->postVar('feid'), $request->postVar('value'));
    }

    /**
     *
     * @param string $class
     * @param string $field
     * @param int $id
     * @param string $value
     */
    public function __construct($class, $field, $id, $value) {
        parent::__construct();
        $this->class = $class;
        $this->field = $field;
        $this->id    = $id;
        $this->value = $value;
    }

    public function exists() {
        return
                parent::exists() &&
                class_exists($this->class) &&
                is_object($this->getRecord());
    }

    public function isVersioned() {
        return
                class_exists($this->class) &&
                method_exists($this->class, 'has_extension') &&
                forward_static_call(array($this->class, 'has_extension'), 'Versioned');
    }

    /**
     *
     * @return DataObject|Versioned
     */
    public function getRecord() {
        if (!$this->record) {
            $this->record = $this->isVersioned() ?
                    Versioned::get_by_stage($this->class, 'Live')->byID($this->id) :
                    DataObject::get_by_id($this->class, $this->id);
        }
        return $this->record;
    }

    public function canEdit() {
        return Permission::check('ADMIN') || method_exists($this->getRecord(), 'canEdit') && $this->getRecord()->canEdit();
    }

    public function canPublish() {
        return Permission::check('ADMIN') || method_exists($this->getRecord(), 'canPublish') && $this->getRecord()->canPublish();
    }

    public function saveValue() {
        $result = false;
        if ($this->exists()) {
            $record = $this->getRecord();
            $record->setField($this->field, $this->value);
            if ($this->isVersioned()) {
                $result = $record->writeToStage('Stage');
                if ($this->canPublish()) {
                    $record->publish('Stage', 'Live');
                }
            } else {
                $result = $record->write();
            }
        }
        return $result;
    }

}
