import React, { Component } from 'react';
import '../stylesheets/main.css';
import Main from './Main';
import Sidebar from './Sidebar';
import DraftEditor from './DraftEditor';

class App extends Component {
  render() {
    return (
			<div className="app__container right-nav">	
				<Sidebar>{'Sidebar'}</Sidebar>
				<Main>			
					<DraftEditor/>
				</Main>
      </div>
    );
  }
}

export default App;
