/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler'
import React from 'react'
import {Provider as PaperProvider} from 'react-native-paper'
import NavigationContainer from './navigation/NavigationContainer'
import {StyleSheet, useColorScheme} from 'react-native'
import {AuthProvider} from './context/auth'
import {Colors} from 'react-native/Libraries/NewAppScreen'

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer />
      </PaperProvider>
    </AuthProvider>

    // <GoogleSignIn />
    // <MyStarRating />
    // <Example />
    // <Zoom />
    // <Vir />
    // <Comp />
    // <McqsMenuScreen />
    // <CategoryQuizScreen/>
    // <CategoryQuestionsScreen/>
    // <ContactUs />
    // <QuizMenuScreen />
    // <CommentScreen/>
    // <ProfileScreen/>
    // <AboutUs/>
    // <DashboardScreen/>
    // <SplashScreen/>
    // <QuizTitleScreen />
    // <ApiCall />
    // <Fetch />
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
})

export default App
