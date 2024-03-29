import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {AppDispatch, useActions} from "../../app/store";
import {login} from "./authReducer";
import {FormikHelpers, useFormik} from "formik";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "./selectors";
import {asyncAuthActions} from "./index";

type FormikErrorType = {
  email?: string
  password?: string
  rememberMe?: boolean
}

type FormValuesType = {
  email: string
  password: string
  rememberMe: boolean
}

export const Login = () => {

  const dispatch = AppDispatch();

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
        errors.password = 'Password should be more than 3 symbols'
      }
      return errors
    },
    onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
      const action = await dispatch(login({...values}))

      if (login.rejected.match(action)) {
        if (action.payload?.fieldsErrors?.length) {
          const error = action.payload?.fieldsErrors[0]
          formikHelpers.setFieldError(error.field, error.error)
        }
      }
      // formikHelpers.setFieldError('email', 'fakeError')
      //formik.resetForm()
    },
  })

  const isLoggedIn = useSelector(selectIsLoggedIn)

  if (isLoggedIn) {
    return <Navigate to={'/Todolist/'}/>
  }

  return <Grid container justifyContent={'center'}>
    <Grid item justifyContent={'center'}>
      <FormControl>
        <form onSubmit={formik.handleSubmit}>
          <FormLabel>
            <div style={{color: 'grey'}}>
              <p>To log in get registered
                <a href={'https://social-network.samuraijs.com/'}
                   target={'_blank'}> here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </div>
          </FormLabel>
          <FormGroup>
            <TextField label='Email'
                       margin="normal"
                       {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email ?
              <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
            <TextField type="password"
                       label='Password'
                       margin="normal"
                       {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password ?
              <div style={{color: 'red'}}>{formik.errors.password}</div> : null}

            <FormControlLabel label={'Remember me'}
                              style={{marginLeft: '2px'}}
                              control={<Checkbox {...formik.getFieldProps('rememberMe')}
                                                 checked={formik.values.rememberMe}/>}/>
            <Button type={'submit'} variant={'contained'} color={'primary'}
                    style={{marginTop: '20px', borderRadius: '4px'}}>
              Login
            </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  </Grid>
}

