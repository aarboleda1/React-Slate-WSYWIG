import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css'; 

export default class DraftEditor extends React.Component {
	static defaultProps = {
  }
  static propTypes = {
  }	
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
	}
	_onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }
  render() {
    return (
				<div className="draft__wrapper">
					<button onClick={this._onBoldClick.bind(this)}>Bold</button>
        	<Editor editorState={this.state.editorState} onChange={this.onChange} />
				</div>
				
    );
  }
}