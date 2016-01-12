<?php

/**
 * Extension class to assist the Frontend Admin Panel
 */
class FrontendAdminPageExtension extends DataExtension
{

    /**
     * Checks for frontEndAdmin or HTTP_X_FRONT_END_ADMIN and removes the Content
     * field from the page.
     *
     * To ensure saving pages from within the admin panel does not overwrite content saved from the front end editor
     * set the X-REMOVE-CONTENT header or frontEndAdmin query string and the content field will be removed here
     *
     * @param FieldList $fields
     */
    public function updateCMSFields(FieldList $fields)
    {
        $controller       = Controller::curr();
        $isEditController = $controller instanceof CMSPageEditController;
        $xfrontEndAdmin   = filter_input(INPUT_SERVER, 'HTTP_X_FRONT_END_ADMIN') == "true";
        $frontEndAdmin    = $controller->getRequest()->getVar('frontEndAdmin') == "true";

        if ($isEditController && ($xfrontEndAdmin || $frontEndAdmin)) {
            $fields->removeFieldFromTab("Root.Main", "Content");
        }
    }
}