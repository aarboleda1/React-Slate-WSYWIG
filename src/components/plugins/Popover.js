import React, {Component} from 'react';
import PropTypes from 'prop-types';
export default class Popover extends Component {
	static propTypes = {
		addItem: PropTypes.func,
		isActive: PropTypes.bool,
		inputUrl: PropTypes.string, 
		handleTextChange: PropTypes.func,
		onAddImage: PropTypes.func,
		popOverType: PropTypes.string.isRequired,
		onAddLink: PropTypes.func,
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
	onAddEntity = (event) => {
		const {onAddLink, onAddImage, popOverType} = this.props;
		switch(popOverType){
			case('imageUrl'):
				onAddImage(event);
				break;
			case('linkUrl'):
				console.log('added')
				onAddLink()
				break;
			default:
				return;
		}
	}
	render() {
		const {inputUrl, isActive, handleTextChange, popOverType, targetText} = this.props;
		return(
			<div className={`rs-popover ${isActive ? 'active' : null}`}>			
			  <h6>{popOverType === 'imageUrl' ? 'Insert Image URL' : 'Insert URL'}</h6>
				<input value={inputUrl} onChange={(event) => handleTextChange(event.target.value, popOverType) }/>
				{	popOverType === 'linkUrl' ?
					<div className="rs-button-container">
						<h6>Target</h6> 
						<input 
							value={targetText} 
							onChange={(event) => handleTextChange(event.target.value, 'targetText') }
						/> 
					</div>
						: null
				}
				
				<div className="rs-button-container">
					<button onMouseDown={(event) => this.onAddEntity(event)} className="se button">Add</button>
					<button className="se button">Cancel</button>					
				</div>
				{/*<div className="rs-button-container"> 
				<input type="file" className="se button" onMouseDown={this.handleImageChange} />
		</div>*/}
				
			</div>
		)
	}
}