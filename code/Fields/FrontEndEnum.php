<?php

/**
 * Description of FrontEndEnum
 *
 * @author corey
 */
class FrontEndEnum extends Enum
{

    /**
     * Set the value on the field.
     * Optionally takes the whole record as an argument,
     * to pick other values.
     *
     * @param mixed $value
     * @param array $record
     */
    public function setValue($value, $record = null)
    {
        FrontendEditing::setValue($this, $value, $record);
        parent::setValue($value, $record);
    }

    /**
     * Returns the string which will be used in the template
     * @return string
     */
    public function forTemplate()
    {
        $isEditable = FrontendEditing::editingEnabled() && FrontendEditing::isEditable($this);
        $value      = parent::forTemplate();
        if ($isEditable) {
            $field = $this->formField(null, null, false, $value)->
                setAttribute('data-feclass', FrontendEditing::getClassName($this))->
                setAttribute('data-feid', FrontendEditing::getID($this))->
                setAttribute('data-fefield', $this->name)->
                addExtraClass("frontend-editable frontend-editable-enum");
            $value = $field->forTemplate();
        }
        return $value;
    }
}