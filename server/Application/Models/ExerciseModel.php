<?php
class ExerciseModel extends BaseModel
{
    function QueryTopicList($type)
    {
        $collname = 'topicList';
        $filter = [
            'type' => $type
        ];
        return $this->_dao->query($collname, $filter);
    }
    function QueryExercise($collname, $id, $type)
    {
        $filter = [
            'id' => $id,
            'type' => $type
        ];
        return $this->_dao->query($collname, $filter);
    }
}
