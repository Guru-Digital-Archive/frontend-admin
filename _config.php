<?php

define('FRONTEND_ADMIN_DIR', basename(dirname(__FILE__)));

Object::useCustomClass('HTMLText', 'FrontendEditorHTMLText', true);
Object::useCustomClass('Varchar', 'FrontendEditorVarchar', true);
Object::useCustomClass('Enum', 'FrontEndEnum', true);
Object::useCustomClass('Boolean', 'FrontEndBoolean', true);
Object::useCustomClass('Image', 'FrontEndImage', true);

//FrontEndText
Image::add_extension('FrontEndImageExtension');

Object::add_extension('Page_Controller', 'FrontendEditingControllerExtension');
Object::add_extension('Page', 'FrontendAdminPageExtension');

class FrontEndImage extends Image {

    public function forTemplate() {
        $value = parent::forTemplate();
        return "<span class='editable'>" . $value . "</span>";
    }

}
