import React, {Component} from 'react';

export class EditContainer extends Component {
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
			<div>
				{this.props.children}
			</div>
		)
	}
}