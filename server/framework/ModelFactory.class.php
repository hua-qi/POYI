<?php
// 使用单例模式
// 设计单例工厂类
class ModelFactory
{
    static $all_model = array();  // 用于存储各个模型类的唯一实例 （单例模式）
    static function M($model_name) // $model_name是一个模型类的类型
    {
        if (
            // 若该实例不存在
            !isset(static::$all_model[$model_name]) || !(static::$all_model[$model_name] instanceof $model_name)
            // 或该示例不属于 $all_model
        ) {
            static::$all_model[$model_name] = new $model_name();
        }
        return static::$all_model[$model_name];
    }
}
