import React, {Component} from 'react';
import PropTypes from 'prop-types';
const EMOJIS = [
  '😊', '😎', '🤗', '😃', '😬', '😂', '😅', '😆', '😍', '😱', '👋', '👏', '👍', '🙌', '👌', '🙏', '👻', '🍔', '🍑', '🍆', '🔑'
]
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
	handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      // this.setState({
      //   file: file,
      //   imagePreviewUrl: reader.result
			// });
			// console.log(reader.result);
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
				onAddLink()
				break;
			default:
				return;
		}
	}
	render() {
		const popOverTypes = {
			imageUrl: 'Insert Image URL',
			linkUrl: 'Insert URL',
			emoji: null,
		}
		let popOverBody;
		const {
			inputUrl, 
			isActive, 
			handleTextChange, 
			popOverType, 
			targetText
		} = this.props;
		if (popOverType === 'emoji') {
			popOverBody = (
				<div className="se-emoji-container">
					{EMOJIS.map((emoji, index) => {
						const onMouseDown = e => this.props.onClickEmoji(e, emoji)
						return (
							<span 
								onMouseDown={onMouseDown} 
								className="se-emoji-option" 
								key={index}
							>
								{emoji}
							</span>
						)
					})}
				</div>
			)
		} else {
			popOverBody = (
				<div>
					<h6>{popOverTypes[popOverType] === 'imageUrl' ? 'Insert Image URL' : 'Insert URL'}</h6>
					<input 
						value={inputUrl} 
						onChange={(event) => handleTextChange(event.target.value, popOverType) }
					/>
					{	
						popOverType === 'linkUrl' ?
						<div className="rs-button-container">
							<h6>Target</h6> 
							<input 
								value={targetText} 
								onChange={(event) => handleTextChange(event.target.value, 'targetText') }
							/> 
						</div> : null
					}
				
				<div className="rs-button-container">
					<button onMouseDown={(event) => this.onAddEntity(event)} className="se button">Add</button>
					<button className="se button">Cancel</button>					
				</div>		
			</div>		
			)
		}
		return(
			<div className={`rs-popover ${isActive ? 'active' : null}`}>			
			  {popOverBody}				
			</div>
		)
	}
}