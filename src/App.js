import './App.css';
import Leaderboard from './components/Leaderboard';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Container } from '@material-ui/core';


const theme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  }
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container className="mainDiv">
        <Leaderboard />
      </Container>
    </ThemeProvider>
  );
}

export default App;
