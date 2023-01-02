import React, {ChangeEvent, memo, useState} from 'react';
import {TextField} from "@material-ui/core";

type EditItemType = {
    title: string
    callback: (newTitle: string) => void
    disabled?: boolean
}
export const EditItem = memo((props: EditItemType) => {
    const [edit, setEdit] = useState(false)
    const [newTitle, setNewTitle] = useState<string>(props.title)

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }
    const onClickHandler = () => {
        setEdit(!edit)
        props.callback(newTitle)
    }
    // const onEnterDownAddTask = (e: KeyboardEvent<HTMLInputElement>) =>{
    //     e.key === "Enter" && props.callback(newTitle)
    //     console.log('aa')
    // }
    console.log(props.disabled)
    return (
        edit
            ?
            <TextField value={newTitle}
                       onChange={onChangeTitle}
                       autoFocus
                       onBlur={onClickHandler}
                       disabled={props.disabled}/>
            : <span onClick={onClickHandler}>{props.title}</span>
    );
});