import './App.css';
import Leaderboard from './components/Leaderboard';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Container } from '@material-ui/core';


const theme = createTheme({
  palette: {
    type: "dark",
  }
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Leaderboard />
      </Container>
    </ThemeProvider>
  );
}

export default App;
