import React, { useEffect, useState} from "react";

import "./newChatWindow.css";
import defaultProfilePic from "./profilePicDefault.svg";
import messageServices from "../../services/messages.services";
import Loading from "../loading";

const NewChatWindowSearchEnum = {
    RESULTS: "results",
    LOADING: "loading",
    EMPTY: "empty",
    ERROR: "error"
}

const NewChatWindowResult = (props) => {

    //const profilePic = (props.chatHead.profilePic == null) ? props.chatHead.profilePic : defaultProfilePic;

    const onLabelClick = () => {
        return props.onLabelClick(props.userDetails.id);
    }

    const onAddBtnClick = () => {
        return props.onAddBtnClick(props.userDetails.id);
    }

    const resIsTheUser = props.userDetails.id === JSON.parse(localStorage.getItem("user"))._id;

    return (
        <div onClick={onLabelClick()} className="newChatWindowSearchResultLabel">
            <img alt="profile" src={defaultProfilePic} className="newChatWindowSearchResultLabelProfilePic"/>
            <div className="newChatWindowSearchResultLabelNameDiv">
                <div className="newChatWindowSearchResultLabelName">
                    <span>{props.userDetails.name}</span>
                </div>
                <div className="newChatWindowSearchResultLabelUsername">
                    <span>{`@${props.userDetails.username}`}</span>
                </div>
            </div>
            {!resIsTheUser && 
            <button 
                className="newChatWindowSearchResultLabelNewChatBtn" 
                onClick={onAddBtnClick()}>
                    <p>+</p>
            </button>}
        </div>
    );
} 

const NewChatWindowSearch = (props) => {

    const [searchText, changeSearchText] = useState(props.searchText || "");
    const [resState, changeResState] = useState(NewChatWindowSearchEnum.EMPTY);
    const [resData, changeResData] = useState("");

    const onClear = () => {
        changeSearchText("")
    }

    const onAddBtnClick = (id) => () => {
        props.startANewChat(id, JSON.parse(localStorage.getItem("user"))._id);
        props.closeNewChatWindow();
    }

    const onLabelClick = (id) => () => {
        console.log("Profile " + id);
    }

    const getSearchResults = () => {
        console.log("Search");
        changeResState(NewChatWindowSearchEnum.LOADING);
        messageServices.searchNewUsers(searchText, (user) => {
            if (!user.matchedUser) {
                changeResData([]);
            } else if (Array.isArray(user.matchedUser)) {
                changeResData(user.matchedUser);
            } else {
                changeResData([user.matchedUser]);
            }
            changeResState(NewChatWindowSearchEnum.RESULTS)
        }, (err) => {
            changeResData(err);
            changeResState(NewChatWindowSearchEnum.ERROR);
            console.log(err);
        }) 
    }

    const renderResults = (results) => {
        if (!results.length) {
            return <div className="onlyText"><p>Your search did not match any users</p></div>
        } else {
            const resultList = results.map(user => {
                return (
                    <li key={user.id}>
                        <NewChatWindowResult 
                            userDetails={user}
                            onAddBtnClick={onAddBtnClick}
                            onLabelClick={onLabelClick}
                        />
                    </li>
                )
            });
            return (
                <div>
                    <ul>{resultList}</ul>
                </div>
            )
        }
    }

    const renderContent = () => {
        switch (resState) {
            case NewChatWindowSearchEnum.RESULTS:
                return (renderResults(resData))
            case NewChatWindowSearchEnum.LOADING:
                return <div className="onlyText"><Loading /></div>
            case NewChatWindowSearchEnum.ERROR:
                return (<div className="onlyText"><p>Something went wrong</p></div>)
            default:
                return null;
        }
    }

    const onSearchEnter = (e) => {
        // e.preventDefault();
        // console.log(e);
        if (e.nativeEvent.inputType === "insertText") {
            const inp = e.nativeEvent.data && e.nativeEvent.data.charCodeAt(0);
            if ((inp > 64 && inp < 91)) changeSearchText(searchText + String.fromCharCode(inp + 32));
            else if (inp > 96 && inp < 123) changeSearchText(searchText + String.fromCharCode(inp));
            else if (inp > 47 && inp < 58) changeSearchText(searchText + String.fromCharCode(inp));
        } else {
            changeSearchText(e.target.value);
        }
    }

    return(
        <div  className="newChatWindowContent">
            <div className="newChatWindowSearchSearch">
                <div className="newChatWindowSearchSearchDiv">
                    <input 
                        type="text" 
                        value={searchText} 
                        onChange={e => onSearchEnter(e)}
                        placeholder="Search user by username"
                        onKeyPress={e => e.key === "Enter" && getSearchResults()}
                    />
                </div>
                {searchText && <div className="newChatWindowSearchCloseDiv"><button onClick={onClear} /></div>}
            </div>
            <div className="newChatWindowSearchResult">
                {renderContent()}
            </div>
        </div>
    )
}

const NewChatWindow = (props) => {

    // let newChatRef = React.createRef();

    const handleOutsideClick = (e) => {
        if (document.getElementById("newChatWindowDiv").contains(e.target)) {
            return;
        }
        props.closeNewChatWindow()
    }
    const handleKeyPress = (e) => {
        if (e.key === "Escape") props.closeNewChatWindow()
    }

    useEffect(() => {

        document.addEventListener('mousedown', handleOutsideClick, false);
        document.addEventListener('keydown', handleKeyPress, false);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick, false);
            document.removeEventListener('keydown', handleKeyPress, false);
        }
    });

    return(
        <div className="newChatWindowContainer">  
            <div id="newChatWindowDiv" className="newChatWindowDiv">
                <div className="newChatWindowTitleBar">
                    <p className="newChatWindowTitle">Start a new chat</p>
                    <button className="closeButton" onClick={props.closeNewChatWindow} />
                </div>
                <NewChatWindowSearch 
                    closeNewChatWindow={props.closeNewChatWindow}
                    startANewChat={props.startANewChat}
                />
            </div>
        </div>
    );
}

export default NewChatWindow;