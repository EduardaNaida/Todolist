import React, {useCallback, memo, useEffect} from 'react';
import {Button, IconButton, List, ListItem, Typography, PropTypes} from "@material-ui/core";
import BackspaceIcon from '@material-ui/icons/Backspace';
import {EditItem} from "./components/EditItem";
import {AddItemForm} from "./components/AddItemForm";
import {TaskRedux} from "./TaskRedux";
import {FilterValuesType} from "./AppWithRedux";
import {AppDispatch} from "./store/store";
import {TaskStatuses, TaskType} from "./api/todolist-api";
import {fetchTasksThunk} from "./store/tasks-reducer";

type TodoListPropsType = {
    todoListId: string
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    removeTask: (taskId: string, todoListId: string) => void
    changeTodoListFilter: (filter: FilterValuesType, todoListId: string) => void
    addTask: (title: string, todoListId: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    editTask: (todoListId: string, taskId: string, newTitle: string) => void
    editTodolist: (todoListId: string, newTitle: string) => void
}

// type TaskType = {
//     id: string
//     title: string
//     isDone: boolean
// }


const TodoList = React.memo(function (props: TodoListPropsType) {

    // const removeTask = useCallback((taskId: string) => props.removeTask(taskId, props.todoListId),
    //     [props.removeTask, props.todoListId ])
    // const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses) => props.changeTaskStatus(taskId, status, props.todoListId),
    //     [props.changeTaskStatus, props.todoListId])
    // const editItem = useCallback((taskId: string, newTitle: string) =>
    //         props.editTask(props.todoListId, taskId, newTitle),
    //     [props.editTask, props.todoListId])

    // const getTasksListItem = (t: TaskType) => {
    //     const removeTask = (taskId: string) => props.removeTask(t.id, taskId)
    //     const changeTaskStatus = (taskId: string, status: boolean) => props.changeTaskStatus(taskId, status, props.todoListId)
    //     const editItem = useCallback((taskId: string, newTitle: string) =>
    //         props.editTask(taskId, t.id, newTitle),
    //         [props.editTask, props.todoListId, t.id])
    //     return (
    //         <ListItem
    //             key={t.id}
    //             style={{
    //                 padding: '0px',
    //                 justifyContent: 'space-between',
    //                 textDecoration: t.isDone ? "line-through" : "none"
    //             }}
    //             className={t.isDone ? "isDone" : "notIsDone"}>
    //             <Checkbox
    //                 color={'primary'}
    //                 onChange={changeTaskStatus}
    //                 // type={"checkbox"}
    //                 checked={t.isDone}
    //             />
    //             <EditItem title={t.title} callback={editItem}/>
    //             <IconButton size={'small'} onClick={removeTask}>
    //                 <BackspaceIcon/>
    //             </IconButton>
    //         </ListItem>
    //     )
    // }

    const dispatch = AppDispatch();

    useEffect(() => {
        dispatch(fetchTasksThunk(props.todoListId))
    }, [])

    let tasks = props.tasks;

    if (props.filter === "completed") {
        tasks = tasks.filter(t => t.status === TaskStatuses.New);
    }

    if (props.filter === "active") {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    const onAllClickHandler = useCallback(() => props.changeTodoListFilter("all", props.todoListId), [])
    const onActiveClickHandler = useCallback(() => props.changeTodoListFilter("active", props.todoListId), [])
    const onCompletedClickHandler = useCallback(() => props.changeTodoListFilter("completed", props.todoListId), [])


    const removeTodoList = () => props.removeTodoList(props.todoListId)

    const addTaskHandler = useCallback((title: string) => {
        props.addTask(title, props.todoListId)
    }, [props.addTask, props.todoListId])

    const editTodolist = useCallback((title: string) => {
        props.editTodolist(props.todoListId, title)
    }, [props.editTodolist, props.todoListId])

    return (
        <div style={{width: '250px'}}>
            <Typography
                variant={'h5'}
                align={'center'}
                style={{fontWeight: 'bold'}}
                color={'primary'}
            >
                <EditItem title={props.title} callback={editTodolist}/>
                <IconButton size={'small'} onClick={removeTodoList}>
                    <BackspaceIcon/>
                </IconButton>
            </Typography>
            {/*<Input callback={addTaskHandler}/>*/}
            <AddItemForm addItem={addTaskHandler}/>

            {tasks.map(t => {
                return <TaskRedux todolistId={props.todoListId}
                                  key={t.id}
                                  tasks={t}
                                  removeTask={props.removeTask}
                                  changeTaskStatus={props.changeTaskStatus}
                                  changeTaskTitle={props.editTask}
                />

            })}
            <div>
                <ButtonWithMemo
                    variant={'contained'}
                    color={props.filter === "all" ? "secondary" : 'primary'}
                    size={'small'}
                    style={{marginRight: '3px'}}
                    //className={props.filter === "all" ? "active-btn btn" : "btn"}
                    onClick={onAllClickHandler}
                    title={'All'}
                />
                <ButtonWithMemo
                    variant={'contained'}
                    color={props.filter === "active" ? "secondary" : 'primary'}
                    size={'small'}
                    style={{marginRight: '3px'}}
                    onClick={onActiveClickHandler}
                    title={'Active'}
                />
                <ButtonWithMemo
                    variant={'contained'}
                    color={props.filter === "completed" ? "secondary" : 'primary'}
                    size={'small'}
                    style={{marginRight: '1px'}}
                    onClick={onCompletedClickHandler}
                    title={'Completed'}
                />
            </div>
        </div>
    );
});

type ButtonWithMemo = {
    variant: "text" | "outlined" | "contained",
    color: PropTypes.Color,
    style: React.CSSProperties,
    size: "small" | "medium" | "large",
    onClick: () => void,
    title: string
}

const ButtonWithMemo = memo((props: ButtonWithMemo) => {
    return <Button
        variant={props.variant}
        color={props.color}
        style={props.style}
        size={props.size}
        onClick={props.onClick}
    >{props.title}
    </Button>

})
export default TodoList;

//
// import React, {useCallback, useEffect} from 'react'
// import {TaskStatuses, TaskType} from './api/todolist-api'
// import {FilterValuesType} from "./AppWithRedux";
// import {AppDispatch} from "./store/store";
// import {fetchTasksThunk} from "./store/tasks-reducer";
// import {Delete} from "@material-ui/icons";
// import {Button, IconButton} from "@mui/material";
// import {EditItem} from "./components/EditItem";
// import {AddItemForm} from "./components/AddItemForm";
// import {TaskRedux} from "./TaskRedux";
// // import {AddItemForm} from './AddItemForm'
// // import {EditableSpan} from './EditableSpan'
// // import IconButton from '@mui/material/IconButton';
// // import Button from '@mui/material/Button';
// // import {Delete} from '@mui/icons-material';
// // import {Task} from './Task'
// // import {TaskStatuses, TaskType} from './api/todolists-api'
// // import {FilterValuesType} from './state/todolists-reducer'
// // import {fetchTasksThunk} from "./state/tasks-reducer";
// // import {AppDispatch} from "./state/store";
//
// type PropsType = {
//     id: string
//     title: string
//     tasks: Array<TaskType>
//     changeFilter: (value: FilterValuesType, todolistId: string) => void
//     addTask: (title: string, todolistId: string) => void
//     changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
//     changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
//     removeTask: (taskId: string, todolistId: string) => void
//     removeTodolist: (id: string) => void
//     changeTodolistTitle: (id: string, newTitle: string) => void
//     filter: FilterValuesType
//
// }
//
// export const TodoList = React.memo(function (props: PropsType) {
//     console.log('Todolist called')
//     const dispatch = AppDispatch();
//
//     useEffect(() => {
//         dispatch(fetchTasksThunk(props.id))
//     }, [])
//
//     const addTask = useCallback((title: string) => {
//         props.addTask(title, props.id)
//     }, [props.addTask, props.id])
//
//     const removeTodolist = () => {
//         props.removeTodolist(props.id)
//     }
//     const changeTodolistTitle = useCallback((title: string) => {
//         props.changeTodolistTitle(props.id, title)
//     }, [props.id, props.changeTodolistTitle])
//
//     const onAllClickHandler = useCallback(() => props.changeFilter('all', props.id), [props.id, props.changeFilter])
//     const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.id), [props.id, props.changeFilter])
//     const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.id), [props.id, props.changeFilter])
//
//
//     let tasksForTodolist = props.tasks
//
//     if (props.filter === 'active') {
//         tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
//     }
//     if (props.filter === 'completed') {
//         tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
//     }
//
//     return <div>
//         <h3><EditItem title={props.title} callback={changeTodolistTitle}/>
//             <IconButton onClick={removeTodolist}>
//                 <Delete/>
//             </IconButton>
//         </h3>
//         <AddItemForm addItem={addTask}/>
//         <div>
//             {
//                 tasksForTodolist.map(t => <TaskRedux key={t.id} task={t} todolistId={props.id}
//                                                 removeTask={props.removeTask}
//                                                 changeTaskTitle={props.changeTaskTitle}
//                                                 changeTaskStatus={props.changeTaskStatus}
//                 />)
//             }
//         </div>
//         <div style={{paddingTop: '10px'}}>
//             <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
//                     onClick={onAllClickHandler}
//                     color={'inherit'}
//             >All
//             </Button>
//             <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
//                     onClick={onActiveClickHandler}
//                     color={'primary'}>Active
//             </Button>
//             <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
//                     onClick={onCompletedClickHandler}
//                     color={'secondary'}>Completed
//             </Button>
//         </div>
//     </div>
// })
//
