<?php

define('FRONTEND_ADMIN_DIR', basename(dirname(__FILE__)));

Object::useCustomClass('Boolean', 'FrontEndBoolean', true);
Object::useCustomClass('Enum', 'FrontEndEnum', true);
//Object::useCustomClass('Image', 'FrontEndImage', true);
Object::useCustomClass('HTMLText', 'FrontendEditorHTMLText', true);
Object::useCustomClass('Text', 'FrontendEditorText', true);
Object::useCustomClass('Varchar', 'FrontendEditorVarchar', true);

//Image::add_extension('FrontEndImageExtension');

Object::add_extension('Page_Controller', 'FrontendEditingControllerExtension');
Object::add_extension('Page', 'FrontendAdminPageExtension');

if (class_exists("DynamicCacheExtension")) {
    Object::add_extension('DynamicCache', 'FrontEndAdminDynamicCacheExtension');
}