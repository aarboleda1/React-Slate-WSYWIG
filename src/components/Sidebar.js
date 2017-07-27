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
				{this.props.children}
			</div>
		)
	}
}