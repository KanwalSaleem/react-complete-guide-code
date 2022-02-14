// hooks
import useAuth from '../hooks/useAuth'
//
import {MAvatar} from './@material-extend'
import createAvatar from '../utils/createAvatar'

// ----------------------------------------------------------------------

export default function MyAvatar({...other}) {
  const {user} = useAuth()
  const user_data = JSON.parse(localStorage.getItem('USER_DATA'))
  return (
    <MAvatar
      src={user_data.profilePic}
      alt={user_data.firstName}
      color={
        user_data.profilePic
          ? 'default'
          : createAvatar(user_data.firstName).color
      }
      {...other}>
      {createAvatar(user_data.firstName).name}
    </MAvatar>
  )
}
