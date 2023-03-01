import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {ReduxStoreProviderDecorator} from "../store/ReduxStoreProviderDecorator";
import TodolistList from "../features/TodolistList/TodolistList";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'TODOLIST/TodolistList',
    component: TodolistList,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof TodolistList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TodolistList> = (args) => <TodolistList/>;

export const AppWithReduxFormStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
