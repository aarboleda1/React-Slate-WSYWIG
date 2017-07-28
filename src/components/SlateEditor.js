import React, {Component} from 'react';
import { Editor, Raw } from 'slate';


import {MarkHotKey} from './utils/utils';
const plugins = [
  MarkHotKey({ code: 66, type: 'bold' }),
  MarkHotKey({ code: 67, type: 'code', isAltKey: true }),
  MarkHotKey({ code: 73, type: 'italic' }),
  MarkHotKey({ code: 68, type: 'strikethrough' }),
  MarkHotKey({ code: 85, type: 'underline' })
]
const initialState = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: 'A line of text in a paragraph.'
        }
      ]
    }
  ]
}, { terse: true })

export default class SlateEdtior extends Component { 
 // Set the initial state when the app is first constructed.
  state = {
		state: initialState,
	  schema: {
      marks: {
        bold: props => <strong>{props.children}</strong>,
        code: props => <code>{props.children}</code>,
        italic: props => <em>{props.children}</em>,
        strikethrough: props => <del>{props.children}</del>,
        underline: props => <u>{props.children}</u>,
      }
    }

  }
  onChange = (state) => {
    this.setState({ state })
	}

  render = () => {
    return (
			<div className="editor__wrapper ">
				<Editor
					plugins={plugins}
					schema={this.state.schema}
					state={this.state.state}
					onChange={this.onChange}
				/>
			</div>
    )
  }
}