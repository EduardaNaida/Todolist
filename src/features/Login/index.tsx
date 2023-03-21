import * as authSelector from './selectors'
import {Login} from './Login'
import {asyncActions, slice} from './authReducer'

const asyncAuthActions = {
  ...asyncActions,
  ...slice.actions
}
export {
  authSelector,
  Login,
  asyncAuthActions
}