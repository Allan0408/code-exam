import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import withMe from './withMe'
import './header.styl'

export default @withMe() class Header extends Component {
  render(){
    return <div className='header'>
      <div className='logo'>
        <img src={require('../../../static/img/horse.png')} />
        <h2>专注算法学习，提高编码效率</h2>
      </div>

      <div className='u'>
        <div className='circle'>
          {this.props.nickname && this.props.nickname[0]}
        </div>
        {this.props.student && <div className='top-menu'>
          <div className='item'>
            <a href='/inspire'>创作中心</a>
          </div>
          <div className='item'>
            <a href='/logout'>登出</a>
          </div>
        </div>}
      </div>
    </div>
  }
}