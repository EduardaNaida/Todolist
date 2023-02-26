import React, {useState} from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {AppDispatch, AppRootStateType} from "../../app/store";
import {loginTC} from "./authReducer";
import {useFormik} from "formik";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {Reddit} from "@material-ui/icons";

type FormikErrorType = {
  email?: string
  password?: string
  rememberMe?: boolean
}

export const Login = () => {

  const dispatch = AppDispatch();

  //const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validate: (values) => {
      const errors: FormikErrorType = {}
      if (!values.email) {
        errors.email = 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }
      if (values.password.length < 3) {
        errors.password = 'Password should be more than 3 characters'
      }
      return errors
    },
    onSubmit: values => {
      dispatch(loginTC({...values}))
      formik.resetForm()
    },
  })

  const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
  if (isLoggedIn) {
    return <Navigate to={'/'}/>
  }
  console.log(isLoggedIn, 'isLogged')

  return <Grid container justifyContent={'center'}>
    <Grid item justifyContent={'center'}>
      <FormControl>
        <form onSubmit={formik.handleSubmit}>
          <FormLabel>
            <p>To log in get registered
              <a href={'https://social-network.samuraijs.com/'}
                 target={'_blank'}> here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>Email: free@samuraijs.com</p>
            <p>Password: free</p>
          </FormLabel>
          <FormGroup>
            <TextField label='Email'
                       margin="normal"
                       {...formik.getFieldProps('email')}
            />
            {formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
            <TextField type="password"
                       label='Password'
                       margin="normal"
                       {...formik.getFieldProps('password')}
            />
            {formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
            <FormControlLabel label={'Remember me'} control={<Checkbox onChange={formik.handleChange}
                                                                       checked={formik.values.rememberMe}
                                                                       name='rememberMe'/>}/>
            <Button type={'submit'} variant={'contained'} color={'primary'}>
              Login
            </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  </Grid>
}