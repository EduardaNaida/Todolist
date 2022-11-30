import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {Button} from './Button';
import {Task} from "../Task";
import {TaskType} from "../TodoList";
import {action} from "@storybook/addon-actions";
import {ReduxStoreProviderDecorator} from "../store/ReduxStoreProviderDecorator";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'TODOLIST/Task',
    component: Task,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    args: {
        removeTask: action('removeTask'),
        editTask: action('editTask'),
        changeTaskStatus: action('changeTaskStatus'),
        tasks: {id: 'id', title: 'JS', isDone: true}
    },
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof Task>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsDoneStory.args = {};

export const TaskIsNotDoneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsNotDoneStory.args = {
    tasks: {id: 'id', title: 'JS', isDone: false},
};

