export const ResizeActionTypesEnum = {
    RESIZE: "resizeStatus/resize"
}

export const resizeAction = (width) => {
    return {
        type: ResizeActionTypesEnum.RESIZE,
        payload: width
    }
}

export const resize = (dispatch, width) => {
    dispatch(resizeAction(width));
}