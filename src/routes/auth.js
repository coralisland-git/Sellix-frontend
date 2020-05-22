import {
  LogIn,
  Register,
  ResetPassword,
  ForgotPassword,
  TwoFactorAuthentication,
  OTPLogin,
  EmailConfirm,
  ResetOTP,
  ChangeEmail,
} from 'screens'

const initialRoutes = [
  {
    path: '/auth/login',
    name: 'LogIn',
    component: LogIn
  },
  {
    path: '/auth/email',
    name: '2FA',
    component: TwoFactorAuthentication
  },
  {
    path: '/auth/otp',
    name: '2FA',
    component: OTPLogin
  },
  {
    path: '/auth/otp/reset',
    name: '2FA',
    component: ResetOTP
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/auth/password/reset',
    name: 'Forgot Password',
    component: ForgotPassword
  },
  {
    path: '/auth/reset/:id',
    name: 'Reset Password',
    component: ResetPassword
  },
  {
    path: '/auth/validate/:code',
    name: 'Email Confirm',
    component: EmailConfirm
  },
  {
    path: '/auth/change/email/:code',
    name: 'Change Email',
    component: ChangeEmail
  }
]
export default initialRoutes;
