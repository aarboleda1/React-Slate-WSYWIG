import React, {Component} from 'react';

export default class Main extends Component {
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
			<div className="main__container">
				{this.props.children}
			</div>
		)
	}
}