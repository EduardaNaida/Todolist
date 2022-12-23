import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {AddItemForm} from "../components/AddItemForm";
import {action} from "@storybook/addon-actions";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";
import AppWithRedux from "../app/AppWithRedux";
import {Provider} from "react-redux";
import {store} from "../app/store";
import {ReduxStoreProviderDecorator} from "../store/ReduxStoreProviderDecorator";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'TODOLIST/AppWithRedux',
    component: AppWithRedux,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof AppWithRedux>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AppWithRedux> = (args) => <AppWithRedux/>;

export const AppWithReduxFormStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
