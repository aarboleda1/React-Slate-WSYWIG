import React, {Component} from 'react';
import { Editor, Raw, Block, Html } from 'slate';
import isImage from 'is-image';
import isUrl from 'is-url';
import initialState from './state.json';
import {MarkHotKey} from './utils/utils';
import Popover from './plugins/Popover';

const DEFAULT_NODE = 'paragraph';
// let rule = new Html();
const RULES =[
	{ 
		deserialize(el, next){
      if (el.tagName.toLowerCase() === 'p') {
        return {
          kind: 'block',
          type: 'paragraph',
          nodes: next(el.childNodes)
        }
      }			
		},
		serialize(object, children) {
			if (object.kind === 'block' && object.type === 'paragraph') {
				return <p>{children}</p>
			}
		}
	}, 
]
// const serializer = new Html({RULES})


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
	// static props
	constructor(props) {
		super(props)
		this.state = {
			isEmojiModalExpanded: false,
			isImageExpanded: false,
			isLinkModalExpanded: false,
			imageUrl: '',
			linkUrl: '',
			targetText: '',
			state: Raw.deserialize(initialState, { terse: true }),
			schema: {
				nodes: {
					paragraph: (props) => <p {...props.attributes}>{props.children}</p>,	
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
						return <a {...props.attributes} target="_blank" href={href}>{props.children}</a>
					},
					'block-quote': props => <blockquote {...props.attributes}>{props.children}</blockquote>,
					'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
					'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
					'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
					'list-item': props => <li {...props.attributes}>{props.children}</li>,
					'numbered-list': props => <ol {...props.attributes}>{props.children}</ol>,								
					'align-left': props => <div style={{textAlign: 'left'}}>{props.children}</div>,
					'align-right': props => <div style={{textAlign: 'right'}}>{props.children}</div>,
					'align-center': props => <div style={{textAlign: 'center'}}>{props.children}</div>,
					'emoji': (props) => {
						const {state, node} = props;
						const {data} = node;
						const code = data.get('code');
						const isSelected = state.selection.hasFocusIn(node);
						return (<span className={`emoji ${isSelected ? 'selected' : ''}`} {...props.attributes} contentEditable={false}>{code}</span>);
					}		
	
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
					color: {
						color: 'blue'
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
	} 
  render = () => {		
    return (
			<div className="editor__wrapper ">
				<div style={{borderBottom: '1px solid gray'}} className="menu toolbar">
					{this.renderMarkButton('bold', 'format_bold')}
					{this.renderMarkButton('italic', 'format_italic')}
					{this.renderMarkButton('underlined', 'format_underlined')}
					{this.renderMarkButton('code', 'code')}
					{/*{this.renderMarkButton('color', 'format_paint')}*/}
					{this.renderAlignmentButton('align-left', 'format_align_left')}
					{this.renderAlignmentButton('align-center', 'format_align_center')}
					{this.renderAlignmentButton('align-right', 'format_align_right')}					
					{this.renderBlockButton('heading-one', 'looks_one')}
					{this.renderBlockButton('heading-two', 'looks_two')}
					{this.renderBlockButton('block-quote', 'format_quote')}
					{this.renderBlockButton('numbered-list', 'format_list_numbered')}
					{this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
					
					<span className="se button" onMouseDown={(e) => this.onOpenModal(e, 'ImageModal') }>
						<span className="material-icons">image</span>
						<Popover 
							isActive={this.state.isImageExpanded}
							imageUrl={this.state.imageUrl}
							handleTextChange={this.handleTextChange}
							onAddImage={this.onAddImage}
							popOverType={'imageUrl'}
						/>					
					</span>
					<span className="se button" style={{paddingLeft: '10px'}} onMouseDown={(e) => this.onOpenModal(e, 'LinkModal')}>
						<span className="material-icons">link</span>
						<Popover 
							isActive={this.state.isLinkModalExpanded}
							inputUrl={this.state.inputUrl}
							targetText={this.state.targetText}
							handleTextChange={this.handleTextChange}
							onAddLink={this.onAddLink}
							popOverType={'linkUrl'}
						/>							
					</span>	
					<span className="se button" style={{paddingLeft: '10px'}} onMouseDown={(e) => this.onOpenModal(e, 'EmojiModal')}>
						<span className="material-icons">{'😎'}</span>
						<Popover 
							isActive={this.state.isEmojiModalExpanded}
							popOverType={'emoji'}
							onClickEmoji={this.onClickEmoji}
						/>							
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
						onDocumentChange={this.onDocumentChange}
					/>
				</div>
			</div>
    )
  }	

	handleTextChange = (text, type) => {
		switch(type) {
			case('imageUrl'):
				this.setState({imageUrl: text})
				break;
			case('linkUrl'):
				this.setState({linkUrl: text})
				break;
			case('targetText'):
				this.setState({targetText: text})
				break;				
			default:
				return;
		}		
	}
	onDocumentChange = () => {
		// console.log(serializer)
	}
  onChange = (state) => {
    this.setState({ state })
	}
	hasLinks = () => {
		const {state} = this.state;
		return state.inlines.some(inline => inline.type === 'link');
	}
  onClickEmoji = (e, code) => {
    e.preventDefault()
    let { state } = this.state

    state = state
      .transform()
      .insertInline({
        type: 'emoji',
        isVoid: true,
        data: { code }
      })
      .apply()

    this.setState({ state })
  }	
  onOpenModal = (e, modalType) => {
		const {isImageExpanded, isLinkModalExpanded, isEmojiModalExpanded} = this.state;
		if (e.target.className === 'se button' || e.target.className === 'material-icons') {
			switch(modalType) {
				case('ImageModal'):
					this.setState({
						isImageExpanded: !isImageExpanded,
					});
					break;
				case('LinkModal'):
					this.setState({
						isLinkModalExpanded: !isLinkModalExpanded})
					break;
				case('EmojiModal'):
					this.setState({
						isEmojiModalExpanded: !isEmojiModalExpanded,
					})
					break;
				default: 
					return;
			}
		}
	}	
	onAddImage = (e) => {
		e.stopPropagation();
		const src = this.state.imageUrl;
    if (!src) this.setState({isImageExpanded: !this.state.isImageExpanded})			
		let { state } = this.state
		state = this.insertImage(state, null, src)
		this.onChange(state)
		this.setState({
			imageUrl: '',
			isImageExpanded: !this.state.isImageExpanded,
		});
	}
	onAddLink = () => {
    let { state, targetText, linkUrl } = this.state		
		const href = linkUrl;
		if (!href) return;
		const text = targetText;
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
		this.setState({ 
			state,
			targetText: '',
			linkUrl: '',
		 })			
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
			<span className="se button" onMouseDown={(e) => this.onClickBlock(e, type)} data-active={isActive}>
				<span className="material-icons">{icon}</span>
			</span>
		)
	}
	renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)
    const onMouseDown = e => this.onClickMark(e, type)

    return (
      <span className="se button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )		
	}
	onClickAlignment = (alignmentType) => {
		let {state} = this.state
		const getType = state => state.blocks.first().type;
		console.log(state.blocks.first(), 'is the first?')
		console.log('hello world')
		state = state
			.transform()
			.setBlock({
				type: alignmentType,
				data: { alignmentType, currentBlockType: getType(state) }
			})
			.focus()
			.apply()
			this.setState({state})
	}
	renderAlignmentButton = (alignmentType, icon) => {
		const isActive = this.hasMark(alignmentType)		
		const onMouseDown = e => this.onClickAlignment(alignmentType);
		return (
			<span className="se button" onMouseDown={onMouseDown} data-active={isActive}>
				<span className="material-icons">{icon}</span>
			</span>
		)	
	}
	onClickMark = (e, type) => {
		e.preventDefault();
		let {state} = this.state;
		state = state
			.transform()
			.toggleMark(type)
			.apply()
		this.setState({state});
	}
	onClickBlock = (e, type) => {
    e.preventDefault()
    let { state } = this.state
    const transform = state.transform()
		const { document } = state
				
    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
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
        return !!document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        transform
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        transform
          .unwrapBlock(type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
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
    return state.marks.some(mark => mark.type === type)
	}
	
  hasBlock = (type) => {
    const { state } = this.state
    return state.blocks.some(node => node.type === type)
  }
}