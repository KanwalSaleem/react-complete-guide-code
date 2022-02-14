import React, {createContext, useState, useEffect, useCallback} from 'react'

const AppContext = createContext({})

export const AppProvider = (props) => {
  const [appIntro, setAppIntro] = useState(false)
  const [user, setUser] = useState()
  const [tempId, setTempId] = useState('')
  const [isUserSaved, setIsUserSaved] = useState(false)
  const [athletes, setAthletes] = useState([])
  const [expertNames, setExpertNames] = useState([])
  console.log(user?.user_type)

  const getExpertNames = useCallback(() => {
    if (user) {
      const formData = new FormData()
      formData.append('token', 'ZFSgldjzfnvzkjdfbzdzfvbzdbdjkgSGVFddzfv')
      formData.append('accadamy_id', user.accadamy_id)
      fetch('https://staiigs.sector7.space/staii/API/fetchUsers.php', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res.Students[0])
          const validExperts = res.Experts.map((expert) => ({
            value: expert.teacher_id,
            label: expert.teacher_name,
            Sport_Name: expert.Sport_Name,
          }))
          const validStudents = res.Students.map((student) => ({
            value: student.student_id,
            label: student.student_name,
            Sport_Name: student.Sport_Name,
            student_id: student.student_id,
          }))
          // console.log(validExperts)
          setAthletes(validStudents)
          setExpertNames(validExperts)
          // console.log(validExperts)
        })
        .catch((e) => console.log(e))
    }
  }, [user])

  useEffect(() => {
    getExpertNames()
  }, [getExpertNames])
  return (
    <AppContext.Provider
      value={{
        appIntro,
        setAppIntro,
        user,
        setUser,
        tempId,
        setTempId,
        isUserSaved,
        setIsUserSaved,
        athletes,
        expertNames,
      }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContext
