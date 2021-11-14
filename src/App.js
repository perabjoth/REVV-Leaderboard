import './App.css';
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
        <h1>Leaderabord has moved to the REVV Suite:</h1>
        <h2><a href="https://perabjoth.github.io/REVV-Suite/#/Leaderboard" style={{color: 'red'}}>https://perabjoth.github.io/REVV-Suite/#/Leaderboard</a></h2>
      </Container>
    </ThemeProvider>
  );
}

export default App;
