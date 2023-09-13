import React from 'react'
import './RoundButton.css'
import pencilIcon from '../../assets/img/icons/pencil-icon.png'
import pencilIconBlack from '../../assets/img/icons/pencil-black.png'

const RoundButton = (props) => {

    const onButtonClick = () => {
        var checkBox = document.getElementById('inputCheckBox');
        console.log(checkBox.checked);
    }

    return(
        <>
            <label onClick={onButtonClick}>
                <input id="inputCheckBox" className="inputCheckBox" type="checkbox" />
                <div className='roundButton'>
                    <img className="roundButtonImg" src={pencilIcon} />
                    <img className="roundButtonImgBlack" src={pencilIconBlack} />
                </div>
            </label>
        </>
    );
}

export default RoundButton;