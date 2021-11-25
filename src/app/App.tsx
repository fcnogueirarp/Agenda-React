import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import CalendarScreen from './CalendarScreen';
import { getToday } from './dateFunctions';

export default function App() {
  const month = getToday().substring(0, 7);
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/calendar/:month">
          <CalendarScreen />
        </Route>
        <Redirect to={{ pathname: '/calendar/' + month }} />
      </Switch>
    </BrowserRouter>
  );
}
