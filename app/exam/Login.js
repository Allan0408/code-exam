import React, {Component} from 'react'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd'
import request from '../lib/request'
import qs from 'qs'
const FormItem = Form.Item
export default class Login extends Component{
  render(){
    return <div className='flex-center full'>
      <div className='login'>
        <h1>用户登入</h1>
        <WrappedNormalLoginForm />
      </div>
    </div>
  }
}


class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        request(`/api/account/login?email=${values.email}&password=${values.password}`)
        .then(data => {
          message.success('登录成功')

          setTimeout( () => {
            const query = qs.parse(location.search.substr(1))
            window.location.href = decodeURIComponent(query.next)
          })
        })
        .catch(ex => {

        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入邮箱!' }, {
              type : 'email',
              message : '邮箱格式不正确'
            }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
          )}
        </FormItem>
        <FormItem>
          <div>
            <Button style={{width : '100%'}} type="primary" htmlType="submit" className="login-form-button">
              Log in
          </Button>
          </div>


          <div>
            <a href="">注册</a>
          </div>

        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
