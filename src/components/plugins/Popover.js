import React, {Component, PropTypes} from 'react';

export default class Popover extends Component {
	static propTypes = {
		addItem: PropTypes.func,
		isActive: PropTypes.bool,
		inputUrl: PropTypes.string, 
		handleTextChange: PropTypes.func,
		onAddImage: PropTypes.func,
	}
	constructor(props){
		super(props)

	}
	componentWillReceiveProps(props){
		// console.log(props)
	}
	componentDidUpdate(props) {
		// console.log('did update')
	}
	handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      // this.setState({
      //   file: file,
      //   imagePreviewUrl: reader.result
			// });
			console.log(reader.result);
    }
		if (file && file.type.match('image.*')) {
      reader.readAsDataURL(file);
    } 
	}
	render() {
		const {inputUrl, isActive, handleTextChange, onAddImage} = this.props;
		return(
			<div className={`rs-popover ${isActive ? 'active' : null}`}>
			  <h6>Insert Image Link</h6>
				<input value={inputUrl} onChange={(e) => handleTextChange(e.target.value) }/>
				<div className="rs-button-container">
					<button onMouseDown={(e) => onAddImage(e)} className="se button">Add</button>
					<button className="se button">Cancel</button>					
				</div>
				{/*<div className="rs-button-container"> 
				<input type="file" className="se button" onMouseDown={this.handleImageChange} />
		</div>*/}
				
			</div>
		)
	}
}