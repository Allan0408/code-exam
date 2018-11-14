const Validator = require('../lib/query/validator')
const api_wrapper = require('../lib/util/api_wrapper')

const bodyParser = require('body-parser')
const token = require('../lib/util/token.middleware')
const LogicException = require('../lib/exception/LogicException')
const LoginException = require('../lib/exception/LoginException')

const Inspire = require('./dao/inspire')

/**
 * 服务注册函数
 * 向express中注册路由
 */
function register(app){

  app.get('/my/question', token, api_wrapper( async (req, res) => {
    const validator = new Validator(req.query)
    query.offset = query.offset || 0
    validator.check('offset', 'integer', 'offset必须是整数')
    validator.check('limit', 'integer', 'offset必须是10-50之间的整数', {
      min : 10,
      max : 50
    })
    validator.validate()
    const inspire = new Inspire()
    const questions = await inspire.questions(req.student.account_id, query.offset, query.limit)
    res.send(questions)
  }))


  app.put('/my/question', token, api_wrapper( async (req, res) => {
    const validator = new Validator(req.body)
    validator.check('md', 'required', '请填写题目内容')
    validator.check('md', 'len', '题目内容应当为10-1000个字符', {
      min : 10,
      max : 1000
    })
    validator.check('sample', 'required', '请填写示例程序')
    validator.check('sample', 'len', '题目内容应当为10-200', {
      min : 10,
      max : 200
    })
    validator.check('tester', 'required', '请填写测试程序')
    validator.check('tester', 'len', '测试程序应当为20-1000个字符', {
      min: 10,
      max: 1000
    })
    validator.validate()

    const inspire = new Inspire()

    await inspire.put_question({
      md : req.body.md,
      tester : req.body.tester,
      sample : req.body.sample,
      account_id : req.student.account_id
    })

    res.send({
      success : 1
    })
  }))


  app.post('/my/question', token, api_wrapper(async (req, res) => {
    const validator = new Validator(req.body)
    validator.check('id', 'required', '需要id')
    validator.check('id', 'integer', '需要整数id')
    validator.check('md', 'required', '请填写题目内容')
    validator.check('md', 'len', '题目内容应当为10-1000个字符', {
      min : 10,
      max : 1000
    })
    validator.check('sample', 'required', '请填写示例程序')
    validator.check('sample', 'len', '题目内容应当为10-200', {
      min : 10,
      max : 200
    })
    validator.check('tester', 'required', '请填写测试程序')
    validator.check('tester', 'len', '测试程序应当为20-1000个字符', {
      min: 10,
      max: 1000
    })
    validator.validate()

    const inspire = new Inspire()

    await inspire.put_question({
      md : req.body.md,
      tester : req.body.tester,
      sample : req.body.sample,
      account_id : req.student.account_id
    })

    res.send({
      success : 1
    })
  }))



  app.delete('/my/question', token, api_wrapper(async (req, res) => {
    const validator = new Validator(req.body)
    validator.check('id', 'required', '需要id')
    validator.check('id', 'integer', '需要整数id')

    validator.validate()

    const inspire = new Inspire()

    await inspire.delete_question(req.body.id)
    res.send({
      success: 1
    })
  })

}


module.exports = register