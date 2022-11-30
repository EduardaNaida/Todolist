import React from 'react';

type PropsType = {
    className: string
    name: string,
    callBack: () => void
}
export const Button = (props: PropsType) => {
    const onClickHandler = () => {
        props.callBack()
    }
    return (
        <button onClick={onClickHandler}>{props.name}</button>
    );
};
