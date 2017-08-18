import React, { Component } from 'react';
import '../stylesheets/main.css';
import Main from './layouts/Main';
// import Sidebar from './layouts/Sidebar'; drag and drop
// import DraftEditor from './DraftEditor';
import Header from './layouts/Header'
import SlateEditor from './SlateEditor';
import HtmlViewer from './HtmlViewer';
import serializedHTML from './utils/utils';
// import SerializedEditor from './SerializedEditor.js';
import Sidebar from './layouts/Sidebar';
class App extends Component {
  render() {
    return (
			<div className="app__container">	
				<Header/>				
				{/*<Sidebar/>
				*/}
				<Main>			
					<SlateEditor 
						serializedHTML={serializedHTML}
					/>
					{/*	
							<SerializedEditor/> testing for serialization 
					/>*/}
					{/*<HtmlViewer/>*/}
				</Main>
      </div>
    );
  }
}

export default App;