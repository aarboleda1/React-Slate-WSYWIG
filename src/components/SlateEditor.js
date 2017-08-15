import React, {Component} from 'react';
import { Editor, Raw, Block } from 'slate';
import isImage from 'is-image';
import isUrl from 'is-url';
import initialState from './state.json';
import {MarkHotKey} from './utils/utils';
// import MdIconPack from 'react-icons/lib/md';
const DEFAULT_NODE = 'paragraph'

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
				// paragraph: (props) => <p {...props.attributes}>{props.children}</p>,	
				image: (props) => {
					const { node, state } = props;
					const active = state.isFocused && state.selection.hasEdgeIn(node);
					const src = node.data.get('src');
					const className = active ? 'active' : null;
					return (
						<img src={src} alt="" className={className} {...props.attributes} />
					)
				},				
				link: (props) => {
					const {data}= props.node;
					let href = data.get('href');
					return <a {...props.attributes} href={href}>{props.children}</a>
				},
				'block-quote': props => <blockquote {...props.attributes}>{props.children}</blockquote>,
				'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
				'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
				'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
				'list-item': props => <li {...props.attributes}>{props.children}</li>,
				'numbered-list': props => <ol {...props.attributes}>{props.children}</ol>,								
			},
			marks: {
				bold: {
					fontWeight: 'bold'
				},
				code: {
					fontFamily: 'monospace',
					backgroundColor: '#eee',
					padding: '3px',
					borderRadius: '4px'
				},
				italic: {
					fontStyle: 'italic'
				},
				underlined: {
					textDecoration: 'underline'
				},
				'align-left': {
					textAlign: 'left',
				},
				'align-right':{
					textAlign: 'right',
				}

			},
			rules: [
					// Rule to insert a paragraph block if the document is empty.
					{
						match: (node) => {
							return node.kind === 'document'
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
							return node.kind === 'document'
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
				<div style={{borderBottom: '1px solid gray'}} className="menu toolbar">
					{this.renderMarkButton('bold', 'format_bold')}
					{this.renderMarkButton('italic', 'format_italic')}
					{this.renderMarkButton('underlined', 'format_underlined')}
					{this.renderMarkButton('code', 'code')}
					{this.renderBlockButton('align-left', 'format_align_left')}
					{this.renderBlockButton('align-center', 'format_align_center')}
					{this.renderBlockButton('align-right', 'format_align_right')}					
					{this.renderBlockButton('heading-one', 'looks_one')}
					{this.renderBlockButton('heading-two', 'looks_two')}
					{this.renderBlockButton('block-quote', 'format_quote')}
					{this.renderBlockButton('numbered-list', 'format_list_numbered')}
					{this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
					<span className="button" onMouseDown={this.onClickImage}>
						<span className="material-icons">image</span>
					</span>
					<span className="button" style={{paddingLeft: '10px'}}onMouseDown={this.onClickLink}>
						<span className="material-icons">link</span>
					</span>		
				</div>
				<div className="editor">
					<Editor
						spellCheck
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
	hasLinks = () => {
		const {state} = this.state;
		return state.inlines.some(inline => inline.type === 'link');
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
  onClickLink = (e) => {
    e.preventDefault()
    let { state } = this.state
    const hasLinks = this.hasLinks()
    if (hasLinks) {
      state = state
        .transform()
        .unwrapInline('link')
        .apply()
    }
    else if (state.isExpanded) {
			console.log('insdie the isExpanded??')
      const href = window.prompt('Enter the URL of the link:')
      state = state
        .transform()
        .wrapInline({
          type: 'link',
          data: { href }
        })
        .collapseToEnd()
        .apply()
    }
    else {
			const href = window.prompt('Enter the URL of the link:');
			if (!href) return;
			const text = window.prompt('Enter the text for the link:')
			if (!text) return;			
      state = state
        .transform()
        .insertText(text)
        .extend(0 - text.length)
        .wrapInline({
          type: 'link',
          data: { href }
        })
        .collapseToEnd()
        .apply()
    }
    this.setState({ state })
  }
  insertImage = (state, target, src) => {
    const transform = state.transform()
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
		// eslint-disable-next-line
    switch (data.type) {
      case 'files': return this.onDropOrPasteFiles(e, data, state, editor)
    }
	}
	onDropOrPasteFiles = (e, data, state, editor) => {
		for (const file of data.files) {
			const reader = new FileReader();
			const [type] = file.type.split('/');
			if (type !== 'image') continue;
			// eslint-disable-next-line
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
		// eslint-disable-next-line
    switch (data.type) { 
      case 'files': return this.onDropOrPasteFiles(e, data, state, editor)
      case 'text': return this.onPasteText(e, data, state)
    }
	}
	onKeyDown = (e, data, state) => {
		if (!data.isMod) return;
		let mark;
		switch(data.key) {
			case 'b':
				mark = 'bold'
				break;
			case 'i':
        mark = 'italic'
        break
      case 'u':
        mark = 'underlined'
        break
      case '`':
        mark = 'code'
        break
      default:
        return
		}
		state = state
			.transform()
			.toggleMark(mark)
			.apply()
		
		e.preventDefault()
		return state;
	}
	renderBlockButton = (type, icon) => {
		const isActive = this.hasMark(type);
		return (
			<span className="button" onMouseDown={(e) => this.onClickBlock(e, type)} data-active={isActive}>
				<span className="material-icons">{icon}</span>
			</span>
		)
	}
	renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)
    const onMouseDown = e => this.onClickMark(e, type)

    return (
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )		
	}
	onClickMark = (e, type) => {
		e.preventDefault();
		let {state} = this.state;
		console.log(type, 'is the type')
		state = state
			.transform()
			.toggleMark(type)
			.apply()
		this.setState({state});
	}
	alignmentMarkStrategy = (state, align) => {
		const getType = state => state.blocks.first().type
		console.log('blah')
		console.log(state)	
		
		state
			.transform()
			.setBlock({
				type: 'alignment',
				data: { align, currentBlockType: getType(state) }
			})
			.focus()
			.apply()	
		console.log(state)	
		this.setState({state})
	}
	onClickBlock = (e, type) => {
    e.preventDefault()
    let { state } = this.state
    const transform = state.transform()
		const { document } = state
		if (type.includes('align')) {
			// const getType = state => state.blocks.first().type
			
			// const alignmentMarkStrategy = (state, align) => {
			// 	console.log(state, align)
			// 	state
			// 		.transform()
			// 		.setBlock({
			// 			type: 'alignment',
			// 			data: { align, currentBlockType: getType(state) }
			// 		})
			// 		.focus()
			// 		.apply()
			// }
			this.alignmentMarkStrategy(state, 'right');
			return;
		}
    // Handle everything but list buttons.
    if (type != 'bulleted-list' && type != 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      }

      else {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
      }
    }

    // Handle the extra wrapping required for list buttons.
    else {
      const isList = this.hasBlock('list-item')
      const isType = state.blocks.some((block) => {
        return !!document.getClosest(block.key, parent => parent.type == type)
      })

      if (isList && isType) {
        transform
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        transform
          .unwrapBlock(type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
          .wrapBlock(type)
      } else {
        transform
          .setBlock('list-item')
          .wrapBlock(type)
      }
    }

    state = transform.apply()
    this.setState({ state })
  }	
	hasMark = (type) => {
    const { state } = this.state
    return state.marks.some(mark => mark.type == type)
	}
	
  hasBlock = (type) => {
    const { state } = this.state
    return state.blocks.some(node => node.type == type)
  }
}