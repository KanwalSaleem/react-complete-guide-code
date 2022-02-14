import React from 'react'
import {Platform} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'
import LoginScreen from '../screens/LoginScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import Colors from '../constants/Colors'
import DashboardScreen from '../screens/DashboardScreen'
import McqsMenuScreen from '../screens/McqsMenuScreen'
import CategoryQuestionsScreen from '../screens/CategoryQuestionsScreen'
import QuizMenuScreen from '../screens/QuizMenuScreen'
import CategoryQuizScreen from '../screens/CategoryQuizScreen'
import CommentScreen from '../screens/CommentScreen'
import ProfileScreen from '../screens/ProfileScreen'
import QuizContributer from '../screens/QuizContributerScreen'
import ZoomImage from '../screens/CategoryQuestionZoomImage'
import ContactUs from '../screens/ContactUsScreen'
import QuizResult from '../screens/QuizResultScreen'
import EditProfile from '../screens/EditProfileScreen'
import QuizMarks from '../screens/QuizMarksScreen'

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : 'white',
  },
  //   headerTitleStyle: {
  //     fontFamily: 'open-sans-bold',
  //   },
  //   headerBackTitleStyle: {
  //     fontFamily: 'open-sans',
  //   },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
}

const AuthStack = createStackNavigator()
const QuizStack = createStackNavigator()

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={defaultNavOptions}>
      <AuthStack.Screen
        name="login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="forgotPassword"
        component={ForgotPasswordScreen}
        options={{headerShown: false}}
      />
    </AuthStack.Navigator>
  )
}

export const QuizNavigator = () => {
  return (
    <QuizStack.Navigator screenOptions={defaultNavOptions}>
      <QuizStack.Screen
        name="dashboard"
        component={DashboardScreen}
        options={{headerTitle: 'World MCQs'}}
      />
      <QuizStack.Screen
        name="mcqs"
        component={McqsMenuScreen}
        options={{headerShown: false}}
      />
      <QuizStack.Screen
        name="quiz"
        component={QuizMenuScreen}
        options={{headerShown: false}}
      />
      <QuizStack.Screen
        name="categoryQuestions"
        component={CategoryQuestionsScreen}
        options={{headerTitle: 'Mcqs'}}
      />
      <QuizStack.Screen
        name="categoryQuiz"
        component={CategoryQuizScreen}
        options={{headerTitle: 'Quiz'}}
      />
      <QuizStack.Screen
        name="commentScreen"
        component={CommentScreen}
        options={{headerTitle: 'Comments'}}
      />
      <QuizStack.Screen
        name="profileScreen"
        component={ProfileScreen}
        options={{headerTitle: 'Profile'}}
      />

      <QuizStack.Screen
        name="quizContributer"
        component={QuizContributer}
        options={{headerTitle: 'Sample Papers'}}
      />
      <QuizStack.Screen
        name="zoomImage"
        component={ZoomImage}
        options={{headerTitle: 'World MCQs'}}
      />
      <QuizStack.Screen
        name="contactUs"
        component={ContactUs}
        options={{headerTitle: 'Contact Us'}}
      />
      <QuizStack.Screen
        name="quizResult"
        component={QuizResult}
        options={{headerTitle: 'Quiz Results'}}
      />
      <QuizStack.Screen
        name="editProfile"
        component={EditProfile}
        options={{headerShown: false}}
      />
      <QuizStack.Screen
        name="quizMarks"
        component={QuizMarks}
        options={{headerTitle: 'Quiz Marks'}}
      />
    </QuizStack.Navigator>
  )
}
