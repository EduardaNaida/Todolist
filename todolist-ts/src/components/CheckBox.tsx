import React, {ChangeEvent} from 'react';

type CheckBoxType = {
    checked: boolean,
    callBack: (isDone: boolean) => void

}
export const CheckBox = (props: CheckBoxType) => {
    const changeIsDoneHandler = (event: ChangeEvent<HTMLInputElement>) => {
        props.callBack(event.currentTarget.checked)
    }
    return (
        <div>
            <input type="checkbox" defaultChecked={props.checked} onChange={changeIsDoneHandler}/>
        </div>
    );
};
