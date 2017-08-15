import React, {Component} from 'react';

export default class Sidebar extends Component {
	static defaultProps = {
  }
  static propTypes = {
  }
	constructor() {
		super();
		this.state = {

		}
	}
	render() {
		return (
			<div className="sidebar__container">
				<span style={{float: 'right'}} onClick={() => console.log('close')}>{'<<'}</span>
				<h2>{'Place Drag n Drop Blocks here'}</h2>
				{/*<ul>
					<li> 
						<strong>Home</strong>: command + B
					</li>
					<li> 
						<i>Italic</i>: command + I
					</li>		
					<li> 
						<code>Code</code>: command + alt +  C
					</li>		
					<li> 
						<u>Underline</u>: command + U
					</li>	
					<li> 
						<s>Strikethrough</s>: command + alt + S
					</li>													
				</ul>*/}
			</div>
		)
	}
}
