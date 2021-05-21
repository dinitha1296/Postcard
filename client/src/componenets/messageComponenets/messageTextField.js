import React, { useState } from "react";
import Picker from "emoji-picker-react";
import { EmojiConvertor } from "emoji-js";
import sendIcon from './send.svg';
// import { Twemoji } from "react-emoji-render";

import "./messageTextField.css";
// import grin from './grin-regular.svg'

function MessageTextField(props) {
    
    const [input, changeInput] = useState("")
    const [pickerOpen, changePickerOpen] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        props.handleSubmit(input);
        changeInput("")
    }

    const onEmojiPickerClick = (e) => {
        changePickerOpen(!pickerOpen)
    }

    const onEmojiPick = (e, emoji) => {
        changeInput(input + emoji.emoji);
    }

    const emoji = new EmojiConvertor();
    emoji.img_sets.apple.path = "https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/6.0.1/img/apple/64/";
    // const emoji = new EmojiConvertor();

    return (
        <form className="messageInputDiv" onSubmit={handleSubmit}>
            
            <button className="emojiButton" onClick={onEmojiPickerClick} type="button">
                {pickerOpen && <div className="emojiPicker"><Picker onEmojiClick={onEmojiPick}/></div>}
            </button>
            {/* {console.log(emoji.replace_unified(input))} */}
            <input
                type="text" 
                value={input}
                onChange={e => changeInput(e.target.value)} 
                className="messageInput textField"
                placeholder="Write a message..."
                InputProps={{startAdornment: <input type="submit" value="" className="messageInput submit"/>}}
            />
            <button type="submit" value="" className="messageInput submit" disabled={!input} hidden={!input}><img src={sendIcon} alt="a" /></button>
        </form>
    );
}

export default MessageTextField;