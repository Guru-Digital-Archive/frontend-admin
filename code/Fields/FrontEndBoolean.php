<?php

/**
 * Description of FrontEndBoolean
 *
 * @author corey
 */
class FrontEndBoolean extends Boolean {

    /**
     * Set the value on the field.
     * Optionally takes the whole record as an argument,
     * to pick other values.
     *
     * @param mixed $value
     * @param array $record
     */
    public function setValue($value, $record = null) {
        FrontendEditing::setValue($this, $value, $record);
        parent::setValue($value, $record);
    }

    /**
     * Returns the string which will be used in the template
     * @return string
     */
    public function forTemplate() {
        $isEditable = FrontendEditing::editingEnabled() && FrontendEditing::isEditable($this);
        $value      = parent::forTemplate();
        if ($isEditable) {
            $field = $this->scaffoldSearchField($value)->
                    setAttribute('data-feclass', FrontendEditing::getClassName($this))->
                    setAttribute('data-feid', FrontendEditing::getID($this))->
                    setAttribute('data-fefield', $this->name)->
                    setHasEmptyDefault(false)->
                    addExtraClass("frontend-editable frontend-editable-boolean")->
                    setValue($value);
            $value = $field->forTemplate();
        }
        return $value;
    }

}
