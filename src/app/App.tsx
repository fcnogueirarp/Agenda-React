import { useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { getUserEndpoint, IUser } from './backend';
import CalendarScreen from './CalendarScreen';
import { getToday } from './dateFunctions';
import { LoginScreen } from './LoginScreen';

export default function App() {
  const month = getToday().substring(0, 7);
  const [user, setUser] = useState<IUser | null>(null);

  function signOut() {
    setUser(null);
  }

  useEffect(() => {
    getUserEndpoint().then(setUser, signOut);
  }, []);

  if (user) {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/calendar/:month">
            <CalendarScreen user={user} onSignOut={signOut} />
          </Route>
          <Redirect to={{ pathname: '/calendar/' + month }} />
        </Switch>
      </BrowserRouter>
    );
  } else {
    return <LoginScreen onSignIn={setUser} />;
  }
}
