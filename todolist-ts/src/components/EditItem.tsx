import React, {ChangeEvent, memo, useState} from 'react';

type EditItemType = {
    title: string
    callback:(newTitle: string) => void
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
    return (
        edit
            ? <input value={newTitle} autoFocus onBlur={onClickHandler} onChange={onChangeTitle}/>
            : <span onClick={onClickHandler}>{props.title}</span>
    );
});