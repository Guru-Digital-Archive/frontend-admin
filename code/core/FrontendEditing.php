<?php

class FrontendEditing {

    public static $ForceEditable   = false;
    public static $EditableClasses = array();

    /**
     * Remember the classname and the ID for the given $dbField
     * @param DBField $dbField
     * @param $value
     * @param null $record
     */
    public static function setValue(DBField $dbField, $value, $record = null) {
        $canEdit = (Controller::curr() instanceof Page_Controller && Permission::check('ADMIN'));
        if (!$canEdit) {
            $canEdit = is_object($record) && in_array(get_class($record), self::$EditableClasses) && method_exists($record, 'canEdit') && $record->canEdit();
        }
        if ($canEdit && $record && is_object($record) && $dbField->getName()) {
            $dbField->makeEditable  = true;
            $dbField->editClassName = $record->ClassName;
            $dbField->editID        = $record->ID;
        }
    }

    /**
     * returns if the dbfield is editable
     * @param DBField $dbField
     * @return bool
     */
    public static function isEditable(DBField $dbField) {
        return isset($dbField->makeEditable) && $dbField->makeEditable;
    }

    /**
     * returns the classname for the given DBField
     * @param DBField $dbField
     * @return mixed
     */
    public static function getClassName(DBField $dbField) {
        return $dbField->editClassName;
    }

    /**
     * returns the ID for the given DBField
     * @param DBField $dbField
     * @return mixed
     */
    public static function getID(DBField $dbField) {
        return $dbField->editID;
    }

    public static function editingEnabled() {
        return FrontendEditing::$ForceEditable || ( (Cookie::get('editmode') !== 'false') && !Controller::curr()->getRequest()->offsetExists('stage'));
    }

    public static function enablingEditingFor($class) {
        FrontendEditing::$ForceEditable = true;
        Controller::curr()->AddEditingIncludes();

        if (!in_array($class, self::$EditableClasses)) {
            self::$EditableClasses[] = $class;
        }
    }

    public static function disableEditingFor($class) {
        if (in_array($class, self::$EditableClasses)) {
            unset(self::$EditableClasses[array_search($class, self::$EditableClasses)]);
        }
        if (empty(self::$EditableClasses)) {
            FrontendEditing::$ForceEditable = false;
        }
    }

}
