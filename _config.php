<?php

define('FRONTEND_ADMIN_DIR', basename(dirname(__FILE__)));

Object::useCustomClass('HTMLText', 'FrontendEditorHTMLText', true);
Object::useCustomClass('Varchar', 'FrontendEditorVarchar', true);

Object::add_extension('Page_Controller', 'FrontendEditingControllerExtension');
Object::add_extension('Page', 'FrontendAdminPageExtension');
