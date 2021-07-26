import { createTheme, ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './components/Auth/Login';
import Nav from './components/layout/Nav';
import { useAuth } from './contexts/AuthContext';
import AuthLoading from './components/layout/AuthLoading';
import AddTask from './components/tasks/AddTask';
import Balance from './components/balance/Balance';
import Tasks from './components/tasks/Tasks';
import { TaskProvider } from './contexts/TaskContext'
import ReceivedTasks from './components/tasks/ReceivedTasks';

const theme = createTheme({  //creating theme
  palette: {
    type: 'dark',
    primary: {
      main: '#ff5722',
      mainGradient: 'linear-gradient(315deg, #ff4e00 0%, #ec9f05 74%)',
    },
    secondary: {
      main: '#1de9b6',
      mainGradient: 'linear-gradient(315deg, #00aa7f, #47bf9b, #70d4b7, #95ead3, #baffee)'
    },
    background: {
      defaultPrimary: "linear-gradient(315deg, #000000 -20%, #414141 74%)",
      defaultSecondary: "linear-gradient(45deg, #000000 -60%, #414141 60%)"
    }
  },
  typography: {
    fontFamily: 'Ubuntu',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  }
})






function App() {
  const { currentUser, authLoading } = useAuth()
  return (
      <ThemeProvider theme={ theme }>
      <Router>
        {(authLoading) ?
          // loading screen when user is logged in
          <AuthLoading />
        : (!currentUser) ?
          <Login />
          :
            // when user is logged in 
          <Nav>
            <TaskProvider>
              <Switch>
                <Route exact path="/">
                  <Tasks />
                </Route>
                <Route path="/addTask">
                  <AddTask />    
                  </Route>
                <Route path="/balance">
                  <Balance />    
                  </Route>
                  <Route path="/received">
                  <ReceivedTasks />    
                </Route>
              </Switch>
            </TaskProvider>
          </Nav>
        }
        </Router>
      </ThemeProvider>
  );
}

export default App;
