import { Box, Button, TextField } from '@mui/material';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { IUser, signInEndpoint } from './backend';

interface ILoginScreenProps {
  onSignIn: (user: IUser) => void;
}

export function LoginScreen(props: ILoginScreenProps) {
  const [email, setEmail] = useState('danilo@email.com');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');

  function signIn(evt: React.FormEvent) {
    evt.preventDefault();
    console.log('signIn');
    signInEndpoint(email, password).then(props.onSignIn, e =>
      setError('E-mail não encontrado ou senha incorreta')
    );
  }
  return (
    <Container maxWidth="sm">
      <h1>Agenda React</h1>
      <p>
        Digite o email <kbd>danilo@email.com</kbd> e senha <kbd>1234</kbd>
      </p>
      <form onSubmit={signIn}>
        <TextField
          margin="normal"
          fullWidth
          label="E-mail"
          variant="outlined"
          value={email}
          onChange={evt => setEmail(evt.target.value)}
        />
        {error && <div>{error}</div>}
        <TextField
          type="password"
          margin="normal"
          fullWidth
          label="senha"
          variant="outlined"
          value={password}
          onChange={evt => setPassword(evt.target.value)}
        />
        <Box textAlign="right" marginTop="16px">
          <Button type="submit" variant="contained" color="primary">
            Entrar
          </Button>
        </Box>
      </form>
    </Container>
  );
}
