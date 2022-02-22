<?php
class ExerciseController
{
    // 查询题库列表
    function QueryTopicList()
    {
        $type = $_GET['type'];

        // 判断是否为空
        if (empty($type)) {
            return json_encode(['code' => 1, 'data' => '', 'mag' => '参数不正确']);
        };

        // 单例模式验证
        $obj = ModelFactory::M('ExerciseModel');
        $list = $obj->QueryTopicList($type);
        echo json_encode($list);
    }

    // 查询具体题目 / listening`s section / reading`s section
    function QueryExercise()
    {
        $collname = $_GET['collectionName'];
        $id = $_GET['id'];
        $type = $_GET['type'];

        // 判断是否为空
        if (empty($collname) || empty($id) || empty($type)) {
            return json_encode(['code' => 1, 'data' => '', 'mag' => '参数不正确']);
        };

        $obj = ModelFactory::M('ExerciseModel');
        $list = $obj->QueryExercise($collname, $id, $type);
        echo json_encode($list);
    }
}
