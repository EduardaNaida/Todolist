import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import AddIcon from '@material-ui/icons/Add';
import {IconButton, TextField} from "@material-ui/core";

type InputPropsType = {
    callback: (title: string) => void
}

export const Input = (props: InputPropsType) => {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<boolean>(false)
    const onChangeSetLocalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError(false)
        setTitle(e.currentTarget.value)
    }

    const addTask = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle !== "") {
            props.callback(trimmedTitle)
        } else {
            setError(true)
        }
        setTitle("")
    }
    const errorMessage = error ? <div style={{fontWeight: "bold", color: "hotpink"}}>Title is required!</div> : null
    const onEnterDownAddTask = (e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && addTask()
    return (
        <div>
            <TextField
                variant={'outlined'}
                value={title}
                onChange={onChangeSetLocalTitle}
                onKeyDown={onEnterDownAddTask}
                label={'Title'}
                size={'small'}
                //className={error ? "error" : ""}
                error={error}
                helperText={error && 'Title is required!'}
            />
            <IconButton onClick={addTask}> <AddIcon/></IconButton>
            {/*{errorMessage}*/}
        </div>
    );
};
