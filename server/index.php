<?php
// 引入项目框架类
require './Framework/MongoDB.class.php';
require './Framework/ModelFactory.class.php';
require './Framework/BaseModel.class.php';
// 引入项目Model层类
require './Application/Models/UserModel.php';
require './Application/Models/ExerciseModel.php';
require './Application/Models/MessageModel.php';
require './Application/Models/WordModel.php';
// 引入项目Controller层类
require './Application/Controllers/UserController.php';
require './Application/Controllers/ExerciseController.php';
require './Application/Controllers/MessageController.php';
require './Application/Controllers/WordController.php';

// 使用三元运算符判断并 附module值
$module = !empty($_GET['module']) ? $_GET['module'] : 'index';
// 字符拼接
$controller = $module . 'Controller';
// 实例化经字符拼接后的类名对应的Controller类
$ModuleController = new $controller();

// 使用三元运算符判断并 符action值
$action = !empty($_GET['action']) ? $_GET['action'] : 'index';
// 上文实例化的Controller类调用其对应的类中的方法
$ModuleController->$action();	//可变函数————>>可变方法
