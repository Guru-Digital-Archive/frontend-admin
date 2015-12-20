<?php

/**
 * Description of FrontEndBoolean
 *
 * @property Image $owner
 */
class FrontEndImageExtension extends DataExtension
{
    /**
     * Set the value on the field.
     * Optionally takes the whole record as an argument,
     * to pick other values.
     *
     * @param mixed $value
     * @param array $record
     */
//    public function setValue($value, $record = null) {
//        FrontendEditing::setValue($this->owner, $value, $record);
//        parent::setValue($value, $record);
//    }
//
////    public function augmentSQL(SQLQuery &$query) {
////        echo '<pre class="debug"> "$record"' . PHP_EOL . __FILE__ . "::" . __LINE__ . PHP_EOL . '</pre>';
////        echo '<pre class="debug"> "$record"' . $this->owner->getFilename() . '</pre>';
////    }
//
//    public function canView($member) {
//        echo '<pre class="debug"> "$record"' . PHP_EOL . __FILE__ . "::" . __LINE__ . PHP_EOL . '</pre>';
//        echo '<pre class="debug"> "$record"' . $this->owner->getFilename() . '</pre>';
//        return parent::can($member);
//    }

    /**
     * Returns the string which will be used in the template
     * @return string
     */
    public function forTemplateEdit()
    {
        $dbField    = $this->owner->dbObject('Filename');
        FrontendEditing::setValue($dbField, $this->owner->Filename, $this->owner);
        $isEditable = FrontendEditing::editingEnabled() && FrontendEditing::isEditable($dbField);
        $value      = $this->owner->forTemplate() . "99";
        if ($isEditable) {
            $value = "<span class='editable'>" . $value . "</span>";
        }
        return $value;
    }
}
