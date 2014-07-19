<?php

/**
 * Extension class to assist the Frontend Admin Panel
 */
class FrontendEditingPageExtension extends DataExtension {

    /**
     * Checks for removeContent or HTTP_X_REMOVE_CONTENT and removes the Content
     * field from the page.
     *
     * To ensure saving pages from within the admin panel does not overwrite content saved from the front end editor
     * set the X-REMOVE-CONTENT header or removeContent query string and the content field will be removed here
     *
     * @param FieldList $fields
     */
    public function updateCMSFields(FieldList $fields) {
        $controller       = Controller::curr();
        $isEditController = $controller instanceof CMSPageEditController;
        $xRemoveContent   = filter_input(INPUT_SERVER, 'HTTP_X_REMOVE_CONTENT') == "true";
        $removeContent    = $controller->getRequest()->getVar('removeContent') == "true";

        if ($isEditController && ($xRemoveContent || $removeContent)) {
            $fields->removeFieldFromTab("Root.Main", "Content");
        }
    }

}
