import React, { Component } from 'react';
import '../stylesheets/main.css';
import Main from './layouts/Main';
// import Sidebar from './layouts/Sidebar'; drag and drop
// import DraftEditor from './DraftEditor';
import Header from './layouts/Header'
import SlateEditor from './SlateEditor';
class App extends Component {
  render() {
    return (
			<div className="app__container">	
				<Header/>
				{/*
					<Sidebar/> 
					render this sidebar for drag and drop functionality
				*/}
				<Main>			
					<SlateEditor/>
				</Main>
      </div>
    );
  }
}

export default App;