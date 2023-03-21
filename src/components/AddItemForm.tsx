import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from '@material-ui/icons';
import {login} from "../features/Login/authReducer";
import {AxiosError} from "axios";
import {instance} from "@storybook/node-logger";
import {instanceOf} from "prop-types";


type AddItemFormPropsType = {
  addItem: (title: string) => Promise<any>,
  disabled?: boolean
}

export const AddItemForm = memo((props: AddItemFormPropsType) => {
  let [title, setTitle] = useState("")
  let [error, setError] = useState<string | null>(null)

  const addItem = async () => {
    if (title.trim() !== "") {
      try {
        await props.addItem(title);
        setTitle("")
      } catch (error ) {
        setError((error as Error).message)
      }
    } else {
      setError("Title is required");
    }
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null);
    }
    if (e.charCode === 13) {
      addItem();
    }
  }

  return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <TextField variant="outlined"
               error={!!error}
               value={title}
               size={'small'}
               onChange={onChangeHandler}
               onKeyPress={onKeyPressHandler}
               label="Title"
               helperText={error}
               disabled={props.disabled}
    />
    <IconButton color="primary" onClick={addItem} disabled={props.disabled} style={{marginLeft: '8px'}}>
      <AddBox/>
    </IconButton>
  </div>
})
