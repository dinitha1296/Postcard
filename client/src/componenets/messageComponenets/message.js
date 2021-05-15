import React from "react";
import { EmojiConvertor } from "emoji-js";
// import { Twemoji } from "react-emoji-render"
// import Emoji from "react-emoji-render";
// import { ReactHtmlParser} from "react-html-parser";

import "./message.css";
// import axios from "axios";

function Message(props) {
    
    // axios.post('/echo', {location: "messages.js", line: "7", props: props});

    const date = new Date(props.message.date);
    const time = date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0');

    // const MyEmojiRender = ({children, ...rest}) => {
    //     const options = {
    //         baseUrl: "https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/6.0.1/img/apple/64",
    //         ext: "png",
    //         size: 64
    //     };
    //     return <Emoji options={options} {...rest} />;
    // }
    
    // <MyEmojiRender text={props.message.body} />

    const emoji = new EmojiConvertor();
    emoji.img_sets.apple.path = "https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/6.0.1/img/apple/64/";
    // emoji.use_sheet = true;
    // emoji.use_css_imgs = true;
    // emoji.img_sets.apple.sheet = "https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/6.0.1/img/apple/sheets/64.png";

    return (
        <div className={`container`}>
            <div className={`message${props.sent ? ' right' : ' left'}`} style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>
                {/* <p>{props.message.body}</p> */}
                {/* <Twemoji text={props.message.body} /> */}
                {/* <Twemoji text={props.message.body} /> */}
                <span dangerouslySetInnerHTML={{__html: emoji.replace_unified(props.message.body)}} />
                <p className="time">{time}</p>
            </div>
        </div>
    );
}

export default Message;