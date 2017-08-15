import React, { Component } from 'react';
import '../stylesheets/main.css';
import Main from './layouts/Main';
import Sidebar from './layouts/Sidebar';
// import DraftEditor from './DraftEditor';
import Header from './layouts/Header'
import SlateEditor from './SlateEditor';
import SlateEditorImage from './SlateEditorImage';
class App extends Component {
  render() {
    return (
			<div className="app__container">	
				<Header/>
				<Sidebar/>
				<Main>			
					<SlateEditor/>
				</Main>
      </div>
    );
  }
}

export default App;