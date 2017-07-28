import React, {Component} from 'react';
import { Editor, Raw, Block } from 'slate';
import isImage from 'is-image';
import isUrl from 'is-url';
import initialState from './state.json';
import {MarkHotKey} from './utils/utils';

const plugins = [
  MarkHotKey({ code: 66, type: 'bold' }),
  MarkHotKey({ code: 67, type: 'code', isAltKey: true }),
  MarkHotKey({ code: 73, type: 'italic' }),
  MarkHotKey({ code: 68, type: 'strikethrough' }),
	MarkHotKey({ code: 85, type: 'underline' }),	
]
const defaultBlock = {
  type: 'paragraph',
  isVoid: false,
  data: {}
}
export default class SlateEdtior extends Component { 
 // Set the initial state when the app is first constructed.
  state = {
		state: Raw.deserialize(initialState, { terse: true }),
	  schema: {
			nodes: {
				paragraph: (props) => {
					let result = <p {...props.attributes}></p>;
					return (<p {...props.attributes}>{props.children}</p>);
				},	
				image: (props) => {
					const { node, state } = props;
					const active = state.isFocused && state.selection.hasEdgeIn(node);
					const src = node.data.get('src');
					const className = active ? 'active' : null;
					return (
						<img src={src} className={className} {...props.attributes} />
					)
				},							
			},
      marks: {
        bold: props => <strong>{props.children}</strong>,
        code: props => <code>{props.children}</code>,
        italic: props => <em>{props.children}</em>,
        strikethrough: props => <del>{props.children}</del>,
				underline: props => <u>{props.children}</u>,
			},
			rules: [
					// Rule to insert a paragraph block if the document is empty.
					{
						match: (node) => {
							return node.kind == 'document'
						},
						validate: (document) => {
							return document.nodes.size ? null : true
						},
						normalize: (transform, document) => {
							const block = Block.create(defaultBlock)
							transform.insertNodeByKey(document.key, 0, block)
						}
					},
					// Rule to insert a paragraph below a void node (the image) if that node is
					// the last one in the document.
					{
						match: (node) => {
							return node.kind == 'document'
						},
						validate: (document) => {
							const lastNode = document.nodes.last()
							return lastNode && lastNode.isVoid ? true : null
						},
						normalize: (transform, document) => {
							const block = Block.create(defaultBlock)
							transform.insertNodeByKey(document.key, document.nodes.size, block)
						}
					}
				]			
    }
	}
  render = () => {
    return (
			<div className="editor__wrapper ">
				<div style={{borderBottom: '1px solid gray'}}className="menu toolbar">
					<span className="button" onMouseDown={this.onClickImage}>
						<span className="material-icons">image</span>
					</span>
				</div>
				<div className="editor">
					<Editor
						plugins={plugins}
						schema={this.state.schema}
						state={this.state.state}
						onChange={this.onChange}
						onDrop={this.onDrop}
						onPaste={this.onPaste}
						onKeyDown={this.onKeyDown}
					/>
				</div>
			</div>
    )
  }	
	componentDidUpdate = () => {
	}
  onChange = (state) => {
    this.setState({ state })
	}
  onClickImage = (e) => {
    e.preventDefault()
    const src = window.prompt('Enter the URL of the image:')
    if (!src) return
    let { state } = this.state
		state = this.insertImage(state, null, src)
		console.log(state)
    this.onChange(state)
	}	
  insertImage = (state, target, src) => {
    const transform = state.transform()
		console.log(transform, 'is transform')
    if (target) transform.select(target)
    return transform
      .insertBlock({
        type: 'image',
        isVoid: true,
        data: { src }
      })
      .apply()
  }
  onDrop = (e, data, state, editor) => {
    switch (data.type) {
      case 'files': return this.onDropOrPasteFiles(e, data, state, editor)
    }
	}
	onDropOrPasteFiles = (e, data, state, editor) => {
		for (const file of data.files) {
			const reader = new FileReader();
			const [type] = file.type.split('/');
			if (type !== 'image') continue;
			reader.addEventListener('load', () => {
				state = editor.getState();
				state = this.insertImage(state, data.target, reader.result)
				editor.onChange(state);
			})
			reader.readAsDataURL(file);
		}
	}
  onPasteText = (e, data, state) => {
    if (!isUrl(data.text)) return
    if (!isImage(data.text)) return
    return this.insertImage(state, data.target, data.text)
	}
	onPaste = (e, data, state, editor) => {	
    switch (data.type) {
      case 'files': return this.onDropOrPasteFiles(e, data, state, editor)
      case 'text': return this.onPasteText(e, data, state)
    }
	}
}