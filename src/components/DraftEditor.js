import React from 'react';
import {EditorState, convertFromRaw,RichUtils} from 'draft-js';
import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor';
import createInlineToolbarPlugin, {Separator} from 'draft-js-inline-toolbar-plugin'; 
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from 'draft-js-buttons';

import 'draft-js/dist/Draft.css'; 
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import 'draft-js-linkify-plugin/lib/plugin.css';
import 'draft-js-image-plugin/lib/plugin.css';

const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeButton,
    Separator,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
  ]
});
const { InlineToolbar } = inlineToolbarPlugin;
const linkifyPlugin = createLinkifyPlugin();
const imagePlugin = createImagePlugin();

const plugins = [inlineToolbarPlugin, linkifyPlugin, imagePlugin];
const text = 'Enter text here...';

export default class DraftEditor extends React.Component {
	static defaultProps = {
  }
  static propTypes = {
  }	
  constructor(props) {
    super(props);
    this.state = {editorState: createEditorStateWithText(text),};
	}
	componentWillUnmount() {
		this.unMounted = true;
	}
	_onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
	}
	
	focus = () => {
    this.editor.focus();
  };


	onChange = (editorState) => {
		if (this.unMounted) return;
		this.setState({editorState});
	}
  render() {
    return (

				<div onClick={this.focus} className="editor__wrapper">
					<div className="media__toolbar">
						<button>Image</button>
					</div>
						<Editor 
							
							editorState={this.state.editorState} 
							onChange={this.onChange} 
							plugins={plugins}
							ref={(el) => this.editor = el }
						/>
						<InlineToolbar />					
				</div>
				
    );
  }
}