import { Editor } from 'slate'
import React, {Component} from 'react';
import { Html } from 'slate'
// import initialState from './state.json';
const initialState = (
  localStorage.getItem('content') ||
  '<p></p>'
)
// Create a new serializer instance with our `rules` from above.
const BLOCK_TAGS = {
  blockquote: 'quote',
  p: 'paragraph',
  pre: 'code'
}

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline',
}

const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (!type) return
      return {
        kind: 'block',
        type: type,
        nodes: next(el.childNodes)
      }
    },
    serialize(object, children) {
      if (object.kind != 'block') return
      switch (object.type) {
        case 'code': return <pre><code>{children}</code></pre>
        case 'paragraph': return <p>{children}</p>
        case 'quote': return <blockquote>{children}</blockquote>
      }
    }
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()]
      if (!type) return
      return {
        kind: 'mark',
        type: type,
        nodes: next(el.childNodes)
      }
    },
    serialize(object, children) {
      if (object.kind != 'mark') return
      switch (object.type) {
        case 'bold': return <strong>{children}</strong>
        case 'italic': return <em>{children}</em>
        case 'underline': return <u>{children}</u>
      }
    }
  }
]
const html = new Html({ rules })

export default class SerializedEditor extends React.Component {

	state = {
    state: html.deserialize(initialState),
    // Add a schema with our nodes and marks...
    schema: {
      nodes: {
        code: props => <pre {...props.attributes}>{props.children}</pre>,
        paragraph: props => <p {...props.attributes}>{props.children}</p>,
        quote: props => <blockquote {...props.attributes}>{props.children}</blockquote>,
      },
      marks: {
        bold: props => <strong>{props.children}</strong>,
        italic: props => <em>{props.children}</em>,
        underline: props => <u>{props.children}</u>,
      }
    }
  }

  onChange = (state) => {
    this.setState({ state })
  }

  // When the document changes, save the serialized HTML to Local Storage.
  onDocumentChange = (document, state) => {
    const string = html.serialize(state)
    localStorage.setItem('content', string)
  }

  render() {
    // Add the `onDocumentChange` handler.
    return (
      <Editor
        schema={this.state.schema}
        state={this.state.state}
        onChange={this.onChange}
        onDocumentChange={this.onDocumentChange}
      />
    )
  }
}