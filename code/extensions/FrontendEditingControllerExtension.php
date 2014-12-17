<?php

/**
 *
 */
class FrontendEditingControllerExtension extends Extension {

    private static $allowed_actions = array(
        'fesave', 'feFileUploadForm'
    );

    /**
     * add requirements for frontend editing only when logged in
     * @todo Use TinyMCEs Compressor 4.0.2 PHP
     */
    public function onBeforeInit() {
        /* @var $controller Page_Controller */
        $controller     = $this->owner;
        /* @var $page Page */
        $page           = $controller->data();
        $canEdit        = $page->canEdit() && !Controller::curr()->getRequest()->offsetExists('stage');
        $editingEnabled = FrontendEditing::editingEnabled();

        if ($canEdit) {
            // Enable front-end fly-out menu
            //Flexslider imports easing, which breaks?

            Requirements::block('flexslider/javascript/jquery.easing.1.3.js');

            Requirements::javascript(FRAMEWORK_DIR . '/thirdparty/jquery/jquery.js');
            Requirements::javascript(FRAMEWORK_DIR . '/thirdparty/jquery-ui/jquery-ui.js');
            Requirements::javascript(FRAMEWORK_ADMIN_DIR . '/javascript/ssui.core.js');
            Requirements::javascript(THIRDPARTY_DIR . '/jquery-entwine/dist/jquery.entwine-dist.js');
            Requirements::javascriptTemplate(FRONTEND_ADMIN_DIR . '/javascript/dist/FrontEndAdminTemplate.js', $this->getConfig($page));
            Requirements::css(FRAMEWORK_DIR . '/thirdparty/jquery-ui-themes/smoothness/jquery-ui.css');
            Requirements::javascript(FRONTEND_ADMIN_DIR . '/javascript/dist/FrontEndAdmin.js');
            Requirements::css(FRONTEND_ADMIN_DIR . '/css/frontend-admin.css');
        }
        if ($canEdit && $editingEnabled) {
            // Disable mode pagespeed while editing
            $controller->getResponse()->addHeader("PageSpeed", "off");
            // Disable HTTP cache while editing
            HTTP::set_cache_age(86400);
            // Enable TinyMCE when editing has been enabled
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

    public function feFileUploadForm(SS_HTTPRequest $request) {
        $feclass     = $request->getVar('feclass');
        $fefield     = $request->getVar('fefield');
        $feid        = $request->getVar('feid');
        $filesUpload = $request->getVar('filesUpload');
        $fefileid    = $request->getVar('fefileid');
        $fefileclass = $request->getVar('fefileclass');
        $res         = false;
        echo '<pre class="debug">' . PHP_EOL . __FILE__ . "::" . __LINE__ . PHP_EOL . '</pre>';
        if ($filesUpload == 1 && class_exists($fefileclass) && class_exists($feclass)) {
            echo '<pre class="debug">' . PHP_EOL . __FILE__ . "::" . __LINE__ . PHP_EOL . '</pre>';
            $file = $fefileid ? $fefileclass::get()->byId($fefileid) : $fefileclass::create();
            $res  = FrontendEditing::getUploadForm($file, $feclass, $feid, $fefield);
        }
        echo '<pre class="debug"> "$res"' . PHP_EOL . print_r($res, true) . PHP_EOL . '</pre>';
        return $res;
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
        $value = $request->postVar('value');
        if ($request->postVar('feisUpload') == "true") {
            $value = json_decode($value);
        }

        return self::create($request->postVar('feclass'), $request->postVar('fefield'), $request->postVar('feid'), $value);
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
//        return true;
        if ($this->exists()) {
            $record = $this->getRecord();
            $record->setField($this->field, $this->value);
            if ($this->isVersioned()) {
                $result = $record->writeToStage('Stage');
                if ($this->canPublish()) {
                    $record->publish('Stage', 'Live');
                    $lastError = error_get_last();
                    if (!is_null($lastError) && $lastError["type"] == E_USER_WARNING) {
                        $result = false;
//                        $response->content = $lastError["message"];
                    }
                }
            } else {
                $result = $record->write();
            }
        }
        return $result;
    }

}
