import React from 'react';
export const schema = {
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
	
				}
}